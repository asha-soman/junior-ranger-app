import { Controller, Get, Inject } from '@nestjs/common';
import { Kysely } from 'kysely';
import { Database } from '../../database/interfaces/database.interface';

@Controller('cohorts')
export class CohortsListController {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly db: Kysely<Database>,
  ) {}

  @Get()
  async getCohorts() {
    return await this.db.selectFrom('cohorts').selectAll().execute();
  }
}
