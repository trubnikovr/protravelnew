# ProTravel Backend API — Domain modeling

## Module boundary

Every business module uses the following direction of dependencies:

```text
entrypoints/{mobile|admin|backend}
→ modules/<module>/application
→ modules/<module>/domain
← modules/<module>/infrastructure
```

The `domain` directory is mandatory for implemented business modules. It owns
entities, aggregates, domain enums, Value Objects and domain events. Domain
code does not import NestJS, Drizzle, controllers or HTTP DTOs.

Every domain entity extends `DomainEntity` and therefore always has
`id`, `createdAt` and `updatedAt`. Every persisted business record, including
localized child records, has `created_at` and `updated_at` columns. A nested
Value Object has no independent identity and is the only exception.

The `application` directory owns use cases, repository ports and command/query
inputs. The `infrastructure` directory implements those ports and maps database
records to domain entities. Drizzle records must not cross the module boundary.

The current implemented aggregates are:

- `admin/domain/Admin`;
- `customers/domain/Customer`;
- `travelers/domain/Traveler` with nested `TravelerDocument`;
- `tours/domain/Tour` with translations for `ru`, `uz` and `en`.
- `order-flight/domain/FlightOrder` with an immutable offer snapshot and an
  independent booking state machine. Tour orders will use a separate domain.

## Shared Value Objects

Reusable domain primitives live in `src/shared/domain/value-objects`:

- `EntityIdValueObject` — UUID identity;
- `EmailValueObject` and `LoginValueObject` — normalized identities;
- `MoneyValueObject` — non-negative integer amount in minor currency units;
- `ImageValueObject` — normalized HTTP/HTTPS image URL;
- `LocalDateValueObject` — calendar-only `YYYY-MM-DD` value;
- `DateTimeValueObject` — immutable absolute instant;
- `TimeZoneValueObject` — validated IANA time-zone identifier.

DTOs in `src/entrypoints/common` describe the HTTP representation of shared
VOs. They are not domain objects. API mappers serialize domain objects into
response DTOs; persistence mappers restore domain objects from database rows.

All entity response DTOs extend `EntityResponseDto`. All paginated requests
extend `BaseListRequestDto`: the defaults are `page=1`, `limit=20`,
`sortBy=createdAt`, `sortDirection=desc`. A concrete endpoint overrides the
`sortBy` property with its own enum. Pagination output uses the shared
`PaginationMetaResponseDto` inside `meta.pagination`.

## Money contract

Money is represented as an object:

```json
{
  "amount": "125050",
  "currency": "USD",
  "formatted": "1,250.50 USD"
}
```

`amount` is an integer string in minor units. For example, `125050 USD` means
`1250.50 USD`; RUB uses two fractional digits for kopecks. Integer strings avoid
floating-point rounding and JSON number precision loss. The database stores
the same integer value as `numeric(..., scale: 0)`.

`formatted` is presentation convenience only. Consumers must use `amount` and
`currency` for calculations and may format them for their active locale.

## Date, time and time-zone policy

Two concepts must never be mixed:

- Calendar dates such as birth date, passport issue date and passport expiry
  use PostgreSQL `date`, HTTP `YYYY-MM-DD` and `LocalDateValueObject`. They are
  never converted between time zones.
- Instants such as `createdAt`, `updatedAt`, publication and payment time use
  PostgreSQL `timestamp with time zone`. They are stored as UTC and returned as
  ISO 8601 UTC strings, for example `2026-08-05T08:00:00.000Z`.

Each customer stores an IANA time zone such as `Europe/Moscow`. Mobile and
dashboard display an instant in that zone. The backend may use
`DateTimeValueObject.format(timeZone, locale)` for generated messages or
documents, but the stable API value remains UTC. Never persist a numeric UTC
offset such as `+05:00`, because offsets do not describe daylight-saving rules.

## Images

An image is exposed as an object rather than a bare string:

```json
{ "url": "https://cdn.protravel.uz/tours/dubai.jpg" }
```

The current VO validates HTTP/HTTPS URLs. File ownership, variants, dimensions
and localized alt text will be added by the `files` domain; they should not be
silently embedded in unrelated modules.

## Domain events

Successful aggregate changes publish domain events through
`DomainEventPublisher`. Tours, customer status, travelers and traveler
documents already publish create/update/delete events. Event payloads contain
identifiers and stable business facts, never decrypted document numbers.

Handlers may later write audit records, notifications or an outbox. A module
must consume another module through its public application API or a domain
event, not through its Drizzle schema.
