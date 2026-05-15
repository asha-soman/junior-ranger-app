import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../../database/database.service';
import { CreateAdventureDto } from './dto/create-adventure.dto';
import { UpdateAdventureDto } from './dto/update-adventure.dto';

type AuthUser = {
    userId: string;
    email: string;
    role: 'admin' | 'ranger' | 'junior_ranger';
};

@Injectable()
export class AdventuresService {
    constructor(private readonly db: DatabaseService) { }

    async createAdventure(
        cohortId: string,
        dto: CreateAdventureDto,
        user: AuthUser,
    ) {
        if (user.role !== 'ranger' && user.role !== 'admin') {
            throw new ForbiddenException('Junior Rangers cannot create adventures');
        }

        const cohort = await this.db
            .selectFrom('cohorts')
            .selectAll()
            .where('id', '=', cohortId)
            .where('is_deleted', '=', false)
            .executeTakeFirst();

        if (!cohort) {
            throw new NotFoundException('Cohort not found');
        }

        if (
            user.role === 'ranger' &&
            cohort.created_by_ranger_id !== user.userId &&
            cohort.assigned_ranger_id !== user.userId
        ) {
            throw new ForbiddenException(
                'You do not have permission to create adventures for this cohort',
            );
        }

        const adventure = await this.db
            .insertInto('adventures')
            .values({
                id: randomUUID(),
                cohort_id: cohortId,
                title: dto.title,
                description: dto.description,
                task_instructions: dto.task_instructions,
                due_date: new Date(dto.due_date),
                status: 'published',
                created_by_user_id: user.userId,
                is_deleted: false,
                created_at: new Date(),
                updated_at: null,
            })
            .returningAll()
            .executeTakeFirst();

        return {
            message: 'Adventure created successfully',
            adventure,
        };
    }

    async getAllAdventures(user: AuthUser) {
        // ADMIN → gets everything
        if (user.role === 'admin') {
            return this.db
                .selectFrom('adventures')
                .selectAll()
                .where('is_deleted', '=', false)
                .orderBy('created_at', 'desc')
                .execute();
        }

        // RANGER → adventures from cohorts they manage
        if (user.role === 'ranger') {
            return this.db
                .selectFrom('adventures')
                .innerJoin(
                    'cohorts',
                    'cohorts.id',
                    'adventures.cohort_id',
                )
                .selectAll('adventures')
                .where('adventures.is_deleted', '=', false)
                .where((eb) =>
                    eb.or([
                        eb('cohorts.created_by_ranger_id', '=', user.userId),
                        eb('cohorts.assigned_ranger_id', '=', user.userId),
                    ]),
                )
                .orderBy('adventures.created_at', 'desc')
                .execute();
        }

        // JUNIOR RANGER → adventures from joined cohorts
        return this.db
            .selectFrom('adventures')
            .innerJoin(
                'cohort_members',
                'cohort_members.cohort_id',
                'adventures.cohort_id',
            )
            .selectAll('adventures')
            .where('adventures.is_deleted', '=', false)
            .where('cohort_members.user_id', '=', user.userId)
            .where('cohort_members.is_deleted', '=', false)
            .orderBy('adventures.created_at', 'desc')
            .execute();
    }

    async getAdventuresByCohort(cohortId: string, user: AuthUser) {
        await this.checkCohortAccess(cohortId, user);

        return this.db
            .selectFrom('adventures')
            .selectAll()
            .where('cohort_id', '=', cohortId)
            .where('is_deleted', '=', false)
            .orderBy('due_date', 'asc')
            .execute();
    }

    async getAdventureById(adventureId: string, user: AuthUser) {
        const adventure = await this.db
            .selectFrom('adventures')
            .selectAll()
            .where('id', '=', adventureId)
            .where('is_deleted', '=', false)
            .executeTakeFirst();

        if (!adventure) {
            throw new NotFoundException('Adventure not found');
        }

        await this.checkCohortAccess(adventure.cohort_id, user);

        return adventure;
    }

    async updateAdventure(
        adventureId: string,
        dto: UpdateAdventureDto,
        user: AuthUser,
    ) {
        if (user.role === 'junior_ranger') {
            throw new ForbiddenException('Junior Rangers cannot update adventures');
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

        await this.checkCohortAccess(adventure.cohort_id, user);

        if (user.role === 'ranger' && adventure.created_by_user_id !== user.userId) {
            throw new ForbiddenException(
                'Only the creator or admin can update this adventure',
            );
        }

        const updatedAdventure = await this.db
            .updateTable('adventures')
            .set({
                ...(dto.title !== undefined ? { title: dto.title } : {}),
                ...(dto.description !== undefined
                    ? { description: dto.description }
                    : {}),
                ...(dto.task_instructions !== undefined
                    ? { task_instructions: dto.task_instructions }
                    : {}),
                ...(dto.due_date !== undefined
                    ? { due_date: new Date(dto.due_date) }
                    : {}),
                ...(dto.status !== undefined ? { status: dto.status } : {}),
                updated_at: new Date(),
            })
            .where('id', '=', adventureId)
            .returningAll()
            .executeTakeFirst();

        return {
            message: 'Adventure updated successfully',
            adventure: updatedAdventure,
        };
    }

    private async checkCohortAccess(cohortId: string, user: AuthUser) {
        const cohort = await this.db
            .selectFrom('cohorts')
            .selectAll()
            .where('id', '=', cohortId)
            .where('is_deleted', '=', false)
            .executeTakeFirst();

        if (!cohort) {
            throw new NotFoundException('Cohort not found');
        }

        if (user.role === 'admin') return;

        if (
            user.role === 'ranger' &&
            (cohort.created_by_ranger_id === user.userId ||
                cohort.assigned_ranger_id === user.userId)
        ) {
            return;
        }

        if (user.role === 'junior_ranger') {
            const membership = await this.db
                .selectFrom('cohort_members')
                .selectAll()
                .where('cohort_id', '=', cohortId)
                .where('user_id', '=', user.userId)
                .where('is_deleted', '=', false)
                .executeTakeFirst();

            if (membership) return;
        }

        throw new ForbiddenException('You do not have access to this cohort');
    }
}