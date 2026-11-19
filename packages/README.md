# Shared packages

Здесь хранятся общие артефакты, но не runtime-код приложений:

- OpenAPI schema;
- сгенерированный TypeScript API client;
- общие DTO, если backend использует TypeScript;
- общие lint/TypeScript конфигурации.

Версионированные API-контракты находятся в
[`api-contract`](api-contract/README.md). Каждая версия (`v1`, `v2`) хранится
отдельно, чтобы сгенерированные клиенты могли использовать их одновременно во
время постепенной миграции.

The mobile v1 contract includes the polymorphic hosted-payment request and
response used by both tour bookings and flight orders. Provider webhook
payloads remain backend-private and are not shared customer contracts.

Admin and mobile tour contracts include optional minimum and maximum traveler
counts per booking; the backend validates these bounds.
Mobile tour booking creation accepts a traveler count with optional saved
traveler IDs; existing requests containing IDs alone remain supported.
The admin contract supports adding and editing booking-specific traveler details.

Flight sharing adds `POST /api/v1/flights/offers/{offerId}/share` to the mobile
v1 contract. It returns a public URL and expiry; the URL serves backend-rendered
HTML and is intentionally not part of the JSON client contract.

Flight order creation reads contact details from the authenticated profile.
The old `contact` request field is optional and ignored for compatibility.
The preferred v1 endpoints are `POST /api/v1/flights/search` and
`POST /api/v1/flight-orders/create-flight-order`; their former paths remain
available and are marked deprecated.
