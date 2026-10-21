# Payments

`payments` owns hosted customer payments independently from tour and flight
orders. A payment references a payable through `payableType` and `payableId`;
the integration bridge resolves ownership, current status, immutable amount
and expiry without importing order persistence into the payment module.

## Customer API

Both endpoints require a customer JWT. Creation also requires an
`Idempotency-Key` header (maximum 128 characters):

```text
POST /api/v1/me/payments
GET  /api/v1/me/payments/{id}
```

Creation accepts `tour_booking` or `flight_order`. Only a confirmed tour
booking or a booked flight order owned by the authenticated customer can be
paid. Amounts are resolved from the stored server snapshot; the Raiffeisen
adapter currently accepts RUB only.

The response contains a hosted `paymentUrl`. Mobile opens it with
`SFSafariViewController`/Chrome Custom Tabs and returns through
`protravel://payments/result`; card data never enters the application. One
hosted form offers both SBP and bank card (`ACQUIRING`). A browser return is
only a UI signal: only a verified provider webhook can mark a real payment as
successful.

## Raiffeisen integration

```text
PAYMENT_PROVIDER=raiffeisen
PAYMENT_RETURN_URL=protravel://payments/result
RAIFFEISEN_BASE_URL=https://pay.raif.ru
RAIFFEISEN_PUBLIC_ID=...
RAIFFEISEN_SECRET_KEY=...
RAIFFEISEN_TIMEOUT_MS=15000
```

Use `https://pay-test.raif.ru` outside production. The provider creates one
hosted order with `paymentMethods: ["SBP", "ACQUIRING"]`. The webhook endpoint
is deliberately excluded from customer OpenAPI:

```text
POST /api/v1/webhooks/payments/raiffeisen
X-Api-Signature-SHA256: <HMAC-SHA256>
```

The signature is verified before processing. Provider `publicId`, order ID
and exact minor-unit amount must match the stored payment. Webhooks are audited
in `payment_webhooks`; a completed event is recorded only after the payment
and order-side effect finish, so a non-200 response remains retryable.

Successful processing publishes and awaits `payment.succeeded.v1`. The bridge
moves `tour_booking` from `awaiting_payment` to `paid`, or `flight_order` from
`payment_pending` to `paid`. Ticket issuance is a later flight workflow and
must consume the paid order rather than trust a mobile callback.

## Local mode and persistence

`PAYMENT_PROVIDER=mock` completes payment and publishes the same event without
an external bank. Migration `0023_nebulous_patch.sql` adds `payments`,
`payment_webhooks`, payment enums and order statuses. Refund statuses are
reserved; refund commands and dashboard controls are not implemented yet.

The current event transport is awaited but in-process. A transactional outbox
is still required before production to close the process-crash gap between
payment persistence and downstream fulfillment.
