import { Injectable } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { AnnouncementsService } from '../announcements/announcements.service';
import { ActivityPostsService } from '../activity-posts/activity-posts.service';
import { ClubActivitiesService } from '../club-activity/club-activities.service';
import { ReactionsService } from '../reaction/reactions.service';
import type { ReactionTargetType } from '../../database/database.types';

type AuthUser = {
    userId: string;
    email: string;
    role: 'admin' | 'ranger' | 'junior_ranger';
};

@Injectable()
export class FeedService {
    constructor(
        private readonly eventsService: EventsService,
        private readonly announcementsService: AnnouncementsService,
        private readonly activityPostsService: ActivityPostsService,
        private readonly clubActivitiesService: ClubActivitiesService,
        private readonly reactionsService: ReactionsService,
    ) { }

    async getFeed(user: AuthUser) {
        const [
            events,
            announcements,
            activityPosts,
            clubActivities,
        ] = await Promise.all([
            this.eventsService.getEvents(user),
            this.announcementsService.getAnnouncements(user),
            this.activityPostsService.getActivityPosts(user),
            this.clubActivitiesService.getClubActivities(user),
        ]);

        const eventItems = events.map((event) => ({
            id: event.id,
            type: 'event' as const,

            title: event.title,
            content: event.description,

            cohort_id: event.cohort_id,
            cohort_name: event.cohort_name,

            location: event.location,
            start_time: event.start_time,
            end_time: event.end_time,

            image_url: null,

            created_by_user_id: event.created_by_user_id,

            created_at: event.created_at,
        }));

        const announcementItems = announcements.map(
            (announcement) => ({
                id: announcement.id,
                type: 'announcement' as const,

                title: announcement.title,
                content: announcement.content,

                cohort_id: announcement.cohort_id,
                cohort_name: announcement.cohort_name,

                author_name: announcement.author_name,
                author_role: announcement.author_role,

                priority: announcement.priority,
                is_pinned: announcement.is_pinned,

                image_url: null,

                created_at:
                    announcement.published_at ??
                    announcement.created_at,
            }),
        );

        const activityItems = activityPosts.map((post) => ({
            id: post.id,
            type: 'activity_post' as const,

            title: null,
            content: post.content,

            image_url: post.image_url,

            cohort_id: post.cohort_id,
            cohort_name: post.cohort_name,

            author_name: post.author_name,
            author_avatar_url: post.author_avatar_url,

            created_by_user_id: post.created_by_user_id,

            created_at: post.created_at,
        }));

        const clubActivityItems = clubActivities.map(
            (activity) => ({
                id: activity.id,
                type: 'club_activity' as const,

                title: activity.title,
                content: activity.description,

                image_url: activity.image_url,

                cohort_id: activity.cohort_id,
                cohort_name: activity.cohort_name,

                author_name: activity.author_name,
                author_role: activity.author_role,

                activity_date: activity.activity_date,

                created_by_user_id:
                    activity.created_by_user_id,

                created_at: activity.created_at,
            }),
        );

        const feedItems = [
            ...announcementItems,
            ...eventItems,
            ...clubActivityItems,
            ...activityItems,
        ];

        const feedWithReactions = await Promise.all(
            feedItems.map(async (item) => {
                const reactionData =
                    await this.reactionsService.getReactions(
                        item.type as ReactionTargetType,
                        item.id,
                        user,
                    );

                return {
                    ...item,

                    reaction_counts: reactionData.reactions,

                    user_reaction:
                        reactionData.user_reaction,

                    total_reactions:
                        reactionData.total,
                };
            }),
        );

        return feedWithReactions.sort((a, b) => {
            const dateA = a.created_at
                ? new Date(a.created_at).getTime()
                : 0;

            const dateB = b.created_at
                ? new Date(b.created_at).getTime()
                : 0;

            return dateB - dateA;
        });
    }
}