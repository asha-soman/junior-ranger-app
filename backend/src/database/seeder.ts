import { createDatabaseConnection } from './migrator';
import { seedDatabase } from './seeds/seed';

async function runSeeder() {
  const db = createDatabaseConnection();

  const truncate =
    process.argv.includes('--truncate') || process.argv.includes('-t');

  try {
    await seedDatabase(db, { truncate });
  } catch (error) {
    console.error('Database seeding failed with error:', error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

if (require.main === module) {
  runSeeder();
}
