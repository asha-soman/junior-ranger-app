import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CohortsController } from './cohorts.controller';
import { CohortsService } from './cohorts.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CohortsController],
  providers: [CohortsService],
})
export class CohortsModule {}