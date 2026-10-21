import { CustomerAuthenticationContractMapper } from './customer-authentication-contract.mapper';
import { CustomerEventMapper } from './customer-event.mapper';
import { CustomerForTourBookingContractMapper } from './customer-for-tour-booking-contract.mapper';
import type { CustomerRecord } from '../../infrastructure/persistence/customer.schema';

describe('customer boundary mappers', () => {
  it('exposes only the fields required by customer authentication', () => {
    const record = {
      id: 'customer-id',
      phone: '+79991234567',
      firstName: 'Aziz',
      lastName: 'Karimov',
      status: 'active',
      email: 'private@example.com',
      passwordHash: 'private-hash',
    } as CustomerRecord;

    expect(CustomerAuthenticationContractMapper.toContract(record)).toEqual({
      id: 'customer-id',
      phone: '+79991234567',
      firstName: 'Aziz',
      lastName: 'Karimov',
      status: 'active',
    });
  });

  it('exposes the minimal customer snapshot required by tour booking', () => {
    const record = {
      id: 'customer-id',
      firstName: 'Aziz',
      lastName: 'Karimov',
      email: 'aziz@example.com',
      phone: '+998901234567',
      passwordHash: 'private-hash',
    } as CustomerRecord;

    expect(CustomerForTourBookingContractMapper.toContract(record)).toEqual({
      id: 'customer-id',
      name: 'Aziz Karimov',
      phone: '+998901234567',
      email: 'aziz@example.com',
    });
  });

  it('publishes customer creation without phone or other PII', () => {
    const event = CustomerEventMapper.toCreated('customer-id');

    expect(event.name).toBe('customer.created.v1');
    expect(event.version).toBe(1);
    expect(event.aggregateId).toBe('customer-id');
    expect(event.payload).toEqual({});
  });
});
