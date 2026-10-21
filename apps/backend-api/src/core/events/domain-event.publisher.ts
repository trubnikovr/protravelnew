import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { DomainEvent } from './domain-event';

@Injectable()
export class DomainEventPublisher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  publish(event: DomainEvent<object>): void {
    this.eventEmitter.emit(event.name, event);
  }

  async publishAsync(event: DomainEvent<object>): Promise<void> {
    await this.eventEmitter.emitAsync(event.name, event);
  }
}
