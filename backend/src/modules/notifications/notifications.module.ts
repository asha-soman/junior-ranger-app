import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { EmailModule } from '../email/email.module';
import { EventRemindersService } from './event-reminders.service';

@Module({
  imports: [EmailModule],
  controllers: [NotificationsController],
    providers: [
    NotificationsService,
    EventRemindersService,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}