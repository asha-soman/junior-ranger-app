import { Body, Controller, Get, Patch, Req, UseGuards, Param } from '@nestjs/common';
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

  @Get('me')
    getMyNotifications(@Req() req: any) {
      return this.notificationsService.getMyNotifications(
        req.user.userId,
      );
    }
  
  @Patch('read-all')
  markAllAsRead(@Req() req: any) {
    return this.notificationsService.markAllAsRead(
      req.user.userId,
    );
  }
  
  @Patch(':id/read')
    markAsRead(
      @Param('id') notificationId: string,
      @Req() req: any,
    ) {
      return this.notificationsService.markAsRead(
        notificationId,
        req.user.userId,
      );
    }
  
  @Get('unread-count')
  getUnreadCount(@Req() req: any) {
    return this.notificationsService.getUnreadCount(
      req.user.userId,
    );
  }

}