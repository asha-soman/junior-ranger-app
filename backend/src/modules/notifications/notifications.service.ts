import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

  async notifyAdminsOfPendingRanger(params: {
    rangerId: string;
    rangerName: string;
  }): Promise<void> {
    const admins = await this.db
      .selectFrom('users')
      .select([
        'id',
        'email',
      ])
      .where('role', '=', 'admin')
      .where('is_active', '=', true)
      .where('is_deleted', '=', false)
      .execute();

    for (const admin of admins) {
      const notification =
        await this.createNotification({
          userId: admin.id,
          type: 'ranger_approval_pending',
          title:
            'Pending Ranger Account Approval',
          message:
            `${params.rangerName} has requested a Ranger account and is awaiting approval.`,
        });

      try {
        const providerMessageId =
          await this.emailService
            .sendPendingRangerApproval(
              admin.email,
              params.rangerName,
            );

        await this.logDelivery({
          notificationId: notification.id,
          userId: admin.id,
          recipientEmail: admin.email,
          status: 'sent',
          providerMessageId,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Unknown email delivery error';

        this.logger.error(
          `Failed to send pending Ranger approval notification to admin ${admin.id}: ${errorMessage}`,
        );

        try {
          await this.logDelivery({
            notificationId: notification.id,
            userId: admin.id,
            recipientEmail: admin.email,
            status: 'failed',
            errorMessage,
          });
        } catch (logError) {
          this.logger.error(
            'Failed to record pending Ranger approval delivery failure',
            logError,
          );
        }
      }
    }
  }

  async notifyRangerAccountStatus(params: {
    rangerId: string;
    rangerName: string;
    rangerEmail: string;
    status: 'approved' | 'rejected';
  }): Promise<void> {
    const isApproved =
      params.status === 'approved';

    const notification =
      await this.createNotification({
        userId: params.rangerId,
        type: isApproved
          ? 'ranger_approved'
          : 'ranger_rejected',
        title: isApproved
          ? 'Ranger Account Approved'
          : 'Ranger Account Rejected',
        message: isApproved
          ? 'Your Ranger account has been approved. You can now sign in.'
          : 'Your Ranger account request has been rejected.',
      });

    try {
      const providerMessageId =
        isApproved
          ? await this.emailService
              .sendRangerAccountApproved(
                params.rangerEmail,
                params.rangerName,
              )
          : await this.emailService
              .sendRangerAccountRejected(
                params.rangerEmail,
                params.rangerName,
              );

      await this.logDelivery({
        notificationId: notification.id,
        userId: params.rangerId,
        recipientEmail: params.rangerEmail,
        status: 'sent',
        providerMessageId,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unknown email delivery error';

      this.logger.error(
        `Failed to send Ranger account ${params.status} email to ${params.rangerId}: ${errorMessage}`,
      );

      try {
        await this.logDelivery({
          notificationId: notification.id,
          userId: params.rangerId,
          recipientEmail: params.rangerEmail,
          status: 'failed',
          errorMessage,
        });
      } catch (logError) {
        this.logger.error(
          'Failed to record Ranger account status delivery failure',
          logError,
        );
      }
    }
  }

  async notifyRangerOfMissionSubmission(params: {
    rangerId: string;
    rangerEmail: string;
    juniorRangerName: string;
    taskTitle: string;
  }): Promise<void> {
    const notification =
      await this.createNotification({
        userId: params.rangerId,
        type: 'mission_submitted',
        title: 'New Adventure Task Submission',
        message:
          `${params.juniorRangerName} submitted "${params.taskTitle}" for review.`,
      });

    try {
      const providerMessageId =
        await this.emailService
          .sendMissionSubmitted(
            params.rangerEmail,
            params.juniorRangerName,
            params.taskTitle,
          );

      await this.logDelivery({
        notificationId: notification.id,
        userId: params.rangerId,
        recipientEmail: params.rangerEmail,
        status: 'sent',
        providerMessageId,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unknown email delivery error';

      this.logger.error(
        `Failed to send mission submission email to Ranger ${params.rangerId}: ${errorMessage}`,
      );

      try {
        await this.logDelivery({
          notificationId: notification.id,
          userId: params.rangerId,
          recipientEmail: params.rangerEmail,
          status: 'failed',
          errorMessage,
        });
      } catch (logError) {
        this.logger.error(
          'Failed to record mission submission delivery failure',
          logError,
        );
      }
    }
  }

  async notifyJuniorRangerOfTaskReview(params: {
    juniorRangerId: string;
    juniorRangerEmail: string;
    juniorRangerName: string;
    taskTitle: string;
    status: 'approved' | 'rejected';
    feedback?: string | null;
  }): Promise<void> {
    const isApproved =
      params.status === 'approved';

    const notification =
      await this.createNotification({
        userId: params.juniorRangerId,
        type: isApproved
          ? 'task_approved'
          : 'task_rejected',
        title: isApproved
          ? 'Adventure Task Approved'
          : 'Adventure Task Needs Changes',
        message: isApproved
          ? `Your submission for "${params.taskTitle}" has been approved.`
          : `Your submission for "${params.taskTitle}" needs changes. Please review the Ranger's feedback.`,
      });

    try {
      const providerMessageId =
        isApproved
          ? await this.emailService
              .sendTaskApproved(
                params.juniorRangerEmail,
                params.juniorRangerName,
                params.taskTitle,
              )
          : await this.emailService
              .sendTaskRejected(
                params.juniorRangerEmail,
                params.juniorRangerName,
                params.taskTitle,
                params.feedback,
              );

      await this.logDelivery({
        notificationId: notification.id,
        userId: params.juniorRangerId,
        recipientEmail:
          params.juniorRangerEmail,
        status: 'sent',
        providerMessageId,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unknown email delivery error';

      this.logger.error(
        `Failed to send task ${params.status} email to Junior Ranger ${params.juniorRangerId}: ${errorMessage}`,
      );

      try {
        await this.logDelivery({
          notificationId: notification.id,
          userId: params.juniorRangerId,
          recipientEmail:
            params.juniorRangerEmail,
          status: 'failed',
          errorMessage,
        });
      } catch (logError) {
        this.logger.error(
          'Failed to record task review delivery failure',
          logError,
        );
      }
    }
  }

  async notifyRangerOfJuniorRangerJoining(params: {
    rangerId: string;
    rangerEmail: string;
    juniorRangerName: string;
    cohortName: string;
  }): Promise<void> {
    const notification =
      await this.createNotification({
        userId: params.rangerId,
        type: 'junior_ranger_joined_cohort',
        title: 'New Junior Ranger Joined Your Cohort',
        message:
          `${params.juniorRangerName} joined your cohort "${params.cohortName}".`,
      });

    try {
      const providerMessageId =
        await this.emailService
          .sendJuniorRangerJoinedCohort(
            params.rangerEmail,
            params.juniorRangerName,
            params.cohortName,
          );

      await this.logDelivery({
        notificationId: notification.id,
        userId: params.rangerId,
        recipientEmail: params.rangerEmail,
        status: 'sent',
        providerMessageId,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unknown email delivery error';

      this.logger.error(
        `Failed to send cohort join email to Ranger ${params.rangerId}: ${errorMessage}`,
      );

      try {
        await this.logDelivery({
          notificationId: notification.id,
          userId: params.rangerId,
          recipientEmail: params.rangerEmail,
          status: 'failed',
          errorMessage,
        });
      } catch (logError) {
        this.logger.error(
          'Failed to record cohort join delivery failure',
          logError,
        );
      }
    }
  }

  async notifyRangerOfEventRegistrationChange(params: {
    rangerId: string;
    juniorRangerName: string;
    eventId: string;
    eventTitle: string;
    action: 'registered' | 'cancelled';
  }): Promise<void> {
    const isRegistration =
      params.action === 'registered';

    await this.createNotification({
      userId: params.rangerId,
      type: isRegistration
        ? 'event_participant_registered'
        : 'event_participant_cancelled',
      title: isRegistration
        ? 'New Event Registration'
        : 'Event Registration Cancelled',
      message: isRegistration
        ? `${params.juniorRangerName} registered for "${params.eventTitle}".`
        : `${params.juniorRangerName} cancelled their registration for "${params.eventTitle}".`,
      eventId: params.eventId,
    });
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

  async getMyNotifications(userId: string) {
    return this.db
      .selectFrom('notifications')
      .selectAll()
      .where('user_id', '=', userId)
      .orderBy('created_at', 'desc')
      .execute();
    }

    async markAsRead(
      notificationId: string,
      userId: string,
    ) {
      const notification = await this.db
        .updateTable('notifications')
        .set({
          is_read: true,
        })
        .where('id', '=', notificationId)
        .where('user_id', '=', userId)
        .returningAll()
        .executeTakeFirst();

      if (!notification) {
        throw new NotFoundException(
          'Notification not found',
        );
      }

      return notification;
    }

    async markAllAsRead(userId: string) {
      await this.db
        .updateTable('notifications')
        .set({
          is_read: true,
        })
        .where('user_id', '=', userId)
        .where('is_read', '=', false)
        .execute();

      return {
        message: 'All notifications marked as read',
      };
    }

    async getUnreadCount(userId: string) {
      const result = await this.db
        .selectFrom('notifications')
        .select(({ fn }) =>
          fn.count<number>('id').as('count'),
        )
        .where('user_id', '=', userId)
        .where('is_read', '=', false)
        .executeTakeFirst();

      return {
        count: Number(result?.count ?? 0),
      };
    }

}