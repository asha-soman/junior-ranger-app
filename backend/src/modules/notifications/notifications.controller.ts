import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get('preferences')
  getPreferences(@Req() req: any) {
    return this.notificationsService.getPreferences(
      req.user.userId,
    );
  }

  @Patch('preferences')
  updatePreferences(
    @Req() req: any,
    @Body()
    body: {
      event_updates_enabled?: boolean;
      event_reminders_enabled?: boolean;
    },
  ) {
    return this.notificationsService.updatePreferences(
      req.user.userId,
      body,
    );
  }
}