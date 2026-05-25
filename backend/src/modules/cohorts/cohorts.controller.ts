import { 
  Body, 
  Controller, 
  Param, 
  Post, 
  UseGuards, 
  Request, 
  ForbiddenException 
} from '@nestjs/common';
import { InviteCodeService } from './invite-code.service';
import { CreateInviteCodeDto } from './dto/create-invite-code.dto';
import { UserRole } from '../../common/enums/user-role.enum';
import { Kysely } from 'kysely';
import { Database } from '../../database/interfaces/database.interface';
import { Inject } from '@nestjs/common';

@Controller('cohorts')
export class CohortsController {
  constructor(
    private readonly inviteCodeService: InviteCodeService,
    @Inject('DATABASE_CONNECTION') private readonly db: Kysely<Database>,
  ) {}

  @Post(':id/invite-codes')
  async createInviteCode(
    @Param('id') cohortId: string,
    @Body() dto: CreateInviteCodeDto,
    @Request() req: any,
  ) {
    const user = req.user || { id: 'mock-user-id', role: UserRole.RANGER };

    if (user.role !== UserRole.ADMIN) {
      const cohort = await this.db
        .selectFrom('cohorts')
        .select('assignedRangerId')
        .where('id', '=', cohortId)
        .executeTakeFirst();

      if (!cohort || cohort.assignedRangerId !== user.id) {
        throw new ForbiddenException('You are not authorized to generate invite codes for this cohort');
      }
    }

    return this.inviteCodeService.generateInviteCode(cohortId, user.id, dto);
  }
}
