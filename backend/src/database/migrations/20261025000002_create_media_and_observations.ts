import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // 1. Images Table
  await db.schema
    .createTable('images')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('secure_url', 'text', (col) => col.notNull())
    .addColumn('metadata', 'jsonb')
    .addColumn('is_deleted', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updated_at', 'timestamptz')
    .execute();

  // 2. Observations Table
  await db.schema
    .createTable('observations')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('student_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('teacher_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('notes', 'text', (col) => col.notNull())
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
    .createIndex('idx_images_is_deleted')
    .on('images')
    .column('is_deleted')
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_observations_student_id')
    .on('observations')
    .column('student_id')
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex('idx_observations_teacher_id')
    .on('observations')
    .column('teacher_id')
    .ifNotExists()
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('idx_observations_teacher_id').ifExists().execute();
  await db.schema.dropIndex('idx_observations_student_id').ifExists().execute();
  await db.schema.dropIndex('idx_images_is_deleted').ifExists().execute();

  await db.schema.dropTable('observations').ifExists().execute();
  await db.schema.dropTable('images').ifExists().execute();
}
