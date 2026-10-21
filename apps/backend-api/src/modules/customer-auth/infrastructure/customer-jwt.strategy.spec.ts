import { ConfigService } from '@nestjs/config';
import type { CustomerJwtPayload } from '../domain/customer-auth.types';
import { CustomerJwtStrategy } from './customer-jwt.strategy';

describe('CustomerJwtStrategy', () => {
  const payload: CustomerJwtPayload = {
    sub: '88b6aa4e-7e8e-4278-bfd2-b84abcd6c0f9',
    phone: '+998901234567',
    type: 'access',
    scope: 'customer',
  };

  const strategy = (status: 'active' | 'blocked' = 'active') =>
    new CustomerJwtStrategy(
      {
        getOrThrow: jest.fn().mockReturnValue('a'.repeat(32)),
      } as unknown as ConfigService,
      {
        findOrCreateByPhone: jest.fn(),
        getById: jest.fn().mockResolvedValue({
          id: payload.sub,
          phone: payload.phone,
          firstName: 'Aziz',
          lastName: 'Karimov',
          status,
        }),
      },
    );

  it('returns the current customer identity from the account contract', async () => {
    await expect(strategy().validate(payload)).resolves.toEqual({
      id: payload.sub,
      phone: payload.phone,
      firstName: 'Aziz',
      lastName: 'Karimov',
    });
  });

  it('rejects a blocked customer with a valid access token', async () => {
    await expect(strategy('blocked').validate(payload)).rejects.toMatchObject({
      response: { code: 'CUSTOMER_AUTH_INVALID_ACCESS_TOKEN' },
    });
  });
});
