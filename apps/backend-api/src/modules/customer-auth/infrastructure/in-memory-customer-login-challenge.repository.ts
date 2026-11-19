import { Injectable } from '@nestjs/common';
import type { CustomerLoginChallengeRepository } from '../application/customer-login-challenge.repository';
import type { CustomerLoginChallenge } from '../domain/customer-auth.types';

@Injectable()
export class InMemoryCustomerLoginChallengeRepository implements CustomerLoginChallengeRepository {
  private readonly challenges = new Map<string, CustomerLoginChallenge>();
  private readonly attempts = new Map<string, number>();

  save(challenge: CustomerLoginChallenge): Promise<void> {
    this.challenges.set(challenge.id, challenge);
    return Promise.resolve();
  }

  consume(id: string, code: string): Promise<CustomerLoginChallenge | null> {
    const challenge = this.challenges.get(id);
    if (!challenge || challenge.expiresAt.getTime() <= Date.now()) {
      this.challenges.delete(id);
      this.attempts.delete(id);
      return Promise.resolve(null);
    }
    if (challenge.code !== code) {
      const attempts = (this.attempts.get(id) ?? 0) + 1;
      if (attempts >= 5) {
        this.challenges.delete(id);
        this.attempts.delete(id);
      } else {
        this.attempts.set(id, attempts);
      }
      return Promise.resolve(null);
    }
    this.challenges.delete(id);
    this.attempts.delete(id);
    return Promise.resolve(challenge);
  }
}
