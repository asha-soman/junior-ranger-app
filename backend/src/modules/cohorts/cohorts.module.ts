import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CohortsController } from './cohorts.controller';
import { InviteCodesController } from './invite-codes.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { CohortsService } from './cohorts.service';

@Module({
  imports: [DatabaseModule, NotificationsModule],
  controllers: [CohortsController, InviteCodesController],
  providers: [CohortsService],
})
export class CohortsModule {}