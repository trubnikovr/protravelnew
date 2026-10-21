export interface AuthenticatedCustomer {
  id: string;
  phone: string;
  firstName: string;
  lastName: string | null;
}

export interface CustomerJwtPayload {
  sub: string;
  phone: string;
  type: 'access' | 'refresh';
  scope: 'customer';
}

export interface CustomerLoginChallenge {
  id: string;
  phone: string;
  code: string;
  expiresAt: Date;
}
