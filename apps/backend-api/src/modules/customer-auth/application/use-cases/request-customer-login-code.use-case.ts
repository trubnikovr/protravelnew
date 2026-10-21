import { randomUUID } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import {
  CUSTOMER_LOGIN_CHALLENGE_REPOSITORY,
  type CustomerLoginChallengeRepository,
} from '../customer-login-challenge.repository';
import {
  CUSTOMER_SMS_SENDER,
  type CustomerSmsSenderPort,
} from '../customer-sms-sender.port';

const DEVELOPMENT_LOGIN_CODE = '4322';
const CHALLENGE_TTL_SECONDS = 300;

@Injectable()
export class RequestCustomerLoginCodeUseCase {
  constructor(
    @Inject(CUSTOMER_LOGIN_CHALLENGE_REPOSITORY)
    private readonly challenges: CustomerLoginChallengeRepository,
    @Inject(CUSTOMER_SMS_SENDER)
    private readonly sms: CustomerSmsSenderPort,
  ) {}

  async execute(phone: string) {
    const challenge = {
      id: randomUUID(),
      phone: phone.trim(),
      code: DEVELOPMENT_LOGIN_CODE,
      expiresAt: new Date(Date.now() + CHALLENGE_TTL_SECONDS * 1_000),
    };
    await this.challenges.save(challenge);
    const delivery = await this.sms.sendLoginCode(
      challenge.phone,
      challenge.code,
    );
    return {
      verificationId: challenge.id,
      expiresIn: CHALLENGE_TTL_SECONDS,
      ...delivery,
    };
  }
}
