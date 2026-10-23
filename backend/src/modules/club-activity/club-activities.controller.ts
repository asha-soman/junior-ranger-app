import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

import { ClubActivitiesService } from './club-activities.service';
import { CreateClubActivityDto } from './dto/create-club-activity.dto';
import { UpdateClubActivityDto } from './dto/update-club-activity.dto';

type AuthUser = {
    userId: string;
    email: string;
    role: 'admin' | 'ranger' | 'junior_ranger';
};

@Controller('club-activities')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClubActivitiesController {
    constructor(
        private readonly clubActivitiesService: ClubActivitiesService,
    ) { }

    @Get()
    @Roles('admin', 'ranger', 'junior_ranger')
    getClubActivities(
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.clubActivitiesService.getClubActivities(
            req.user,
        );
    }

    @Post()
    @Roles('admin', 'ranger')
    createClubActivity(
        @Body() dto: CreateClubActivityDto,
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.clubActivitiesService.createClubActivity(
            dto,
            req.user,
        );
    }

    @Get(':id/details')
    @Roles('admin', 'ranger', 'junior_ranger')
    getClubActivityDetails(
        @Param('id') id: string,
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.clubActivitiesService.getClubActivityDetails(
            id,
            req.user,
        );
    }

    @Patch(':id')
    @Roles('admin', 'ranger')
    updateClubActivity(
        @Param('id') id: string,
        @Body() dto: UpdateClubActivityDto,
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.clubActivitiesService.updateClubActivity(
            id,
            dto,
            req.user,
        );
    }

    @Delete(':id')
    @Roles('admin', 'ranger')
    deleteClubActivity(
        @Param('id') id: string,
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.clubActivitiesService.deleteClubActivity(
            id,
            req.user,
        );
    }
}