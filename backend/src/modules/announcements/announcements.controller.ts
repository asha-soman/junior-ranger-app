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

import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

type AuthUser = {
    userId: string;
    email: string;
    role: 'admin' | 'ranger' | 'junior_ranger';
};

@Controller('announcements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnnouncementsController {
    constructor(
        private readonly announcementsService: AnnouncementsService,
    ) { }

    // List announcements
    @Get()
    @Roles('admin', 'ranger', 'junior_ranger')
    getAnnouncements(
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.announcementsService.getAnnouncements(
            req.user,
        );
    }

    // Create announcement
    @Post()
    @Roles('admin', 'ranger')
    createAnnouncement(
        @Body() dto: CreateAnnouncementDto,
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.announcementsService.createAnnouncement(
            dto,
            req.user,
        );
    }

    // Get announcement details
    @Get(':id/details')
    @Roles('admin', 'ranger', 'junior_ranger')
    getAnnouncementDetails(
        @Param('id') id: string,
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.announcementsService.getAnnouncementDetails(
            id,
            req.user,
        );
    }

    // Update announcement
    @Patch(':id')
    @Roles('admin', 'ranger')
    updateAnnouncement(
        @Param('id') id: string,
        @Body() dto: UpdateAnnouncementDto,
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.announcementsService.updateAnnouncement(
            id,
            dto,
            req.user,
        );
    }

    // Publish announcement
    @Patch(':id/publish')
    @Roles('admin', 'ranger')
    publishAnnouncement(
        @Param('id') id: string,
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.announcementsService.publishAnnouncement(
            id,
            req.user,
        );
    }

    // Archive announcement
    @Patch(':id/archive')
    @Roles('admin', 'ranger')
    archiveAnnouncement(
        @Param('id') id: string,
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.announcementsService.archiveAnnouncement(
            id,
            req.user,
        );
    }

    // Soft delete announcement
    @Delete(':id')
    @Roles('admin', 'ranger')
    deleteAnnouncement(
        @Param('id') id: string,
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.announcementsService.deleteAnnouncement(
            id,
            req.user,
        );
    }
}