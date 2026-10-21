import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminService } from '@modules/admin';
import type { AdminJwtPayload, AuthenticatedAdmin } from './admin-auth.types';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(config: ConfigService, private readonly admins: AdminService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('ADMIN_JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: AdminJwtPayload): Promise<AuthenticatedAdmin> {
    const admin =
      payload.scope === 'admin'
        ? await this.admins.findById(payload.sub)
        : null;
    if (
      !admin ||
      !admin.isActive() ||
      payload.tokenVersion !== admin.tokenVersion
    ) {
      throw new UnauthorizedException({
        code: 'ADMIN_AUTH_INVALID_ACCESS_TOKEN',
        message: 'Admin access token is invalid',
      });
    }

    return {
      id: admin.id.toString(),
      login: admin.login.toString(),
      email: admin.email.toString(),
      role: admin.role,
      permissions: [...admin.permissions],
    };
  }
}
