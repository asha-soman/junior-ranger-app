import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../../database/database.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

type AuthUser = {
    userId: string;
    email: string;
    role: 'admin' | 'ranger' | 'junior_ranger';
};

@Injectable()
export class AnnouncementsService {
    constructor(private readonly db: DatabaseService) { }

    // Validate whether Admin/Ranger can manage announcements for a cohort
    private async validateCohortPermission(
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

        if (user.role === 'ranger') {
            const membership = await this.db
                .selectFrom('cohort_members')
                .select('id')
                .where('user_id', '=', user.userId)
                .where('cohort_id', '=', cohortId)
                .where('role', '=', 'ranger')
                .where('is_deleted', '=', false)
                .executeTakeFirst();

            if (!membership) {
                throw new ForbiddenException(
                    'You do not have permission to manage announcements for this cohort',
                );
            }

            return cohort;
        }

        throw new ForbiddenException(
            'You do not have permission to manage announcements',
        );
    }

    // Used before update/delete/publish operations
    private async getManageableAnnouncement(
        announcementId: string,
        user: AuthUser,
    ) {
        const announcement = await this.db
            .selectFrom('announcements')
            .selectAll()
            .where('id', '=', announcementId)
            .where('is_deleted', '=', false)
            .executeTakeFirst();

        if (!announcement) {
            throw new NotFoundException('Announcement not found');
        }

        await this.validateCohortPermission(
            announcement.cohort_id,
            user,
        );

        return announcement;
    }

    // List announcements according to user role and cohort
    async getAnnouncements(user: AuthUser) {
        // Admin can see every non-deleted announcement
        if (user.role === 'admin') {
            return this.db
                .selectFrom('announcements')
                .innerJoin(
                    'cohorts',
                    'cohorts.id',
                    'announcements.cohort_id',
                )
                .innerJoin(
                    'users as author',
                    'author.id',
                    'announcements.created_by_user_id',
                )
                .select([
                    'announcements.id',
                    'announcements.title',
                    'announcements.content',
                    'announcements.cohort_id',
                    'announcements.created_by_user_id',
                    'announcements.status',
                    'announcements.priority',
                    'announcements.is_pinned',
                    'announcements.published_at',
                    'announcements.created_at',
                    'announcements.updated_at',

                    'cohorts.name as cohort_name',
                    'author.name as author_name',
                    'author.role as author_role',
                ])
                .where('announcements.is_deleted', '=', false)
                .orderBy('announcements.is_pinned', 'desc')
                .orderBy('announcements.created_at', 'desc')
                .execute();
        }

        // Ranger sees announcements belonging to cohorts they manage
        if (user.role === 'ranger') {
            return this.db
                .selectFrom('announcements')
                .innerJoin(
                    'cohorts',
                    'cohorts.id',
                    'announcements.cohort_id',
                )
                .innerJoin(
                    'cohort_members',
                    'cohort_members.cohort_id',
                    'announcements.cohort_id',
                )
                .innerJoin(
                    'users as author',
                    'author.id',
                    'announcements.created_by_user_id',
                )
                .select([
                    'announcements.id',
                    'announcements.title',
                    'announcements.content',
                    'announcements.cohort_id',
                    'announcements.created_by_user_id',
                    'announcements.status',
                    'announcements.priority',
                    'announcements.is_pinned',
                    'announcements.published_at',
                    'announcements.created_at',
                    'announcements.updated_at',

                    'cohorts.name as cohort_name',
                    'author.name as author_name',
                    'author.role as author_role',
                ])
                .where('cohort_members.user_id', '=', user.userId)
                .where('cohort_members.role', '=', 'ranger')
                .where('cohort_members.is_deleted', '=', false)
                .where('announcements.is_deleted', '=', false)
                .orderBy('announcements.is_pinned', 'desc')
                .orderBy('announcements.created_at', 'desc')
                .execute();
        }

        // Junior Ranger sees only published announcements from their cohort
        return this.db
            .selectFrom('announcements')
            .innerJoin(
                'cohorts',
                'cohorts.id',
                'announcements.cohort_id',
            )
            .innerJoin(
                'cohort_members',
                'cohort_members.cohort_id',
                'announcements.cohort_id',
            )
            .innerJoin(
                'users as author',
                'author.id',
                'announcements.created_by_user_id',
            )
            .select([
                'announcements.id',
                'announcements.title',
                'announcements.content',
                'announcements.cohort_id',
                'announcements.created_by_user_id',
                'announcements.status',
                'announcements.priority',
                'announcements.is_pinned',
                'announcements.published_at',
                'announcements.created_at',
                'announcements.updated_at',

                'cohorts.name as cohort_name',
                'author.name as author_name',
                'author.role as author_role',
            ])
            .where('cohort_members.user_id', '=', user.userId)
            .where('cohort_members.role', '=', 'junior_ranger')
            .where('cohort_members.is_deleted', '=', false)
            .where('announcements.is_deleted', '=', false)
            .where('announcements.status', '=', 'published')
            .orderBy('announcements.is_pinned', 'desc')
            .orderBy('announcements.published_at', 'desc')
            .execute();
    }

    // Create announcement
    async createAnnouncement(
        dto: CreateAnnouncementDto,
        user: AuthUser,
    ) {
        await this.validateCohortPermission(
            dto.cohort_id,
            user,
        );

        const status = dto.status ?? 'published';

        const announcement = await this.db
            .insertInto('announcements')
            .values({
                id: randomUUID(),

                title: dto.title.trim(),
                content: dto.content.trim(),

                cohort_id: dto.cohort_id,
                created_by_user_id: user.userId,

                status,
                priority: dto.priority ?? 'normal',
                is_pinned: dto.is_pinned ?? false,

                is_deleted: false,

                published_at:
                    status === 'published'
                        ? new Date()
                        : null,

                created_at: new Date(),
                updated_at: null,
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        return {
            message: 'Announcement created successfully',
            announcement,
        };
    }

    // Get announcement details
    async getAnnouncementDetails(
        announcementId: string,
        user: AuthUser,
    ) {
        const announcement = await this.db
            .selectFrom('announcements')
            .innerJoin(
                'cohorts',
                'cohorts.id',
                'announcements.cohort_id',
            )
            .innerJoin(
                'users as author',
                'author.id',
                'announcements.created_by_user_id',
            )
            .select([
                'announcements.id',
                'announcements.title',
                'announcements.content',
                'announcements.cohort_id',
                'announcements.created_by_user_id',
                'announcements.status',
                'announcements.priority',
                'announcements.is_pinned',
                'announcements.published_at',
                'announcements.created_at',
                'announcements.updated_at',

                'cohorts.name as cohort_name',
                'author.name as author_name',
                'author.role as author_role',
            ])
            .where('announcements.id', '=', announcementId)
            .where('announcements.is_deleted', '=', false)
            .executeTakeFirst();

        if (!announcement) {
            throw new NotFoundException(
                'Announcement not found',
            );
        }

        if (user.role === 'ranger') {
            await this.validateCohortPermission(
                announcement.cohort_id,
                user,
            );
        }

        if (user.role === 'junior_ranger') {
            const membership = await this.db
                .selectFrom('cohort_members')
                .select('id')
                .where('user_id', '=', user.userId)
                .where(
                    'cohort_id',
                    '=',
                    announcement.cohort_id,
                )
                .where('role', '=', 'junior_ranger')
                .where('is_deleted', '=', false)
                .executeTakeFirst();

            if (!membership) {
                throw new ForbiddenException(
                    'You do not have access to this announcement',
                );
            }

            if (announcement.status !== 'published') {
                throw new ForbiddenException(
                    'This announcement is not available',
                );
            }
        }

        return announcement;
    }

    // Update announcement
    async updateAnnouncement(
        announcementId: string,
        dto: UpdateAnnouncementDto,
        user: AuthUser,
    ) {
        const existingAnnouncement =
            await this.getManageableAnnouncement(
                announcementId,
                user,
            );

        if (
            dto.cohort_id !== undefined &&
            dto.cohort_id !==
            existingAnnouncement.cohort_id
        ) {
            await this.validateCohortPermission(
                dto.cohort_id,
                user,
            );
        }

        const updatedAnnouncement = await this.db
            .updateTable('announcements')
            .set({
                ...(dto.title !== undefined
                    ? { title: dto.title.trim() }
                    : {}),

                ...(dto.content !== undefined
                    ? { content: dto.content.trim() }
                    : {}),

                ...(dto.cohort_id !== undefined
                    ? { cohort_id: dto.cohort_id }
                    : {}),

                ...(dto.status !== undefined
                    ? {
                        status: dto.status,
                        published_at:
                            dto.status === 'published' &&
                                existingAnnouncement.status !==
                                'published'
                                ? new Date()
                                : existingAnnouncement.published_at,
                    }
                    : {}),

                ...(dto.priority !== undefined
                    ? { priority: dto.priority }
                    : {}),

                ...(dto.is_pinned !== undefined
                    ? { is_pinned: dto.is_pinned }
                    : {}),

                updated_at: new Date(),
            })
            .where('id', '=', announcementId)
            .returningAll()
            .executeTakeFirstOrThrow();

        return {
            message: 'Announcement updated successfully',
            announcement: updatedAnnouncement,
        };
    }

    // Publish announcement
    async publishAnnouncement(
        announcementId: string,
        user: AuthUser,
    ) {
        const announcement =
            await this.getManageableAnnouncement(
                announcementId,
                user,
            );

        if (announcement.status === 'published') {
            throw new BadRequestException(
                'Announcement is already published',
            );
        }

        if (announcement.status === 'archived') {
            throw new BadRequestException(
                'Archived announcement cannot be published',
            );
        }

        const updatedAnnouncement = await this.db
            .updateTable('announcements')
            .set({
                status: 'published',
                published_at: new Date(),
                updated_at: new Date(),
            })
            .where('id', '=', announcementId)
            .returningAll()
            .executeTakeFirstOrThrow();

        return {
            message: 'Announcement published successfully',
            announcement: updatedAnnouncement,
        };
    }

    // Archive announcement
    async archiveAnnouncement(
        announcementId: string,
        user: AuthUser,
    ) {
        await this.getManageableAnnouncement(
            announcementId,
            user,
        );

        const updatedAnnouncement = await this.db
            .updateTable('announcements')
            .set({
                status: 'archived',
                updated_at: new Date(),
            })
            .where('id', '=', announcementId)
            .returningAll()
            .executeTakeFirstOrThrow();

        return {
            message: 'Announcement archived successfully',
            announcement: updatedAnnouncement,
        };
    }

    // Soft delete
    async deleteAnnouncement(
        announcementId: string,
        user: AuthUser,
    ) {
        await this.getManageableAnnouncement(
            announcementId,
            user,
        );

        await this.db
            .updateTable('announcements')
            .set({
                is_deleted: true,
                updated_at: new Date(),
            })
            .where('id', '=', announcementId)
            .execute();

        return {
            message: 'Announcement deleted successfully',
        };
    }
}