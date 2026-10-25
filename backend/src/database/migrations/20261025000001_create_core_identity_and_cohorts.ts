import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Ensure UUID generators are available
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`.execute(db);
  await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`.execute(db);

  // 1. Users Table
  await db.schema
    .createTable('users')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('email', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('name', 'varchar(255)')
    .addColumn('role', 'varchar(50)', (col) => col.notNull())
    .addColumn('password_hash', 'text')
    .addColumn('avatar_url', 'text')
    .addColumn('is_active', 'boolean', (col) => col.notNull().defaultTo(true))
    .addColumn('approval_status', 'varchar(50)', (col) =>
      col.notNull().defaultTo('approved'),
    )
    .addColumn('email_verified', 'boolean', (col) =>
      col.notNull().defaultTo(false),
    )
    .addColumn('two_factor_enabled', 'boolean', (col) =>
      col.notNull().defaultTo(false),
    )
    .addColumn('two_factor_code', 'varchar(50)')
    .addColumn('two_factor_expiry', 'timestamptz')
    .addColumn('total_xp', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('current_level', 'integer', (col) => col.notNull().defaultTo(1))
    .addColumn('is_deleted', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();

  // 2. Cohorts Table
  await db.schema
    .createTable('cohorts')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('location', 'text')
    .addColumn('image_url', 'text')
    .addColumn('created_by_ranger_id', 'uuid', (col) =>
      col.references('users.id').onDelete('set null'),
    )
    .addColumn('assigned_ranger_id', 'uuid', (col) =>
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

  // 3. Cohort Members Table
  await db.schema
    .createTable('cohort_members')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('cohort_id', 'uuid', (col) =>
      col.notNull().references('cohorts.id').onDelete('cascade'),
    )
    .addColumn('role', 'varchar(50)', (col) => col.notNull())
    .addColumn('is_deleted', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();

  // 4. Invite Codes Table
  await db.schema
    .createTable('invite_codes')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('cohort_id', 'uuid', (col) =>
      col.notNull().references('cohorts.id').onDelete('cascade'),
    )
    .addColumn('code', 'varchar(100)', (col) => col.notNull().unique())
    .addColumn('expiry_date', 'timestamptz', (col) => col.notNull())
    .addColumn('max_usage', 'integer', (col) => col.notNull().defaultTo(10))
    .addColumn('used_count', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('active', 'boolean', (col) => col.notNull().defaultTo(true))
    .addColumn('created_by', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();

  // 5. Auth Challenges Table
  await db.schema
    .createTable('auth_challenges')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('email', 'varchar(255)', (col) => col.notNull())
    .addColumn('code', 'varchar(50)', (col) => col.notNull())
    .addColumn('purpose', 'varchar(50)', (col) => col.notNull())
    .addColumn('expires_at', 'timestamptz', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();

  // 6. Sessions Table
  await db.schema
    .createTable('sessions')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('token', 'text', (col) => col.notNull())
    .addColumn('expires_at', 'timestamptz', (col) => col.notNull())
    .addColumn('is_deleted', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();

  // Indexes
  await db.schema
    .createIndex('idx_users_email')
    .on('users')
    .column('email')
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_cohort_members_user_cohort')
    .on('cohort_members')
    .columns(['user_id', 'cohort_id'])
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_invite_codes_code')
    .on('invite_codes')
    .column('code')
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_auth_challenges_email_purpose')
    .on('auth_challenges')
    .columns(['email', 'purpose'])
    .ifNotExists()
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropIndex('idx_auth_challenges_email_purpose')
    .ifExists()
    .execute();
  await db.schema.dropIndex('idx_invite_codes_code').ifExists().execute();
  await db.schema
    .dropIndex('idx_cohort_members_user_cohort')
    .ifExists()
    .execute();
  await db.schema.dropIndex('idx_users_email').ifExists().execute();

  await db.schema.dropTable('sessions').ifExists().execute();
  await db.schema.dropTable('auth_challenges').ifExists().execute();
  await db.schema.dropTable('invite_codes').ifExists().execute();
  await db.schema.dropTable('cohort_members').ifExists().execute();
  await db.schema.dropTable('cohorts').ifExists().execute();
  await db.schema.dropTable('users').ifExists().execute();
}
