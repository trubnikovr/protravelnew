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

Flight search uses `POST /api/v1/flights/search`; flight booking and order
creation use `POST /api/v1/flight-orders/create-flight-order`. The previous v1
paths remain available for existing clients.
Booking uses the authenticated customer's profile for phone and email; mobile
can update a missing email through the profile API before submitting the order.

Destination-aware travel facts use the same content boundary. Admin CRUD lives
under `/api/v1/admin/travel-facts`; mobile independently requests a bounded set
of published facts from `/api/v1/travel-facts` and rotates them locally while
flight search is running.

Flight sharing uses the versioned mobile API to create a 30-day public snapshot
and returns a share URL. The backend serves that URL as responsive HTML, so a
recipient can view itinerary details without the mobile app or an account.
Only public flight details are retained; passenger and provider booking data
remain private.

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
the tour, departure, traveler count and optionally customer-owned traveler IDs; backend resolves the JWT
customer, revalidates availability and price, and stores immutable contact and
traveler snapshots before returning the `pending` booking. Managers can later
add or edit booking-specific traveler details without changing customer profiles.
Tour contracts expose optional minimum and maximum travelers per booking. The
backend enforces them for quotes and booking creation; null means no additional
bound. Departure seat availability is a separate constraint.

Hosted payments use the shared v1 `/api/v1/me/payments` contract. A payment
points to either a tour booking or flight order, while an integration bridge
exposes only ownership, amount, status and expiry. Mobile opens the provider
URL in a system in-app browser and treats the signed backend webhook, not the
deep-link return, as the source of truth. `payment.succeeded.v1` updates the
owning product without direct runtime imports between domains.

Документация принадлежит приложению, которое отвечает за описанную область.
Кросс-приложенческие решения остаются в корневой `docs`.
