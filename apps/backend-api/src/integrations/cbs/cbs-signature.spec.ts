import { createHash } from 'node:crypto';
import { createCbsSignature } from './cbs-signature';

describe('createCbsSignature', () => {
  it('hashes the literal ordered TTBooking credential string', () => {
    const signature =
      'agency=7663&password=$2y$10$hash/with.specials&' +
      'time=2014-11-11T15:10:18+02:00&user=10719';

    expect(
      createCbsSignature({
        agency: '7663',
        password: '$2y$10$hash/with.specials',
        time: '2014-11-11T15:10:18+02:00',
        user: '10719',
      }),
    ).toBe(createHash('md5').update(signature).digest('hex'));
  });
});
