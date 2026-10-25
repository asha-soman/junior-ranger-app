import { Module } from '@nestjs/common';

import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

import { EventsModule } from '../events/events.module';
import { AnnouncementsModule } from '../announcements/announcements.module';
import { ActivityPostsModule } from '../activity-posts/activity-posts.module';
import { ClubActivitiesModule } from '../club-activity/club-activities.module';
import { ReactionsModule } from '../reaction/reactions.module';

@Module({
    imports: [
        EventsModule,
        AnnouncementsModule,
        ActivityPostsModule,
        ClubActivitiesModule,
        ReactionsModule,
    ],
    controllers: [FeedController],
    providers: [FeedService],
    exports: [FeedService],
})
export class FeedModule { }