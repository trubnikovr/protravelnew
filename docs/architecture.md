# ProTravel monorepo architecture

```text
apps/
├── mobile/
├── backend-api/
└── frontend-dashboard/
design/
docs/
packages/
```

Каждое приложение независимо запускается и развёртывается. Приложения не
импортируют runtime-код друг друга напрямую.

Общие артефакты размещаются в `packages`:

- OpenAPI schema;
- сгенерированный API client;
- DTO и схемы валидации, если стек позволяет безопасное переиспользование;
- общие lint/TypeScript-конфигурации.

OpenAPI contracts and generated consumers are versioned side by side. Current
code imports `generated/v1`; a future `generated/v2` does not replace v1, so
mobile and admin can migrate feature by feature. Swagger keeps one stable page
per audience and exposes the available versions through its selector.

Operational mobile banners use the shared OpenAPI contract:
`GET /api/v1/system-messages` returns active `info`/`error` records, while the
admin API owns creation and activation. Mobile never hardcodes outage text.

The published tours catalog is another shared v1 contract boundary:
`GET /api/v1/tours` owns filtering/sorting and `GET /api/v1/tours/:id` owns
full customer-facing content. Mobile consumes generated v1 models rather than
duplicating tour response interfaces.

The news tab reads `GET /api/v1/news/unread-status` for its lightweight
`hasUnread`/`unreadCount` badge state; the full feed remains under
`GET /api/v1/news`. Feed items expose a short `summary` and full `content` for
the mobile detail screen. Dashboard publishing uses the shared admin v1
contract under `/api/v1/admin/news`.

Authenticated tour checkout uses `/api/v1/me/tour-bookings`. Mobile supplies
the tour, departure and customer-owned traveler IDs; backend resolves the JWT
customer, revalidates availability and price, and stores immutable contact and
traveler snapshots before returning the `pending` booking.

Hosted payments use the shared v1 `/api/v1/me/payments` contract. A payment
points to either a tour booking or flight order, while an integration bridge
exposes only ownership, amount, status and expiry. Mobile opens the provider
URL in a system in-app browser and treats the signed backend webhook, not the
deep-link return, as the source of truth. `payment.succeeded.v1` updates the
owning product without direct runtime imports between domains.

Документация принадлежит приложению, которое отвечает за описанную область.
Кросс-приложенческие решения остаются в корневой `docs`.
