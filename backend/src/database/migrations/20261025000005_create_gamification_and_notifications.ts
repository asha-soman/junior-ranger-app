import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // 1. Badges Table
  await db.schema
    .createTable('badges')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('image_url', 'text')
    .addColumn('criteria_type', 'varchar(50)')
    .addColumn('criteria_value', 'integer')
    .addColumn('is_deleted', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();

  // 2. User Badges Table
  await db.schema
    .createTable('user_badges')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('badge_id', 'uuid', (col) =>
      col.notNull().references('badges.id').onDelete('cascade'),
    )
    .addColumn('earned_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('is_deleted', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();

  // 3. Notifications Table
  await db.schema
    .createTable('notifications')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('event_id', 'uuid', (col) =>
      col.references('events.id').onDelete('set null'),
    )
    .addColumn('type', 'varchar(100)', (col) => col.notNull())
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('message', 'text', (col) => col.notNull())
    .addColumn('is_read', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();

  // 4. Notification Preferences Table
  await db.schema
    .createTable('notification_preferences')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('user_id', 'uuid', (col) =>
      col.notNull().unique().references('users.id').onDelete('cascade'),
    )
    .addColumn('event_updates_enabled', 'boolean', (col) =>
      col.notNull().defaultTo(true),
    )
    .addColumn('event_reminders_enabled', 'boolean', (col) =>
      col.notNull().defaultTo(true),
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();

  // 5. Notification Delivery Logs Table
  await db.schema
    .createTable('notification_delivery_logs')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('notification_id', 'uuid', (col) =>
      col.references('notifications.id').onDelete('set null'),
    )
    .addColumn('user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('event_id', 'uuid', (col) =>
      col.references('events.id').onDelete('set null'),
    )
    .addColumn('channel', 'varchar(50)', (col) =>
      col.notNull().defaultTo('email'),
    )
    .addColumn('status', 'varchar(50)', (col) => col.notNull())
    .addColumn('recipient_email', 'varchar(255)')
    .addColumn('provider_message_id', 'varchar(255)')
    .addColumn('error_message', 'text')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();

  // Indexes
  await db.schema
    .createIndex('idx_badges_criteria')
    .on('badges')
    .columns(['criteria_type', 'criteria_value'])
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_user_badges_user_badge')
    .on('user_badges')
    .columns(['user_id', 'badge_id'])
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_notifications_user_read')
    .on('notifications')
    .columns(['user_id', 'is_read'])
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_notif_prefs_user')
    .on('notification_preferences')
    .column('user_id')
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_notif_logs_notif_id')
    .on('notification_delivery_logs')
    .column('notification_id')
    .ifNotExists()
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('idx_notif_logs_notif_id').ifExists().execute();
  await db.schema.dropIndex('idx_notif_prefs_user').ifExists().execute();
  await db.schema.dropIndex('idx_notifications_user_read').ifExists().execute();
  await db.schema.dropIndex('idx_user_badges_user_badge').ifExists().execute();
  await db.schema.dropIndex('idx_badges_criteria').ifExists().execute();

  await db.schema.dropTable('notification_delivery_logs').ifExists().execute();
  await db.schema.dropTable('notification_preferences').ifExists().execute();
  await db.schema.dropTable('notifications').ifExists().execute();
  await db.schema.dropTable('user_badges').ifExists().execute();
  await db.schema.dropTable('badges').ifExists().execute();
}
