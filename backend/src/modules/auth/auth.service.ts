import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../../database/database.service';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { randomUUID } from 'crypto';

@Injectable()

export class AuthService {

  async resendCode(email: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  this.verificationCodes[email] = code;

  console.log(`Resent code for ${email}: ${code}`);

  return {
    message: 'Verification code resent successfully',
  };
}

  private verificationCodes: Record<string, string> = {};
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

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
      })
      .returningAll()
      .executeTakeFirst();

      //const code = Math.floor(100000 + Math.random() * 900000).toString();
      //this.verificationCodes[email] = code;
      //console.log(`Verification code for ${email}: ${code}`);

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

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

      // TEMP: auto-approve for testing
      //await this.db
      //.updateTable('users')
      //.set({
      //  is_active: true,
      //  approval_status: 'approved',
  //})
     // .where('email', '=', email)
      //.execute();

    if (!user || !user.password_hash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.verificationCodes[email] = code;
    console.log(`Verification code for ${email}: ${code}`);

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.is_active || user.approval_status !== 'approved') {
      throw new UnauthorizedException(
        user.approval_status !== 'approved'
          ? 'Your account is pending admin approval'
          : 'Your account is not active',
      );
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      message: 'Login successful',
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
  async verifyCode(email: string, code: string) {
  const storedCode = this.verificationCodes[email];

  if (!storedCode) {
    throw new BadRequestException('No verification code found');
  }

  if (storedCode !== code) {
    throw new BadRequestException('Invalid verification code');
  }

  // update DB
  //await this.db
    //.updateTable('users')
    //.where('email', '=', email)
    //.execute();

    console.log(`Email ${email} verified successfully`);

  // remove code after success
  delete this.verificationCodes[email];

  return {
    message: 'Email verified successfully',
  };
}
}
