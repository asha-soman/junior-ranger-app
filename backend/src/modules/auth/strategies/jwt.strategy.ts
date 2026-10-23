import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DatabaseService } from '../../../database/database.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: 'admin' | 'ranger' | 'junior_ranger';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly db: DatabaseService,
  ) {
    const secret = configService.get('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.db
      .selectFrom('users')
      .select([
        'id',
        'email',
        'role',
        'is_active',
        'is_deleted',
        'two_factor_enabled',
      ])
      .where('id', '=', payload.sub)
      .executeTakeFirst();

    if (!user || !user.is_active || user.is_deleted) {
      throw new UnauthorizedException('User account is not available');
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      two_factor_enabled: user.two_factor_enabled,
    };
  }
}