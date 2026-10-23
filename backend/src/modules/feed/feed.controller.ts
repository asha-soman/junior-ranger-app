import {
    Controller,
    Get,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

import { FeedService } from './feed.service';

type AuthUser = {
    userId: string;
    email: string;
    role: 'admin' | 'ranger' | 'junior_ranger';
};

@Controller('feed')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeedController {
    constructor(
        private readonly feedService: FeedService,
    ) { }

    @Get()
    @Roles('admin', 'ranger', 'junior_ranger')
    getFeed(
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.feedService.getFeed(req.user);
    }
}