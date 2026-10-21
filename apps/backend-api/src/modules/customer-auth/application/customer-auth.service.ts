import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { CustomerJwtPayload } from '../domain/customer-auth.types';
import {
  CUSTOMER_AUTHENTICATION_ACCOUNT,
  type CustomerAuthenticationAccountPort,
} from './customer-authentication-account.port';

@Injectable()
export class CustomerAuthService {
  constructor(
    @Inject(CUSTOMER_AUTHENTICATION_ACCOUNT)
    private readonly customers: CustomerAuthenticationAccountPort,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async createSession(customerId: string, phone: string) {
    const common = { sub: customerId, phone, scope: 'customer' as const };
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(common),
      this.signRefreshToken(common),
    ]);
    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer' as const,
      expiresIn: this.accessTokenTtl(),
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.verifyRefreshToken(refreshToken);
      const customer = await this.customers.getById(payload.sub);
      if (!customer.phone || customer.status !== 'active') {
        throw new Error('Customer cannot refresh session');
      }
      return this.createSession(customer.id, customer.phone);
    } catch {
      throw new UnauthorizedException({
        code: 'CUSTOMER_AUTH_INVALID_REFRESH_TOKEN',
        message: 'Customer refresh token is invalid or expired',
      });
    }
  }

  private async verifyRefreshToken(token: string): Promise<CustomerJwtPayload> {
    const payload = await this.jwt.verifyAsync<CustomerJwtPayload>(token, {
      secret: this.config.getOrThrow<string>('CUSTOMER_JWT_REFRESH_SECRET'),
    });
    if (payload.type !== 'refresh' || payload.scope !== 'customer') {
      throw new Error('Unexpected customer token');
    }
    return payload;
  }

  private signAccessToken(common: Omit<CustomerJwtPayload, 'type'>) {
    return this.jwt.signAsync(
      { ...common, type: 'access' } satisfies CustomerJwtPayload,
      {
        secret: this.config.getOrThrow<string>('CUSTOMER_JWT_ACCESS_SECRET'),
        expiresIn: this.accessTokenTtl(),
      },
    );
  }

  private signRefreshToken(common: Omit<CustomerJwtPayload, 'type'>) {
    return this.jwt.signAsync(
      { ...common, type: 'refresh' } satisfies CustomerJwtPayload,
      {
        secret: this.config.getOrThrow<string>('CUSTOMER_JWT_REFRESH_SECRET'),
        expiresIn: this.config.getOrThrow<number>(
          'CUSTOMER_JWT_REFRESH_TTL_SECONDS',
        ),
      },
    );
  }

  private accessTokenTtl(): number {
    return this.config.getOrThrow<number>('CUSTOMER_JWT_ACCESS_TTL_SECONDS');
  }
}
