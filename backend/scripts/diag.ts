import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function diag() {
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
    const cohort = await db.selectFrom('cohorts').selectAll().limit(1).executeTakeFirst();
    if (!cohort) {
        console.error('No cohorts in DB');
        return;
    }
    const user = await db.selectFrom('users').selectAll().limit(1).executeTakeFirst();
    if (!user) {
        console.error('No users in DB');
        return;
    }

    console.log('Testing with real Cohort ID:', cohort.id);
    
    const code = 'TEST' + Math.floor(Math.random() * 1000);
    const result = await db
      .insertInto('invite_codes')
      .values({
        cohort_id: cohort.id,
        code: code,
        expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        max_usage: 10,
        created_by: user.id,
      })
      .returningAll()
      .executeTakeFirst();
      
    console.log('API call simulation successful!', result);
  } catch (e: any) {
    console.error('CRITICAL ERROR:', e.message);
  } finally {
    await db.destroy();
  }
}

diag();
