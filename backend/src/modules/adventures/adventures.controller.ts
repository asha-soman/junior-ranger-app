import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { AdventuresService } from './adventures.service';

import { CreateAdventureDto } from './dto/create-adventure.dto';
import { UpdateAdventureDto } from './dto/update-adventure.dto';
import { AssignAdventureDto } from './dto/assign-adventure.dto';

import { CreateAdventureTaskDto } from './dto/create-adventure-task.dto';
import { UpdateAdventureTaskDto } from './dto/update-adventure-task.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

type AuthUser = {
  userId: string;
  email: string;
  role:
    | 'admin'
    | 'ranger'
    | 'junior_ranger';
};

@Controller()
@UseGuards(JwtAuthGuard)
export class AdventuresController {
  constructor(
    private readonly adventuresService:
      AdventuresService,
  ) {}

  @Post('cohorts/:cohortId/adventures')
  createAdventure(
    @Param('cohortId')
    cohortId: string,

    @Body()
    dto: CreateAdventureDto,

    @Req()
    req: Request & {
      user: AuthUser;
    },
  ) {
    return this.adventuresService.createAdventure(
      cohortId,
      dto,
      req.user,
    );
  }

  @Get('adventures')
  getAllAdventures(
    @Req()
    req: Request & {
      user: AuthUser;
    },
  ) {
    return this.adventuresService.getAllAdventures(
      req.user,
    );
  }

  @Get('cohorts/:cohortId/adventures')
  getAdventuresByCohort(
    @Param('cohortId')
    cohortId: string,

    @Req()
    req: Request & {
      user: AuthUser;
    },
  ) {
    return this.adventuresService.getAdventuresByCohort(
      cohortId,
      req.user,
    );
  }

  @Get('adventures/:id')
  getAdventureById(
    @Param('id')
    id: string,

    @Req()
    req: Request & {
      user: AuthUser;
    },
  ) {
    return this.adventuresService.getAdventureById(
      id,
      req.user,
    );
  }

  @Patch('adventures/:id')
  updateAdventure(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateAdventureDto,

    @Req()
    req: Request & {
      user: AuthUser;
    },
  ) {
    return this.adventuresService.updateAdventure(
      id,
      dto,
      req.user,
    );
  }

  /*
   * =============================
   * ADVENTURE TASK ROUTES
   * =============================
   */

  @Post('adventures/:id/tasks')
  createAdventureTask(
    @Param('id')
    adventureId: string,

    @Body()
    dto: CreateAdventureTaskDto,

    @Req()
    req: Request & {
      user: AuthUser;
    },
  ) {
    return this.adventuresService.createAdventureTask(
      adventureId,
      dto,
      req.user,
    );
  }

  @Get('adventures/:id/tasks')
  getAdventureTasks(
    @Param('id')
    adventureId: string,

    @Req()
    req: Request & {
      user: AuthUser;
    },
  ) {
    return this.adventuresService.getAdventureTasks(
      adventureId,
      req.user,
    );
  }

  @Patch('adventure-tasks/:taskId')
  updateAdventureTask(
    @Param('taskId')
    taskId: string,

    @Body()
    dto: UpdateAdventureTaskDto,

    @Req()
    req: Request & {
      user: AuthUser;
    },
  ) {
    return this.adventuresService.updateAdventureTask(
      taskId,
      dto,
      req.user,
    );
  }

  @Delete('adventure-tasks/:taskId')
  deleteAdventureTask(
    @Param('taskId')
    taskId: string,

    @Req()
    req: Request & {
      user: AuthUser;
    },
  ) {
    return this.adventuresService.deleteAdventureTask(
      taskId,
      req.user,
    );
  }

  /*
   * =============================
   * ASSIGNMENT
   * =============================
   */

  @Post('adventures/assign')
  assignAdventureToCohorts(
    @Body()
    dto: AssignAdventureDto,

    @Req()
    req: Request & {
      user: AuthUser;
    },
  ) {
    return this.adventuresService.assignAdventureToCohorts(
      dto,
      req.user,
    );
  }
}