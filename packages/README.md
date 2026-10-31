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

Flight sharing adds `POST /api/v1/flights/offers/{offerId}/share` to the mobile
v1 contract. It returns a public URL and expiry; the URL serves backend-rendered
HTML and is intentionally not part of the JSON client contract.
