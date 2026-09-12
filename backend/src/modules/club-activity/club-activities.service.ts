import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../../database/database.service';
import { CreateClubActivityDto } from './dto/create-club-activity.dto';
import { UpdateClubActivityDto } from './dto/update-club-activity.dto';

type AuthUser = {
    userId: string;
    email: string;
    role: 'admin' | 'ranger' | 'junior_ranger';
};

@Injectable()
export class ClubActivitiesService {
    constructor(private readonly db: DatabaseService) { }

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

    async createClubActivity(
        dto: CreateClubActivityDto,
        user: AuthUser,
    ) {
        if (
            user.role !== 'admin' &&
            user.role !== 'ranger'
        ) {
            throw new ForbiddenException(
                'Only Admins and Rangers can create club activities',
            );
        }

        await this.validateCohortAccess(
            dto.cohort_id,
            user,
        );

        const activity = await this.db
            .insertInto('club_activities')
            .values({
                id: randomUUID(),

                title: dto.title.trim(),
                description: dto.description?.trim() || null,
                image_url: dto.image_url ?? null,

                cohort_id: dto.cohort_id,
                created_by_user_id: user.userId,

                activity_date: dto.activity_date
                    ? new Date(dto.activity_date)
                    : null,

                is_deleted: false,
                created_at: new Date(),
                updated_at: null,
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        return {
            message: 'Club activity created successfully',
            activity,
        };
    }

    async getClubActivities(user: AuthUser) {
        if (user.role === 'admin') {
            return this.db
                .selectFrom('club_activities')
                .innerJoin(
                    'cohorts',
                    'cohorts.id',
                    'club_activities.cohort_id',
                )
                .innerJoin(
                    'users as author',
                    'author.id',
                    'club_activities.created_by_user_id',
                )
                .select([
                    'club_activities.id',
                    'club_activities.title',
                    'club_activities.description',
                    'club_activities.image_url',
                    'club_activities.cohort_id',
                    'club_activities.created_by_user_id',
                    'club_activities.activity_date',
                    'club_activities.created_at',
                    'club_activities.updated_at',

                    'cohorts.name as cohort_name',
                    'author.name as author_name',
                    'author.role as author_role',
                ])
                .where('club_activities.is_deleted', '=', false)
                .orderBy('club_activities.created_at', 'desc')
                .execute();
        }

        return this.db
            .selectFrom('club_activities')
            .innerJoin(
                'cohort_members',
                'cohort_members.cohort_id',
                'club_activities.cohort_id',
            )
            .innerJoin(
                'cohorts',
                'cohorts.id',
                'club_activities.cohort_id',
            )
            .innerJoin(
                'users as author',
                'author.id',
                'club_activities.created_by_user_id',
            )
            .select([
                'club_activities.id',
                'club_activities.title',
                'club_activities.description',
                'club_activities.image_url',
                'club_activities.cohort_id',
                'club_activities.created_by_user_id',
                'club_activities.activity_date',
                'club_activities.created_at',
                'club_activities.updated_at',

                'cohorts.name as cohort_name',
                'author.name as author_name',
                'author.role as author_role',
            ])
            .where('cohort_members.user_id', '=', user.userId)
            .where('cohort_members.role', '=', user.role)
            .where('cohort_members.is_deleted', '=', false)
            .where('club_activities.is_deleted', '=', false)
            .orderBy('club_activities.created_at', 'desc')
            .execute();
    }

    async getClubActivityDetails(
        activityId: string,
        user: AuthUser,
    ) {
        const activity = await this.db
            .selectFrom('club_activities')
            .innerJoin(
                'cohorts',
                'cohorts.id',
                'club_activities.cohort_id',
            )
            .innerJoin(
                'users as author',
                'author.id',
                'club_activities.created_by_user_id',
            )
            .select([
                'club_activities.id',
                'club_activities.title',
                'club_activities.description',
                'club_activities.image_url',
                'club_activities.cohort_id',
                'club_activities.created_by_user_id',
                'club_activities.activity_date',
                'club_activities.created_at',
                'club_activities.updated_at',

                'cohorts.name as cohort_name',
                'author.name as author_name',
                'author.role as author_role',
            ])
            .where('club_activities.id', '=', activityId)
            .where('club_activities.is_deleted', '=', false)
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

        return activity;
    }

    async updateClubActivity(
        activityId: string,
        dto: UpdateClubActivityDto,
        user: AuthUser,
    ) {
        if (
            user.role !== 'admin' &&
            user.role !== 'ranger'
        ) {
            throw new ForbiddenException(
                'You do not have permission to edit club activities',
            );
        }

        const existing = await this.db
            .selectFrom('club_activities')
            .selectAll()
            .where('id', '=', activityId)
            .where('is_deleted', '=', false)
            .executeTakeFirst();

        if (!existing) {
            throw new NotFoundException(
                'Club activity not found',
            );
        }

        await this.validateCohortAccess(
            existing.cohort_id,
            user,
        );

        const updated = await this.db
            .updateTable('club_activities')
            .set({
                ...(dto.title !== undefined
                    ? { title: dto.title.trim() }
                    : {}),

                ...(dto.description !== undefined
                    ? {
                        description:
                            dto.description.trim() || null,
                    }
                    : {}),

                ...(dto.image_url !== undefined
                    ? { image_url: dto.image_url }
                    : {}),

                ...(dto.activity_date !== undefined
                    ? {
                        activity_date: new Date(
                            dto.activity_date,
                        ),
                    }
                    : {}),

                updated_at: new Date(),
            })
            .where('id', '=', activityId)
            .returningAll()
            .executeTakeFirstOrThrow();

        return {
            message: 'Club activity updated successfully',
            activity: updated,
        };
    }

    async deleteClubActivity(
        activityId: string,
        user: AuthUser,
    ) {
        if (
            user.role !== 'admin' &&
            user.role !== 'ranger'
        ) {
            throw new ForbiddenException(
                'You do not have permission to delete club activities',
            );
        }

        const existing = await this.db
            .selectFrom('club_activities')
            .selectAll()
            .where('id', '=', activityId)
            .where('is_deleted', '=', false)
            .executeTakeFirst();

        if (!existing) {
            throw new NotFoundException(
                'Club activity not found',
            );
        }

        await this.validateCohortAccess(
            existing.cohort_id,
            user,
        );

        await this.db
            .updateTable('club_activities')
            .set({
                is_deleted: true,
                updated_at: new Date(),
            })
            .where('id', '=', activityId)
            .execute();

        return {
            message: 'Club activity deleted successfully',
        };
    }
}