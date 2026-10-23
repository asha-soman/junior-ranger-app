import { Module } from '@nestjs/common';
import { ActivityPostsController } from './activity-posts.controller';
import { ActivityPostsService } from './activity-posts.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [ActivityPostsController],
  providers: [ActivityPostsService],
  exports: [ActivityPostsService],
})
export class ActivityPostsModule {}