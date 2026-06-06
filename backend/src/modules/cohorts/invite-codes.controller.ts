import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CohortsService } from './cohorts.service';
import { ValidateInviteCodeDto } from './dto/validate-invite-code.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('invite-codes')
export class InviteCodesController {
  constructor(private readonly cohortsService: CohortsService) {}

  @Post('validate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'ranger', 'junior_ranger')
  async validateInviteCode(@Body() dto: ValidateInviteCodeDto) {
    return this.cohortsService.validateInviteCode(dto.code);
  }
}
