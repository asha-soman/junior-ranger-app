import {
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

    async createSubmission(adventureId: string, dto: CreateSubmissionDto, user: AuthUser) {
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

        const membership = await this.db
            .selectFrom('cohort_members')
            .selectAll()
            .where('cohort_id', '=', adventure.cohort_id)
            .where('user_id', '=', user.userId)
            .where('is_deleted', '=', false)
            .executeTakeFirst();

        if (!membership) {
            throw new ForbiddenException(
                'You can only submit adventures assigned to your cohort',
            );
        }

        const submission = await this.db
            .insertInto('adventure_submissions')
            .values({
                id: randomUUID(),
                adventure_id: adventureId,
                cohort_id: adventure.cohort_id,
                junior_ranger_user_id: user.userId,
                submission_text: dto.submission_text,
                image_url: dto.image_url ?? null,
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

        if (user.role === 'ranger') {
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
                    'You do not have permission to view submissions for this adventure',
                );
            }
        }

        return this.db
            .selectFrom('adventure_submissions')
            .innerJoin('users', 'users.id', 'adventure_submissions.junior_ranger_user_id')
            .select([
                'adventure_submissions.id',
                'adventure_submissions.adventure_id',
                'adventure_submissions.cohort_id',
                'adventure_submissions.junior_ranger_user_id',
                'adventure_submissions.submission_text',
                'adventure_submissions.image_url',
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
            .where('adventure_submissions.adventure_id', '=', adventureId)
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
}