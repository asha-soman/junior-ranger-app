import { 
  Body, 
  Controller, 
  Post, 
  HttpCode, 
  HttpStatus,
  Request,
  ForbiddenException
} from '@nestjs/common';
import { InviteCodeService } from './invite-code.service';
import { ValidateInviteCodeDto } from './dto/validate-invite-code.dto';
import { JoinCohortDto } from './dto/join-cohort.dto';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('invite-codes')
export class InviteCodesController {
  constructor(private readonly inviteCodeService: InviteCodeService) {}

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validateInviteCode(@Body() dto: ValidateInviteCodeDto) {
    return this.inviteCodeService.validateInviteCode(dto);
  }

  @Post('join')
  @HttpCode(HttpStatus.CREATED)
  async joinCohort(@Body() dto: JoinCohortDto, @Request() req: any) {
    const user = req.user || { id: 'mock-junior-id', role: UserRole.JUNIOR_RANGER };

    if (user.role !== UserRole.JUNIOR_RANGER) {
      throw new ForbiddenException('Only Junior Rangers can join cohorts using invite codes');
    }

    return this.inviteCodeService.joinCohort(user.id, dto);
  }
}
