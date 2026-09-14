import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DatabaseService } from '../../database/database.service';
import { NotificationsService } from './notifications.service';

@Injectable()
export class EventRemindersService {
  private readonly logger =
    new Logger(EventRemindersService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Cron('0 0 * * * *')
  async sendEventReminders(): Promise<void> {
    const now = new Date();

    console.log(
        'Reminder scheduler running at:',
        now,
    );

    const reminderWindowStart = new Date(
    now.getTime() + 1 * 60 * 60 * 1000,
    );

    const reminderWindowEnd = new Date(
    now.getTime() + 24 * 60 * 60 * 1000,
    );

    console.log(
      'Reminder window:',
      reminderWindowStart,
      'to',
      reminderWindowEnd,
    );

    const events = await this.db
      .selectFrom('events')
      .select([
        'id',
        'title',
        'start_time',
      ])
      .where('status', '=', 'published')
      .where('is_deleted', '=', false)
      .where(
        'start_time',
        '>=',
        reminderWindowStart,
      )
      .where(
        'start_time',
        '<',
        reminderWindowEnd,
      )
      .execute();

    for (const event of events) {
      await this.processEventReminders(
        event.id,
        event.title,
      );
    }
  }

  private async processEventReminders(
    eventId: string,
    eventTitle: string,
  ): Promise<void> {
    const participants = await this.db
      .selectFrom('event_registrations')
      .innerJoin(
        'users',
        'users.id',
        'event_registrations.junior_ranger_user_id',
      )
      .select([
        'users.id as user_id',
        'users.email as email',
      ])
      .where(
        'event_registrations.event_id',
        '=',
        eventId,
      )
      .where(
        'event_registrations.status',
        '=',
        'registered',
      )
      .where(
        'users.is_deleted',
        '=',
        false,
      )
      .execute();

    for (const participant of participants) {
      try {
        await this.notificationsService
          .notifyEventReminder({
            userId: participant.user_id,
            email: participant.email,
            eventId,
            eventTitle,
          });
      } catch (error) {
        this.logger.error(
          `Failed to process reminder for user ${participant.user_id}`,
          error,
        );
      }
    }
  }
}