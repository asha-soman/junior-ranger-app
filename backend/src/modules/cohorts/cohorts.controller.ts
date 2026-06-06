import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';

import { Request } from 'express';

import { CohortsService } from './cohorts.service';
import { CreateCohortDto } from './dto/create-cohort.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpdateCohortDto } from './dto/update-cohort.dto';
import { AssignRangerDto } from './dto/assign-ranger.dto';
import { CreateInviteCodeDto } from './dto/create-invite-code.dto';
import { JoinCohortDto } from './dto/join-cohort.dto';

@Controller('cohorts')
export class CohortsController {
  constructor(private readonly cohortsService: CohortsService) {}

  //Create a new Cohort
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'ranger')
  async createCohort(
    @Body() dto: CreateCohortDto,
    @Req()
    req: Request & {
      user: {
        userId: string;
        email: string;
        role: string;
      };
    },
  ) {
    return this.cohortsService.createCohort(dto, req.user);
  }

  //Get all Cohorts
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'ranger', 'junior_ranger')
  async findAllCohorts(
    @Req()
    req: Request & {
      user: {
        userId: string;
        email: string;
        role: string;
      };
    },
  ) {
    return this.cohortsService.findAllCohorts(req.user);
  }

  //Get all members of a particular cohort
  @Get(':id/members')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'ranger', 'junior_ranger')
  async findCohortMembers(
    @Param('id') id: string,
    @Req()
    req: Request & {
      user: {
        userId: string;
        email: string;
        role: string;
      };
    },
  ) {
    return this.cohortsService.findCohortMembers(id, req.user);
  }

  //Assigning a ranger to a cohort by Admin
  @Patch(':id/assign-ranger')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async assignRangerToCohort(
    @Param('id') id: string,
    @Body() dto: AssignRangerDto,
  ) {
    return this.cohortsService.assignRangerToCohort(id, dto);
  }

  //Get cohort details by ID
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'ranger', 'junior_ranger')
  async findCohortById(
    @Param('id') id: string,
    @Req()
    req: Request & {
      user: {
        userId: string;
        email: string;
        role: string;
      };
    },
  ) {
    return this.cohortsService.findCohortById(id, req.user);
  }

  //Update Cohort Contraoller method
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'ranger')
  async updateCohort(
    @Param('id') id: string,
    @Body() dto: UpdateCohortDto,
    @Req()
    req: Request & {
      user: {
        userId: string;
        email: string;
        role: string;
      };
    },
  ) {
    return this.cohortsService.updateCohort(id, dto, req.user);
  }

  @Patch(':id/remove-ranger')
  @Roles('admin')
  removeRangerFromCohort(
    @Param('id') cohortId: string,
    @Body('rangerId') rangerId: string,
  ) {
    return this.cohortsService.removeRangerFromCohort(cohortId, rangerId);
  }

  @Post(':id/invite-codes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'ranger')
  async generateInviteCode(
    @Param('id') id: string,
    @Body() dto: CreateInviteCodeDto,
    @Req()
    req: Request & {
      user: {
        userId: string;
        email: string;
        role: string;
      };
    },
  ) {
    return this.cohortsService.generateInviteCode(id, dto, req.user);
  }

  @Post('join')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('junior_ranger')
  async joinCohort(
    @Body() dto: JoinCohortDto,
    @Req()
    req: Request & {
      user: {
        userId: string;
      };
    },
  ) {
    return this.cohortsService.joinCohort(dto.code, req.user.userId);
  }
}
