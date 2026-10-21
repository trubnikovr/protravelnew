import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '@modules/admin';
import { AdminApiMapper } from '@entrypoints/admin/common/mappers/admin-api.mapper';
import type { AdminJwtPayload } from './admin-auth.types';
import type { AdminLoginRequestDto } from './dto/request/admin-login.request.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly admins: AdminService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: AdminLoginRequestDto) {
    const admin = await this.admins.authenticate(dto.login, dto.password);
    if (!admin) {
      throw new UnauthorizedException({
        code: 'ADMIN_AUTH_INVALID_CREDENTIALS',
        message: 'Invalid admin login or password',
      });
    }

    const expiresIn = this.config.getOrThrow<number>(
      'ADMIN_JWT_ACCESS_TTL_SECONDS',
    );
    const payload: AdminJwtPayload = {
      sub: admin.id.toString(),
      login: admin.login.toString(),
      email: admin.email.toString(),
      role: admin.role,
      permissions: [...admin.permissions],
      tokenVersion: admin.tokenVersion,
      scope: 'admin',
    };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>('ADMIN_JWT_ACCESS_SECRET'),
      expiresIn,
    });

    return {
      accessToken,
      tokenType: 'Bearer' as const,
      expiresIn,
      admin: AdminApiMapper.toResponse(admin),
    };
  }

  async revokeAllSessions(adminId: string): Promise<{ revoked: true }> {
    await this.admins.revokeAllSessions(adminId);
    return { revoked: true };
  }
}
