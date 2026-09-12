import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

type AuthUser = {
  userId: string;
  email: string;
  role: 'admin' | 'ranger' | 'junior_ranger';
};

@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
  ) {}

  // Event listing
  @Get()
  @Roles('admin', 'ranger', 'junior_ranger')
  getEvents(
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.eventsService.getEvents(req.user);
  }

  // Create event
  @Post()
  @Roles('admin', 'ranger')
  createEvent(
    @Body() dto: CreateEventDto,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.eventsService.createEvent(
      dto,
      req.user,
    );
  }

  // Event Details
  @Get(':id/details')
  @Roles('admin', 'ranger', 'junior_ranger')
  getEventDetails(
    @Param('id') id: string,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.eventsService.getEventDetails(
      id,
      req.user,
    );
  }

  // Event management details
  @Get(':id')
  @Roles('admin', 'ranger')
  getEventForManagement(
    @Param('id') id: string,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.eventsService.getEventForManagement(
      id,
      req.user,
    );
  }

  // Update event
  @Patch(':id')
  @Roles('admin', 'ranger')
  updateEvent(
    @Param('id') id: string,
    @Body() dto: UpdateEventDto,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.eventsService.updateEvent(
      id,
      dto,
      req.user,
    );
  }

  // Publish event
  @Patch(':id/publish')
  @Roles('admin', 'ranger')
  publishEvent(
    @Param('id') id: string,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.eventsService.publishEvent(
      id,
      req.user,
    );
  }

  // Cancel event
  @Patch(':id/cancel')
  @Roles('admin', 'ranger')
  cancelEvent(
    @Param('id') id: string,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.eventsService.cancelEvent(
      id,
      req.user,
    );
  }

  // Soft delete event
  @Delete(':id')
  @Roles('admin', 'ranger')
  deleteEvent(
    @Param('id') id: string,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.eventsService.deleteEvent(
      id,
      req.user,
    );
  }

  // Register for an event
  @Post(':id/register')
  @Roles('junior_ranger')
  registerForEvent(
    @Param('id') id: string,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.eventsService.registerForEvent(
      id,
      req.user,
    );
  }

  // Cancel registration for an event
  @Patch(':id/registration/cancel')
  @Roles('junior_ranger')
  cancelRegistration(
    @Param('id') id: string,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.eventsService.cancelRegistration(
      id,
      req.user,
    );
  }

  // Get event participants
  @Get(':id/participants')
  @Roles('admin', 'ranger')
  getEventParticipants(
    @Param('id') id: string,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.eventsService.getEventParticipants(
      id,
      req.user,
    );
  }

  @Patch(':eventId/attendance/:registrationId')
  @Roles('admin', 'ranger')
  updateAttendance(
    @Param('eventId') eventId: string,
    @Param('registrationId') registrationId: string,
    @Body() dto: UpdateAttendanceDto,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.eventsService.updateAttendance(
      eventId,
      registrationId,
      dto.status,
      req.user,
    );
  }



}