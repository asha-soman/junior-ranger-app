import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly db: DatabaseService) {}

  async onModuleInit() {
    try {
      const users = await this.db
        .selectFrom('users')
        .selectAll()
        .execute();

      console.log('DB Connected Successfully!');
    } catch (error) {
      console.error('DB Connection Failed!', error);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}