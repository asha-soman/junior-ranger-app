import { Module } from '@nestjs/common';
import { ActivityPostsController } from './activity-posts.controller';
import { ActivityPostsService } from './activity-posts.service';

@Module({
    controllers: [ActivityPostsController],
    providers: [ActivityPostsService],
    exports: [ActivityPostsService],
})
export class ActivityPostsModule { }