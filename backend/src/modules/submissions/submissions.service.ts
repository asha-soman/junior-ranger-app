import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { DatabaseService } from '../../database/database.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';

type AuthUser = {
    userId: string;
    email: string;
    role: 'admin' | 'ranger' | 'junior_ranger';
};

@Injectable()
export class SubmissionsService {
    constructor(private readonly db: DatabaseService) { }

    async createSubmission(
        adventureId: string,
        dto: CreateSubmissionDto,
        user: AuthUser,
    ) {
        if (user.role !== 'junior_ranger') {
            throw new ForbiddenException('Only Junior Rangers can submit adventures');
        }

        const adventure = await this.db
            .selectFrom('adventures')
            .selectAll()
            .where('id', '=', adventureId)
            .where('is_deleted', '=', false)
            .executeTakeFirst();

        if (!adventure) {
            throw new NotFoundException('Adventure not found');
        }

        const assignedCohortMembership = await this.db
            .selectFrom('cohort_adventures')
            .innerJoin(
                'cohort_members',
                'cohort_members.cohort_id',
                'cohort_adventures.cohort_id',
            )
            .select('cohort_adventures.cohort_id')
            .where('cohort_adventures.adventure_id', '=', adventureId)
            .where('cohort_adventures.is_deleted', '=', false)
            .where('cohort_members.user_id', '=', user.userId)
            .where('cohort_members.is_deleted', '=', false)
            .executeTakeFirst();

        if (!assignedCohortMembership) {
            throw new ForbiddenException(
                'You can only submit adventures assigned to your cohort',
            );
        }

        const existingSubmission = await this.db
            .selectFrom('adventure_submissions')
            .selectAll()
            .where('adventure_id', '=', adventureId)
            .where('junior_ranger_user_id', '=', user.userId)
            .executeTakeFirst();

        if (existingSubmission) {
            throw new ForbiddenException(
                'You have already submitted this adventure. Please update your existing submission.',
            );
        }

        let imageId: string | null = null;
        if (dto.image_url) {
            const image = await this.db
                .insertInto('images')
                .values({
                    id: randomUUID(),
                    secure_url: dto.image_url,
                    metadata: dto.image_metadata ? JSON.stringify(dto.image_metadata) : null,
                    is_deleted: false,
                    created_at: new Date(),
                    updated_at: null,
                })
                .returning('id')
                .executeTakeFirst();
            imageId = image?.id ?? null;
        }

        const submission = await this.db
            .insertInto('adventure_submissions')
            .values({
                id: randomUUID(),
                adventure_id: adventureId,
                cohort_id: assignedCohortMembership.cohort_id,
                junior_ranger_user_id: user.userId,
                submission_text: dto.submission_text,
                image_id: imageId,
                status: 'submitted',
                feedback: null,
                reviewed_by_ranger_id: null,
                submitted_at: new Date(),
                reviewed_at: null,
                created_at: new Date(),
                updated_at: null,
            })
            .returningAll()
            .executeTakeFirst();

        return {
            message: 'Adventure submitted successfully',
            submission,
        };
    }

    async getSubmissionsForAdventure(adventureId: string, user: AuthUser) {
        if (user.role === 'junior_ranger') {
            throw new ForbiddenException('Junior Rangers cannot view all submissions');
        }

        const adventure = await this.db
            .selectFrom('adventures')
            .selectAll()
            .where('id', '=', adventureId)
            .where('is_deleted', '=', false)
            .executeTakeFirst();

        if (!adventure) {
            throw new NotFoundException('Adventure not found');
        }

        // Admin should not review submissions based on client requirement
        if (user.role === 'admin') {
            throw new ForbiddenException('Admins cannot review adventure submissions');
        }

        // Find cohorts this ranger manages where this adventure is assigned
        const managedAssignedCohorts = await this.db
            .selectFrom('cohort_adventures')
            .innerJoin('cohorts', 'cohorts.id', 'cohort_adventures.cohort_id')
            .select('cohort_adventures.cohort_id')
            .where('cohort_adventures.adventure_id', '=', adventureId)
            .where('cohort_adventures.is_deleted', '=', false)
            .where('cohorts.is_deleted', '=', false)
            .where((eb) =>
                eb.or([
                    eb('cohorts.created_by_ranger_id', '=', user.userId),
                    eb('cohorts.assigned_ranger_id', '=', user.userId),
                ]),
            )
            .execute();

        const managedCohortIds = managedAssignedCohorts.map(
            (item) => item.cohort_id,
        );

        if (managedCohortIds.length === 0 && adventure.created_by_user_id !== user.userId) {
            throw new ForbiddenException(
                'You do not have permission to view submissions for this adventure',
            );
        }

        let query = this.db
            .selectFrom('adventure_submissions')
            .innerJoin(
                'users',
                'users.id',
                'adventure_submissions.junior_ranger_user_id',
            )
            .leftJoin('images', 'images.id', 'adventure_submissions.image_id')
            .select([
                'adventure_submissions.id',
                'adventure_submissions.adventure_id',
                'adventure_submissions.cohort_id',
                'adventure_submissions.junior_ranger_user_id',
                'adventure_submissions.submission_text',
                'images.secure_url as image_url',
                'images.metadata as image_metadata',
                'adventure_submissions.status',
                'adventure_submissions.feedback',
                'adventure_submissions.reviewed_by_ranger_id',
                'adventure_submissions.submitted_at',
                'adventure_submissions.reviewed_at',
                'adventure_submissions.created_at',
                'adventure_submissions.updated_at',
                'users.name as junior_ranger_name',
                'users.email as junior_ranger_email',
            ])
            .where('adventure_submissions.adventure_id', '=', adventureId);

        // If the ranger manages assigned cohorts, show only submissions from those cohorts
        if (managedCohortIds.length > 0) {
            query = query.where(
                'adventure_submissions.cohort_id',
                'in',
                managedCohortIds,
            );
        }

        return query
            .orderBy('adventure_submissions.submitted_at', 'desc')
            .execute();
    }

    async reviewSubmission(
        submissionId: string,
        dto: ReviewSubmissionDto,
        user: AuthUser,
    ) {
        if (user.role !== 'ranger') {
            throw new ForbiddenException('Only Rangers can review submissions');
        }

        if (dto.status === 'rejected' && !dto.feedback?.trim()) {
            throw new BadRequestException(
                'Feedback is required when rejecting a submission',
            );
        }

        const submission = await this.db
            .selectFrom('adventure_submissions')
            .selectAll()
            .where('id', '=', submissionId)
            .executeTakeFirst();

        if (!submission) {
            throw new NotFoundException('Submission not found');
        }

        const adventure = await this.db
            .selectFrom('adventures')
            .selectAll()
            .where('id', '=', submission.adventure_id)
            .where('is_deleted', '=', false)
            .executeTakeFirst();

        if (!adventure) {
            throw new NotFoundException('Adventure not found');
        }

        const cohort = await this.db
            .selectFrom('cohorts')
            .selectAll()
            .where('id', '=', adventure.cohort_id)
            .where('is_deleted', '=', false)
            .executeTakeFirst();

        if (
            !cohort ||
            (cohort.created_by_ranger_id !== user.userId &&
                cohort.assigned_ranger_id !== user.userId)
        ) {
            throw new ForbiddenException(
                'You do not have permission to review this submission',
            );
        }

        const updatedSubmission = await this.db
            .updateTable('adventure_submissions')
            .set({
                status: dto.status,
                feedback: dto.feedback ?? null,
                reviewed_by_ranger_id: user.userId,
                reviewed_at: new Date(),
                updated_at: new Date(),
            })
            .where('id', '=', submissionId)
            .returningAll()
            .executeTakeFirst();

        return {
            message: 'Submission reviewed successfully',
            submission: updatedSubmission,
        };
    }

    async getMySubmission(adventureId: string, user: AuthUser) {
        if (user.role !== 'junior_ranger') {
            throw new ForbiddenException('Only Junior Rangers can view their submission');
        }

        const submission = await this.db
            .selectFrom('adventure_submissions')
            .leftJoin('images', 'images.id', 'adventure_submissions.image_id')
            .select([
                'adventure_submissions.id',
                'adventure_submissions.adventure_id',
                'adventure_submissions.cohort_id',
                'adventure_submissions.junior_ranger_user_id',
                'adventure_submissions.submission_text',
                'images.secure_url as image_url',
                'images.metadata as image_metadata',
                'adventure_submissions.status',
                'adventure_submissions.feedback',
                'adventure_submissions.reviewed_by_ranger_id',
                'adventure_submissions.submitted_at',
                'adventure_submissions.reviewed_at',
                'adventure_submissions.created_at',
                'adventure_submissions.updated_at',
            ])
            .where('adventure_submissions.adventure_id', '=', adventureId)
            .where('adventure_submissions.junior_ranger_user_id', '=', user.userId)
            .executeTakeFirst();

        return {
            submission: submission || null,
        };
    }

    async updateMySubmission(
        submissionId: string,
        dto: CreateSubmissionDto,
        user: AuthUser,
    ) {
        if (user.role !== 'junior_ranger') {
            throw new ForbiddenException('Only Junior Rangers can update submissions');
        }

        const submission = await this.db
            .selectFrom('adventure_submissions')
            .selectAll()
            .where('id', '=', submissionId)
            .executeTakeFirst();

        if (!submission) {
            throw new NotFoundException('Submission not found');
        }

        if (submission.junior_ranger_user_id !== user.userId) {
            throw new ForbiddenException('You can only update your own submission');
        }

        if (submission.status === 'approved') {
            throw new ForbiddenException('Approved submissions cannot be edited');
        }

        let imageId = submission.image_id;
        if (dto.image_url) {
            const image = await this.db
                .insertInto('images')
                .values({
                    id: randomUUID(),
                    secure_url: dto.image_url,
                    metadata: dto.image_metadata ? JSON.stringify(dto.image_metadata) : null,
                    is_deleted: false,
                    created_at: new Date(),
                    updated_at: null,
                })
                .returning('id')
                .executeTakeFirst();
            imageId = image?.id ?? null;
        }

        const updatedSubmission = await this.db
            .updateTable('adventure_submissions')
            .set({
                submission_text: dto.submission_text,
                image_id: imageId,
                status: 'submitted',
                feedback: null,
                reviewed_by_ranger_id: null,
                reviewed_at: null,
                updated_at: new Date(),
            })
            .where('id', '=', submissionId)
            .returningAll()
            .executeTakeFirst();

        return {
            message: 'Submission updated successfully',
            submission: updatedSubmission,
        };
    }
}