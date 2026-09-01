import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateTaskCompletionDto } from './dto/create-task-completion.dto';
import { ReviewTaskCompletionDto } from './dto/review-task-completion.dto';

type AuthUser = {
  userId: string;
  email: string;
  role: 'admin' | 'ranger' | 'junior_ranger';
};

@Controller()
@UseGuards(JwtAuthGuard)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post('adventures/:adventureId/submissions')
  createSubmission(
    @Param('adventureId') adventureId: string,
    @Body() dto: CreateSubmissionDto,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.submissionsService.createSubmission(adventureId, dto, req.user);
  }

  @Get('adventures/:adventureId/submissions')
  getSubmissionsForAdventure(
    @Param('adventureId') adventureId: string,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.submissionsService.getSubmissionsForAdventure(
      adventureId,
      req.user,
    );
  }

  @Patch('submissions/:submissionId/review')
  reviewSubmission(
    @Param('submissionId') submissionId: string,
    @Body() dto: ReviewSubmissionDto,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.submissionsService.reviewSubmission(
      submissionId,
      dto,
      req.user,
    );
  }

  @Get('adventures/:adventureId/my-submission')
  getMySubmission(
    @Param('adventureId') adventureId: string,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.submissionsService.getMySubmission(adventureId, req.user);
  }

  @Patch('submissions/:submissionId')
  updateMySubmission(
    @Param('submissionId') submissionId: string,
    @Body() dto: CreateSubmissionDto,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.submissionsService.updateMySubmission(
      submissionId,
      dto,
      req.user,
    );
  }

  @Post('tasks/:taskId/completions')
  createTaskCompletion(
    @Param('taskId') taskId: string,
    @Body() dto: CreateTaskCompletionDto,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.submissionsService.createTaskCompletion(taskId, dto, req.user);
  }

  @Get('tasks/:taskId/completions')
  getTaskCompletions(
    @Param('taskId') taskId: string,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.submissionsService.getTaskCompletions(taskId, req.user);
  }

  @Patch('task-completions/:completionId/review')
  reviewTaskCompletion(
    @Param('completionId') completionId: string,
    @Body() dto: ReviewTaskCompletionDto,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.submissionsService.reviewTaskCompletion(
      completionId,
      dto,
      req.user,
    );
  }
}
