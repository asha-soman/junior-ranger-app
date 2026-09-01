import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly db: DatabaseService,
  ) {}

  async getMyProfile(userId: string) {
    const user = await this.db
      .selectFrom('users')
      .select([
        'id',
        'name',
        'email',
        'role',
        'avatar_url',
      ])
      .where('id', '=', userId)
      .where('is_deleted', '=', false)
      .executeTakeFirst();

    if (!user) {
      throw new NotFoundException(
        'User profile not found',
      );
    }

    /*
     * Admin users do not need a cohort.
     */
    if (user.role === 'admin') {
      return {
        ...user,
        cohort: null,
      };
    }

    /*
     * Rangers and Junior Rangers:
     * retrieve their active cohort membership.
     */
    const membership = await this.db
      .selectFrom('cohort_members')
      .innerJoin(
        'cohorts',
        'cohorts.id',
        'cohort_members.cohort_id',
      )
      .select([
        'cohorts.id as cohort_id',
        'cohorts.name as cohort_name',
        'cohorts.location as cohort_location',
      ])
      .where(
        'cohort_members.user_id',
        '=',
        userId,
      )
      .where(
        'cohort_members.is_deleted',
        '=',
        false,
      )
      .where(
        'cohorts.is_deleted',
        '=',
        false,
      )
      .executeTakeFirst();

    return {
      ...user,

      cohort: membership
        ? {
            id: membership.cohort_id,
            name: membership.cohort_name,
            location:
              membership.cohort_location,
          }
        : null,
    };
  }
}