export type CustomerStatusContract = 'active' | 'blocked';

export interface CustomerAuthenticationContract {
  id: string;
  phone: string | null;
  firstName: string;
  lastName: string | null;
  status: CustomerStatusContract;
}
