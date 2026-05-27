import { Module } from '@nestjs/common';
import { CohortsController } from './cohorts.controller';
import { InviteCodesController } from './invite-codes.controller';
import { CohortsListController } from './cohorts-list.controller';
import { InviteCodeService } from './invite-code.service';

@Module({
  controllers: [CohortsController, InviteCodesController, CohortsListController],
  providers: [InviteCodeService],
  exports: [InviteCodeService],
})
export class CohortsModule {}
