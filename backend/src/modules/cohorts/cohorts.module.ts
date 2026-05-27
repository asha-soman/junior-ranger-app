import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CohortsController } from './cohorts.controller';
import { CohortsService } from './cohorts.service';
import { InviteCodesController } from './invite-codes.controller';
import { CohortsListController } from './cohorts-list.controller';
import { InviteCodeService } from './invite-code.service';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CohortsController,
    InviteCodesController,
    CohortsListController,
  ],
  providers: [CohortsService, InviteCodeService],
  exports: [InviteCodeService],
})
export class CohortsModule {}
