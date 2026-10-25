import * as path from 'path';
import { Pool } from 'pg';
import { promises as fs } from 'fs';
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider,
} from 'kysely';
import * as dotenv from 'dotenv';

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../../.env') });

export function createDatabaseConnection(): Kysely<any> {
  const isSsl = process.env.DB_SSL === 'true';

  const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: isSsl ? { rejectUnauthorized: false } : false,
  });

  return new Kysely<any>({
    dialect: new PostgresDialect({ pool }),
  });
}

export function createMigrator(db: Kysely<any>): Migrator {
  return new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, 'migrations'),
    }),
  });
}

export async function runMigration(
  action: string = process.argv[2] || 'latest',
) {
  const db = createDatabaseConnection();
  const migrator = createMigrator(db);

  try {
    if (action === 'latest') {
      console.log('Running pending migrations (migrate:latest)...');
      const { error, results } = await migrator.migrateToLatest();

      results?.forEach((it) => {
        if (it.status === 'Success') {
          console.log(
            `[SUCCESS] Migration "${it.migrationName}" executed successfully.`,
          );
        } else if (it.status === 'Error') {
          console.error(
            `[ERROR] Failed to execute migration "${it.migrationName}".`,
          );
        }
      });

      if (error) {
        console.error('Migration execution failed with error:', error);
        process.exit(1);
      }

      if (!results || results.length === 0) {
        console.log('Database is already up to date. No migrations to run.');
      }
    } else if (action === 'down') {
      console.log('Rolling back last migration batch (migrate:down)...');
      const { error, results } = await migrator.migrateDown();

      results?.forEach((it) => {
        if (it.status === 'Success') {
          console.log(
            `[SUCCESS] Migration "${it.migrationName}" was successfully rolled back.`,
          );
        } else if (it.status === 'Error') {
          console.error(
            `[ERROR] Failed to roll back migration "${it.migrationName}".`,
          );
        }
      });

      if (error) {
        console.error('Rollback failed with error:', error);
        process.exit(1);
      }

      if (!results || results.length === 0) {
        console.log('No executed migrations available to roll back.');
      }
    } else if (action === 'status') {
      console.log('Checking migration status...\n');
      const migrations = await migrator.getMigrations();

      console.log(
        '--------------------------------------------------------------------------------',
      );
      console.log(
        'STATUS'.padEnd(12) + 'MIGRATION NAME'.padEnd(52) + 'EXECUTED AT',
      );
      console.log(
        '--------------------------------------------------------------------------------',
      );

      if (migrations.length === 0) {
        console.log('No migration files found in migrations directory.');
      } else {
        for (const m of migrations) {
          const status = m.executedAt ? 'EXECUTED' : 'PENDING';
          const executedAt = m.executedAt ? m.executedAt.toISOString() : '-';
          console.log(status.padEnd(12) + m.name.padEnd(52) + executedAt);
        }
      }
      console.log(
        '--------------------------------------------------------------------------------\n',
      );
    } else {
      console.error(
        `Unknown action: "${action}". Supported actions: "latest", "down", "status".`,
      );
      process.exit(1);
    }
  } catch (err) {
    console.error('Unexpected migration runner error:', err);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

if (require.main === module) {
  runMigration();
}
