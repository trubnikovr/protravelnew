import { ConfigService } from '@nestjs/config';
import { NotificationPayloadCipherService } from './notification-payload-cipher.service';

describe('NotificationPayloadCipherService', () => {
  it('keeps recipient PII out of the persisted queue payload', () => {
    const config = new ConfigService({
      NOTIFICATION_ENCRYPTION_KEY: '11'.repeat(32),
    });
    const cipher = new NotificationPayloadCipherService(config);
    const request = {
      eventId: 'event-id',
      recipient: { email: 'private@example.com', name: 'Private Name' },
      template: 'flight-order-created' as const,
      variables: { orderId: 'order-id' },
    };

    const encrypted = cipher.encrypt(request);

    expect(JSON.stringify(encrypted)).not.toContain('private@example.com');
    expect(JSON.stringify(encrypted)).not.toContain('Private Name');
    expect(cipher.decrypt(encrypted)).toEqual(request);
  });
});
