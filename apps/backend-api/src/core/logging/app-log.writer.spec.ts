import type { PinoLogger } from 'nestjs-pino';
import { AppLogWriter } from './app-log.writer';

describe('AppLogWriter', () => {
  it('is the single adapter that writes application log events to Pino', () => {
    const info = jest.fn();
    const pino = { info } as unknown as PinoLogger;
    const writer = new AppLogWriter(pino);

    writer.handle({
      level: 'info',
      context: 'SearchFlightsUseCase',
      fields: { offers: 12 },
      message: 'Flight search completed',
    });

    expect(info).toHaveBeenCalledWith(
      { context: 'SearchFlightsUseCase', offers: 12 },
      'Flight search completed',
    );
  });
});
