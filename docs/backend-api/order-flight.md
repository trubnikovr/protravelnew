# Flight orders

`order-flight` owns the airline-order lifecycle. It is deliberately separate
from the future `order-tour` module: supplier statuses, traveler requirements,
expiry and cancellation rules differ by product. A generic `orders` domain is
not used.

```text
Flight offer → draft → booking → booked → payment_pending → paid
                         ↘ failed        └───────────────→ cancelled
```

## Mobile API

All endpoints require customer JWT authentication:

```text
POST /api/v1/flight-orders
GET  /api/v1/flight-orders/{id}
POST /api/v1/flight-orders/{id}/book
POST /api/v1/flight-orders/{id}/refresh
POST /api/v1/flight-orders/{id}/cancel
```

Creation requires `Idempotency-Key`. The key is unique per customer and a
repeat returns the original order. Creation revalidates the offer, validates
that selected traveler types match the searched passenger composition and
stores immutable price, route and provider-reference snapshots.
If revalidation changes amount or currency, creation returns `PRICE_CHANGED`
with the new offer UUID and price instead of silently accepting it.

`book` loads selected traveler documents through the public
`CustomerTravelersService` application API. Decrypted document numbers exist only in
the transient provider call; response DTOs and domain events never contain
them. Provider booking tokens are stored internally and are also excluded from
the mobile response. The customer may receive the PNR/record locator.

Flight-order events contain identifiers and stable non-sensitive facts only.
Notification consumers obtain the immutable contact snapshot through the
restricted `GetFlightOrderNotificationContextUseCase`; email, name and phone
are not copied into the event stream.

Customers manage themselves and family members through
`/api/v1/me/travelers`. Every traveler has an independent relationship,
citizenship and document collection. An order selects a concrete `travelerId`
and `documentId`; ownership is checked against the authenticated customer.

## Provider boundary

`FlightBookingProviderPort` exposes `book`, `refresh` and `cancel`. The local
mock adapter supports the complete state flow. The CBS adapter maps:

- `CREATEBR` — create the booking;
- `LOADBOOKING` — refresh remote status;
- `CANCELBOOKING` — cancel an unissued booking.

CBS enums and domain mappings shared by search and booking live in
`src/integrations/cbs`. `PAYDEPOSIT` and ticket issuance are intentionally not
part of this module yet. Hosted customer payment is now a separate workflow: a
booked order can create a `flight_order` payment and the verified
`payment.succeeded.v1` event moves it to `paid`. Airline ticket issuance after
payment remains provider-specific work.

`order-flight` does not import the `flights` domain or its use cases. Its
application layer depends on `FlightOfferReaderPort` and
`FlightOfferForOrderContract` from `src/shared/contracts`. The
`src/integrations/flights-order` bridge calls the current `FlightsModule` and
maps its private `FlightOffer` entity to the shared contract. A future HTTP or
message-based adapter can replace that bridge without changing order use
cases.

## Persistence

`flight_orders` stores customer ownership, idempotency key, status, sanitized
traveler selection, offer snapshot, amount/currency, PNR, provider state and
booking expiry. Migration `0011_flaky_corsair.sql` creates the table and its
indexes. Every record has `created_at` and `updated_at`.
Migration `0023_nebulous_patch.sql` adds `payment_pending` and `paid` statuses.
