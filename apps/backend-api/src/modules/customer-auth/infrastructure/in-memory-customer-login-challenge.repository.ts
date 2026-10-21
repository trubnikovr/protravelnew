import { Injectable } from '@nestjs/common';
import type { CustomerLoginChallengeRepository } from '../application/customer-login-challenge.repository';
import type { CustomerLoginChallenge } from '../domain/customer-auth.types';

@Injectable()
export class InMemoryCustomerLoginChallengeRepository
  implements CustomerLoginChallengeRepository
{
  private readonly challenges = new Map<string, CustomerLoginChallenge>();

  save(challenge: CustomerLoginChallenge): Promise<void> {
    this.challenges.set(challenge.id, challenge);
    return Promise.resolve();
  }

  consume(id: string, code: string): Promise<CustomerLoginChallenge | null> {
    const challenge = this.challenges.get(id);
    if (!challenge || challenge.expiresAt.getTime() <= Date.now()) {
      this.challenges.delete(id);
      return Promise.resolve(null);
    }
    if (challenge.code !== code) return Promise.resolve(null);
    this.challenges.delete(id);
    return Promise.resolve(challenge);
  }
}
