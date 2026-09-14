import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../../database/database.service';
import { EmailService } from '../email/email.service';
import type { NotificationType } from '../../database/database.types';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly emailService: EmailService,
  ) {}

  async createNotification(params: {
    userId: string;
    eventId?: string | null;
    type: NotificationType;
    title: string;
    message: string;
  }) {
    return this.db
      .insertInto('notifications')
      .values({
        id: randomUUID(),
        user_id: params.userId,
        event_id: params.eventId ?? null,
        type: params.type,
        title: params.title,
        message: params.message,
        is_read: false,
        created_at: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async getPreferences(userId: string) {
    const preferences = await this.db
      .selectFrom('notification_preferences')
      .selectAll()
      .where('user_id', '=', userId)
      .executeTakeFirst();

    return {
      event_updates_enabled:
        preferences?.event_updates_enabled ?? true,
      event_reminders_enabled:
        preferences?.event_reminders_enabled ?? true,
    };
  }

  async logDelivery(params: {
    notificationId?: string | null;
    userId: string;
    eventId?: string | null;
    recipientEmail?: string | null;
    status: 'sent' | 'failed';
    providerMessageId?: string | null;
    errorMessage?: string | null;
  }) {
    await this.db
      .insertInto('notification_delivery_logs')
      .values({
        id: randomUUID(),
        notification_id: params.notificationId ?? null,
        user_id: params.userId,
        event_id: params.eventId ?? null,
        channel: 'email',
        status: params.status,
        recipient_email: params.recipientEmail ?? null,
        provider_message_id: params.providerMessageId ?? null,
        error_message: params.errorMessage ?? null,
        created_at: new Date(),
      })
      .execute();
  }

  async notifyEventRegistration(params: {
    userId: string;
    email: string;
    eventId: string;
    eventTitle: string;
  }): Promise<void> {
    const notification = await this.createNotification({
        userId: params.userId,
        eventId: params.eventId,
        type: 'event_registration',
        title: 'Registration Confirmed',
        message: `You are registered for ${params.eventTitle}.`,
    });

    try {
        const providerMessageId =
        await this.emailService.sendEventRegistrationConfirmation(
            params.email,
            params.eventTitle,
        );

        await this.logDelivery({
            notificationId: notification.id,
            userId: params.userId,
            eventId: params.eventId,
            recipientEmail: params.email,
            status: 'sent',
            providerMessageId,
        });
    } catch (error) {
        const errorMessage =
        error instanceof Error
            ? error.message
            : 'Unknown email delivery error';

        this.logger.error(
            `Failed to send registration confirmation for user ${params.userId}: ${errorMessage}`,
        );

        try {
            await this.logDelivery({
                notificationId: notification.id,
                userId: params.userId,
                eventId: params.eventId,
                recipientEmail: params.email,
                status: 'failed',
                errorMessage,
        });
        } catch (logError) {
        this.logger.error(
            'Failed to record notification delivery failure',
            logError,
        );
      }
    }
  }

  async notifyEventRegistrationCancellation(params: {
    userId: string;
    email: string;
    eventId: string;
    eventTitle: string;
  }): Promise<void> {
    const notification = await this.createNotification({
        userId: params.userId,
        eventId: params.eventId,
        type: 'event_registration_cancelled',
        title: 'Registration Cancelled',
        message: `Your registration for ${params.eventTitle} has been cancelled.`,
    });

    try {
      const providerMessageId =
        await this.emailService.sendEventRegistrationCancellation(
            params.email,
            params.eventTitle,
        );

        await this.logDelivery({
            notificationId: notification.id,
            userId: params.userId,
            eventId: params.eventId,
            recipientEmail: params.email,
            status: 'sent',
            providerMessageId,
        });
    } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Unknown email delivery error';

        this.logger.error(
          `Failed to send registration cancellation for user ${params.userId}: ${errorMessage}`,
        );

        try {
            await this.logDelivery({
                notificationId: notification.id,
                userId: params.userId,
                eventId: params.eventId,
                recipientEmail: params.email,
                status: 'failed',
                errorMessage,
            });
        } catch (logError) {
          this.logger.error(
            'Failed to record notification delivery failure',
            logError,
          );
        }
    }
  }

  async notifyEventCancellation(params: {
    userId: string;
    email: string;
    eventId: string;
    eventTitle: string;
  }): Promise<void> {
    const notification = await this.createNotification({
        userId: params.userId,
        eventId: params.eventId,
        type: 'event_cancelled',
        title: 'Event Cancelled',
        message: `${params.eventTitle} has been cancelled.`,
    });

    try {
        const providerMessageId =
          await this.emailService.sendEventCancellation(
            params.email,
            params.eventTitle,
        );

        await this.logDelivery({
            notificationId: notification.id,
            userId: params.userId,
            eventId: params.eventId,
            recipientEmail: params.email,
            status: 'sent',
            providerMessageId,
        });
    } catch (error) {
      const errorMessage =
        error instanceof Error
            ? error.message
            : 'Unknown email delivery error';

        this.logger.error(
            `Failed to send event cancellation notification to user ${params.userId}: ${errorMessage}`,
        );

        try {
          await this.logDelivery({
            notificationId: notification.id,
            userId: params.userId,
            eventId: params.eventId,
            recipientEmail: params.email,
            status: 'failed',
            errorMessage,
          });
        } catch (logError) {
          this.logger.error(
            'Failed to record event cancellation delivery failure',
            logError,
        );
      }
    }
  }

  async notifyEventUpdate(params: {
    userId: string;
    email: string;
    eventId: string;
    eventTitle: string;
  }): Promise<void> {
    const preferences =
        await this.getPreferences(params.userId);

    if (!preferences.event_updates_enabled) {
        return;
    }

    const notification = await this.createNotification({
        userId: params.userId,
        eventId: params.eventId,
        type: 'event_update',
        title: 'Event Updated',
        message: `Some details for ${params.eventTitle} have changed.`,
    });

    try {
        const providerMessageId =
          await this.emailService.sendEventUpdate(
            params.email,
            params.eventTitle,
          );

        await this.logDelivery({
            notificationId: notification.id,
            userId: params.userId,
            eventId: params.eventId,
            recipientEmail: params.email,
            status: 'sent',
            providerMessageId,
        });
    } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Unknown email delivery error';

        this.logger.error(
          `Failed to send event update to user ${params.userId}: ${errorMessage}`,
        );

        try {
          await this.logDelivery({
            notificationId: notification.id,
            userId: params.userId,
            eventId: params.eventId,
            recipientEmail: params.email,
            status: 'failed',
            errorMessage,
          });
        } catch (logError) {
          this.logger.error(
            'Failed to record event update delivery failure',
            logError,
        );
      }
    }
  }

  async notifyEventRepublished(params: {
    userId: string;
    email: string;
    eventId: string;
    eventTitle: string;
  }): Promise<void> {
    const notification = await this.createNotification({
        userId: params.userId,
        eventId: params.eventId,
        type: 'event_update',
        title: 'Event Available Again',
        message: `${params.eventTitle} has been published again.`,
    });

    try {
      const providerMessageId =
        await this.emailService.sendEventRepublished(
            params.email,
            params.eventTitle,
        );

        await this.logDelivery({
            notificationId: notification.id,
            userId: params.userId,
            eventId: params.eventId,
            recipientEmail: params.email,
            status: 'sent',
            providerMessageId,
        });
    } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Unknown email delivery error';

        this.logger.error(
          `Failed to send republished event notification to user ${params.userId}: ${errorMessage}`,
        );

        try {
          await this.logDelivery({
            notificationId: notification.id,
            userId: params.userId,
            eventId: params.eventId,
            recipientEmail: params.email,
            status: 'failed',
            errorMessage,
          });
        } catch (logError) {
          this.logger.error(
            'Failed to record republished event delivery failure',
            logError,
        );
      }
    }
  }
  
  async notifyEventReminder(params: {
    userId: string;
    email: string;
    eventId: string;
    eventTitle: string;
  }): Promise<void> {
    const preferences =
        await this.getPreferences(params.userId);

    if (!preferences.event_reminders_enabled) {
        return;
    }

    // Avoid sending the same reminder more than once
    const existingReminder = await this.db
        .selectFrom('notifications')
        .select('id')
        .where('user_id', '=', params.userId)
        .where('event_id', '=', params.eventId)
        .where('type', '=', 'event_reminder')
        .executeTakeFirst();

    if (existingReminder) {
        return;
    }

    const notification =
      await this.createNotification({
        userId: params.userId,
        eventId: params.eventId,
        type: 'event_reminder',
        title: 'Event Reminder',
        message: `This is a reminder that ${params.eventTitle} is coming up soon.`,
        });

    try {
      const providerMessageId =
        await this.emailService.sendEventReminder(
            params.email,
            params.eventTitle,
        );

      await this.logDelivery({
        notificationId: notification.id,
        userId: params.userId,
        eventId: params.eventId,
        recipientEmail: params.email,
        status: 'sent',
        providerMessageId,
      });
    } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Unknown email delivery error';

        this.logger.error(
          `Failed to send event reminder to user ${params.userId}: ${errorMessage}`,
        );

        try {
          await this.logDelivery({
            notificationId: notification.id,
            userId: params.userId,
            eventId: params.eventId,
            recipientEmail: params.email,
            status: 'failed',
            errorMessage,
        });
      } catch (logError) {
        this.logger.error(
            'Failed to record event reminder delivery failure',
            logError,
        );
     }
    }
  }

  async updatePreferences(
    userId: string,
    preferences: {
        event_updates_enabled?: boolean;
        event_reminders_enabled?: boolean;
    },
    ) {
    const existing = await this.db
        .selectFrom('notification_preferences')
        .selectAll()
        .where('user_id', '=', userId)
        .executeTakeFirst();

    if (existing) {
        return this.db
        .updateTable('notification_preferences')
        .set({
            ...(preferences.event_updates_enabled !== undefined
            ? {
                event_updates_enabled:
                    preferences.event_updates_enabled,
                }
            : {}),

            ...(preferences.event_reminders_enabled !== undefined
            ? {
                event_reminders_enabled:
                    preferences.event_reminders_enabled,
                }
            : {}),

            updated_at: new Date(),
        })
        .where('user_id', '=', userId)
        .returningAll()
        .executeTakeFirstOrThrow();
    }

    return this.db
        .insertInto('notification_preferences')
        .values({
        user_id: userId,
        event_updates_enabled:
            preferences.event_updates_enabled ?? true,
        event_reminders_enabled:
            preferences.event_reminders_enabled ?? true,
        created_at: new Date(),
        updated_at: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();
    }

}