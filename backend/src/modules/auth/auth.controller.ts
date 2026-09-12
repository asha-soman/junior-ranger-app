import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  @Post('resend-code')
  resendCode(@Body() body: { email: string }) {
    return this.authService.resendCode(body.email);
  }

  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('verify-code')
  verifyCode(@Body() body: { email: string; code: string }) {
    return this.authService.verifyCode(body.email, body.code);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request & { user: unknown }) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin-only')
  adminOnly(@Req() req: Request & { user: unknown }) {
    return {
      message: 'Welcome Admin',
      user: req.user,
    };
  }

  @Patch('2fa')
  @UseGuards(JwtAuthGuard)
  updateTwoFactorStatus(
    @Req() req: Request & { user: { userId: string } },
    @Body() body: { enabled: boolean },
  ) {
    return this.authService.updateTwoFactorStatus(
      req.user.userId,
      body.enabled,
    );
  }

  @Post('verify-2fa')
  verifyTwoFactorCode(
    @Body() body: { email: string; code: string },
  ) {
    return this.authService.verifyTwoFactorCode(
      body.email,
      body.code,
    );
  }
}
