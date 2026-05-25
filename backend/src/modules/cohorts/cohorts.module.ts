import { Module } from '@nestjs/common';
import { CohortsController } from './cohorts.controller';
import { InviteCodesController } from './invite-codes.controller';
import { InviteCodeService } from './invite-code.service';

@Module({
  controllers: [CohortsController, InviteCodesController],
  providers: [InviteCodeService],
  exports: [InviteCodeService],
})
export class CohortsModule {}
