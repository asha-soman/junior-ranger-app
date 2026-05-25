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
import { AdventuresService } from './adventures.service';
import { CreateAdventureDto } from './dto/create-adventure.dto';
import { UpdateAdventureDto } from './dto/update-adventure.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AssignAdventureDto } from './dto/assign-adventure.dto';

type AuthUser = {
    userId: string;
    email: string;
    role: 'admin' | 'ranger' | 'junior_ranger';
};

@Controller()
@UseGuards(JwtAuthGuard)
export class AdventuresController {
    constructor(private readonly adventuresService: AdventuresService) { }

    @Post('cohorts/:cohortId/adventures')
    createAdventure(
        @Param('cohortId') cohortId: string,
        @Body() dto: CreateAdventureDto,
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.adventuresService.createAdventure(cohortId, dto, req.user);
    }

    @Get('adventures')
    getAllAdventures(
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.adventuresService.getAllAdventures(req.user);
    }

    @Get('cohorts/:cohortId/adventures')
    getAdventuresByCohort(
        @Param('cohortId') cohortId: string,
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.adventuresService.getAdventuresByCohort(cohortId, req.user);
    }

    @Get('adventures/:id')
    getAdventureById(
        @Param('id') id: string,
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.adventuresService.getAdventureById(id, req.user);
    }

    @Patch('adventures/:id')
    updateAdventure(
        @Param('id') id: string,
        @Body() dto: UpdateAdventureDto,
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.adventuresService.updateAdventure(id, dto, req.user);
    }

    @Post('adventures/assign')
    assignAdventureToCohorts(
        @Body() dto: AssignAdventureDto,
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.adventuresService.assignAdventureToCohorts(dto, req.user);
    }
}