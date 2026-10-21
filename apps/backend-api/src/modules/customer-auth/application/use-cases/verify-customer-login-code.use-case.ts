import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CustomerAuthService } from '../customer-auth.service';
import {
  CUSTOMER_AUTHENTICATION_ACCOUNT,
  type CustomerAuthenticationAccountPort,
} from '../customer-authentication-account.port';
import {
  CUSTOMER_LOGIN_CHALLENGE_REPOSITORY,
  type CustomerLoginChallengeRepository,
} from '../customer-login-challenge.repository';

@Injectable()
export class VerifyCustomerLoginCodeUseCase {
  constructor(
    @Inject(CUSTOMER_LOGIN_CHALLENGE_REPOSITORY)
    private readonly challenges: CustomerLoginChallengeRepository,
    @Inject(CUSTOMER_AUTHENTICATION_ACCOUNT)
    private readonly customers: CustomerAuthenticationAccountPort,
    private readonly auth: CustomerAuthService,
  ) {}

  async execute(verificationId: string, code: string) {
    const challenge = await this.challenges.consume(verificationId, code);
    if (!challenge) this.invalidCode();
    const customer = await this.customers.findOrCreateByPhone(challenge.phone);
    if (customer.status !== 'active') this.customerBlocked();
    return this.auth.createSession(customer.id, challenge.phone);
  }

  private invalidCode(): never {
    throw new UnauthorizedException({
      code: 'CUSTOMER_AUTH_INVALID_CODE',
      message: 'Verification code is invalid or expired',
    });
  }

  private customerBlocked(): never {
    throw new UnauthorizedException({
      code: 'CUSTOMER_AUTH_ACCOUNT_BLOCKED',
      message: 'Customer account is blocked',
    });
  }
}
