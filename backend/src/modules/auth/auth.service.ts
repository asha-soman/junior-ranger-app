import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../../database/database.service';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { randomUUID } from 'crypto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  async resendCode(email: string) {
    const now = Date.now();
    const lastResend = this.resendTimestamps[email];

    if (lastResend && now - lastResend < 60000) {
      throw new BadRequestException(
        'Please wait 60 seconds before requesting another verification code',
      );
    }

  const code = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await this.db
    .deleteFrom('auth_challenges')
    .where('email', '=', email)
    .execute();

  await this.db
    .insertInto('auth_challenges')
    .values({
      id: randomUUID(),
      email,
      code,
      expires_at: expiresAt,
      created_at: new Date(),
    })
    .execute();

  this.resendTimestamps[email] = now;

  await this.emailService.sendVerificationCode(email, code);

    return {
      message: 'Verification code resent successfully',
    };
  }

  private resendTimestamps: Record<string, number> = {};
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  // ============================================================
  // SIGN UP
  // ============================================================

  async signup(dto: SignupDto) {
    const { email, name, password, role } = dto;

    const existingUser = await this.db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const isRanger = role === 'ranger';

    const newUser = await this.db
      .insertInto('users')
      .values({
        id: randomUUID(),
        email,
        name,
        role,
        password_hash: passwordHash,
        is_active: !isRanger,
        approval_status: isRanger ? 'pending' : 'approved',
        is_deleted: false,
        email_verified: false,

        two_factor_enabled: false,
        two_factor_code: null,
        two_factor_expiry: null,

        total_xp: 0,
        current_level: 1,
      })
      .returningAll()
      .executeTakeFirst();

    // Email verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Remove any previous verification challenge for this email
    await this.db
      .deleteFrom('auth_challenges')
      .where('email', '=', email)
      .execute();

    // Store the new verification challenge
    await this.db
      .insertInto('auth_challenges')
      .values({
        id: randomUUID(),
        email,
        code,
        expires_at: expiresAt,
        created_at: new Date(),
      })
      .execute();

    await this.emailService.sendVerificationCode(email, code);

    return {
      message: isRanger
        ? 'Signup successful. Awaiting admin approval.'
        : 'Signup successful',

      user: {
        id: newUser?.id,
        email: newUser?.email,
        name: newUser?.name,
        role: newUser?.role,
        avatar_url: newUser?.avatar_url,
        is_active: newUser?.is_active,
        approval_status: newUser?.approval_status,
        created_at: newUser?.created_at,
        updated_at: newUser?.updated_at,
      },
    };
  }

  // ============================================================
  // LOGIN
  // ============================================================

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    if (!user || !user.password_hash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.email_verified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    if (!user.is_active || user.approval_status !== 'approved') {
      throw new UnauthorizedException(
        user.approval_status !== 'approved'
          ? 'Your account is pending admin approval'
          : 'Your account is not active',
      );
    }

    // ==========================================================
    // 2FA ENABLED
    // ==========================================================

    if (user.two_factor_enabled) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // Code expires after 5 minutes
      const expiry = new Date(Date.now() + 5 * 60 * 1000);

      await this.db
        .updateTable('users')
        .set({
          two_factor_code: code,
          two_factor_expiry: expiry,
          updated_at: new Date(),
        })
        .where('id', '=', user.id)
        .execute();

      // Temporary testing output
      console.log('=================================');
      console.log('2FA LOGIN CODE');
      console.log(`Email: ${user.email}`);
      console.log(`Code : ${code}`);
      console.log('=================================');

      await this.emailService.sendTwoFactorCode(user.email, code);

      return {
        message: 'Two-factor authentication required',
        requires2FA: true,
        email: user.email,
      };
    }

    // ==========================================================
    // NORMAL LOGIN - 2FA DISABLED
    // ==========================================================

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      message: 'Login successful',
      requires2FA: false,
      access_token: accessToken,

      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar_url: user.avatar_url,
        is_active: user.is_active,
        approval_status: user.approval_status,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    };
  }

  // ============================================================
  // VERIFY SIGNUP EMAIL
  // ============================================================

  async verifyCode(email: string, code: string) {
    const challenge = await this.db
      .selectFrom('auth_challenges')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    if (!challenge) {
      throw new BadRequestException(
        'No verification code found',
      );
    }

    if (
      new Date().getTime() >
      new Date(challenge.expires_at).getTime()
    ) {
      await this.db
        .deleteFrom('auth_challenges')
        .where('id', '=', challenge.id)
        .execute();

      throw new BadRequestException(
        'Verification code has expired',
      );
    }

    if (challenge.code !== code) {
      throw new BadRequestException(
        'Invalid verification code',
      );
    }

    await this.db
      .updateTable('users')
      .set({
        email_verified: true,
        updated_at: new Date(),
      })
      .where('email', '=', email)
      .execute();

    await this.db
      .deleteFrom('auth_challenges')
      .where('id', '=', challenge.id)
      .execute();

    console.log(`Email ${email} verified successfully`);

    return {
      message: 'Email verified successfully',
    };
  }

  // ============================================================
  // ENABLE / DISABLE 2FA
  // ============================================================

  async updateTwoFactorStatus(userId: string, enabled: boolean) {
    const updatedUser = await this.db
      .updateTable('users')
      .set({
        two_factor_enabled: enabled,

        // Clear any previous code whenever setting changes
        two_factor_code: null,
        two_factor_expiry: null,

        updated_at: new Date(),
      })
      .where('id', '=', userId)
      .returning(['id', 'email', 'two_factor_enabled'])
      .executeTakeFirst();

    if (!updatedUser) {
      throw new BadRequestException('User not found');
    }

    return {
      message: enabled
        ? 'Two-factor authentication enabled'
        : 'Two-factor authentication disabled',

      two_factor_enabled: updatedUser.two_factor_enabled,
    };
  }

  // ============================================================
  // VERIFY 2FA CODE
  // ============================================================

  async verifyTwoFactorCode(email: string, code: string) {
    const user = await this.db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.two_factor_enabled) {
      throw new BadRequestException('Two-factor authentication is not enabled');
    }

    if (!user.two_factor_code || !user.two_factor_expiry) {
      throw new BadRequestException('No two-factor authentication code found');
    }

    // Check expiry BEFORE validating the code
    if (new Date().getTime() > new Date(user.two_factor_expiry).getTime()) {
      // Clear expired code
      await this.db
        .updateTable('users')
        .set({
          two_factor_code: null,
          two_factor_expiry: null,
          updated_at: new Date(),
        })
        .where('id', '=', user.id)
        .execute();

      throw new UnauthorizedException(
        'Two-factor authentication code has expired',
      );
    }

    if (user.two_factor_code !== code) {
      throw new UnauthorizedException('Invalid two-factor authentication code');
    }

    // Clear code after successful verification
    await this.db
      .updateTable('users')
      .set({
        two_factor_code: null,
        two_factor_expiry: null,
        updated_at: new Date(),
      })
      .where('id', '=', user.id)
      .execute();

    // Login is now fully authenticated
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      message: 'Two-factor authentication successful',

      access_token: accessToken,

      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar_url: user.avatar_url,
        is_active: user.is_active,
        approval_status: user.approval_status,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    };
  }
}
