# ProTravel Backend API — Development Guide

Before backend work, read:

1. `docs/backend-api/README.md`;
2. `docs/backend-api/architecture.md`;
3. `docs/backend-api/summery-tz.md`;
4. `docs/architecture.md`;
5. `packages/README.md`.

Backend owns API behavior, domain models, persistence, authentication,
authorization, provider integrations, payments, background jobs and OpenAPI.

When API behavior changes:

- update backend docs and OpenAPI in the same change;
- preserve stable machine-readable error codes;
- notify mobile/admin consumers through shared contracts in `packages`;
- never make mobile or dashboard code the source of truth for authorization.

Controllers, HTTP guards, locale/auth decorators, request/response DTOs and
API mappers belong to `src/entrypoints/mobile` or `src/entrypoints/admin`.
Business logic, database schemas and persistence belong to `src/modules`.
Imports from `src/modules` to `src/entrypoints` are forbidden.

Implemented business modules must contain a `domain` directory. Domain
entities and Value Objects are the module's outward-facing model; controllers
must not receive Drizzle records. Read `docs/backend-api/domain-modeling.md`
before adding money, images, calendar dates, timestamps or time zones.

Global technical configuration belongs to `src/core`. Add configuration,
logging, database, queue and similar infrastructure through a dedicated core
module and aggregate it in `CoreModule`; do not configure these concerns
directly in `AppModule`.

Notification queue payloads are encrypted with `NOTIFICATION_ENCRYPTION_KEY`
(64 hexadecimal characters). A separate key is mandatory in production. Local
development may fall back to `DOCUMENT_ENCRYPTION_KEY` while the notification
provider is simulated.

## Local commands

PostgreSQL and Redis are expected to run as local services during the current
architecture phase. Do not start Docker Compose unless it is requested
explicitly.

- `npm run backend:dev` — start NestJS in watch mode;
- `npm run backend:typecheck` — strict TypeScript check;
- `npm run backend:lint` — ESLint;
- `npm run backend:db:generate` — generate a Drizzle
  SQL migration from schema changes;
- `npm run backend:db:check` — validate Drizzle
  migration history;
- `npm run backend:db:studio` — start Drizzle Studio;
- `npm run backend:test` — unit tests;
- `npm run backend:build` — production compilation;
- `npm run backend:db:migrate` — apply database migrations.
- `npm run backend:seed:admin` — idempotently create the initial super-admin
  from `ADMIN_SEED_*` variables in `apps/backend-api/.env`.
- `npm run backend:seed:reference` — idempotently import countries, cities and
  airports from `apps/backend-api/seeds/reference`. Run database migrations
  first. The importer preserves legacy IDs, joins airport countries by ISO
  code and creates missing global cities from the airport source.
- `npm run backend:seed:demo` — idempotently create or refresh ten published
  demo tours in different countries and ten demo customer accounts. The seed
  also publishes bundled destination-specific covers for Antalya, Dubai,
  Tbilisi and Baku into local image storage. Run migrations and the reference
  seed first.

Only one record may have the `super_admin` role. PostgreSQL enforces this with
a partial unique index. The domain exposes it as `isSuperAdmin`; this role
always receives every `AdminPermission` and bypasses permission guards.

Admin access tokens contain the administrator `tokenVersion`. The JWT strategy
compares it with `admins.token_version` during its existing administrator
lookup. Incrementing the database value revokes every previously issued token
without an additional query per request. `POST /api/v1/admin/auth/revoke-all`
performs this operation for the current administrator.

Do not use `drizzle-kit push` for shared or production databases. Every schema
change must be represented by a generated, reviewed and committed SQL
migration.

Every controller or DTO contract change must regenerate
`packages/api-contract/v1/mobile.openapi.json` or
`packages/api-contract/v1/admin.openapi.json`. A new API version gets its own
directory and never overwrites an older contract. The generated JSON must be
committed in the same change as the backend endpoint so mobile and dashboard
can consume a versioned contract.

OpenAPI contracts are generated during NestJS startup from `@nestjs/swagger`
decorators declared directly in controllers and DTOs. Do not maintain a
separate OpenAPI generation script.

The stable Swagger UI URLs are `/api/mobile/docs` and `/api/admin/docs`; their
version selector reads separate documents such as
`/api/v1/mobile/openapi.json`. Generated consumers import explicit
`generated/v1` or `generated/v2` modules so both versions can coexist.

## Media uploads

`POST /api/v1/admin/files/images` accepts one JPEG, PNG or WebP image up to
10 MB and returns the public image URL. During local development files are
stored under `UPLOAD_DIRECTORY` and served by
`GET /api/v1/files/images/:filename`. Public files are exposed by NestJS
`ServeStaticModule` inside `FilesModule`; they do not belong to the mobile
entrypoint and do not use a controller. `PUBLIC_API_URL` defines the public
origin written into stored tour image URLs.

Relative `UPLOAD_DIRECTORY` values are resolved from `apps/backend-api`; the
local default is `uploads`.

Public image responses explicitly use
`Cross-Origin-Resource-Policy: cross-origin` and
`Access-Control-Allow-Origin: *`. This allows the dashboard, mobile web views
and a future CDN to render public media while Helmet keeps its stricter
same-origin policy for ordinary API responses.

The local adapter is suitable for one development instance. A multi-replica
Kubernetes deployment must replace it with the S3/MinIO adapter or mount a
shared persistent volume; pod-local files are not shared between replicas.

### Image transformation

`GET /api/v1/files/image-transform` accepts `src` and a required named
`preset`. Arbitrary dimensions are intentionally forbidden so clients cannot
create an unbounded number of cached variants. The current `home-card` preset
generates a `600x420` WebP with `cover` through Sharp. New sizes must be added
as backend-owned named presets.

`src` must point to an image previously uploaded under
`/api/v1/files/images/:filename`. Arbitrary external origins are rejected to
prevent SSRF. Generated variants are immutable files under
`UPLOAD_DIRECTORY/image-transforms`; Node streams them from disk and does not
keep a process-level image cache.

The current backend cache key is the hexadecimal SHA-256 digest of:

```text
<source filename>:<preset>:<width>:<height>:<fit>:<WebP quality>
```

For example, the resulting file is stored as
`UPLOAD_DIRECTORY/image-transforms/<sha256>.webp`. This is a transformation
key, not a hash of the source file contents. MD5 is not used. Uploaded image
filenames are immutable UUID-based identifiers, so replacing the contents of
an existing filename is forbidden. A changed source must receive a new
filename. If that invariant is removed later, the cache key must additionally
contain a source content hash or explicit source version.

Nginx must not read or hash the source image on each request. Named presets
also keep the set of possible cached objects bounded. The first
deployment phase should use `proxy_cache` keyed by the normalized complete
transform request URI; a cache miss is proxied to the backend generator. A
future `try_files` setup requires a canonical public variant URL containing
the backend-derived SHA-256 key, for example
`/image-transforms/<sha256>.webp`. Nginx then checks that path and serves the
existing file directly, falling back to the generator only when it is absent.

Production operations must define disk-cache retention limits when the
supported variant set becomes dynamic.

## Flight providers

Flight controllers call application use cases exported by `FlightsModule`.
Provider-specific commands and tokens remain behind `FlightProviderPort`; CBS
payloads must not enter entrypoint DTOs. See `docs/backend-api/flights.md` for
the polling lifecycle, configuration and current local persistence constraint.

## Размер методов

- Метод содержит не более 15 непустых строк кода.
- Use case оставляет в `execute()` только последовательность шагов сценария.
- Валидация, построение domain input, вызов провайдера и публикация событий
  выносятся в небольшие private-методы с названиями, описывающими намерение.
- Для `order-flight` ограничение проверяется ESLint-правилом
  `max-lines-per-function`; DTO, Drizzle schema и тесты не считаются методами
  прикладной логики.

Traveler request/response DTOs and `TravelerApiMapper` are shared by the admin
and customer HTTP interfaces under `src/entrypoints/common/travelers`.
Business logic remains in `CustomerTravelersService`; mobile/admin controllers must
not duplicate document encryption or ownership checks.
