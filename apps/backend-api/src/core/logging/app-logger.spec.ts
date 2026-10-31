import { EventEmitter2 } from '@nestjs/event-emitter';
import { APP_LOG_EVENT } from './app-log.event';
import { AppLogger } from './app-logger';
import { LogContext } from './log-context';

describe('AppLogger', () => {
  it('publishes a structured event without writing it directly', () => {
    const emit = jest.fn();
    const events = { emit } as unknown as EventEmitter2;
    const context = new LogContext();
    const logger = new AppLogger(events, context);
    logger.setContext('SearchFlightsUseCase');

    logger.info({ offers: 12 }, 'Flight search completed');

    expect(emit).toHaveBeenCalledWith(APP_LOG_EVENT, {
      level: 'info',
      context: 'SearchFlightsUseCase',
      fields: { offers: 12 },
      message: 'Flight search completed',
    });
  });

  it('adds the active optional log context to application events', () => {
    const emit = jest.fn();
    const events = { emit } as unknown as EventEmitter2;
    const context = new LogContext();
    const logger = new AppLogger(events, context);

    context.run(
      {
        trace_id: 'trace-1',
        span_id: 'span-1',
        requestId: 'request-1',
        userId: 'customer-1',
        actorType: 'customer',
      },
      () => logger.info({ offers: 12 }, 'Flight search completed'),
    );

    expect(emit).toHaveBeenCalledWith(
      APP_LOG_EVENT,
      expect.objectContaining({
        fields: {
          offers: 12,
          trace_id: 'trace-1',
          span_id: 'span-1',
          requestId: 'request-1',
          userId: 'customer-1',
          actorType: 'customer',
        },
      }),
    );
  });
});
