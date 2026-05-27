import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateInviteCodeDto } from './dto/create-invite-code.dto';
import { ValidateInviteCodeDto } from './dto/validate-invite-code.dto';
import { JoinCohortDto } from './dto/join-cohort.dto';
import * as crypto from 'crypto';

@Injectable()
export class InviteCodeService {
  constructor(private readonly db: DatabaseService) {}

  async generateInviteCode(
    cohortId: string,
    userId: string,
    dto: CreateInviteCodeDto,
  ) {
    const cohort = await this.db
      .selectFrom('cohorts')
      .selectAll()
      .where('id', '=', cohortId)
      .executeTakeFirst();

    if (!cohort) {
      throw new NotFoundException(`Cohort with ID ${cohortId} not found`);
    }

    let code: string = '';
    let isUnique = false;
    while (!isUnique) {
      code = crypto.randomBytes(4).toString('hex').toUpperCase();
      const existing = await this.db
        .selectFrom('invite_codes')
        .where('code', '=', code)
        .executeTakeFirst();
      if (!existing) {
        isUnique = true;
      }
    }

    const expiryDate = dto.expiryDate 
      ? new Date(dto.expiryDate) 
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    const maxUsage = dto.maxUsage ?? 10;

    const result = await this.db
      .insertInto('invite_codes')
      .values({
        id: crypto.randomUUID(),
        cohort_id: cohortId,
        code,
        expiry_date: expiryDate,
        max_usage: maxUsage,
        created_by: userId,
        used_count: 0,
        active: true,
        created_at: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return result;
  }

  async validateInviteCode(dto: ValidateInviteCodeDto) {
    const invite = await this.db
      .selectFrom('invite_codes')
      .selectAll()
      .where('code', '=', dto.code)
      .executeTakeFirst();

    if (!invite) {
      throw new NotFoundException('Invite code not found');
    }

    if (!invite.active) {
      throw new BadRequestException('Invite code is no longer active');
    }

    if (new Date() > new Date(invite.expiry_date)) {
      throw new BadRequestException('Invite code has expired');
    }

    if (invite.used_count >= invite.max_usage) {
      throw new BadRequestException('Invite code usage limit reached');
    }

    const cohort = await this.db
      .selectFrom('cohorts')
      .selectAll()
      .where('id', '=', invite.cohort_id)
      .executeTakeFirst();

    if (!cohort) {
      throw new NotFoundException('Associated cohort not found');
    }

    return {
      inviteCode: invite,
      cohort: cohort,
    };
  }

  async joinCohort(userId: string, dto: JoinCohortDto) {
    const { inviteCode, cohort } = await this.validateInviteCode({ code: dto.code });

    // Check if user is already a member
    const existingMember = await this.db
      .selectFrom('cohort_members')
      .selectAll()
      .where('user_id', '=', userId)
      .where('cohort_id', '=', cohort.id)
      .executeTakeFirst();

    if (existingMember) {
      throw new BadRequestException('You are already a member of this cohort');
    }

    return await this.db.transaction().execute(async (trx) => {
      // Create membership record
      await trx
        .insertInto('cohort_members')
        .values({
          id: crypto.randomUUID(),
          user_id: userId,
          cohort_id: cohort.id,
          role: 'junior_ranger',
          created_at: new Date(),
          is_deleted: false,
        })
        .execute();

      // Increment usage count
      await trx
        .updateTable('invite_codes')
        .set((eb) => ({
          used_count: eb('used_count', '+', 1),
        }))
        .where('id', '=', inviteCode.id)
        .execute();

      return { success: true, cohortName: cohort.name };
    });
  }
}
