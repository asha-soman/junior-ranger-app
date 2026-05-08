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
      .where('is_deleted', '=', false);

    if (role && role !== 'all') {
      query = query.where('role', '=', role as any);
    }

    if (status && status !== 'all') {
      query = query.where('approval_status', '=', status as any);
    }

    if (name && name.trim()) {
      query = query.where('name', 'ilike', `%${name.trim()}%`);
    }

    const users = await query.orderBy('created_at', 'desc').execute();

    return users.map((user) => ({
      ...user,
      cohort_name: null,
    }));
  }

}
