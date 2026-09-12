import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../../database/database.service';
import { SetReactionDto } from './dto/set-reaction.dto';
import {
    ReactionTargetType,
    ReactionType,
} from '../../database/database.types';

type AuthUser = {
    userId: string;
    email: string;
    role: 'admin' | 'ranger' | 'junior_ranger';
};

@Injectable()
export class ReactionsService {
    constructor(private readonly db: DatabaseService) { }

    // Check that the logged-in user can access the cohort
    private async validateCohortAccess(
        cohortId: string,
        user: AuthUser,
    ) {
        if (user.role === 'admin') {
            return;
        }

        const membership = await this.db
            .selectFrom('cohort_members')
            .select('id')
            .where('user_id', '=', user.userId)
            .where('cohort_id', '=', cohortId)
            .where('role', '=', user.role)
            .where('is_deleted', '=', false)
            .executeTakeFirst();

        if (!membership) {
            throw new ForbiddenException(
                'You do not have access to this content',
            );
        }
    }

    // Find target and validate its cohort
    private async validateTargetAccess(
        targetType: ReactionTargetType,
        targetId: string,
        user: AuthUser,
    ) {
        if (targetType === 'announcement') {
            const announcement = await this.db
                .selectFrom('announcements')
                .select([
                    'id',
                    'cohort_id',
                    'status',
                ])
                .where('id', '=', targetId)
                .where('is_deleted', '=', false)
                .executeTakeFirst();

            if (!announcement) {
                throw new NotFoundException(
                    'Announcement not found',
                );
            }

            if (
                user.role === 'junior_ranger' &&
                announcement.status !== 'published'
            ) {
                throw new ForbiddenException(
                    'This announcement is not available',
                );
            }

            await this.validateCohortAccess(
                announcement.cohort_id,
                user,
            );

            return;
        }

        if (targetType === 'event') {
            const event = await this.db
                .selectFrom('events')
                .select([
                    'id',
                    'cohort_id',
                    'status',
                ])
                .where('id', '=', targetId)
                .where('is_deleted', '=', false)
                .executeTakeFirst();

            if (!event) {
                throw new NotFoundException('Event not found');
            }

            if (
                user.role === 'junior_ranger' &&
                event.status !== 'published'
            ) {
                throw new ForbiddenException(
                    'This event is not available',
                );
            }

            await this.validateCohortAccess(
                event.cohort_id,
                user,
            );

            return;
        }

        if (targetType === 'activity_post') {
            const post = await this.db
                .selectFrom('activity_posts')
                .select([
                    'id',
                    'cohort_id',
                ])
                .where('id', '=', targetId)
                .where('is_deleted', '=', false)
                .executeTakeFirst();

            if (!post) {
                throw new NotFoundException(
                    'Activity post not found',
                );
            }

            await this.validateCohortAccess(
                post.cohort_id,
                user,
            );

            return;
        }

        if (targetType === 'club_activity') {
            const activity = await this.db
                .selectFrom('club_activities')
                .select([
                    'id',
                    'cohort_id',
                ])
                .where('id', '=', targetId)
                .where('is_deleted', '=', false)
                .executeTakeFirst();

            if (!activity) {
                throw new NotFoundException(
                    'Club activity not found',
                );
            }

            await this.validateCohortAccess(
                activity.cohort_id,
                user,
            );

            return;
        }

        throw new BadRequestException(
            'Invalid reaction target',
        );
    }

    // Create reaction OR change existing reaction
    async setReaction(
        dto: SetReactionDto,
        user: AuthUser,
    ) {
        await this.validateTargetAccess(
            dto.target_type,
            dto.target_id,
            user,
        );

        const existingReaction = await this.db
            .selectFrom('reactions')
            .selectAll()
            .where('user_id', '=', user.userId)
            .where('target_type', '=', dto.target_type)
            .where('target_id', '=', dto.target_id)
            .executeTakeFirst();

        if (existingReaction) {
            const updatedReaction = await this.db
                .updateTable('reactions')
                .set({
                    reaction_type: dto.reaction_type,
                    updated_at: new Date(),
                })
                .where('id', '=', existingReaction.id)
                .returningAll()
                .executeTakeFirstOrThrow();

            return {
                message: 'Reaction updated successfully',
                reaction: updatedReaction,
            };
        }

        const reaction = await this.db
            .insertInto('reactions')
            .values({
                id: randomUUID(),

                user_id: user.userId,

                target_type: dto.target_type,
                target_id: dto.target_id,

                reaction_type: dto.reaction_type,

                created_at: new Date(),
                updated_at: null,
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        return {
            message: 'Reaction added successfully',
            reaction,
        };
    }

    // Return reaction totals + logged-in user's reaction
    async getReactions(
        targetType: ReactionTargetType,
        targetId: string,
        user: AuthUser,
    ) {
        await this.validateTargetAccess(
            targetType,
            targetId,
            user,
        );

        const reactions = await this.db
            .selectFrom('reactions')
            .select([
                'reaction_type',
                'user_id',
            ])
            .where('target_type', '=', targetType)
            .where('target_id', '=', targetId)
            .execute();

        const counts: Record<ReactionType, number> = {
            clap: 0,
            thumbs_up: 0,
            star: 0,
            smile: 0,
            wow: 0,
            okay: 0,
        };

        let userReaction: ReactionType | null = null;

        for (const reaction of reactions) {
            counts[reaction.reaction_type]++;

            if (reaction.user_id === user.userId) {
                userReaction = reaction.reaction_type;
            }
        }

        return {
            target_type: targetType,
            target_id: targetId,
            reactions: counts,
            user_reaction: userReaction,
            total: reactions.length,
        };
    }

    // Remove user's reaction
    async removeReaction(
        targetType: ReactionTargetType,
        targetId: string,
        user: AuthUser,
    ) {
        await this.validateTargetAccess(
            targetType,
            targetId,
            user,
        );

        const reaction = await this.db
            .selectFrom('reactions')
            .select('id')
            .where('user_id', '=', user.userId)
            .where('target_type', '=', targetType)
            .where('target_id', '=', targetId)
            .executeTakeFirst();

        if (!reaction) {
            throw new NotFoundException(
                'Reaction not found',
            );
        }

        await this.db
            .deleteFrom('reactions')
            .where('id', '=', reaction.id)
            .execute();

        return {
            message: 'Reaction removed successfully',
        };
    }
}