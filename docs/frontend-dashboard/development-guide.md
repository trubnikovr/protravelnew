# ProTravel Admin Dashboard — Development Guide

Before dashboard work, read:

1. `docs/frontend-dashboard/README.md`;
2. `docs/architecture.md`;
3. `docs/backend-api/README.md` when API or permissions are involved.

Dashboard owns administrative routes, UI, tables, filters, forms and API
consumption. Backend owns authorization and domain rules.

## Preferred stack

- TanStack Router for typed routes and URL search state;
- TanStack Query for server state;
- TanStack Form with Zod for forms and validation;
- TanStack Table and Virtual for data-heavy modules;
- Tailwind CSS and owned shadcn-style primitives for UI.

Pages belong to `src/screens`, user actions to `src/features`, reusable layout
sections to `src/widgets`, and infrastructure/UI primitives to `src/shared`.

Every user-facing string must use the shared `react-i18next` configuration and
provide a Russian value. Do not hardcode strings in new screens.

## API client generation

Backend API is the only owner of HTTP contracts. Its Swagger decorators produce
`packages/api-contract/v1/admin.openapi.json` when NestJS starts. After a
backend contract change, regenerate the dashboard client:

```bash
npm run dashboard:api:generate
```

OpenAPI Generator writes the TypeScript Fetch client to
`apps/frontend-dashboard/src/shared/api/generated/v1`. Imports name the version
explicitly so a future `generated/v2` client can coexist during migration.
Feature API adapters may configure and call that client, but must not duplicate
generated request, response or endpoint types manually.

When a request changes API contracts, document it under Backend API and expose
the contract through `packages`; do not define a dashboard-only API shape.
# Проверки

Не создавайте и не запускайте тесты без отдельного указания пользователя.
Проверки типов, линтер и сборка остаются допустимыми.

