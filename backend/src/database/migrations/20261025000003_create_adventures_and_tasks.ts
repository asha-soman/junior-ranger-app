import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // 1. Adventures Table
  await db.schema
    .createTable('adventures')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('image_url', 'text')
    .addColumn('task_instructions', 'text')
    .addColumn('cohort_id', 'uuid', (col) =>
      col.notNull().references('cohorts.id').onDelete('cascade'),
    )
    .addColumn('due_date', 'timestamptz')
    .addColumn('status', 'varchar(50)', (col) =>
      col.notNull().defaultTo('published'),
    )
    .addColumn('created_by_user_id', 'uuid', (col) =>
      col.references('users.id').onDelete('set null'),
    )
    .addColumn('is_deleted', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();

  // 2. Adventure Tasks Table
  await db.schema
    .createTable('adventure_tasks')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('adventure_id', 'uuid', (col) =>
      col.notNull().references('adventures.id').onDelete('cascade'),
    )
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('xp_reward', 'integer', (col) => col.notNull().defaultTo(25))
    .addColumn('task_order', 'integer', (col) => col.notNull().defaultTo(1))
    .addColumn('is_deleted', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updated_at', 'timestamptz')
    .execute();

  // 3. Adventure Submissions Table
  await db.schema
    .createTable('adventure_submissions')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('adventure_id', 'uuid', (col) =>
      col.notNull().references('adventures.id').onDelete('cascade'),
    )
    .addColumn('cohort_id', 'uuid', (col) =>
      col.notNull().references('cohorts.id').onDelete('cascade'),
    )
    .addColumn('junior_ranger_user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('submission_text', 'text', (col) => col.notNull())
    .addColumn('image_id', 'uuid', (col) =>
      col.references('images.id').onDelete('set null'),
    )
    .addColumn('image_url', 'text')
    .addColumn('status', 'varchar(50)', (col) =>
      col.notNull().defaultTo('submitted'),
    )
    .addColumn('feedback', 'text')
    .addColumn('reviewed_by_ranger_id', 'uuid', (col) =>
      col.references('users.id').onDelete('set null'),
    )
    .addColumn('submitted_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('reviewed_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updated_at', 'timestamptz')
    .execute();

  // 4. Task Completions Table
  await db.schema
    .createTable('task_completions')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('task_id', 'uuid', (col) =>
      col.notNull().references('adventure_tasks.id').onDelete('cascade'),
    )
    .addColumn('junior_ranger_user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('submission_text', 'text')
    .addColumn('image_url', 'text')
    .addColumn('status', 'varchar(50)', (col) =>
      col.notNull().defaultTo('submitted'),
    )
    .addColumn('feedback', 'text')
    .addColumn('reviewed_by_ranger_id', 'uuid', (col) =>
      col.references('users.id').onDelete('set null'),
    )
    .addColumn('submitted_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('reviewed_at', 'timestamptz')
    .addColumn('xp_awarded', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updated_at', 'timestamptz')
    .execute();

  // 5. Cohort Adventures Table
  await db.schema
    .createTable('cohort_adventures')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('cohort_id', 'uuid', (col) =>
      col.notNull().references('cohorts.id').onDelete('cascade'),
    )
    .addColumn('adventure_id', 'uuid', (col) =>
      col.notNull().references('adventures.id').onDelete('cascade'),
    )
    .addColumn('assigned_by_user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('assigned_by_role', 'varchar(50)', (col) => col.notNull())
    .addColumn('is_deleted', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('assigned_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updated_at', 'timestamptz')
    .execute();

  // Indexes
  await db.schema
    .createIndex('idx_adventures_cohort_id')
    .on('adventures')
    .column('cohort_id')
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_adventure_tasks_adventure_id')
    .on('adventure_tasks')
    .column('adventure_id')
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_adventure_submissions_user_adv')
    .on('adventure_submissions')
    .columns(['junior_ranger_user_id', 'adventure_id'])
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_task_completions_user_task')
    .on('task_completions')
    .columns(['junior_ranger_user_id', 'task_id'])
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_cohort_adventures_cohort_adv')
    .on('cohort_adventures')
    .columns(['cohort_id', 'adventure_id'])
    .ifNotExists()
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropIndex('idx_cohort_adventures_cohort_adv')
    .ifExists()
    .execute();
  await db.schema
    .dropIndex('idx_task_completions_user_task')
    .ifExists()
    .execute();
  await db.schema
    .dropIndex('idx_adventure_submissions_user_adv')
    .ifExists()
    .execute();
  await db.schema
    .dropIndex('idx_adventure_tasks_adventure_id')
    .ifExists()
    .execute();
  await db.schema.dropIndex('idx_adventures_cohort_id').ifExists().execute();

  await db.schema.dropTable('cohort_adventures').ifExists().execute();
  await db.schema.dropTable('task_completions').ifExists().execute();
  await db.schema.dropTable('adventure_submissions').ifExists().execute();
  await db.schema.dropTable('adventure_tasks').ifExists().execute();
  await db.schema.dropTable('adventures').ifExists().execute();
}
