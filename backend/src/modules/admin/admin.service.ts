import { Injectable } from '@nestjs/common';
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
}