import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DatabaseService } from '../../database/database.service';

type AuthUser = {
  userId: string;
  email: string;
  role: 'admin' | 'ranger' | 'junior_ranger';
};

@Injectable()
export class GamificationService {
  constructor(private readonly db: DatabaseService) {}

  private getLevelProgress(totalXp: number, currentLevel: number) {
    const thresholds = [
      { level: 1, minXp: 0, nextXp: 100 },
      { level: 2, minXp: 100, nextXp: 250 },
      { level: 3, minXp: 250, nextXp: 500 },
      { level: 4, minXp: 500, nextXp: 1000 },
      { level: 5, minXp: 1000, nextXp: null },
    ];

    const levelInfo = thresholds.find((item) => item.level === currentLevel);

    if (!levelInfo) {
      return {
        current_level: currentLevel,
        xp_into_level: 0,
        xp_needed_for_next_level: 0,
        progress_percentage: 100,
        next_level_xp: null,
      };
    }

    if (levelInfo.nextXp === null) {
      return {
        current_level: currentLevel,
        xp_into_level: totalXp - levelInfo.minXp,
        xp_needed_for_next_level: 0,
        progress_percentage: 100,
        next_level_xp: null,
      };
    }

    const xpIntoLevel = totalXp - levelInfo.minXp;

    const xpRange = levelInfo.nextXp - levelInfo.minXp;

    const percentage = Math.min(100, Math.round((xpIntoLevel / xpRange) * 100));

    return {
      current_level: currentLevel,
      xp_into_level: xpIntoLevel,
      xp_needed_for_next_level: levelInfo.nextXp - totalXp,
      progress_percentage: percentage,
      next_level_xp: levelInfo.nextXp,
    };
  }

  async getMyProgress(user: AuthUser) {
    if (user.role !== 'junior_ranger') {
      throw new ForbiddenException(
        'Only Junior Rangers have gamification progress',
      );
    }

    const juniorRanger = await this.db
      .selectFrom('users')
      .select(['id', 'name', 'total_xp', 'current_level'])
      .where('id', '=', user.userId)
      .where('is_deleted', '=', false)
      .executeTakeFirst();

    if (!juniorRanger) {
      throw new NotFoundException('Junior Ranger not found');
    }

    const levelProgress = this.getLevelProgress(
      juniorRanger.total_xp,
      juniorRanger.current_level,
    );

    return {
      user_id: juniorRanger.id,
      name: juniorRanger.name,
      total_xp: juniorRanger.total_xp,
      ...levelProgress,
    };
  }

  async getMyBadges(user: AuthUser) {
    if (user.role !== 'junior_ranger') {
      throw new ForbiddenException(
        'Only Junior Rangers can view earned badges',
      );
    }

    return this.db
      .selectFrom('user_badges')
      .innerJoin('badges', 'badges.id', 'user_badges.badge_id')
      .select([
        'badges.id',
        'badges.name',
        'badges.description',
        'badges.image_url',
        'badges.criteria_type',
        'badges.criteria_value',
        'user_badges.earned_at',
      ])
      .where('user_badges.user_id', '=', user.userId)
      .where('user_badges.is_deleted', '=', false)
      .where('badges.is_deleted', '=', false)
      .orderBy('user_badges.earned_at', 'desc')
      .execute();
  }

  async getMyNotifications(user: AuthUser) {
    return this.db
      .selectFrom('notifications')
      .selectAll()
      .where('user_id', '=', user.userId)
      .orderBy('created_at', 'desc')
      .execute();
  }

  async getAdventureProgress(adventureId: string, user: AuthUser) {
    if (user.role !== 'junior_ranger') {
      throw new ForbiddenException(
        'Only Junior Rangers can view adventure progress',
      );
    }

    // 1. Check the adventure exists
    const adventure = await this.db
      .selectFrom('adventures')
      .select(['id', 'title', 'cohort_id'])
      .where('id', '=', adventureId)
      .where('is_deleted', '=', false)
      .executeTakeFirst();

    if (!adventure) {
      throw new NotFoundException('Adventure not found');
    }

    // 2. Check that this Junior Ranger belongs to the adventure cohort
    const membership = await this.db
      .selectFrom('cohort_members')
      .select('id')
      .where('cohort_id', '=', adventure.cohort_id)
      .where('user_id', '=', user.userId)
      .where('is_deleted', '=', false)
      .executeTakeFirst();

    if (!membership) {
      throw new ForbiddenException('You do not have access to this adventure');
    }

    // 3. Get all tasks belonging to this adventure
    const tasks = await this.db
      .selectFrom('adventure_tasks')
      .select(['id', 'title', 'task_order', 'xp_reward'])
      .where('adventure_id', '=', adventureId)
      .where('is_deleted', '=', false)
      .orderBy('task_order', 'asc')
      .execute();

    // 4. Get this Junior Ranger's completion status for those tasks
    let completions: {
      task_id: string;
      status: 'submitted' | 'approved' | 'rejected';
    }[] = [];

    // Only query completions when the adventure actually has tasks
    if (tasks.length > 0) {
      completions = await this.db
        .selectFrom('task_completions')
        .select(['task_id', 'status'])
        .where('junior_ranger_user_id', '=', user.userId)
        .where(
          'task_id',
          'in',
          tasks.map((task) => task.id),
        )
        .execute();
    }

    // 5. Map each task to its completion status
    const completionMap = new Map(
      completions.map((completion) => [completion.task_id, completion.status]),
    );

    const taskProgress = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      task_order: task.task_order,
      xp_reward: task.xp_reward,
      status: completionMap.get(task.id) ?? 'not_started',
    }));

    // 6. Calculate adventure progress
    const totalTasks = tasks.length;

    const approvedTasks = taskProgress.filter(
      (task) => task.status === 'approved',
    ).length;

    const remainingTasks = totalTasks - approvedTasks;

    const progressPercentage =
      totalTasks === 0 ? 0 : Math.round((approvedTasks / totalTasks) * 100);

    // 7. Return everything the frontend needs
    return {
      adventure_id: adventure.id,
      adventure_title: adventure.title,
      total_tasks: totalTasks,
      approved_tasks: approvedTasks,
      remaining_tasks: remainingTasks,
      progress_percentage: progressPercentage,
      tasks: taskProgress,
    };
  }
}
