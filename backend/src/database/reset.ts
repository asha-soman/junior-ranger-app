import * as path from 'path';
import * as dotenv from 'dotenv';
import { createDatabaseConnection, createMigrator } from './migrator';
import { seedDatabase } from './seeds/seed';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function resetDatabase() {
  console.log('=== Database Reset Script ===');

  const isProduction = process.env.NODE_ENV === 'production';
  const hasForceFlag =
    process.argv.includes('--force') || process.env.FORCE_DB_RESET === 'true';

  if (isProduction && !hasForceFlag) {
    console.error(
      '[ABORTED] Cannot reset database in production without --force flag or FORCE_DB_RESET=true.',
    );
    process.exit(1);
  }

  const db = createDatabaseConnection();
  const migrator = createMigrator(db);

  try {
    console.log('1. Rolling back all executed migrations...');
    let rollbackCount = 0;
    while (true) {
      const { error, results } = await migrator.migrateDown();
      if (error) {
        console.error('Error during migration rollback:', error);
        throw error;
      }
      if (!results || results.length === 0) {
        break;
      }
      results.forEach((r) => {
        console.log(`   Rolled back: ${r.migrationName}`);
      });
      rollbackCount += results.length;
    }
    console.log(`   Completed rollback of ${rollbackCount} migration(s).`);

    console.log('2. Running migrations to latest (migrate:latest)...');
    const { error: latestError, results: latestResults } =
      await migrator.migrateToLatest();
    if (latestError) {
      console.error('Error applying migrations:', latestError);
      throw latestError;
    }
    latestResults?.forEach((r) => {
      console.log(`   Applied: ${r.migrationName}`);
    });

    console.log('3. Running seed script...');
    await seedDatabase(db, { truncate: false });

    console.log('\n=== Database Reset & Seeding Completed Successfully! ===\n');
  } catch (error) {
    console.error('Failed to reset database:', error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

if (require.main === module) {
  resetDatabase();
}
