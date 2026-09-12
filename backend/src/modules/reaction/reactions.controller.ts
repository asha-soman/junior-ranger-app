import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

import { ReactionsService } from './reactions.service';
import { SetReactionDto } from './dto/set-reaction.dto';
import type { ReactionTargetType } from '../../database/database.types';

type AuthUser = {
    userId: string;
    email: string;
    role: 'admin' | 'ranger' | 'junior_ranger';
};

@Controller('reactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReactionsController {
    constructor(
        private readonly reactionsService: ReactionsService,
    ) { }

    // Junior Ranger adds or changes reaction
    @Post()
    @Roles('junior_ranger')
    setReaction(
        @Body() dto: SetReactionDto,
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.reactionsService.setReaction(
            dto,
            req.user,
        );
    }

    // View reaction counts
    @Get(':targetType/:targetId')
    @Roles('admin', 'ranger', 'junior_ranger')
    getReactions(
        @Param('targetType')
        targetType: ReactionTargetType,

        @Param('targetId')
        targetId: string,

        @Req() req: Request & { user: AuthUser },
    ) {
        return this.reactionsService.getReactions(
            targetType,
            targetId,
            req.user,
        );
    }

    // Junior Ranger removes their reaction
    @Delete(':targetType/:targetId')
    @Roles('junior_ranger')
    removeReaction(
        @Param('targetType')
        targetType: ReactionTargetType,

        @Param('targetId')
        targetId: string,

        @Req() req: Request & { user: AuthUser },
    ) {
        return this.reactionsService.removeReaction(
            targetType,
            targetId,
            req.user,
        );
    }
}