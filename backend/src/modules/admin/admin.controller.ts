import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('rangers/pending')
  getPendingRangers(@Query('name') name?: string) {
    return this.adminService.getPendingRangers(name);
  }
  @Get('rangers/:id')
  getRangerRequestById(@Param('id') id: string) {
    return this.adminService.getRangerRequestById(id);
  }

  @Patch('rangers/:id/approve')
  approveRanger(@Param('id') id: string) {
    return this.adminService.approveRanger(id);
  }

  @Patch('rangers/:id/reject')
  rejectRanger(@Param('id') id: string) {
    return this.adminService.rejectRanger(id);
  }

  @Get('users')
  getAllUsers(
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('name') name?: string,
  ) {
    return this.adminService.getAllUsers(role, status, name);
  }

  @Get('cohorts')
  getAllCohorts() {
    return this.adminService.getAllCohorts();
  }

  @Get('cohorts/:id')
  getCohortById(@Param('id') id: string) {
    return this.adminService.getCohortById(id);
  }
  
}