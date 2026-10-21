import type { CustomerLoginChallenge } from '../domain/customer-auth.types';

export const CUSTOMER_LOGIN_CHALLENGE_REPOSITORY = Symbol(
  'CUSTOMER_LOGIN_CHALLENGE_REPOSITORY',
);

export interface CustomerLoginChallengeRepository {
  save(challenge: CustomerLoginChallenge): Promise<void>;
  consume(id: string, code: string): Promise<CustomerLoginChallenge | null>;
}
