import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class AdminService {
  constructor(private readonly db: DatabaseService) {}

  async getPendingRangers(name?: string) {
    let query = this.db
      .selectFrom('users')
      .select([
        'id',
        'name',
        'email',
        'role',
        'is_active',
        'approval_status',
        'created_at',
      ])
      .where('role', '=', 'ranger')
      .where('approval_status', '=', 'pending')
      .where('is_deleted', '=', false);

    if (name && name.trim()) {
      query = query.where('name', 'ilike', `%${name.trim()}%`);
    }

    return query.orderBy('created_at', 'desc').execute();
  }

  async getRangerRequestById(id: string) {
    const ranger = await this.db
      .selectFrom('users')
      .select([
        'id',
        'name',
        'email',
        'role',
        'is_active',
        'approval_status',
        'created_at',
      ])
      .where('id', '=', id)
      .where('role', '=', 'ranger')
      .where('is_deleted', '=', false)
      .executeTakeFirst();

    if (!ranger) {
      throw new NotFoundException('Ranger request not found');
    }

    return ranger;
  }

  async approveRanger(id: string) {
    const ranger = await this.getRangerRequestById(id);

    if (ranger.approval_status !== 'pending') {
      throw new BadRequestException('Only pending ranger requests can be approved');
    }

    return this.db
      .updateTable('users')
      .set({
        is_active: true,
        approval_status: 'approved',
        updated_at: new Date(),
      })
      .where('id', '=', id)
      .returning([
        'id',
        'name',
        'email',
        'role',
        'is_active',
        'approval_status',
        'created_at',
      ])
      .executeTakeFirst();
  }

  async rejectRanger(id: string) {
    const ranger = await this.getRangerRequestById(id);

    if (ranger.approval_status !== 'pending') {
      throw new BadRequestException('Only pending ranger requests can be rejected');
    }

    return this.db
      .updateTable('users')
      .set({
        is_active: false,
        approval_status: 'rejected',
        updated_at: new Date(),
      })
      .where('id', '=', id)
      .returning([
        'id',
        'name',
        'email',
        'role',
        'is_active',
        'approval_status',
        'created_at',
      ])
      .executeTakeFirst();
  }

  async getAllUsers(role?: string, status?: string, name?: string) {
    let query = this.db
      .selectFrom('users as u')
      .leftJoin('cohort_members as cm', (join) =>
        join
          .onRef('cm.user_id', '=', 'u.id')
          .on('cm.is_deleted', '=', false)
      )
      .leftJoin('cohorts as c', (join) =>
        join
          .onRef('c.id', '=', 'cm.cohort_id')
          .on('c.is_deleted', '=', false)
      )
      .select([
        'u.id',
        'u.name',
        'u.email',
        'u.role',
        'u.is_active',
        'u.approval_status',
        'u.created_at',
        'c.name as cohort_name',
      ])
      .where('u.is_deleted', '=', false);

    if (role && role !== 'all') {
      query = query.where('u.role', '=', role as any);
    }

    if (status && status !== 'all') {
      query = query.where('u.approval_status', '=', status as any);
    }

    if (name && name.trim()) {
      query = query.where('u.name', 'ilike', `%${name.trim()}%`);
    }

    return query.orderBy('u.created_at', 'desc').execute();
  }

  async getAllCohorts(name?: string) {
  let query = this.db
    .selectFrom('cohorts as c')
    .leftJoin('users as ranger', 'ranger.id', 'c.assigned_ranger_id')
    .select([
      'c.id',
      'c.name',
      'c.description',
      'c.location',
      'c.created_at',
      'c.assigned_ranger_id',
      'ranger.name as assigned_ranger_name',
      'ranger.email as assigned_ranger_email',
    ])
    .where('c.is_deleted', '=', false)
    if (name && name.trim()) {
      query = query.where(
        'c.name',
        'ilike',
        `%${name.trim()}%`
      );
    }
  const cohorts = await query
    .orderBy('c.created_at', 'desc')
    .execute();

  const cohortsWithCounts = await Promise.all(
    cohorts.map(async (cohort) => {
      const memberCountResult = await this.db
        .selectFrom('cohort_members')
        .select((eb) => eb.fn.countAll<number>().as('member_count'))
        .where('cohort_id', '=', cohort.id)
        .where('is_deleted', '=', false)
        .executeTakeFirst();

      return {
        ...cohort,
        member_count: Number(memberCountResult?.member_count ?? 0),
      };
    })
  );

  return cohortsWithCounts;
}

async getCohortById(id: string) {
  const cohort = await this.db
    .selectFrom('cohorts as c')
    .leftJoin('users as ranger', 'ranger.id', 'c.assigned_ranger_id')
    .select([
      'c.id',
      'c.name',
      'c.description',
      'c.location',
      'c.created_at',
      'c.assigned_ranger_id',
      'ranger.name as assigned_ranger_name',
      'ranger.email as assigned_ranger_email',
    ])
    .where('c.id', '=', id)
    .where('c.is_deleted', '=', false)
    .executeTakeFirst();

  if (!cohort) {
    throw new NotFoundException('Cohort not found');
  }

  const members = await this.db
    .selectFrom('cohort_members as cm')
    .leftJoin('users as u', 'u.id', 'cm.user_id')
    .select([
      'cm.id',
      'cm.user_id',
      'cm.role',
      'u.name as user_name',
      'u.email as user_email',
    ])
    .where('cm.cohort_id', '=', id)
    .where('cm.is_deleted', '=', false)
    .orderBy('u.name', 'asc')
    .execute();

  return {
    ...cohort,
    member_count: members.length,
    members,
  };
}

}
