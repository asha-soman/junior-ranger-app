
import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { DatabaseService } from '../../database/database.service';
import { CreateActivityPostDto } from './dto/create-activity-post.dto';
import { UpdateActivityPostDto } from './dto/update-activity-post.dto';

type AuthUser = {
    userId: string;
    email: string;
    role: 'admin' | 'ranger' | 'junior_ranger';
};

@Injectable()
export class ActivityPostsService {
    constructor(
        private readonly db: DatabaseService,
    ) { }

    // Verify that the user belongs to or manages a cohort
    private async validateCohortAccess(
        cohortId: string,
        user: AuthUser,
    ) {
        const cohort = await this.db
            .selectFrom('cohorts')
            .selectAll()
            .where('id', '=', cohortId)
            .where('is_deleted', '=', false)
            .executeTakeFirst();

        if (!cohort) {
            throw new NotFoundException('Cohort not found');
        }

        if (user.role === 'admin') {
            return cohort;
        }

        const membership = await this.db
            .selectFrom('cohort_members')
            .select(['id', 'role'])
            .where('user_id', '=', user.userId)
            .where('cohort_id', '=', cohortId)
            .where('is_deleted', '=', false)
            .executeTakeFirst();

        if (!membership) {
            throw new ForbiddenException(
                'You do not have access to this cohort',
            );
        }

        if (
            user.role === 'ranger' &&
            membership.role !== 'ranger'
        ) {
            throw new ForbiddenException(
                'You do not manage this cohort',
            );
        }

        if (
            user.role === 'junior_ranger' &&
            membership.role !== 'junior_ranger'
        ) {
            throw new ForbiddenException(
                'You are not a Junior Ranger in this cohort',
            );
        }

        return cohort;
    }

    // RANGER: CREATE POST
    async createActivityPost(
        dto: CreateActivityPostDto,
        user: AuthUser,
    ) {
        if (user.role !== 'ranger') {
            throw new ForbiddenException(
                'Only Rangers can create Community Hub posts',
            );
        }

        await this.validateCohortAccess(
            dto.cohort_id,
            user,
        );

        const post = await this.db
            .insertInto('activity_posts')
            .values({
                id: randomUUID(),
                content: dto.content.trim(),
                image_url: dto.image_url ?? null,
                cohort_id: dto.cohort_id,
                created_by_user_id: user.userId,
                is_deleted: false,
                created_at: new Date(),
                updated_at: null,
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        return {
            message: 'Community Hub post created successfully',
            post,
        };
    }

    // VIEW POSTS ACCORDING TO USER ACCESS
    async getActivityPosts(user: AuthUser) {
        if (user.role === 'admin') {
            return this.db
                .selectFrom('activity_posts')
                .innerJoin(
                    'users as author',
                    'author.id',
                    'activity_posts.created_by_user_id',
                )
                .innerJoin(
                    'cohorts',
                    'cohorts.id',
                    'activity_posts.cohort_id',
                )
                .select([
                    'activity_posts.id',
                    'activity_posts.content',
                    'activity_posts.image_url',
                    'activity_posts.cohort_id',
                    'activity_posts.created_by_user_id',
                    'activity_posts.created_at',
                    'activity_posts.updated_at',
                    'author.name as author_name',
                    'author.avatar_url as author_avatar_url',
                    'cohorts.name as cohort_name',
                ])
                .where('activity_posts.is_deleted', '=', false)
                .orderBy('activity_posts.created_at', 'desc')
                .execute();
        }

        return this.db
            .selectFrom('activity_posts')
            .innerJoin(
                'cohort_members',
                'cohort_members.cohort_id',
                'activity_posts.cohort_id',
            )
            .innerJoin(
                'users as author',
                'author.id',
                'activity_posts.created_by_user_id',
            )
            .innerJoin(
                'cohorts',
                'cohorts.id',
                'activity_posts.cohort_id',
            )
            .select([
                'activity_posts.id',
                'activity_posts.content',
                'activity_posts.image_url',
                'activity_posts.cohort_id',
                'activity_posts.created_by_user_id',
                'activity_posts.created_at',
                'activity_posts.updated_at',
                'author.name as author_name',
                'author.avatar_url as author_avatar_url',
                'cohorts.name as cohort_name',
            ])
            .where('cohort_members.user_id', '=', user.userId)
            .where('cohort_members.role', '=', user.role)
            .where('cohort_members.is_deleted', '=', false)
            .where('activity_posts.is_deleted', '=', false)
            .orderBy('activity_posts.created_at', 'desc')
            .execute();
    }

    // VIEW INDIVIDUAL POST
    async getActivityPostDetails(
        postId: string,
        user: AuthUser,
    ) {
        const post = await this.db
            .selectFrom('activity_posts')
            .innerJoin(
                'users as author',
                'author.id',
                'activity_posts.created_by_user_id',
            )
            .innerJoin(
                'cohorts',
                'cohorts.id',
                'activity_posts.cohort_id',
            )
            .select([
                'activity_posts.id',
                'activity_posts.content',
                'activity_posts.image_url',
                'activity_posts.cohort_id',
                'activity_posts.created_by_user_id',
                'activity_posts.created_at',
                'activity_posts.updated_at',
                'author.name as author_name',
                'author.avatar_url as author_avatar_url',
                'cohorts.name as cohort_name',
            ])
            .where('activity_posts.id', '=', postId)
            .where('activity_posts.is_deleted', '=', false)
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

        return post;
    }

    // RANGER: EDIT OWN POST
    async updateActivityPost(
        postId: string,
        dto: UpdateActivityPostDto,
        user: AuthUser,
    ) {
        if (user.role !== 'ranger') {
            throw new ForbiddenException(
                'Only Rangers can edit Community Hub posts',
            );
        }

        const post = await this.db
            .selectFrom('activity_posts')
            .selectAll()
            .where('id', '=', postId)
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

        if (post.created_by_user_id !== user.userId) {
            throw new ForbiddenException(
                'You can only edit your own posts',
            );
        }

        const updatedPost = await this.db
            .updateTable('activity_posts')
            .set({
                ...(dto.content !== undefined
                    ? { content: dto.content.trim() }
                    : {}),
                ...(dto.image_url !== undefined
                    ? { image_url: dto.image_url }
                    : {}),
                updated_at: new Date(),
            })
            .where('id', '=', postId)
            .returningAll()
            .executeTakeFirstOrThrow();

        return {
            message: 'Community Hub post updated successfully',
            post: updatedPost,
        };
    }

    // RANGER: DELETE OWN POST
    // ADMIN: DELETE FOR MODERATION
    async deleteActivityPost(
        postId: string,
        user: AuthUser,
    ) {
        if (
            user.role !== 'admin' &&
            user.role !== 'ranger'
        ) {
            throw new ForbiddenException(
                'You do not have permission to delete posts',
            );
        }

        const post = await this.db
            .selectFrom('activity_posts')
            .selectAll()
            .where('id', '=', postId)
            .where('is_deleted', '=', false)
            .executeTakeFirst();

        if (!post) {
            throw new NotFoundException(
                'Activity post not found',
            );
        }

        if (user.role === 'ranger') {
            await this.validateCohortAccess(
                post.cohort_id,
                user,
            );

            if (post.created_by_user_id !== user.userId) {
                throw new ForbiddenException(
                    'You can only delete your own posts',
                );
            }
        }

        await this.db
            .updateTable('activity_posts')
            .set({
                is_deleted: true,
                updated_at: new Date(),
            })
            .where('id', '=', postId)
            .execute();

        return {
            message: 'Community Hub post deleted successfully',
        };
    }
}
