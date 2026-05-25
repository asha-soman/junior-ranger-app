import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Kysely } from 'kysely';
import { Database } from '../../database/interfaces/database.interface';
import { CreateInviteCodeDto } from './dto/create-invite-code.dto';
import { ValidateInviteCodeDto } from './dto/validate-invite-code.dto';
import { JoinCohortDto } from './dto/join-cohort.dto';
import { InviteCode } from './interfaces/invite-code.interface';
import * as crypto from 'crypto';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class InviteCodeService {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly db: Kysely<Database>,
  ) {}

  async generateInviteCode(
    cohortId: string,
    userId: string,
    dto: CreateInviteCodeDto,
  ): Promise<InviteCode> {
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
        cohortId,
        code,
        expiryDate,
        maxUsage,
        createdBy: userId,
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

    if (new Date() > new Date(invite.expiryDate)) {
      throw new BadRequestException('Invite code has expired');
    }

    if (invite.usedCount >= invite.maxUsage) {
      throw new BadRequestException('Invite code usage limit reached');
    }

    const cohort = await this.db
      .selectFrom('cohorts')
      .selectAll()
      .where('id', '=', invite.cohortId)
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
      .where('userId', '=', userId)
      .where('cohortId', '=', cohort.id)
      .executeTakeFirst();

    if (existingMember) {
      throw new BadRequestException('You are already a member of this cohort');
    }

    return await this.db.transaction().execute(async (trx) => {
      // Create membership record
      await trx
        .insertInto('cohort_members')
        .values({
          userId,
          cohortId: cohort.id,
          role: UserRole.JUNIOR_RANGER,
        })
        .execute();

      // Increment usage count
      await trx
        .updateTable('invite_codes')
        .set((eb) => ({
          usedCount: eb('usedCount', '+', 1),
        }))
        .where('id', '=', inviteCode.id)
        .execute();

      return { success: true, cohortName: cohort.name };
    });
  }
}
