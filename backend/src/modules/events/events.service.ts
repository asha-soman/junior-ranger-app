import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DatabaseService } from '../../database/database.service';
import type { AttendanceStatus} from '../../database/database.types';
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

    if (user.role === 'admin') {
      return cohort;
    }

    if (user.role === 'ranger') {
      const membership = await this.db
        .selectFrom('cohort_members')
        .select(['id'])
        .where('user_id', '=', user.userId)
        .where('cohort_id', '=', cohortId)
        .where('role', '=', 'ranger')
        .where('is_deleted', '=', false)
        .executeTakeFirst();

      if (!membership) {
        throw new ForbiddenException(
          'You do not have permission to manage events for this cohort',
        );
      }

      return cohort;
    }

    throw new ForbiddenException(
      'You do not have permission to manage events',
    );
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

  async getEvents(user: AuthUser) {
  // Admin can see all non-deleted events
  if (user.role === 'admin') {
    return this.db
      .selectFrom('events')
      .innerJoin('cohorts', 'cohorts.id', 'events.cohort_id')
      .select([
        'events.id',
        'events.title',
        'events.description',
        'events.location',
        'events.start_time',
        'events.end_time',
        'events.registration_deadline',
        'events.capacity',
        'events.status',
        'events.cohort_id',
        'events.created_by_user_id',
        'events.is_deleted',
        'events.created_at',
        'events.updated_at',
        'cohorts.name as cohort_name',
      ])
      .where('events.is_deleted', '=', false)
      .orderBy('events.start_time', 'asc')
      .execute();
  }

  // Ranger can see events belonging to cohorts they manage.
  if (user.role === 'ranger') {
    return this.db
      .selectFrom('events')
      .innerJoin('cohorts', 'cohorts.id', 'events.cohort_id')
      .innerJoin(
      'cohort_members',
      'cohort_members.cohort_id',
      'events.cohort_id',
      )
      .select([
        'events.id',
        'events.title',
        'events.description',
        'events.location',
        'events.start_time',
        'events.end_time',
        'events.registration_deadline',
        'events.capacity',
        'events.status',
        'events.cohort_id',
        'events.created_by_user_id',
        'events.is_deleted',
        'events.created_at',
        'events.updated_at',
        'cohorts.name as cohort_name',
      ])
      .where('cohort_members.user_id', '=', user.userId)
      .where('cohort_members.role', '=', 'ranger')
      .where('cohort_members.is_deleted', '=', false)
      .where('events.is_deleted', '=', false)
      .orderBy('events.start_time', 'asc')
      .execute();
  }

  // Juniors can only see published events belonging to cohorts they are a member of.
  return this.db
    .selectFrom('events')
    .innerJoin('cohorts', 'cohorts.id', 'events.cohort_id')
    .innerJoin(
      'cohort_members',
      'cohort_members.cohort_id',
      'events.cohort_id',
    )
    .select([
      'events.id',
      'events.title',
      'events.description',
      'events.location',
      'events.start_time',
      'events.end_time',
      'events.registration_deadline',
      'events.capacity',
      'events.status',
      'events.cohort_id',
      'events.created_by_user_id',
      'events.is_deleted',
      'events.created_at',
      'events.updated_at',
      'cohorts.name as cohort_name',
    ])
    .where('cohort_members.user_id', '=', user.userId)
    .where('cohort_members.role', '=', 'junior_ranger')
    .where('cohort_members.is_deleted', '=', false)
    .where('events.is_deleted', '=', false)
    .where('events.status', '=', 'published')
    .where('events.end_time', '>=', new Date())
    .orderBy('events.start_time', 'asc')
    .execute();
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

  async getEventDetails(
    eventId: string,
    user: AuthUser,
  ) {
    const event = await this.db
      .selectFrom('events')
      .innerJoin(
        'cohorts',
        'cohorts.id',
        'events.cohort_id',
      )
      .innerJoin(
        'users as organiser',
        'organiser.id',
        'events.created_by_user_id',
      )
      .select([
        'events.id',
        'events.title',
        'events.description',
        'events.location',
        'events.start_time',
        'events.end_time',
        'events.registration_deadline',
        'events.capacity',
        'events.status',
        'events.cohort_id',
        'events.created_by_user_id',
        'events.created_at',
        'events.updated_at',

        'cohorts.name as cohort_name',

        'organiser.name as organiser_name',
        'organiser.email as organiser_email',
        'organiser.role as organiser_role',
      ])
      .where('events.id', '=', eventId)
      .where('events.is_deleted', '=', false)
      .executeTakeFirst();

    if (!event) {
      throw new NotFoundException(
        'Event not found',
      );
    }

    if (user.role === 'ranger') {
      const membership = await this.db
        .selectFrom('cohort_members')
        .select('id')
        .where('user_id', '=', user.userId)
        .where(
          'cohort_id',
          '=',
          event.cohort_id,
        )
        .where('role', '=', 'ranger')
        .where('is_deleted', '=', false)
        .executeTakeFirst();

      if (!membership) {
        throw new ForbiddenException(
          'You do not have access to this event',
        );
      }
    }

    if (user.role === 'junior_ranger') {
      const membership = await this.db
        .selectFrom('cohort_members')
        .select('id')
        .where('user_id', '=', user.userId)
        .where(
          'cohort_id',
          '=',
          event.cohort_id,
        )
        .where('role', '=', 'junior_ranger')
        .where('is_deleted', '=', false)
        .executeTakeFirst();

      if (!membership) {
        throw new ForbiddenException(
          'You do not have access to this event',
        );
      }

      if (event.status !== 'published') {
        throw new ForbiddenException(
          'This event is not available',
        );
      }
    }

    /*Count active registrations*/
    const registrationCountResult =
      await this.db
        .selectFrom('event_registrations')
        .select(({ fn }) =>
          fn.count<number>('id').as('count'),
        )
        .where('event_id', '=', event.id)
        .where('status', '=', 'registered')
        .executeTakeFirst();

    const registeredCount = Number(
      registrationCountResult?.count ?? 0,
    );

    /*Get Junior Ranger's registration status for this event*/
    let userRegistrationStatus:
      | 'registered'
      | 'cancelled'
      | null = null;

    if (user.role === 'junior_ranger') {
      const registration = await this.db
        .selectFrom('event_registrations')
        .select([
          'status',
          'registered_at',
          'cancelled_at',
        ])
        .where('event_id', '=', event.id)
        .where(
          'junior_ranger_user_id',
          '=',
          user.userId,
        )
        .executeTakeFirst();

      userRegistrationStatus =
        registration?.status ?? null;
    }

    /*Calculate remaining capacity*/
    const spotsAvailable =
      event.capacity === null
        ? null
        : Math.max(
            event.capacity - registeredCount,
            0,
          );

    /*Determine whether registration is currently available*/
    const now = new Date();

    const registrationOpen =
      event.status === 'published' &&
      event.start_time > now &&
      (
        event.registration_deadline === null ||
        event.registration_deadline >= now
      ) &&
      (
        event.capacity === null ||
        registeredCount < event.capacity
      );

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      location: event.location,

      start_time: event.start_time,
      end_time: event.end_time,
      registration_deadline:
        event.registration_deadline,

      capacity: event.capacity,
      status: event.status,

      cohort: {
        id: event.cohort_id,
        name: event.cohort_name,
      },

      organiser: {
        id: event.created_by_user_id,
        name: event.organiser_name,
        email: event.organiser_email,
        role: event.organiser_role,
      },

      registration: {
        registered_count: registeredCount,
        spots_available: spotsAvailable,
        registration_open: registrationOpen,
        user_status: userRegistrationStatus,
      },

      created_at: event.created_at,
      updated_at: event.updated_at,
    };
  }

  async registerForEvent(
    eventId: string,
    user: AuthUser,
  ) {
    if (user.role !== 'junior_ranger') {
      throw new ForbiddenException(
        'Only Junior Rangers can register for events',
      );
    }

    return this.db.transaction().execute(
      async (trx) => {
        /*Lock the event while checking capacity*/
        const event = await trx
          .selectFrom('events')
          .selectAll()
          .where('id', '=', eventId)
          .where('is_deleted', '=', false)
          .forUpdate()
          .executeTakeFirst();

        if (!event) {
          throw new NotFoundException(
            'Event not found',
          );
        }

        if (event.status !== 'published') {
          throw new BadRequestException(
            'Registration is not available for this event',
          );
        }

        const membership = await trx
          .selectFrom('cohort_members')
          .select('id')
          .where(
            'user_id',
            '=',
            user.userId,
          )
          .where(
            'cohort_id',
            '=',
            event.cohort_id,
          )
          .where(
            'role',
            '=',
            'junior_ranger',
          )
          .where(
            'is_deleted',
            '=',
            false,
          )
          .executeTakeFirst();

        if (!membership) {
          throw new ForbiddenException(
            'You cannot register for an event from another cohort',
          );
        }

        const now = new Date();

        /*Event already started*/
        if (event.start_time <= now) {
          throw new BadRequestException(
            'Registration is closed because the event has already started',
          );
        }

        /*Registration deadline passed*/
        if (
          event.registration_deadline &&
          event.registration_deadline < now
        ) {
          throw new BadRequestException(
            'The registration deadline has passed',
          );
        }

        /*Check existing registration*/
        const existingRegistration =
          await trx
            .selectFrom(
              'event_registrations',
            )
            .selectAll()
            .where(
              'event_id',
              '=',
              eventId,
            )
            .where(
              'junior_ranger_user_id',
              '=',
              user.userId,
            )
            .executeTakeFirst();

        if (
          existingRegistration?.status ===
          'registered'
        ) {
          throw new BadRequestException(
            'You are already registered for this event',
          );
        }

        /*Count active registrations*/
        const countResult = await trx
          .selectFrom(
            'event_registrations',
          )
          .select(({ fn }) =>
            fn
              .count<number>('id')
              .as('count'),
          )
          .where(
            'event_id',
            '=',
            eventId,
          )
          .where(
            'status',
            '=',
            'registered',
          )
          .executeTakeFirst();

        const registeredCount = Number(
          countResult?.count ?? 0,
        );

        /*Capacity check*/
        if (
          event.capacity !== null &&
          registeredCount >=
            event.capacity
        ) {
          throw new BadRequestException(
            'This event has reached its maximum capacity',
          );
        }

        /*
        * Previously cancelled registration:
        * reactivate row instead of creating another one.
        */
        if (existingRegistration) {
          return trx
            .updateTable(
              'event_registrations',
            )
            .set({
              status: 'registered',
              registered_at:
                new Date(),
              cancelled_at: null,
              updated_at:
                new Date(),
            })
            .where(
              'id',
              '=',
              existingRegistration.id,
            )
            .returningAll()
            .executeTakeFirstOrThrow();
        }

        /*
        * First registration.
        */
        return trx
          .insertInto(
            'event_registrations',
          )
          .values({
            event_id: eventId,

            junior_ranger_user_id:
              user.userId,

            status: 'registered',

            registered_at:
              new Date(),

            cancelled_at: null,

            created_at:
              new Date(),

            updated_at:
              new Date(),
          })
          .returningAll()
          .executeTakeFirstOrThrow();
      },
    );
  }

  async cancelRegistration(
    eventId: string,
    user: AuthUser,
  ) {
    if (user.role !== 'junior_ranger') {
      throw new ForbiddenException(
        'Only Junior Rangers can cancel event registrations',
      );
    }

    const event = await this.db
      .selectFrom('events')
      .select([
        'id',
        'start_time',
        'is_deleted',
      ])
      .where('id', '=', eventId)
      .where('is_deleted', '=', false)
      .executeTakeFirst();

    if (!event) {
      throw new NotFoundException(
        'Event not found',
      );
    }

    if (
      event.start_time <= new Date()
    ) {
      throw new BadRequestException(
        'Registration cannot be cancelled after the event has started',
      );
    }

    const registration =
      await this.db
        .selectFrom(
          'event_registrations',
        )
        .selectAll()
        .where(
          'event_id',
          '=',
          eventId,
        )
        .where(
          'junior_ranger_user_id',
          '=',
          user.userId,
        )
        .executeTakeFirst();

    if (!registration) {
      throw new NotFoundException(
        'Registration not found',
      );
    }

    if (
      registration.status ===
      'cancelled'
    ) {
      throw new BadRequestException(
        'This registration has already been cancelled',
      );
    }

    return this.db
      .updateTable(
        'event_registrations',
      )
      .set({
        status: 'cancelled',
        cancelled_at: new Date(),
        updated_at: new Date(),
      })
      .where(
        'id',
        '=',
        registration.id,
      )
      .returningAll()
      .executeTakeFirstOrThrow();
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

    // Prevent capacity from being reduced below
    // the current number of registered Junior Rangers.
    if (
      dto.capacity !== undefined &&
      dto.capacity !== null
    ) {
      const registrationCountResult =
        await this.db
          .selectFrom('event_registrations')
          .select(({ fn }) =>
            fn.count<number>('id').as('count'),
          )
          .where('event_id', '=', eventId)
          .where('status', '=', 'registered')
          .executeTakeFirst();

      const registeredCount = Number(
        registrationCountResult?.count ?? 0,
      );

      if (dto.capacity < registeredCount) {
        throw new BadRequestException(
          `Capacity cannot be lower than the current number of registered participants (${registeredCount}).`,
        );
      }
    }

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

  async getEventParticipants(
    eventId: string,
    user: AuthUser,
  ) {
    await this.getManageableEvent(
      eventId,
      user,
    );

    const participants = await this.db
      .selectFrom('event_registrations')
      .innerJoin(
        'users',
        'users.id',
        'event_registrations.junior_ranger_user_id',
      )
      .leftJoin(
        'event_attendance',
        'event_attendance.registration_id',
        'event_registrations.id',
      )
      .select([
        'event_registrations.id as registration_id',
        'event_registrations.event_id',
        'event_registrations.junior_ranger_user_id',
        'event_registrations.status as registration_status',
        'event_registrations.registered_at',

        'users.name as junior_name',
        'users.email as junior_email',

        'event_attendance.id as attendance_id',
        'event_attendance.status as attendance_status',
        'event_attendance.marked_at',
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
      .orderBy(
        'users.name',
        'asc',
      )
      .execute();

    return {
      event_id: eventId,
      participant_count:
        participants.length,
      participants: participants.map(
        (participant) => ({
          ...participant,

          attendance_status:
            participant.attendance_status ?? 'not_marked',
        }),
      ),
    };
  }

  async updateAttendance(
    eventId: string,
    registrationId: string,
    status: AttendanceStatus,
    user: AuthUser,
  ) {
    await this.getManageableEvent(
      eventId,
      user,
    );

    /*Find registration*/
    const registration = await this.db
      .selectFrom('event_registrations')
      .selectAll()
      .where(
        'id',
        '=',
        registrationId,
      )
      .where(
        'event_id',
        '=',
        eventId,
      )
      .executeTakeFirst();

    if (!registration) {
      throw new NotFoundException(
        'Event registration not found',
      );
    }

    if (
      registration.status !==
      'registered'
    ) {
      throw new BadRequestException(
        'Only registered participants can have attendance recorded',
      );
    }

    /*Check whether attendance already exists*/
    const existingAttendance =
      await this.db
        .selectFrom('event_attendance')
        .selectAll()
        .where(
          'registration_id',
          '=',
          registrationId,
        )
        .executeTakeFirst();

    /*Update existing record*/
    if (existingAttendance) {
      const attendance =
        await this.db
          .updateTable(
            'event_attendance',
          )
          .set({
            status,
            marked_by_user_id:
              user.userId,
            marked_at: new Date(),
            updated_at: new Date(),
          })
          .where(
            'id',
            '=',
            existingAttendance.id,
          )
          .returningAll()
          .executeTakeFirstOrThrow();

      return {
        message:
          'Attendance updated successfully',
        attendance,
      };
    }

    /*Create record, if there's one*/
    const attendance = await this.db
      .insertInto('event_attendance')
      .values({
        registration_id:
          registrationId,

        status,

        marked_by_user_id:
          user.userId,

        marked_at: new Date(),

        created_at: new Date(),
        updated_at: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return {
      message:
        'Attendance recorded successfully',
      attendance,
    };
  }

  async publishEvent(
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

    await this.validateCohortPermission(
      event.cohort_id,
      user,
    );

    if (event.status === 'published') {
      throw new BadRequestException(
        'Event is already published',
      );
    }

    if (event.status === 'completed') {
      throw new BadRequestException(
        'A completed event cannot be published again',
      );
    }

    const updatedEvent = await this.db
      .updateTable('events')
      .set({
        status: 'published',
        updated_at: new Date(),
      })
      .where('id', '=', eventId)
      .where('is_deleted', '=', false)
      .returningAll()
      .executeTakeFirstOrThrow();

    return updatedEvent;
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