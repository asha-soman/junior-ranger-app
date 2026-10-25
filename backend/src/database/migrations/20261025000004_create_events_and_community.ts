import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // 1. Events Table
  await db.schema
    .createTable('events')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('location', 'text')
    .addColumn('start_time', 'timestamptz', (col) => col.notNull())
    .addColumn('end_time', 'timestamptz', (col) => col.notNull())
    .addColumn('registration_deadline', 'timestamptz')
    .addColumn('capacity', 'integer')
    .addColumn('status', 'varchar(50)', (col) =>
      col.notNull().defaultTo('published'),
    )
    .addColumn('cohort_id', 'uuid', (col) =>
      col.notNull().references('cohorts.id').onDelete('cascade'),
    )
    .addColumn('created_by_user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('is_deleted', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();

  // 2. Event Registrations Table
  await db.schema
    .createTable('event_registrations')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('event_id', 'uuid', (col) =>
      col.notNull().references('events.id').onDelete('cascade'),
    )
    .addColumn('junior_ranger_user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('status', 'varchar(50)', (col) =>
      col.notNull().defaultTo('registered'),
    )
    .addColumn('registered_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('cancelled_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();

  // 3. Event Attendance Table
  await db.schema
    .createTable('event_attendance')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('registration_id', 'uuid', (col) =>
      col.notNull().references('event_registrations.id').onDelete('cascade'),
    )
    .addColumn('status', 'varchar(50)', (col) =>
      col.notNull().defaultTo('not_marked'),
    )
    .addColumn('marked_by_user_id', 'uuid', (col) =>
      col.references('users.id').onDelete('set null'),
    )
    .addColumn('marked_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();

  // 4. Announcements Table
  await db.schema
    .createTable('announcements')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('cohort_id', 'uuid', (col) =>
      col.notNull().references('cohorts.id').onDelete('cascade'),
    )
    .addColumn('created_by_user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('status', 'varchar(50)', (col) =>
      col.notNull().defaultTo('published'),
    )
    .addColumn('priority', 'varchar(50)', (col) =>
      col.notNull().defaultTo('normal'),
    )
    .addColumn('is_pinned', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('is_deleted', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('published_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updated_at', 'timestamptz')
    .execute();

  // 5. Activity Posts Table
  await db.schema
    .createTable('activity_posts')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('image_url', 'text')
    .addColumn('cohort_id', 'uuid', (col) =>
      col.notNull().references('cohorts.id').onDelete('cascade'),
    )
    .addColumn('created_by_user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('is_deleted', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updated_at', 'timestamptz')
    .execute();

  // 6. Club Activities Table
  await db.schema
    .createTable('club_activities')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('image_url', 'text')
    .addColumn('cohort_id', 'uuid', (col) =>
      col.notNull().references('cohorts.id').onDelete('cascade'),
    )
    .addColumn('created_by_user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('activity_date', 'timestamptz')
    .addColumn('is_deleted', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updated_at', 'timestamptz')
    .execute();

  // 7. Reactions Table
  await db.schema
    .createTable('reactions')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('target_type', 'varchar(50)', (col) => col.notNull())
    .addColumn('target_id', 'uuid', (col) => col.notNull())
    .addColumn('reaction_type', 'varchar(50)', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updated_at', 'timestamptz')
    .execute();

  // Indexes
  await db.schema
    .createIndex('idx_events_cohort_start')
    .on('events')
    .columns(['cohort_id', 'start_time'])
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_event_reg_event_user')
    .on('event_registrations')
    .columns(['event_id', 'junior_ranger_user_id'])
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_announcements_cohort_pinned')
    .on('announcements')
    .columns(['cohort_id', 'is_pinned'])
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_activity_posts_cohort')
    .on('activity_posts')
    .column('cohort_id')
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_reactions_target')
    .on('reactions')
    .columns(['target_type', 'target_id'])
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_reactions_user_target')
    .on('reactions')
    .columns(['user_id', 'target_type', 'target_id'])
    .ifNotExists()
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('idx_reactions_user_target').ifExists().execute();
  await db.schema.dropIndex('idx_reactions_target').ifExists().execute();
  await db.schema.dropIndex('idx_activity_posts_cohort').ifExists().execute();
  await db.schema
    .dropIndex('idx_announcements_cohort_pinned')
    .ifExists()
    .execute();
  await db.schema.dropIndex('idx_event_reg_event_user').ifExists().execute();
  await db.schema.dropIndex('idx_events_cohort_start').ifExists().execute();

  await db.schema.dropTable('reactions').ifExists().execute();
  await db.schema.dropTable('club_activities').ifExists().execute();
  await db.schema.dropTable('activity_posts').ifExists().execute();
  await db.schema.dropTable('announcements').ifExists().execute();
  await db.schema.dropTable('event_attendance').ifExists().execute();
  await db.schema.dropTable('event_registrations').ifExists().execute();
  await db.schema.dropTable('events').ifExists().execute();
}
