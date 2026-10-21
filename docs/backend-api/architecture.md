# ProTravel Backend API — Architecture

## Stack

- Node.js 24 LTS;
- NestJS 11, TypeScript strict mode, Express 5;
- REST with URI versioning under `/api/v1`;
- PostgreSQL and Drizzle ORM with schema-first explicit migrations;
- Redis and BullMQ for queues, retries and delayed work;
- JWT access/refresh tokens and Argon2 password hashing;
- OpenAPI/Swagger generated from controllers and DTOs into separate shared
  mobile/admin contracts under `packages/api-contract`;
- Pino structured logging, Terminus health checks and rate limiting.

The backend is a modular monolith. Domain logic lives in
`apps/backend-api/src/modules/<module>` and HTTP interfaces live separately in
`apps/backend-api/src/entrypoints`. A module must not access another module's
repository directly; it uses the exported application service or a domain
event.

## Core

`src/core` is the technical composition layer. It contains application-wide
infrastructure and framework configuration, but no product business logic.

Cross-cutting capabilities with an independent Nest boundary live in
`src/core/submodules`: reference data, file storage and notifications. They are
imported explicitly by consumers and are not made global merely by their
location.

```text
src/core/
├── config/       # environment loading and validation
├── database/     # PostgreSQL pool and typed Drizzle provider
├── health/       # weighted overall system Health Score
├── http/         # response envelopes, filters and Swagger contracts
├── logging/      # nestjs-pino configuration and sensitive-data redaction
├── observability/# OpenTelemetry instrumentation and optional health checks
├── queue/        # Redis and BullMQ root configuration
├── submodules/   # reference, files and notifications
├── swagger/      # Swagger documents and OpenAPI contract persistence
└── core.module.ts
```

`CoreModule` aggregates and exports the technical modules required by the
application. `AppModule` imports `CoreModule` once and must not duplicate core
configuration inline.

Rules:

- core modules may depend on shared primitives and external libraries;
- core must not contain travel, booking, payment or admin business rules;
- domain modules may consume public providers exported by core;
- core must not import entrypoint controllers;
- secrets and request bodies containing passwords or tokens must be redacted
  by `LoggingModule` before structured logs are written.

### Overall system Health Score

`HealthScoreService` returns a score from `0` to `100` based on weighted core
components:

| Component           | Weight |
| ------------------- | -----: |
| PostgreSQL          |     35 |
| Redis               |     25 |
| Node.js heap memory |     20 |
| Application process |     10 |
| Event loop latency  |     10 |

Status thresholds:

- `healthy` — score `90–100`;
- `degraded` — score `60–89`;
- `unhealthy` — score below `60`.

`GET /api/v1/health` returns the score, component states, check latency,
timestamp and process uptime. An `unhealthy` result uses HTTP `503`; `healthy`
and `degraded` results use HTTP `200`. `GET /api/v1/health/live` is a minimal
liveness endpoint and does not query external dependencies.

The calculation belongs to `src/core/health`; the HTTP controller belongs to
`src/entrypoints/backend/health`. Failed checks must not expose connection
strings, credentials or raw infrastructure errors.

Grafana, OpenTelemetry Collector, Tempo, Loki and Prometheus are optional
health components with zero weight. Their outage is reported but does not
reduce the core score or make the API unavailable.

## Entrypoints and controllers

`src/entrypoints` is the API layer and contains three independent interfaces:

- `backend/` — system endpoints owned by the backend itself;
- `mobile/` — public and authenticated API used by the mobile application;
- `admin/` — administrative API used by the back-office dashboard.

Each entrypoint is split into product submodules such as `auth`, `customers`,
`search`, `orders`, `reviews`, `content` and `support`.

Expected structure:

```text
src/
├── entrypoints/
│   ├── mobile/
│   │   ├── auth/
│   │   │   ├── dto/request/
│   │   │   ├── dto/response/
│   │   │   ├── mappers/
│   │   │   ├── auth.controller.ts
│   │   │   └── auth-entrypoint.module.ts
│   │   └── mobile-entrypoint.module.ts
│   ├── admin/
│       ├── auth/
│       ├── users/
│       ├── orders/
│       └── admin-entrypoint.module.ts
│   └── backend/
│       ├── health/
│       └── backend-entrypoint.module.ts
└── modules/
    └── <module>/
        ├── domain/         # entities, VO, enums and domain events
        ├── application/    # use cases and repository ports
        └── infrastructure/ # Drizzle schemas, repositories and mappers
```

Request flow:

```text
HTTP request
→ Controller
→ Request DTO validation
→ Domain service from src/modules
→ API mapper
→ Response DTO
```

Mandatory boundaries:

- controllers only process HTTP input, authentication/locale context and call
  domain services;
- request and response DTOs are separated into `dto/request` and
  `dto/response`;
- API mappers convert domain models into response DTOs;
- business logic and database access belong to `src/modules`, never to an
  entrypoint;
- domain modules must never import from `src/entrypoints`;
- entrypoint modules may import public services exported by domain modules.

### Mobile API

- Uses the named `customer-jwt` strategy and `CustomerJwtAuthGuard`;
- current customer is provided by `@CurrentCustomer()`;
- `OptionalCustomerJwtAuthGuard` will be used for routes available both anonymously
  and to authenticated users;
- locale is provided by `@CurrentLocale()`;
- routes have no `mobile` prefix: `/api/v1/search`, `/api/v1/orders`;
- user authentication is exposed under `/api/v1/auth`.

### Admin API

- All routes use the `/api/v1/admin` prefix;
- uses a separate admin JWT strategy and `AdminJwtAuthGuard`;
- current administrator is provided by `@CurrentAdmin()`;
- permissions are checked by `PermissionsGuard`;
- super-admin bypasses individual permission restrictions;
- admin authentication and user authentication are completely isolated.

### Entrypoint aggregation and Swagger

- `MobileEntrypointModule` aggregates all mobile API submodules;
- `AdminEntrypointModule` aggregates all admin API submodules;
- all three entrypoint modules are imported by `AppModule`;
- mobile Swagger is exposed at `/api/mobile/docs` with an API-version selector;
- admin Swagger is exposed at `/api/admin/docs` with an API-version selector;
- versioned JSON is exposed under `/api/v1/<audience>/openapi.json`;
- generated contracts belong in version directories such as
  `packages/api-contract/v1/mobile.openapi.json` and
  `packages/api-contract/v1/admin.openapi.json`.

To add an API endpoint, create the appropriate mobile/admin entrypoint
submodule, controller, request DTO, response DTO and API mapper. Import the
required domain module and register the entrypoint submodule in
`mobile-entrypoint.module.ts` or `admin-entrypoint.module.ts`.

## Database

Drizzle schema files live inside the owning module's infrastructure layer.
`src/core/database/schema.ts` re-exports
all schemas used by the application. Drizzle Kit writes generated SQL
migrations to `apps/backend-api/drizzle`; generated migrations are reviewed
and committed.

Domain services receive the typed Drizzle database through the `DRIZZLE_DB`
provider. Controllers and API mappers never query Drizzle directly.

## Backend import aliases

Backend source code uses aliases instead of deep relative imports:

- `@app/*` — any file under `src`;
- `@core/*` — configuration, logging, database, queues and Swagger;
- `@entrypoints/*` — mobile/admin API layer;
- `@modules/*` — domain modules and their public APIs;
- `@shared/*` — shared domain primitives and Value Objects.

Every domain module exposes its outward-facing contract through an `index.ts`.
Entrypoints import that public contract and must not reach into a module's
infrastructure folders.

Domain entities are private to their owning module. Synchronous data crossing
a backend module boundary uses type-only contracts from `src/shared/contracts`;
versioned event contracts live in `src/shared/events`.
The consuming module defines the port it needs, and a bridge under
`src/integrations` maps the producer's private domain model to that contract.
This keeps use cases independent from another module's entities and concrete
application services.

Current bridges include `flights-order`, `customer-auth-customers`,
`customers-order-tour`, `tours-order-tour` and `notifications-order-flight`.
Their adapters are the only places allowed to know both sides of a synchronous
module integration.

## Module map

| Module                          | Responsibility                                                          | Status                         |
| ------------------------------- | ----------------------------------------------------------------------- | ------------------------------ |
| `health`                        | weighted overall system score and liveness                              | implemented                    |
| `customer-auth`                 | phone login, SMS challenge use cases, refresh and isolated customer JWT | temporary code adapter         |
| `customers`                     | profile, locale and currency; owns the `customer-travelers` submodule   | MVP implemented                |
| `customer-travelers`            | family travelers and encrypted identity documents                       | nested admin/mobile CRUD       |
| `core/submodules/reference`     | countries, cities, airports, CSV seed and suggest API                   | implemented                    |
| `content`                       | mobile news, read state and operational system messages                    | news and system messages implemented |
| `search`                        | normalized multi-provider search orchestration                          | scaffolded                     |
| `flights`                       | async search, offers, revalidation, fare rules and CBS/mock adapters    | MVP implemented                |
| `hotels`                        | hotel offers, rooms and booking adapter                                 | scaffolded                     |
| `tours`                         | tour catalog, mobile home collections, availability and booking adapter  | admin CRUD and home API implemented |
| `transfers`                     | transfer offers and booking adapter                                     | scaffolded                     |
| `pricing`                       | currency, markup, commission and promo codes                            | scaffolded                     |
| `order-flight`                  | flight order state machine, traveler snapshots and CBS booking          | MVP implemented                |
| `order-tour`                    | tour booking lifecycle, paid state and private administrative documents | admin MVP implemented          |
| `payments`                      | payment intents, webhooks and refunds                                   | scaffolded                     |
| `core/submodules/notifications` | shared delivery queues and notification policies                        | flight-order email queue MVP   |
| `favorites`                     | favorites, saved searches and price alerts                              | scaffolded                     |
| `reviews`                       | reviews and moderation                                                  | scaffolded                     |
| `core/submodules/files`         | public images and private booking documents; S3 adapter planned         | local adapters implemented     |
| `support`                       | support requests and messages                                           | scaffolded                     |
| `admin`                         | separate JWT auth, admin profile, domain model and RBAC foundation      | MVP implemented                |
| `audit`                         | security events and immutable audit trail                               | scaffolded                     |

“Scaffolded” means the Nest module boundary exists and is registered, but no
public API contract is promised yet.

## Implementation order

1. `customers/customer-travelers`, `core/submodules/reference`;
2. `content`, `search`;
3. `flights`, `hotels`, `pricing`;
4. `orders`, `payments`, `core/submodules/files`;
5. `core/submodules/notifications`, `favorites`, `reviews`, `support`;
6. `tours`, `transfers`, `admin`, `audit`.

Provider-backed modules require provider credentials and API contracts. Their
external DTOs must be isolated behind adapters; provider payloads must never
become the public ProTravel API contract.
