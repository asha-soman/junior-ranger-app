import { Module } from '@nestjs/common';
import { ClubActivitiesController } from './club-activities.controller';
import { ClubActivitiesService } from './club-activities.service';

@Module({
    controllers: [ClubActivitiesController],
    providers: [ClubActivitiesService],
    exports: [ClubActivitiesService],
})
export class ClubActivitiesModule { }