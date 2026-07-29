import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Database } from './database.types';

@Injectable()
export class DatabaseService extends Kysely<Database> implements OnModuleDestroy {
  constructor(private readonly configService: ConfigService) {
    super({
      dialect: new PostgresDialect({
        pool: new Pool({
          host: configService.get<string>('DB_HOST'),
          port: Number(configService.get<string>('DB_PORT') ?? 5432),
          user: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          ssl:
            configService.get<string>('DB_SSL') === 'true'
              ? { rejectUnauthorized: false }
              : false,
        }),
      }),
    });
  }

  async onModuleDestroy() {
    await this.destroy();
  }
}