import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { randomUUID } from 'crypto';
import { UpdateCohortDto } from './dto/update-cohort.dto';
import { AssignRangerDto } from './dto/assign-ranger.dto';

@Injectable()
export class CohortsService {
  constructor(private readonly db: DatabaseService) {}

  // Create a new Cohort
  async createCohort(
    dto: CreateCohortDto,
    user: {
      userId: string;
      email: string;
      role: string;
    },
  ) {
    const cohortId = randomUUID();

    const newCohort = await this.db
      .insertInto('cohorts')
      .values({
        id: cohortId,
        name: dto.name,
        description: dto.description ?? null,
        location: dto.location,
        created_by_ranger_id: user.userId,
        assigned_ranger_id: user.role === 'ranger' ? user.userId : null,
        is_deleted: false,
      })
      .returningAll()
      .executeTakeFirst();

    if (user.role === 'ranger') {
      await this.db
        .insertInto('cohort_members')
        .values({
          id: randomUUID(),
          user_id: user.userId,
          cohort_id: cohortId,
          role: 'ranger',
          is_deleted: false,
        })
        .execute();
    }

    return {
      message: 'Cohort created successfully',
      cohort: newCohort,
    };
  }

  // Fetch all Cohorts
  async findAllCohorts(user: { userId: string; email: string; role: string }) {
    let cohorts;

    if (user.role === 'admin') {
      cohorts = await this.db
        .selectFrom('cohorts')
        .leftJoin(
          'users as assigned_ranger',
          'assigned_ranger.id',
          'cohorts.assigned_ranger_id',
        )
        .select([
          'cohorts.id',
          'cohorts.name',
          'cohorts.description',
          'cohorts.location',
          'cohorts.created_by_ranger_id',
          'cohorts.assigned_ranger_id',
          'assigned_ranger.name as assigned_ranger_name',
          'assigned_ranger.email as assigned_ranger_email',
          'cohorts.created_at',
          'cohorts.updated_at',
        ])
        .where('cohorts.is_deleted', '=', false)
        .orderBy('cohorts.created_at', 'desc')
        .execute();
    } else {
      cohorts = await this.db
        .selectFrom('cohort_members')
        .innerJoin('cohorts', 'cohorts.id', 'cohort_members.cohort_id')
        .leftJoin(
          'users as assigned_ranger',
          'assigned_ranger.id',
          'cohorts.assigned_ranger_id',
        )
        .select([
          'cohorts.id',
          'cohorts.name',
          'cohorts.description',
          'cohorts.location',
          'cohorts.created_by_ranger_id',
          'cohorts.assigned_ranger_id',
          'assigned_ranger.name as assigned_ranger_name',
          'assigned_ranger.email as assigned_ranger_email',
          'cohorts.created_at',
          'cohorts.updated_at',
        ])
        .where('cohort_members.user_id', '=', user.userId)
        .where('cohort_members.is_deleted', '=', false)
        .where('cohorts.is_deleted', '=', false)
        .orderBy('cohorts.created_at', 'desc')
        .execute();
    }

    const cohortsWithMemberCount = await Promise.all(
      cohorts.map(async (cohort) => {
        const memberCountResult = await this.db
          .selectFrom('cohort_members')
          .select((eb) => eb.fn.countAll().as('count'))
          .where('cohort_id', '=', cohort.id)
          .where('is_deleted', '=', false)
          .executeTakeFirst();

        return {
          ...cohort,
          member_count: Number(memberCountResult?.count ?? 0),
        };
      }),
    );

    return {
      message: 'Cohorts fetched successfully',
      cohorts: cohortsWithMemberCount,
    };
  }

  // Find cohort by id
  async findCohortById(
    cohortId: string,
    user: {
      userId: string;
      email: string;
      role: string;
    },
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

    if (user.role !== 'admin') {
      const membership = await this.db
        .selectFrom('cohort_members')
        .selectAll()
        .where('cohort_id', '=', cohortId)
        .where('user_id', '=', user.userId)
        .where('is_deleted', '=', false)
        .executeTakeFirst();

      if (!membership) {
        throw new ForbiddenException(
          'You do not have permission to view this cohort',
        );
      }
    }

    const memberCountResult = await this.db
      .selectFrom('cohort_members')
      .select((eb) => eb.fn.countAll().as('count'))
      .where('cohort_id', '=', cohortId)
      .where('is_deleted', '=', false)
      .executeTakeFirst();

    return {
      message: 'Cohort details fetched successfully',
      cohort: {
        ...cohort,
        member_count: Number(memberCountResult?.count ?? 0),
      },
    };
  }

  // Update Cohort
  async updateCohort(
    cohortId: string,
    dto: UpdateCohortDto,
    user: {
      userId: string;
      email: string;
      role: string;
    },
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

    const canUpdate =
      user.role === 'admin' || cohort.assigned_ranger_id === user.userId;

    if (!canUpdate) {
      throw new ForbiddenException(
        'You do not have permission to update this cohort',
      );
    }

    const updatedCohort = await this.db
      .updateTable('cohorts')
      .set({
        ...dto,
        updated_at: new Date(),
      })
      .where('id', '=', cohortId)
      .returningAll()
      .executeTakeFirst();

    return {
      message: 'Cohort updated successfully',
      cohort: updatedCohort,
    };
  }

  //Get all mebers of the Cohort
  async findCohortMembers(
    cohortId: string,
    user: {
      userId: string;
      email: string;
      role: string;
    },
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

    const canViewMembers =
      user.role === 'admin' || cohort.assigned_ranger_id === user.userId;

    if (!canViewMembers) {
      throw new ForbiddenException(
        'You do not have permission to view cohort members',
      );
    }

    const members = await this.db
      .selectFrom('cohort_members')
      .innerJoin('users', 'users.id', 'cohort_members.user_id')
      .select([
        'users.id',
        'users.name',
        'users.email',
        'users.role',
        'cohort_members.role as cohort_role',
        'cohort_members.created_at as joined_at',
      ])
      .where('cohort_members.cohort_id', '=', cohortId)
      .where('cohort_members.is_deleted', '=', false)
      .where('users.is_deleted', '=', false)
      .orderBy('cohort_members.created_at', 'desc')
      .execute();

    return {
      message: 'Cohort members fetched successfully',
      members,
    };
  }

  //Admin assigning a ranger to a cohort
  async assignRangerToCohort(cohortId: string, dto: AssignRangerDto) {
    const cohort = await this.db
      .selectFrom('cohorts')
      .selectAll()
      .where('id', '=', cohortId)
      .where('is_deleted', '=', false)
      .executeTakeFirst();

    if (!cohort) {
      throw new NotFoundException('Cohort not found');
    }

    const ranger = await this.db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', dto.rangerId)
      .where('role', '=', 'ranger')
      .where('is_deleted', '=', false)
      .executeTakeFirst();

    if (!ranger) {
      throw new NotFoundException('Ranger not found');
    }

    const updatedCohort = await this.db
      .updateTable('cohorts')
      .set({
        assigned_ranger_id: dto.rangerId,
        updated_at: new Date(),
      })
      .where('id', '=', cohortId)
      .returningAll()
      .executeTakeFirst();

    await this.db
      .updateTable('cohort_members')
      .set({
        is_deleted: true,
        updated_at: new Date(),
      })
      .where('cohort_id', '=', cohortId)
      .where('role', '=', 'ranger')
      .execute();

    const existingMembership = await this.db
      .selectFrom('cohort_members')
      .selectAll()
      .where('cohort_id', '=', cohortId)
      .where('user_id', '=', dto.rangerId)
      .where('is_deleted', '=', false)
      .executeTakeFirst();

    if (!existingMembership) {
      await this.db
        .insertInto('cohort_members')
        .values({
          id: randomUUID(),
          user_id: dto.rangerId,
          cohort_id: cohortId,
          role: 'ranger',
          is_deleted: false,
        })
        .execute();
    }

    return {
      message: 'Ranger assigned to cohort successfully',
      cohort: updatedCohort,
    };
  }
}
