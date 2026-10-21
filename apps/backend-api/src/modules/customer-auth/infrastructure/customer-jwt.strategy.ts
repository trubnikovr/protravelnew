import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type {
  AuthenticatedCustomer,
  CustomerJwtPayload,
} from '../domain/customer-auth.types';
import {
  CUSTOMER_AUTHENTICATION_ACCOUNT,
  type CustomerAuthenticationAccountPort,
} from '../application/customer-authentication-account.port';

@Injectable()
export class CustomerJwtStrategy extends PassportStrategy(
  Strategy,
  'customer-jwt',
) {
  constructor(
    config: ConfigService,
    @Inject(CUSTOMER_AUTHENTICATION_ACCOUNT)
    private readonly customers: CustomerAuthenticationAccountPort,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('CUSTOMER_JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: CustomerJwtPayload): Promise<AuthenticatedCustomer> {
    if (payload.type !== 'access' || payload.scope !== 'customer') {
      this.invalidAccessToken();
    }
    try {
      const customer = await this.customers.getById(payload.sub);
      if (!customer.phone || customer.status !== 'active') {
        this.invalidAccessToken();
      }
      return {
        id: customer.id,
        phone: customer.phone,
        firstName: customer.firstName,
        lastName: customer.lastName,
      };
    } catch (error) {
      if (error instanceof NotFoundException) this.invalidAccessToken();
      throw error;
    }
  }

  private invalidAccessToken(): never {
    throw new UnauthorizedException({
      code: 'CUSTOMER_AUTH_INVALID_ACCESS_TOKEN',
      message: 'Customer access token is invalid',
    });
  }
}
