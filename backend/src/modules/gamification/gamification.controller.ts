import { Controller, Get, Req, UseGuards, Param } from '@nestjs/common';
import { Request } from 'express';

import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

type AuthUser = {
  userId: string;
  email: string;
  role: 'admin' | 'ranger' | 'junior_ranger';
};

@Controller()
@UseGuards(JwtAuthGuard)
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('gamification/me')
  getMyProgress(@Req() req: Request & { user: AuthUser }) {
    return this.gamificationService.getMyProgress(req.user);
  }

  @Get('gamification/me/badges')
  getMyBadges(@Req() req: Request & { user: AuthUser }) {
    return this.gamificationService.getMyBadges(req.user);
  }

  @Get('notifications/me')
  getMyNotifications(@Req() req: Request & { user: AuthUser }) {
    return this.gamificationService.getMyNotifications(req.user);
  }

  @Get('gamification/adventures/:adventureId/progress')
  getAdventureProgress(
    @Param('adventureId') adventureId: string,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.gamificationService.getAdventureProgress(adventureId, req.user);
  }
}
