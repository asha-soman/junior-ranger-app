import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../../database/database.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

type AuthUser = {
  userId: string;
  email: string;
  role: 'admin' | 'ranger' | 'junior_ranger';
};

@Injectable()
export class EventsService {
  constructor(private readonly db: DatabaseService) {}

  private async validateCohortPermission(
    cohortId: string,
    user: AuthUser,
  ) {
    const cohort = await this.db
      .selectFrom('cohorts')
      .selectAll()
      .where('id', '=', cohortId)
      .where('is_deleted', '=', false)
      .executeTakeFirst();

    if (!cohort) {
      throw new NotFoundException('Cohort not found');
    }

    // Admins can manage events for any cohort
    if (user.role === 'admin') {
      return cohort;
    }

    // Rangers can only manage their own/assigned cohort
    if (
      cohort.created_by_ranger_id !== user.userId &&
      cohort.assigned_ranger_id !== user.userId
    ) {
      throw new ForbiddenException(
        'You do not have permission to manage events for this cohort',
      );
    }

    return cohort;
  }

  private async getManageableEvent(
    eventId: string,
    user: AuthUser,
  ) {
    const event = await this.db
      .selectFrom('events')
      .selectAll()
      .where('id', '=', eventId)
      .where('is_deleted', '=', false)
      .executeTakeFirst();

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    await this.validateCohortPermission(event.cohort_id, user);

    return event;
  }

  private validateDates(
    startTime: Date,
    endTime: Date,
    registrationDeadline?: Date | null,
  ) {
    if (endTime <= startTime) {
      throw new BadRequestException(
        'End time must be after start time',
      );
    }

    if (
      registrationDeadline &&
      registrationDeadline > startTime
    ) {
      throw new BadRequestException(
        'Registration deadline must be before the event starts',
      );
    }
  }

  async createEvent(dto: CreateEventDto, user: AuthUser) {
    await this.validateCohortPermission(dto.cohort_id, user);

    const startTime = new Date(dto.start_time);
    const endTime = new Date(dto.end_time);

    const registrationDeadline = dto.registration_deadline
      ? new Date(dto.registration_deadline)
      : null;

    this.validateDates(
      startTime,
      endTime,
      registrationDeadline,
    );

    const event = await this.db
      .insertInto('events')
      .values({
        id: randomUUID(),
        title: dto.title.trim(),
        description: dto.description?.trim() || null,
        location: dto.location?.trim() || null,

        start_time: startTime,
        end_time: endTime,
        registration_deadline: registrationDeadline,

        capacity: dto.capacity ?? null,

        // New events begin as draft
        status: 'draft',

        cohort_id: dto.cohort_id,
        created_by_user_id: user.userId,

        is_deleted: false,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return {
      message: 'Event created successfully',
      event,
    };
  }

  async getEventForManagement(
    eventId: string,
    user: AuthUser,
  ) {
    const event = await this.getManageableEvent(eventId, user);

    return {
      event,
    };
  }

  async updateEvent(
    eventId: string,
    dto: UpdateEventDto,
    user: AuthUser,
  ) {
    const existingEvent = await this.getManageableEvent(
      eventId,
      user,
    );

    if (
      dto.cohort_id !== undefined &&
      dto.cohort_id !== existingEvent.cohort_id
    ) {
      await this.validateCohortPermission(
        dto.cohort_id,
        user,
      );
    }

    const startTime =
      dto.start_time !== undefined
        ? new Date(dto.start_time)
        : existingEvent.start_time;

    const endTime =
      dto.end_time !== undefined
        ? new Date(dto.end_time)
        : existingEvent.end_time;

    const registrationDeadline =
      dto.registration_deadline !== undefined
        ? new Date(dto.registration_deadline)
        : existingEvent.registration_deadline;

    this.validateDates(
      startTime,
      endTime,
      registrationDeadline,
    );

    const updatedEvent = await this.db
      .updateTable('events')
      .set({
        ...(dto.title !== undefined
          ? { title: dto.title.trim() }
          : {}),

        ...(dto.description !== undefined
          ? {
              description:
                dto.description.trim() || null,
            }
          : {}),

        ...(dto.location !== undefined
          ? {
              location: dto.location.trim() || null,
            }
          : {}),

        ...(dto.start_time !== undefined
          ? { start_time: startTime }
          : {}),

        ...(dto.end_time !== undefined
          ? { end_time: endTime }
          : {}),

        ...(dto.registration_deadline !== undefined
          ? {
              registration_deadline:
                registrationDeadline,
            }
          : {}),

        ...(dto.capacity !== undefined
          ? { capacity: dto.capacity }
          : {}),

        ...(dto.cohort_id !== undefined
          ? { cohort_id: dto.cohort_id }
          : {}),

        updated_at: new Date(),
      })
      .where('id', '=', eventId)
      .returningAll()
      .executeTakeFirstOrThrow();

    return {
      message: 'Event updated successfully',
      event: updatedEvent,
    };
  }

  async publishEvent(
    eventId: string,
    user: AuthUser,
  ) {
    const event = await this.getManageableEvent(eventId, user);

    if (event.status === 'cancelled') {
      throw new BadRequestException(
        'A cancelled event cannot be published',
      );
    }

    if (event.status === 'completed') {
      throw new BadRequestException(
        'A completed event cannot be published',
      );
    }

    if (event.status === 'published') {
      throw new BadRequestException(
        'Event is already published',
      );
    }

    const updatedEvent = await this.db
      .updateTable('events')
      .set({
        status: 'published',
        updated_at: new Date(),
      })
      .where('id', '=', eventId)
      .returningAll()
      .executeTakeFirstOrThrow();

    return {
      message: 'Event published successfully',
      event: updatedEvent,
    };
  }

  async cancelEvent(
    eventId: string,
    user: AuthUser,
  ) {
    const event = await this.getManageableEvent(eventId, user);

    if (event.status === 'cancelled') {
      throw new BadRequestException(
        'Event is already cancelled',
      );
    }

    if (event.status === 'completed') {
      throw new BadRequestException(
        'A completed event cannot be cancelled',
      );
    }

    const updatedEvent = await this.db
      .updateTable('events')
      .set({
        status: 'cancelled',
        updated_at: new Date(),
      })
      .where('id', '=', eventId)
      .returningAll()
      .executeTakeFirstOrThrow();

    return {
      message: 'Event cancelled successfully',
      event: updatedEvent,
    };
  }

  async deleteEvent(
    eventId: string,
    user: AuthUser,
  ) {
    await this.getManageableEvent(eventId, user);

    await this.db
      .updateTable('events')
      .set({
        is_deleted: true,
        updated_at: new Date(),
      })
      .where('id', '=', eventId)
      .execute();

    return {
      message: 'Event deleted successfully',
    };
  }
}