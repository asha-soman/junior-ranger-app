import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UsersService } from './users.service';

type AuthUser = {
  userId: string;
  email: string;
  role:
    | 'admin'
    | 'ranger'
    | 'junior_ranger';
};

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get('me')
  getMyProfile(
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.usersService.getMyProfile(
      req.user.userId,
    );
  }
}