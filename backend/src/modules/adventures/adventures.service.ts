import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { randomUUID } from 'crypto';

import { DatabaseService } from '../../database/database.service';

import { CreateAdventureDto } from './dto/create-adventure.dto';
import { UpdateAdventureDto } from './dto/update-adventure.dto';
import { AssignAdventureDto } from './dto/assign-adventure.dto';

import { CreateAdventureTaskDto } from './dto/create-adventure-task.dto';
import { UpdateAdventureTaskDto } from './dto/update-adventure-task.dto';

type AuthUser = {
  userId: string;
  email: string;
  role:
    | 'admin'
    | 'ranger'
    | 'junior_ranger';
};

type CohortAdventureAssignment = {
  id: string;
  cohort_id: string;
  adventure_id: string;
  assigned_by_user_id: string;
  assigned_by_role:
    | 'admin'
    | 'ranger';
  is_deleted: boolean;
  assigned_at: Date;
  created_at: Date;
  updated_at: Date | null;
};

@Injectable()
export class AdventuresService {
  constructor(
    private readonly db: DatabaseService,
  ) {}

  async createAdventure(
    cohortId: string,
    dto: CreateAdventureDto,
    user: AuthUser,
  ) {
    if (
      user.role !== 'ranger' &&
      user.role !== 'admin'
    ) {
      throw new ForbiddenException(
        'Junior Rangers cannot create adventures',
      );
    }

    const cohort = await this.db
      .selectFrom('cohorts')
      .selectAll()
      .where('id', '=', cohortId)
      .where('is_deleted', '=', false)
      .executeTakeFirst();

    if (!cohort) {
      throw new NotFoundException(
        'Cohort not found',
      );
    }

    if (
      user.role === 'ranger' &&
      cohort.created_by_ranger_id !==
        user.userId &&
      cohort.assigned_ranger_id !==
        user.userId
    ) {
      throw new ForbiddenException(
        'You do not have permission to create adventures for this cohort',
      );
    }

    const adventure = await this.db
      .insertInto('adventures')
      .values({
        id: randomUUID(),
        cohort_id: cohortId,
        title: dto.title,
        description:
          dto.description,
        task_instructions:
          dto.task_instructions,
        due_date: new Date(
          dto.due_date,
        ),
        status: 'published',
        created_by_user_id:
          user.userId,
        is_deleted: false,
        created_at: new Date(),
        updated_at: null,
      })
      .returningAll()
      .executeTakeFirst();

    if (adventure) {
      await this.db
        .insertInto(
          'cohort_adventures',
        )
        .values({
          id: randomUUID(),
          cohort_id: cohortId,
          adventure_id:
            adventure.id,
          assigned_by_user_id:
            user.userId,
          assigned_by_role:
            user.role,
          is_deleted: false,
          assigned_at: new Date(),
          created_at: new Date(),
          updated_at: null,
        })
        .onConflict((oc) =>
          oc
            .columns([
              'cohort_id',
              'adventure_id',
            ])
            .doNothing(),
        )
        .execute();
    }

    return {
      message:
        'Adventure created successfully',
      adventure,
    };
  }

  async getAllAdventures(
    user: AuthUser,
  ) {
    if (user.role === 'admin') {
      return this.db
        .selectFrom('adventures')
        .selectAll()
        .where(
          'is_deleted',
          '=',
          false,
        )
        .orderBy(
          'created_at',
          'desc',
        )
        .execute();
    }

    if (user.role === 'ranger') {
      return this.db
        .selectFrom('adventures')
        .leftJoin(
          'cohort_adventures',
          'cohort_adventures.adventure_id',
          'adventures.id',
        )
        .leftJoin(
          'cohorts',
          'cohorts.id',
          'cohort_adventures.cohort_id',
        )
        .selectAll('adventures')
        .where(
          'adventures.is_deleted',
          '=',
          false,
        )
        .where((eb) =>
          eb.or([
            eb(
              'adventures.created_by_user_id',
              '=',
              user.userId,
            ),

            eb(
              'cohorts.created_by_ranger_id',
              '=',
              user.userId,
            ),

            eb(
              'cohorts.assigned_ranger_id',
              '=',
              user.userId,
            ),
          ]),
        )
        .orderBy(
          'adventures.created_at',
          'desc',
        )
        .distinct()
        .execute();
    }

    return this.db
      .selectFrom('adventures')
      .innerJoin(
        'cohort_adventures',
        'cohort_adventures.adventure_id',
        'adventures.id',
      )
      .innerJoin(
        'cohort_members',
        'cohort_members.cohort_id',
        'cohort_adventures.cohort_id',
      )
      .selectAll('adventures')
      .where(
        'adventures.is_deleted',
        '=',
        false,
      )
      .where(
        'cohort_adventures.is_deleted',
        '=',
        false,
      )
      .where(
        'cohort_members.is_deleted',
        '=',
        false,
      )
      .where(
        'cohort_members.user_id',
        '=',
        user.userId,
      )
      .orderBy(
        'adventures.created_at',
        'desc',
      )
      .distinct()
      .execute();
  }

  async getAdventuresByCohort(
    cohortId: string,
    user: AuthUser,
  ) {
    await this.checkCohortAccess(
      cohortId,
      user,
    );

    return this.db
      .selectFrom('adventures')
      .selectAll()
      .where(
        'cohort_id',
        '=',
        cohortId,
      )
      .where(
        'is_deleted',
        '=',
        false,
      )
      .orderBy(
        'due_date',
        'asc',
      )
      .execute();
  }

  async getAssignedAdventuresByCohort(
    cohortId: string,
    user: AuthUser,
  ) {
    await this.checkCohortAccess(
      cohortId,
      user,
    );

    return this.db
      .selectFrom(
        'cohort_adventures',
      )
      .innerJoin(
        'adventures',
        'adventures.id',
        'cohort_adventures.adventure_id',
      )
      .select([
        'adventures.id',
        'adventures.title',
        'adventures.description',
        'adventures.task_instructions',
        'adventures.cohort_id',
        'adventures.due_date',
        'adventures.status',
        'adventures.created_by_user_id',
        'adventures.is_deleted',
        'adventures.created_at',
        'adventures.updated_at',
        'cohort_adventures.assigned_at',
        'cohort_adventures.assigned_by_user_id',
        'cohort_adventures.assigned_by_role',
      ])
      .where(
        'cohort_adventures.cohort_id',
        '=',
        cohortId,
      )
      .where(
        'cohort_adventures.is_deleted',
        '=',
        false,
      )
      .where(
        'adventures.is_deleted',
        '=',
        false,
      )
      .orderBy(
        'cohort_adventures.assigned_at',
        'desc',
      )
      .execute();
  }

  async getAdventureById(
    adventureId: string,
    user: AuthUser,
  ) {
    const adventure = await this.db
      .selectFrom('adventures')
      .selectAll()
      .where(
        'id',
        '=',
        adventureId,
      )
      .where(
        'is_deleted',
        '=',
        false,
      )
      .executeTakeFirst();

    if (!adventure) {
      throw new NotFoundException(
        'Adventure not found',
      );
    }

    if (user.role === 'admin') {
      return adventure;
    }

    if (user.role === 'ranger') {
      const hasAssignedCohortAccess =
        await this.db
          .selectFrom(
            'cohort_adventures',
          )
          .innerJoin(
            'cohorts',
            'cohorts.id',
            'cohort_adventures.cohort_id',
          )
          .select(
            'cohort_adventures.id',
          )
          .where(
            'cohort_adventures.adventure_id',
            '=',
            adventureId,
          )
          .where(
            'cohort_adventures.is_deleted',
            '=',
            false,
          )
          .where(
            'cohorts.is_deleted',
            '=',
            false,
          )
          .where((eb) =>
            eb.or([
              eb(
                'cohorts.created_by_ranger_id',
                '=',
                user.userId,
              ),

              eb(
                'cohorts.assigned_ranger_id',
                '=',
                user.userId,
              ),
            ]),
          )
          .executeTakeFirst();

      if (
        !hasAssignedCohortAccess &&
        adventure.created_by_user_id !==
          user.userId
      ) {
        throw new ForbiddenException(
          'You do not have access to this adventure',
        );
      }

      return adventure;
    }

    const membershipAccess =
      await this.db
        .selectFrom(
          'cohort_adventures',
        )
        .innerJoin(
          'cohort_members',
          'cohort_members.cohort_id',
          'cohort_adventures.cohort_id',
        )
        .select(
          'cohort_adventures.id',
        )
        .where(
          'cohort_adventures.adventure_id',
          '=',
          adventureId,
        )
        .where(
          'cohort_adventures.is_deleted',
          '=',
          false,
        )
        .where(
          'cohort_members.user_id',
          '=',
          user.userId,
        )
        .where(
          'cohort_members.is_deleted',
          '=',
          false,
        )
        .executeTakeFirst();

    if (!membershipAccess) {
      throw new ForbiddenException(
        'You do not have access to this adventure',
      );
    }

    return adventure;
  }

  async updateAdventure(
    adventureId: string,
    dto: UpdateAdventureDto,
    user: AuthUser,
  ) {
    if (
      user.role ===
      'junior_ranger'
    ) {
      throw new ForbiddenException(
        'Junior Rangers cannot update adventures',
      );
    }

    const adventure = await this.db
      .selectFrom('adventures')
      .selectAll()
      .where(
        'id',
        '=',
        adventureId,
      )
      .where(
        'is_deleted',
        '=',
        false,
      )
      .executeTakeFirst();

    if (!adventure) {
      throw new NotFoundException(
        'Adventure not found',
      );
    }

    if (
      user.role === 'ranger' &&
      adventure.created_by_user_id !==
        user.userId
    ) {
      throw new ForbiddenException(
        'Only the creator or admin can update this adventure',
      );
    }

    const updatedAdventure =
      await this.db
        .updateTable(
          'adventures',
        )
        .set({
          ...(dto.title !==
          undefined
            ? {
                title: dto.title,
              }
            : {}),

          ...(dto.description !==
          undefined
            ? {
                description:
                  dto.description,
              }
            : {}),

          ...(dto.task_instructions !==
          undefined
            ? {
                task_instructions:
                  dto.task_instructions,
              }
            : {}),

          ...(dto.due_date !==
          undefined
            ? {
                due_date:
                  new Date(
                    dto.due_date,
                  ),
              }
            : {}),

          ...(dto.status !==
          undefined
            ? {
                status:
                  dto.status,
              }
            : {}),

          updated_at: new Date(),
        })
        .where(
          'id',
          '=',
          adventureId,
        )
        .returningAll()
        .executeTakeFirst();

    return {
      message:
        'Adventure updated successfully',

      adventure:
        updatedAdventure,
    };
  }

  /*
   * ==========================================
   * ADVENTURE TASKS
   * ==========================================
   */

  async createAdventureTask(
    adventureId: string,
    dto: CreateAdventureTaskDto,
    user: AuthUser,
  ) {
    if (
      user.role !== 'admin' &&
      user.role !== 'ranger'
    ) {
      throw new ForbiddenException(
        'Only Admins and Rangers can create adventure tasks',
      );
    }

    const adventure = await this.db
      .selectFrom('adventures')
      .selectAll()
      .where(
        'id',
        '=',
        adventureId,
      )
      .where(
        'is_deleted',
        '=',
        false,
      )
      .executeTakeFirst();

    if (!adventure) {
      throw new NotFoundException(
        'Adventure not found',
      );
    }

    if (
      user.role === 'ranger' &&
      adventure.created_by_user_id !==
        user.userId
    ) {
      throw new ForbiddenException(
        'You do not have permission to add tasks to this adventure',
      );
    }

    const task = await this.db
      .insertInto(
        'adventure_tasks',
      )
      .values({
        id: randomUUID(),

        adventure_id:
          adventureId,

        title:
          dto.title,

        description:
          dto.description ??
          null,

        xp_reward:
          dto.xp_reward ??
          25,

        task_order:
          dto.task_order ??
          1,

        is_deleted: false,

        created_at:
          new Date(),

        updated_at:
          null,
      })
      .returningAll()
      .executeTakeFirst();

    return {
      message:
        'Adventure task created successfully',

      task,
    };
  }

  async getAdventureTasks(
    adventureId: string,
    user: AuthUser,
  ) {
    await this.getAdventureById(
      adventureId,
      user,
    );

    return this.db
      .selectFrom(
        'adventure_tasks',
      )
      .selectAll()
      .where(
        'adventure_id',
        '=',
        adventureId,
      )
      .where(
        'is_deleted',
        '=',
        false,
      )
      .orderBy(
        'task_order',
        'asc',
      )
      .execute();
  }

  async updateAdventureTask(
    taskId: string,
    dto: UpdateAdventureTaskDto,
    user: AuthUser,
  ) {
    if (
      user.role !== 'admin' &&
      user.role !== 'ranger'
    ) {
      throw new ForbiddenException(
        'Only Admins and Rangers can update adventure tasks',
      );
    }

    const task = await this.db
      .selectFrom(
        'adventure_tasks',
      )
      .innerJoin(
        'adventures',
        'adventures.id',
        'adventure_tasks.adventure_id',
      )
      .select([
        'adventure_tasks.id',

        'adventure_tasks.adventure_id',

        'adventures.created_by_user_id',
      ])
      .where(
        'adventure_tasks.id',
        '=',
        taskId,
      )
      .where(
        'adventure_tasks.is_deleted',
        '=',
        false,
      )
      .where(
        'adventures.is_deleted',
        '=',
        false,
      )
      .executeTakeFirst();

    if (!task) {
      throw new NotFoundException(
        'Adventure task not found',
      );
    }

    if (
      user.role === 'ranger' &&
      task.created_by_user_id !==
        user.userId
    ) {
      throw new ForbiddenException(
        'You do not have permission to update this task',
      );
    }

    const updatedTask =
      await this.db
        .updateTable(
          'adventure_tasks',
        )
        .set({
          ...(dto.title !==
          undefined
            ? {
                title:
                  dto.title,
              }
            : {}),

          ...(dto.description !==
          undefined
            ? {
                description:
                  dto.description,
              }
            : {}),

          ...(dto.xp_reward !==
          undefined
            ? {
                xp_reward:
                  dto.xp_reward,
              }
            : {}),

          ...(dto.task_order !==
          undefined
            ? {
                task_order:
                  dto.task_order,
              }
            : {}),

          updated_at:
            new Date(),
        })
        .where(
          'id',
          '=',
          taskId,
        )
        .returningAll()
        .executeTakeFirst();

    return {
      message:
        'Adventure task updated successfully',

      task:
        updatedTask,
    };
  }

  async deleteAdventureTask(
    taskId: string,
    user: AuthUser,
  ) {
    if (
      user.role !== 'admin' &&
      user.role !== 'ranger'
    ) {
      throw new ForbiddenException(
        'Only Admins and Rangers can delete adventure tasks',
      );
    }

    const task = await this.db
      .selectFrom(
        'adventure_tasks',
      )
      .innerJoin(
        'adventures',
        'adventures.id',
        'adventure_tasks.adventure_id',
      )
      .select([
        'adventure_tasks.id',

        'adventure_tasks.adventure_id',

        'adventures.created_by_user_id',
      ])
      .where(
        'adventure_tasks.id',
        '=',
        taskId,
      )
      .where(
        'adventure_tasks.is_deleted',
        '=',
        false,
      )
      .where(
        'adventures.is_deleted',
        '=',
        false,
      )
      .executeTakeFirst();

    if (!task) {
      throw new NotFoundException(
        'Adventure task not found',
      );
    }

    if (
      user.role === 'ranger' &&
      task.created_by_user_id !==
        user.userId
    ) {
      throw new ForbiddenException(
        'You do not have permission to delete this task',
      );
    }

    await this.db
      .updateTable(
        'adventure_tasks',
      )
      .set({
        is_deleted: true,
        updated_at:
          new Date(),
      })
      .where(
        'id',
        '=',
        taskId,
      )
      .execute();

    return {
      message:
        'Adventure task deleted successfully',
    };
  }

  /*
   * ==========================================
   * ASSIGN ADVENTURE
   * ==========================================
   */

  async assignAdventureToCohorts(
    dto: AssignAdventureDto,
    user: AuthUser,
  ) {
    if (
      user.role !== 'admin' &&
      user.role !== 'ranger'
    ) {
      throw new ForbiddenException(
        'Only Admins and Rangers can assign adventures',
      );
    }

    if (
      user.role === 'ranger' &&
      dto.cohortIds.length > 1
    ) {
      throw new ForbiddenException(
        'Rangers can only assign an adventure to one cohort',
      );
    }

    const adventure = await this.db
      .selectFrom('adventures')
      .selectAll()
      .where(
        'id',
        '=',
        dto.adventureId,
      )
      .where(
        'is_deleted',
        '=',
        false,
      )
      .executeTakeFirst();

    if (!adventure) {
      throw new NotFoundException(
        'Adventure not found',
      );
    }

    const assignedRecords:
      CohortAdventureAssignment[] =
      [];

    for (
      const cohortId of
      dto.cohortIds
    ) {
      const cohort =
        await this.db
          .selectFrom(
            'cohorts',
          )
          .selectAll()
          .where(
            'id',
            '=',
            cohortId,
          )
          .where(
            'is_deleted',
            '=',
            false,
          )
          .executeTakeFirst();

      if (!cohort) {
        throw new NotFoundException(
          `Cohort not found: ${cohortId}`,
        );
      }

      if (
        user.role ===
          'ranger' &&
        cohort.created_by_ranger_id !==
          user.userId &&
        cohort.assigned_ranger_id !==
          user.userId
      ) {
        throw new ForbiddenException(
          'You can only assign adventures to cohorts you manage',
        );
      }

      const assignment =
        await this.db
          .insertInto(
            'cohort_adventures',
          )
          .values({
            id: randomUUID(),

            cohort_id:
              cohortId,

            adventure_id:
              dto.adventureId,

            assigned_by_user_id:
              user.userId,

            assigned_by_role:
              user.role,

            is_deleted:
              false,

            assigned_at:
              new Date(),

            created_at:
              new Date(),

            updated_at:
              null,
          })
          .onConflict(
            (oc) =>
              oc
                .columns([
                  'cohort_id',
                  'adventure_id',
                ])
                .doNothing(),
          )
          .returningAll()
          .executeTakeFirst();

      if (assignment) {
        assignedRecords.push(
          assignment,
        );
      }
    }

    return {
      message:
        'Adventure assigned successfully',

      assignments:
        assignedRecords,
    };
  }

  private async checkCohortAccess(
    cohortId: string,
    user: AuthUser,
  ) {
    const cohort = await this.db
      .selectFrom('cohorts')
      .selectAll()
      .where(
        'id',
        '=',
        cohortId,
      )
      .where(
        'is_deleted',
        '=',
        false,
      )
      .executeTakeFirst();

    if (!cohort) {
      throw new NotFoundException(
        'Cohort not found',
      );
    }

    if (
      user.role === 'admin'
    ) {
      return;
    }

    if (
      user.role === 'ranger' &&
      (
        cohort.created_by_ranger_id ===
          user.userId ||
        cohort.assigned_ranger_id ===
          user.userId
      )
    ) {
      return;
    }

    if (
      user.role ===
      'junior_ranger'
    ) {
      const membership =
        await this.db
          .selectFrom(
            'cohort_members',
          )
          .selectAll()
          .where(
            'cohort_id',
            '=',
            cohortId,
          )
          .where(
            'user_id',
            '=',
            user.userId,
          )
          .where(
            'is_deleted',
            '=',
            false,
          )
          .executeTakeFirst();

      if (membership) {
        return;
      }
    }

    throw new ForbiddenException(
      'You do not have access to this cohort',
    );
  }
}