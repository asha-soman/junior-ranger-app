import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function check() {
  const db = new Kysely<any>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      }),
    }),
  });

  try {
    const users = await db.selectFrom('users').selectAll().execute();
    console.log('Users:', users.length);
    
    const cohorts = await db.selectFrom('cohorts').selectAll().execute();
    console.log('Cohorts:', cohorts.length);

    if (cohorts.length === 0) {
      console.log('No cohorts found. Creating a mock cohort...');
      // We need a user first
      let userId;
      if (users.length === 0) {
         const user = await db.insertInto('users').values({
           id: '00000000-0000-0000-0000-000000000001',
           email: 'ranger@test.com',
           role: 'Ranger',
           name: 'Mock Ranger'
         }).returning('id').executeTakeFirstOrThrow();
         userId = user.id;
      } else {
         userId = users[0].id;
      }

      await db.insertInto('cohorts').values({
        id: 'mock-cohort-id',
        name: 'Mock Cohort',
        assigned_ranger_id: userId
      }).execute();
      console.log('Mock cohort created.');
    }
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await db.destroy();
  }
}

check();
