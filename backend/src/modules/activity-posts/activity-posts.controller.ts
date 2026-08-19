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

import { ActivityPostsService } from './activity-posts.service';
import { CreateActivityPostDto } from './dto/create-activity-post.dto';
import { UpdateActivityPostDto } from './dto/update-activity-post.dto';

type AuthUser = {
    userId: string;
    email: string;
    role: 'admin' | 'ranger' | 'junior_ranger';
};

@Controller('activity-posts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ActivityPostsController {
    constructor(
        private readonly activityPostsService: ActivityPostsService,
    ) { }

    @Get()
    @Roles('admin', 'ranger', 'junior_ranger')
    getActivityPosts(
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.activityPostsService.getActivityPosts(
            req.user,
        );
    }

    @Post()
    @Roles('junior_ranger')
    createActivityPost(
        @Body() dto: CreateActivityPostDto,
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.activityPostsService.createActivityPost(
            dto,
            req.user,
        );
    }

    @Get(':id/details')
    @Roles('admin', 'ranger', 'junior_ranger')
    getActivityPostDetails(
        @Param('id') id: string,
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.activityPostsService.getActivityPostDetails(
            id,
            req.user,
        );
    }

    @Patch(':id')
    @Roles('junior_ranger')
    updateActivityPost(
        @Param('id') id: string,
        @Body() dto: UpdateActivityPostDto,
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.activityPostsService.updateActivityPost(
            id,
            dto,
            req.user,
        );
    }

    @Delete(':id')
    @Roles('admin', 'ranger', 'junior_ranger')
    deleteActivityPost(
        @Param('id') id: string,
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.activityPostsService.deleteActivityPost(
            id,
            req.user,
        );
    }
}