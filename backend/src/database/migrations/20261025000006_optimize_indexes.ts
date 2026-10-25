import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // 1. Cohorts & Memberships Optimization
  await db.schema
    .createIndex('idx_cohort_members_cohort_deleted')
    .on('cohort_members')
    .columns(['cohort_id', 'is_deleted'])
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_cohort_members_user_role_deleted')
    .on('cohort_members')
    .columns(['user_id', 'role', 'is_deleted'])
    .ifNotExists()
    .execute();

  // 2. Feed, Social Hub & Reactions Optimization
  await db.schema
    .createIndex('idx_reactions_target_lookup')
    .on('reactions')
    .columns(['target_id', 'reaction_type', 'user_id'])
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_activity_posts_cohort_created')
    .on('activity_posts')
    .columns(['cohort_id', 'is_deleted', 'created_at'])
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_club_activities_cohort_created')
    .on('club_activities')
    .columns(['cohort_id', 'is_deleted', 'created_at'])
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_announcements_cohort_pinned_created')
    .on('announcements')
    .columns(['cohort_id', 'is_deleted', 'is_pinned', 'created_at'])
    .ifNotExists()
    .execute();

  // 3. Adventures, Tasks & Submissions Optimization
  await db.schema
    .createIndex('idx_adventures_cohort_deleted_created')
    .on('adventures')
    .columns(['cohort_id', 'is_deleted', 'created_at'])
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_adventure_tasks_adv_order')
    .on('adventure_tasks')
    .columns(['adventure_id', 'is_deleted', 'task_order'])
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_cohort_adventures_adv_cohort')
    .on('cohort_adventures')
    .columns(['adventure_id', 'is_deleted', 'cohort_id'])
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_task_completions_user_status')
    .on('task_completions')
    .columns(['junior_ranger_user_id', 'status'])
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_task_completions_task_submitted')
    .on('task_completions')
    .columns(['task_id', 'submitted_at'])
    .ifNotExists()
    .execute();

  // 4. Events & Reminders Scheduling Optimization
  await db.schema
    .createIndex('idx_events_status_deleted_start')
    .on('events')
    .columns(['status', 'is_deleted', 'start_time'])
    .ifNotExists()
    .execute();

  // 5. Notifications Polling Optimization
  await db.schema
    .createIndex('idx_notifications_user_created')
    .on('notifications')
    .columns(['user_id', 'created_at'])
    .ifNotExists()
    .execute();

  // 6. Users & Admin Management Filtering Optimization
  await db.schema
    .createIndex('idx_users_role_status_created')
    .on('users')
    .columns(['role', 'approval_status', 'is_deleted', 'created_at'])
    .ifNotExists()
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropIndex('idx_users_role_status_created')
    .ifExists()
    .execute();
  await db.schema
    .dropIndex('idx_notifications_user_created')
    .ifExists()
    .execute();
  await db.schema
    .dropIndex('idx_events_status_deleted_start')
    .ifExists()
    .execute();
  await db.schema
    .dropIndex('idx_task_completions_task_submitted')
    .ifExists()
    .execute();
  await db.schema
    .dropIndex('idx_task_completions_user_status')
    .ifExists()
    .execute();
  await db.schema
    .dropIndex('idx_cohort_adventures_adv_cohort')
    .ifExists()
    .execute();
  await db.schema
    .dropIndex('idx_adventure_tasks_adv_order')
    .ifExists()
    .execute();
  await db.schema
    .dropIndex('idx_adventures_cohort_deleted_created')
    .ifExists()
    .execute();
  await db.schema
    .dropIndex('idx_announcements_cohort_pinned_created')
    .ifExists()
    .execute();
  await db.schema
    .dropIndex('idx_club_activities_cohort_created')
    .ifExists()
    .execute();
  await db.schema
    .dropIndex('idx_activity_posts_cohort_created')
    .ifExists()
    .execute();
  await db.schema.dropIndex('idx_reactions_target_lookup').ifExists().execute();
  await db.schema
    .dropIndex('idx_cohort_members_user_role_deleted')
    .ifExists()
    .execute();
  await db.schema
    .dropIndex('idx_cohort_members_cohort_deleted')
    .ifExists()
    .execute();
}
