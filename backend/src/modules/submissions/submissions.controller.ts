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

type AuthUser = {
    userId: string;
    email: string;
    role: 'admin' | 'ranger' | 'junior_ranger';
};

@Controller()
@UseGuards(JwtAuthGuard)
export class SubmissionsController {
    constructor(private readonly submissionsService: SubmissionsService) { }

    @Post('adventures/:adventureId/submissions')
    createSubmission(
        @Param('adventureId') adventureId: string,
        @Body() dto: CreateSubmissionDto,
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.submissionsService.createSubmission(
            adventureId,
            dto,
            req.user,
        );
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
}