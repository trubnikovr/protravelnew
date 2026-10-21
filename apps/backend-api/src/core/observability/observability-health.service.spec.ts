import type { ConfigService } from '@nestjs/config';
import { ObservabilityHealthService } from './observability-health.service';

describe('ObservabilityHealthService', () => {
  it('reports unavailable tools without throwing or adding score weight', async () => {
    const config = {
      get: jest.fn().mockReturnValue('http://127.0.0.1/unavailable'),
      getOrThrow: jest.fn().mockReturnValue(100),
    } as unknown as ConfigService;
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockRejectedValue(new Error('unavailable'));

    const result = await new ObservabilityHealthService(config).check();

    expect(result).toHaveLength(5);
    expect(result.every((item) => !item.required && item.weight === 0)).toBe(
      true,
    );
    expect(result.every((item) => item.status === 'down')).toBe(true);
    global.fetch = originalFetch;
  });
});
