import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { DatabaseService } from '../../database/database.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
import { CreateTaskCompletionDto } from './dto/create-task-completion.dto';
import { ReviewTaskCompletionDto } from './dto/review-task-completion.dto';

type AuthUser = {
  userId: string;
  email: string;
  role: 'admin' | 'ranger' | 'junior_ranger';
};

@Injectable()
export class SubmissionsService {
  constructor(private readonly db: DatabaseService) {}

  async createSubmission(
    adventureId: string,
    dto: CreateSubmissionDto,
    user: AuthUser,
  ) {
    if (user.role !== 'junior_ranger') {
      throw new ForbiddenException('Only Junior Rangers can submit adventures');
    }

    const adventure = await this.db
      .selectFrom('adventures')
      .selectAll()
      .where('id', '=', adventureId)
      .where('is_deleted', '=', false)
      .executeTakeFirst();

    if (!adventure) {
      throw new NotFoundException('Adventure not found');
    }

    const assignedCohortMembership = await this.db
      .selectFrom('cohort_adventures')
      .innerJoin(
        'cohort_members',
        'cohort_members.cohort_id',
        'cohort_adventures.cohort_id',
      )
      .select('cohort_adventures.cohort_id')
      .where('cohort_adventures.adventure_id', '=', adventureId)
      .where('cohort_adventures.is_deleted', '=', false)
      .where('cohort_members.user_id', '=', user.userId)
      .where('cohort_members.is_deleted', '=', false)
      .executeTakeFirst();

    if (!assignedCohortMembership) {
      throw new ForbiddenException(
        'You can only submit adventures assigned to your cohort',
      );
    }

    const existingSubmission = await this.db
      .selectFrom('adventure_submissions')
      .selectAll()
      .where('adventure_id', '=', adventureId)
      .where('junior_ranger_user_id', '=', user.userId)
      .executeTakeFirst();

    if (existingSubmission) {
      throw new ForbiddenException(
        'You have already submitted this adventure. Please update your existing submission.',
      );
    }

    const submission = await this.db
      .insertInto('adventure_submissions')
      .values({
        id: randomUUID(),
        adventure_id: adventureId,
        cohort_id: assignedCohortMembership.cohort_id,
        junior_ranger_user_id: user.userId,
        submission_text: dto.submission_text,
        image_url: dto.image_url ?? null,
        status: 'submitted',
        feedback: null,
        reviewed_by_ranger_id: null,
        submitted_at: new Date(),
        reviewed_at: null,
        created_at: new Date(),
        updated_at: null,
      })
      .returningAll()
      .executeTakeFirst();

    return {
      message: 'Adventure submitted successfully',
      submission,
    };
  }

  async getSubmissionsForAdventure(adventureId: string, user: AuthUser) {
    if (user.role === 'junior_ranger') {
      throw new ForbiddenException(
        'Junior Rangers cannot view all submissions',
      );
    }

    const adventure = await this.db
      .selectFrom('adventures')
      .selectAll()
      .where('id', '=', adventureId)
      .where('is_deleted', '=', false)
      .executeTakeFirst();

    if (!adventure) {
      throw new NotFoundException('Adventure not found');
    }

    // Admin should not review submissions based on client requirement
    if (user.role === 'admin') {
      throw new ForbiddenException(
        'Admins cannot review adventure submissions',
      );
    }

    // Find cohorts this ranger manages where this adventure is assigned
    const managedAssignedCohorts = await this.db
      .selectFrom('cohort_adventures')
      .innerJoin('cohorts', 'cohorts.id', 'cohort_adventures.cohort_id')
      .select('cohort_adventures.cohort_id')
      .where('cohort_adventures.adventure_id', '=', adventureId)
      .where('cohort_adventures.is_deleted', '=', false)
      .where('cohorts.is_deleted', '=', false)
      .where((eb) =>
        eb.or([
          eb('cohorts.created_by_ranger_id', '=', user.userId),
          eb('cohorts.assigned_ranger_id', '=', user.userId),
        ]),
      )
      .execute();

    const managedCohortIds = managedAssignedCohorts.map(
      (item) => item.cohort_id,
    );

    if (
      managedCohortIds.length === 0 &&
      adventure.created_by_user_id !== user.userId
    ) {
      throw new ForbiddenException(
        'You do not have permission to view submissions for this adventure',
      );
    }

    let query = this.db
      .selectFrom('adventure_submissions')
      .innerJoin(
        'users',
        'users.id',
        'adventure_submissions.junior_ranger_user_id',
      )
      .select([
        'adventure_submissions.id',
        'adventure_submissions.adventure_id',
        'adventure_submissions.cohort_id',
        'adventure_submissions.junior_ranger_user_id',
        'adventure_submissions.submission_text',
        'adventure_submissions.image_url',
        'adventure_submissions.status',
        'adventure_submissions.feedback',
        'adventure_submissions.reviewed_by_ranger_id',
        'adventure_submissions.submitted_at',
        'adventure_submissions.reviewed_at',
        'adventure_submissions.created_at',
        'adventure_submissions.updated_at',
        'users.name as junior_ranger_name',
        'users.email as junior_ranger_email',
      ])
      .where('adventure_submissions.adventure_id', '=', adventureId);

    // If the ranger manages assigned cohorts, show only submissions from those cohorts
    if (managedCohortIds.length > 0) {
      query = query.where(
        'adventure_submissions.cohort_id',
        'in',
        managedCohortIds,
      );
    }

    return query
      .orderBy('adventure_submissions.submitted_at', 'desc')
      .execute();
  }

  async reviewSubmission(
    submissionId: string,
    dto: ReviewSubmissionDto,
    user: AuthUser,
  ) {
    if (user.role !== 'ranger') {
      throw new ForbiddenException('Only Rangers can review submissions');
    }

    if (dto.status === 'rejected' && !dto.feedback?.trim()) {
      throw new BadRequestException(
        'Feedback is required when rejecting a submission',
      );
    }

    const submission = await this.db
      .selectFrom('adventure_submissions')
      .selectAll()
      .where('id', '=', submissionId)
      .executeTakeFirst();

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    const adventure = await this.db
      .selectFrom('adventures')
      .selectAll()
      .where('id', '=', submission.adventure_id)
      .where('is_deleted', '=', false)
      .executeTakeFirst();

    if (!adventure) {
      throw new NotFoundException('Adventure not found');
    }

    const cohort = await this.db
      .selectFrom('cohorts')
      .selectAll()
      .where('id', '=', adventure.cohort_id)
      .where('is_deleted', '=', false)
      .executeTakeFirst();

    if (
      !cohort ||
      (cohort.created_by_ranger_id !== user.userId &&
        cohort.assigned_ranger_id !== user.userId)
    ) {
      throw new ForbiddenException(
        'You do not have permission to review this submission',
      );
    }

    const updatedSubmission = await this.db
      .updateTable('adventure_submissions')
      .set({
        status: dto.status,
        feedback: dto.feedback ?? null,
        reviewed_by_ranger_id: user.userId,
        reviewed_at: new Date(),
        updated_at: new Date(),
      })
      .where('id', '=', submissionId)
      .returningAll()
      .executeTakeFirst();

    return {
      message: 'Submission reviewed successfully',
      submission: updatedSubmission,
    };
  }

  async getMySubmission(adventureId: string, user: AuthUser) {
    if (user.role !== 'junior_ranger') {
      throw new ForbiddenException(
        'Only Junior Rangers can view their submission',
      );
    }

    const submission = await this.db
      .selectFrom('adventure_submissions')
      .selectAll()
      .where('adventure_id', '=', adventureId)
      .where('junior_ranger_user_id', '=', user.userId)
      .executeTakeFirst();

    return {
      submission: submission || null,
    };
  }

  async updateMySubmission(
    submissionId: string,
    dto: CreateSubmissionDto,
    user: AuthUser,
  ) {
    if (user.role !== 'junior_ranger') {
      throw new ForbiddenException(
        'Only Junior Rangers can update submissions',
      );
    }

    const submission = await this.db
      .selectFrom('adventure_submissions')
      .selectAll()
      .where('id', '=', submissionId)
      .executeTakeFirst();

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (submission.junior_ranger_user_id !== user.userId) {
      throw new ForbiddenException('You can only update your own submission');
    }

    if (submission.status === 'approved') {
      throw new ForbiddenException('Approved submissions cannot be edited');
    }

    const updatedSubmission = await this.db
      .updateTable('adventure_submissions')
      .set({
        submission_text: dto.submission_text,
        image_url: dto.image_url ?? null,
        status: 'submitted',
        feedback: null,
        reviewed_by_ranger_id: null,
        reviewed_at: null,
        updated_at: new Date(),
      })
      .where('id', '=', submissionId)
      .returningAll()
      .executeTakeFirst();

    return {
      message: 'Submission updated successfully',
      submission: updatedSubmission,
    };
  }

  async createTaskCompletion(
    taskId: string,
    dto: CreateTaskCompletionDto,
    user: AuthUser,
  ) {
    if (user.role !== 'junior_ranger') {
      throw new ForbiddenException(
        'Only Junior Rangers can submit adventure tasks',
      );
    }

    const task = await this.db
      .selectFrom('adventure_tasks')
      .innerJoin('adventures', 'adventures.id', 'adventure_tasks.adventure_id')
      .select([
        'adventure_tasks.id',
        'adventure_tasks.adventure_id',
        'adventure_tasks.title',
        'adventures.cohort_id',
      ])
      .where('adventure_tasks.id', '=', taskId)
      .where('adventure_tasks.is_deleted', '=', false)
      .where('adventures.is_deleted', '=', false)
      .executeTakeFirst();

    if (!task) {
      throw new NotFoundException('Adventure task not found');
    }

    // Make sure Junior Ranger belongs to the adventure's cohort
    const membership = await this.db
      .selectFrom('cohort_members')
      .selectAll()
      .where('cohort_id', '=', task.cohort_id)
      .where('user_id', '=', user.userId)
      .where('is_deleted', '=', false)
      .executeTakeFirst();

    if (!membership) {
      throw new ForbiddenException(
        'You can only complete tasks assigned to your cohort',
      );
    }

    // Prevent duplicate task completion
    const existingCompletion = await this.db
      .selectFrom('task_completions')
      .selectAll()
      .where('task_id', '=', taskId)
      .where('junior_ranger_user_id', '=', user.userId)
      .executeTakeFirst();

    if (existingCompletion) {
      throw new BadRequestException('You have already submitted this task');
    }

    const completion = await this.db
      .insertInto('task_completions')
      .values({
        id: randomUUID(),
        task_id: taskId,
        junior_ranger_user_id: user.userId,
        submission_text: dto.submission_text ?? null,
        image_url: dto.image_url ?? null,
        status: 'submitted',
        feedback: null,
        reviewed_by_ranger_id: null,
        submitted_at: new Date(),
        reviewed_at: null,
        xp_awarded: false,
        created_at: new Date(),
        updated_at: null,
      })
      .returningAll()
      .executeTakeFirst();

    return {
      message: 'Task submitted successfully',
      completion,
    };
  }

  async getTaskCompletions(taskId: string, user: AuthUser) {
    if (user.role !== 'ranger') {
      throw new ForbiddenException('Only Rangers can view task submissions');
    }

    const task = await this.db
      .selectFrom('adventure_tasks')
      .innerJoin('adventures', 'adventures.id', 'adventure_tasks.adventure_id')
      .innerJoin('cohorts', 'cohorts.id', 'adventures.cohort_id')
      .select([
        'adventure_tasks.id',
        'adventures.cohort_id',
        'cohorts.created_by_ranger_id',
        'cohorts.assigned_ranger_id',
      ])
      .where('adventure_tasks.id', '=', taskId)
      .where('adventure_tasks.is_deleted', '=', false)
      .executeTakeFirst();

    if (!task) {
      throw new NotFoundException('Adventure task not found');
    }

    if (
      task.created_by_ranger_id !== user.userId &&
      task.assigned_ranger_id !== user.userId
    ) {
      throw new ForbiddenException(
        'You do not have permission to review this task',
      );
    }

    return this.db
      .selectFrom('task_completions')
      .innerJoin('users', 'users.id', 'task_completions.junior_ranger_user_id')
      .select([
        'task_completions.id',
        'task_completions.task_id',
        'task_completions.junior_ranger_user_id',
        'task_completions.submission_text',
        'task_completions.image_url',
        'task_completions.status',
        'task_completions.feedback',
        'task_completions.reviewed_by_ranger_id',
        'task_completions.submitted_at',
        'task_completions.reviewed_at',
        'task_completions.xp_awarded',
        'users.name as junior_ranger_name',
        'users.email as junior_ranger_email',
      ])
      .where('task_completions.task_id', '=', taskId)
      .orderBy('task_completions.submitted_at', 'desc')
      .execute();
  }

  async getTaskCompletionsForAdventure(adventureId: string, user: AuthUser) {
    if (user.role !== 'ranger') {
      throw new ForbiddenException('Only Rangers can view task submissions');
    }

    const adventure = await this.db
      .selectFrom('adventures')
      .selectAll()
      .where('id', '=', adventureId)
      .where('is_deleted', '=', false)
      .executeTakeFirst();

    if (!adventure) {
      throw new NotFoundException('Adventure not found');
    }

    /*
     * Check whether this Ranger manages a cohort
     * to which this Adventure is assigned.
     */
    const managedAssignment = await this.db
      .selectFrom('cohort_adventures')
      .innerJoin('cohorts', 'cohorts.id', 'cohort_adventures.cohort_id')
      .select('cohort_adventures.id')
      .where('cohort_adventures.adventure_id', '=', adventureId)
      .where('cohort_adventures.is_deleted', '=', false)
      .where('cohorts.is_deleted', '=', false)
      .where((eb) =>
        eb.or([
          eb('cohorts.created_by_ranger_id', '=', user.userId),
          eb('cohorts.assigned_ranger_id', '=', user.userId),
        ]),
      )
      .executeTakeFirst();

    if (!managedAssignment && adventure.created_by_user_id !== user.userId) {
      throw new ForbiddenException(
        'You do not have permission to view task submissions for this adventure',
      );
    }

    return this.db
      .selectFrom('task_completions')
      .innerJoin(
        'adventure_tasks',
        'adventure_tasks.id',
        'task_completions.task_id',
      )
      .innerJoin('users', 'users.id', 'task_completions.junior_ranger_user_id')
      .select([
        'task_completions.id',
        'task_completions.task_id',
        'task_completions.junior_ranger_user_id',
        'task_completions.submission_text',
        'task_completions.image_url',
        'task_completions.status',
        'task_completions.feedback',
        'task_completions.reviewed_by_ranger_id',
        'task_completions.submitted_at',
        'task_completions.reviewed_at',
        'task_completions.xp_awarded',
        'task_completions.created_at',
        'task_completions.updated_at',

        'adventure_tasks.title as task_title',
        'adventure_tasks.description as task_description',
        'adventure_tasks.xp_reward',
        'adventure_tasks.task_order',

        'users.name as junior_ranger_name',
        'users.email as junior_ranger_email',
      ])
      .where('adventure_tasks.adventure_id', '=', adventureId)
      .where('adventure_tasks.is_deleted', '=', false)
      .orderBy('task_completions.submitted_at', 'desc')
      .execute();
  }

  private calculateLevel(totalXp: number): number {
    if (totalXp >= 1000) return 5;
    if (totalXp >= 500) return 4;
    if (totalXp >= 250) return 3;
    if (totalXp >= 100) return 2;

    return 1;
  }

  async reviewTaskCompletion(
    completionId: string,
    dto: ReviewTaskCompletionDto,
    user: AuthUser,
  ) {
    if (user.role !== 'ranger') {
      throw new ForbiddenException('Only Rangers can review task submissions');
    }

    if (dto.status === 'rejected' && !dto.feedback?.trim()) {
      throw new BadRequestException(
        'Feedback is required when rejecting a task',
      );
    }

    const completion = await this.db
      .selectFrom('task_completions')
      .innerJoin(
        'adventure_tasks',
        'adventure_tasks.id',
        'task_completions.task_id',
      )
      .innerJoin('adventures', 'adventures.id', 'adventure_tasks.adventure_id')
      .innerJoin('cohorts', 'cohorts.id', 'adventures.cohort_id')
      .select([
        'task_completions.id',
        'task_completions.junior_ranger_user_id',
        'task_completions.status',
        'task_completions.xp_awarded',
        'adventure_tasks.xp_reward',
        'adventure_tasks.adventure_id',
        'cohorts.created_by_ranger_id',
        'cohorts.assigned_ranger_id',
      ])
      .where('task_completions.id', '=', completionId)
      .executeTakeFirst();

    if (!completion) {
      throw new NotFoundException('Task completion not found');
    }

    if (
      completion.created_by_ranger_id !== user.userId &&
      completion.assigned_ranger_id !== user.userId
    ) {
      throw new ForbiddenException(
        'You do not have permission to review this task',
      );
    }

    return this.db.transaction().execute(async (trx) => {
      let xpAwardedNow = 0;
      let previousLevel: number | null = null;
      let currentLevel: number | null = null;

      // Award XP only the first time the task becomes approved
      if (dto.status === 'approved' && !completion.xp_awarded) {
        const juniorRanger = await trx
          .selectFrom('users')
          .select(['id', 'total_xp', 'current_level'])
          .where('id', '=', completion.junior_ranger_user_id)
          .executeTakeFirst();

        if (!juniorRanger) {
          throw new NotFoundException('Junior Ranger not found');
        }

        previousLevel = juniorRanger.current_level;

        const newTotalXp = juniorRanger.total_xp + completion.xp_reward;

        currentLevel = this.calculateLevel(newTotalXp);

        await trx
          .updateTable('users')
          .set({
            total_xp: newTotalXp,
            current_level: currentLevel,
            updated_at: new Date(),
          })
          .where('id', '=', completion.junior_ranger_user_id)
          .execute();

        if (currentLevel > previousLevel) {
          await trx
            .insertInto('notifications')
            .values({
              id: randomUUID(),
              user_id: completion.junior_ranger_user_id,
              type: 'level_up',
              title: 'Level Up!',
              message: `Congratulations! You reached Level ${currentLevel}.`,
              is_read: false,
              created_at: new Date(),
            })
            .execute();
        }
        await this.checkAndAwardBadges(
          trx,
          completion.junior_ranger_user_id,
          newTotalXp,
          currentLevel,
        );

        xpAwardedNow = completion.xp_reward;
      }

      const updatedCompletion = await trx
        .updateTable('task_completions')
        .set({
          status: dto.status,
          feedback: dto.feedback ?? null,
          reviewed_by_ranger_id: user.userId,
          reviewed_at: new Date(),

          xp_awarded: dto.status === 'approved' ? true : completion.xp_awarded,

          updated_at: new Date(),
        })
        .where('id', '=', completionId)
        .returningAll()
        .executeTakeFirst();

      return {
        message:
          dto.status === 'approved'
            ? 'Task approved successfully'
            : 'Task rejected successfully',

        completion: updatedCompletion,

        xp_awarded: xpAwardedNow,

        level_changed:
          previousLevel !== null &&
          currentLevel !== null &&
          currentLevel > previousLevel,

        previous_level: previousLevel,
        current_level: currentLevel,
      };
    });
  }

  private async checkAndAwardBadges(
    trx: any,
    juniorRangerUserId: string,
    totalXp: number,
    currentLevel: number,
  ) {
    const badges = await trx
      .selectFrom('badges')
      .selectAll()
      .where('is_deleted', '=', false)
      .execute();

    const approvedTaskCountResult = await trx
      .selectFrom('task_completions')
      .select((eb: any) => eb.fn.count('id').as('count'))
      .where('junior_ranger_user_id', '=', juniorRangerUserId)
      .where('status', '=', 'approved')
      .executeTakeFirst();

    const approvedTaskCount = Number(approvedTaskCountResult?.count ?? 0);

    for (const badge of badges) {
      if (!badge.criteria_type || badge.criteria_value === null) {
        continue;
      }

      let qualifies = false;

      switch (badge.criteria_type) {
        case 'task_count':
          qualifies = approvedTaskCount >= badge.criteria_value;
          break;

        case 'xp':
          qualifies = totalXp >= badge.criteria_value;
          break;

        case 'level':
          qualifies = currentLevel >= badge.criteria_value;
          break;
      }

      if (!qualifies) {
        continue;
      }

      const existingBadge = await trx
        .selectFrom('user_badges')
        .select('id')
        .where('user_id', '=', juniorRangerUserId)
        .where('badge_id', '=', badge.id)
        .where('is_deleted', '=', false)
        .executeTakeFirst();

      if (existingBadge) {
        continue;
      }

      await trx
        .insertInto('user_badges')
        .values({
          id: randomUUID(),
          user_id: juniorRangerUserId,
          badge_id: badge.id,
          is_deleted: false,
          earned_at: new Date(),
          updated_at: null,
        })
        .execute();

      await trx
        .insertInto('notifications')
        .values({
          id: randomUUID(),
          user_id: juniorRangerUserId,
          type: 'badge_unlocked',
          title: 'Badge Unlocked!',
          message: `You earned the "${badge.name}" badge.`,
          is_read: false,
          created_at: new Date(),
        })
        .execute();
    }
  }
}
