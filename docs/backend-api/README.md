# ProTravel Backend API documentation

- [Backend technical specification](summery-tz.md) — modules, entities,
  endpoints, state machines, integrations and delivery phases.
- [Development guide](development-guide.md) — backend ownership and contract
  rules.
- [Architecture](architecture.md) — selected stack, module boundaries and
  implementation status.
- [API response conventions](api-conventions.md) — success, pagination, error
  and raw response contracts.
- [Domain modeling](domain-modeling.md) — entities, shared Value Objects,
  money, image, date/time and time-zone rules.
- [Observability](observability.md) — OpenTelemetry, Grafana, Tempo, Loki,
  Prometheus and failure isolation.
- [Reference data](reference-data.md) — country, city and airport seed sources
  and import rules.
- [Flight search](flights.md) — synchronous use-case orchestration,
  TTBooking/mock provider adapters and offer persistence constraints.
- [Flight orders](order-flight.md) — isolated airline order domain, booking
  state machine, idempotency and TTBooking booking commands.
- [Tour bookings](order-tour.md) — administrative booking lifecycle, paid
  status and private booking documents.
- [Payments](payments.md) — hosted Raiffeisen checkout, signed webhooks and
  shared tour/flight fulfillment event.
- [Backend event map](events.md) — event producers, consumers and delivery
  reliability boundaries.
- [Customer authentication](customer-auth.md) — phone login, temporary SMS
  challenge and isolated customer JWT.
- [Mobile system messages](system-messages.md) — operational info/error
  banners controlled by the backend.
- [Mobile news](news.md) — reader state and administrative publishing.
- [Travel facts](travel-facts.md) — destination-aware loading content and
  administrative CRUD.
- [Public tours](tours.md) — published mobile catalog, filters and full tour
  details.

Future backend-owned documents belong here:

- OpenAPI conventions;
- database model;
- authentication and permissions;
- provider integration guides;
- deployment and operations;
- ADRs specific to backend.
