import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import type { Job, Queue } from 'bullmq';
import type { FlightSearchQueuePort } from '../../application/ports/flight-search-queue.port';
import { ProcessFlightSearchUseCase } from '../../application/use-cases/process-flight-search.use-case';

export const FLIGHT_SEARCH_QUEUE_NAME = 'flight-searches';

@Injectable()
export class BullFlightSearchQueue implements FlightSearchQueuePort {
  constructor(
    @InjectQueue(FLIGHT_SEARCH_QUEUE_NAME) private readonly queue: Queue,
  ) {}
  async enqueue(searchId: string): Promise<void> {
    await this.queue.add('process', { searchId }, { jobId: searchId });
  }
}

@Processor(FLIGHT_SEARCH_QUEUE_NAME)
export class FlightSearchProcessor extends WorkerHost {
  constructor(private readonly processSearch: ProcessFlightSearchUseCase) {
    super();
  }
  async process(job: Job<{ searchId: string }>): Promise<void> {
    await this.processSearch.execute(job.data.searchId);
  }
}
