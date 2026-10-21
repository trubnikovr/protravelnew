# Backend shared contracts

Synchronous type-only contracts crossing module boundaries inside
`backend-api`. Versioned asynchronous event contracts live separately in
`src/shared/events`.

- domain entities remain private to their owning module;
- producers and consumers map their private models to these contracts;
- PII contracts are synchronous, purpose-specific views and must be encrypted
  before queue or outbox persistence.

Move a contract to the repository-level `packages` directory only when another
application or independently deployed service consumes it.

Contract ownership follows the directory name: `customer/*` is owned by
`customers`, `tours/*` by `tours`, `flights/*` by `flights`, and
`order-flight/*` by `order-flight`.

Tour booking consumes `CustomerForTourBookingContract` and
`TravelerForTourBookingContract` from customers and `TourForBookingContract`
from tours through consumer-owned ports. Integration adapters are the only
code that knows both the producer use case and the consumer port.
