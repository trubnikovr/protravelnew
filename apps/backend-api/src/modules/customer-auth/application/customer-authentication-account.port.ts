import type { CustomerAuthenticationContract } from '@shared/contracts';

export const CUSTOMER_AUTHENTICATION_ACCOUNT = Symbol(
  'CUSTOMER_AUTHENTICATION_ACCOUNT',
);

export interface CustomerAuthenticationAccountPort {
  findOrCreateByPhone(phone: string): Promise<CustomerAuthenticationContract>;
  getById(customerId: string): Promise<CustomerAuthenticationContract>;
}
