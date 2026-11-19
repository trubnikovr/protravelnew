import { randomInt, randomUUID } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    private readonly config: ConfigService,
  ) {}

  async execute(phone: string) {
    const challenge = {
      id: randomUUID(),
      phone: phone.trim(),
      code: this.config.get<string>('SMS_PROVIDER') === 'smspilot'
        ? randomInt(0, 10_000).toString().padStart(4, '0')
        : DEVELOPMENT_LOGIN_CODE,
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
