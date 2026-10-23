import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DatabaseService } from '../../database/database.service';

type AuthUser = {
  userId: string;
  email: string;
  role:
    | 'admin'
    | 'ranger'
    | 'junior_ranger';
};

type TaskCompletionProgress = {
  id: string;
  task_id: string;
  status:
    | 'submitted'
    | 'approved'
    | 'rejected';
  submission_text: string | null;
  image_url: string | null;
  feedback: string | null;
};

@Injectable()
export class GamificationService {
  constructor(
    private readonly db: DatabaseService,
  ) {}

  private getLevelProgress(
    totalXp: number,
    currentLevel: number,
  ) {
    const thresholds = [
      {
        level: 1,
        minXp: 0,
        nextXp: 100,
      },
      {
        level: 2,
        minXp: 100,
        nextXp: 250,
      },
      {
        level: 3,
        minXp: 250,
        nextXp: 500,
      },
      {
        level: 4,
        minXp: 500,
        nextXp: 1000,
      },
      {
        level: 5,
        minXp: 1000,
        nextXp: null,
      },
    ];

    const levelInfo =
      thresholds.find(
        (item) =>
          item.level ===
          currentLevel,
      );

    if (!levelInfo) {
      return {
        current_level:
          currentLevel,

        xp_into_level: 0,

        xp_needed_for_next_level:
          0,

        progress_percentage:
          100,

        next_level_xp:
          null,
      };
    }

    if (
      levelInfo.nextXp ===
      null
    ) {
      return {
        current_level:
          currentLevel,

        xp_into_level:
          totalXp -
          levelInfo.minXp,

        xp_needed_for_next_level:
          0,

        progress_percentage:
          100,

        next_level_xp:
          null,
      };
    }

    const xpIntoLevel =
      totalXp -
      levelInfo.minXp;

    const xpRange =
      levelInfo.nextXp -
      levelInfo.minXp;

    const percentage =
      Math.min(
        100,
        Math.round(
          (xpIntoLevel /
            xpRange) *
            100,
        ),
      );

    return {
      current_level:
        currentLevel,

      xp_into_level:
        xpIntoLevel,

      xp_needed_for_next_level:
        levelInfo.nextXp -
        totalXp,

      progress_percentage:
        percentage,

      next_level_xp:
        levelInfo.nextXp,
    };
  }

  /*
   * ==========================================
   * OVERALL JUNIOR RANGER PROGRESS
   * ==========================================
   */

  async getMyProgress(
    user: AuthUser,
  ) {
    if (
      user.role !==
      'junior_ranger'
    ) {
      throw new ForbiddenException(
        'Only Junior Rangers have gamification progress',
      );
    }

    const juniorRanger =
      await this.db
        .selectFrom('users')
        .select([
          'id',
          'name',
          'total_xp',
          'current_level',
        ])
        .where(
          'id',
          '=',
          user.userId,
        )
        .where(
          'is_deleted',
          '=',
          false,
        )
        .executeTakeFirst();

    if (!juniorRanger) {
      throw new NotFoundException(
        'Junior Ranger not found',
      );
    }

    const levelProgress =
      this.getLevelProgress(
        juniorRanger.total_xp,
        juniorRanger.current_level,
      );

    return {
      user_id:
        juniorRanger.id,

      name:
        juniorRanger.name,

      total_xp:
        juniorRanger.total_xp,

      ...levelProgress,
    };
  }

  /*
   * ==========================================
   * BADGES
   * ==========================================
   */

  async getMyBadges(
    user: AuthUser,
  ) {
    if (
      user.role !==
      'junior_ranger'
    ) {
      throw new ForbiddenException(
        'Only Junior Rangers can view earned badges',
      );
    }

    return this.db
      .selectFrom(
        'user_badges',
      )
      .innerJoin(
        'badges',
        'badges.id',
        'user_badges.badge_id',
      )
      .select([
        'badges.id',
        'badges.name',
        'badges.description',
        'badges.image_url',
        'badges.criteria_type',
        'badges.criteria_value',
        'user_badges.earned_at',
      ])
      .where(
        'user_badges.user_id',
        '=',
        user.userId,
      )
      .where(
        'user_badges.is_deleted',
        '=',
        false,
      )
      .where(
        'badges.is_deleted',
        '=',
        false,
      )
      .orderBy(
        'user_badges.earned_at',
        'desc',
      )
      .execute();
  }

  /*
   * ==========================================
   * NOTIFICATIONS
   * ==========================================
   */

  async getMyNotifications(
    user: AuthUser,
  ) {
    return this.db
      .selectFrom(
        'notifications',
      )
      .selectAll()
      .where(
        'user_id',
        '=',
        user.userId,
      )
      .orderBy(
        'created_at',
        'desc',
      )
      .execute();
  }

  /*
   * ==========================================
   * ADVENTURE PROGRESS
   * ==========================================
   */

  async getAdventureProgress(
    adventureId: string,
    user: AuthUser,
  ) {
    if (
      user.role !==
      'junior_ranger'
    ) {
      throw new ForbiddenException(
        'Only Junior Rangers can view adventure progress',
      );
    }

    /*
     * 1. Check adventure exists.
     */
    const adventure =
      await this.db
        .selectFrom(
          'adventures',
        )
        .select([
          'id',
          'title',
          'cohort_id',
        ])
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

    /*
     * 2. Make sure the Junior Ranger
     * belongs to this adventure's cohort.
     */
    const membership =
      await this.db
        .selectFrom(
          'cohort_members',
        )
        .select('id')
        .where(
          'cohort_id',
          '=',
          adventure.cohort_id,
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

    if (!membership) {
      throw new ForbiddenException(
        'You do not have access to this adventure',
      );
    }

    /*
     * 3. Get every task belonging
     * to this adventure.
     */
    const tasks =
      await this.db
        .selectFrom(
          'adventure_tasks',
        )
        .select([
          'id',
          'title',
          'task_order',
          'xp_reward',
        ])
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

    /*
     * 4. Get this Junior Ranger's
     * completion information.
     *
     * We now return more than status
     * because rejected tasks need:
     *
     * - Ranger feedback
     * - previous answer
     * - previous image
     * - completion ID
     */
    let completions:
      TaskCompletionProgress[] =
      [];

    if (tasks.length > 0) {
      completions =
        await this.db
          .selectFrom(
            'task_completions',
          )
          .select([
            'id',
            'task_id',
            'status',
            'submission_text',
            'image_url',
            'feedback',
          ])
          .where(
            'junior_ranger_user_id',
            '=',
            user.userId,
          )
          .where(
            'task_id',
            'in',
            tasks.map(
              (task) =>
                task.id,
            ),
          )
          .execute();
    }

    /*
     * Map completion information by
     * task ID so it can easily be joined
     * with the adventure tasks.
     */
    const completionMap =
      new Map(
        completions.map(
          (completion) => [
            completion.task_id,
            completion,
          ],
        ),
      );

    /*
     * 5. Build frontend task progress.
     */
    const taskProgress =
      tasks.map((task) => {
        const completion =
          completionMap.get(
            task.id,
          );

        return {
          id: task.id,

          title:
            task.title,

          task_order:
            task.task_order,

          xp_reward:
            task.xp_reward,

          status:
            completion?.status ??
            'not_started',

          /*
           * Added for rejection /
           * resubmission support.
           */
          completion_id:
            completion?.id ??
            null,

          submission_text:
            completion
              ?.submission_text ??
            null,

          image_url:
            completion
              ?.image_url ??
            null,

          feedback:
            completion
              ?.feedback ??
            null,
        };
      });

    /*
     * 6. Adventure progress counts ONLY
     * approved tasks.
     *
     * Rejected and submitted tasks do not
     * increase Adventure progress.
     */
    const totalTasks =
      tasks.length;

    const approvedTasks =
      taskProgress.filter(
        (task) =>
          task.status ===
          'approved',
      ).length;

    const remainingTasks =
      totalTasks -
      approvedTasks;

    const progressPercentage =
      totalTasks === 0
        ? 0
        : Math.round(
            (approvedTasks /
              totalTasks) *
              100,
          );

    /*
     * 7. Return everything required
     * by the Junior Ranger UI.
     */
    return {
      adventure_id:
        adventure.id,

      adventure_title:
        adventure.title,

      total_tasks:
        totalTasks,

      approved_tasks:
        approvedTasks,

      remaining_tasks:
        remainingTasks,

      progress_percentage:
        progressPercentage,

      tasks:
        taskProgress,
    };
  }
}