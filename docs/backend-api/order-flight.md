# Flight orders

`order-flight` owns the airline-order lifecycle. It is deliberately separate
from the future `order-tour` module: supplier statuses, traveler requirements,
expiry and cancellation rules differ by product. A generic `orders` domain is
not used.

```text
Flight offer → provider booking → booked → payment_pending → paid
                                      └──────────────────→ cancelled
```

## Mobile API

All endpoints require customer JWT authentication:

```text
GET  /api/v1/flight-orders?page=1&limit=20
POST /api/v1/flight-orders/create-flight-order
GET  /api/v1/flight-orders/{id}
POST /api/v1/flight-orders/{id}/book
POST /api/v1/flight-orders/{id}/refresh
POST /api/v1/flight-orders/{id}/cancel
```

The list endpoint returns only orders owned by the authenticated customer,
ordered newest first, with standard pagination metadata.

The former `POST /api/v1/flight-orders` creation route remains available for
older clients and is deprecated.

Booking logs record the idempotency check, offer and traveler validation,
attempt reservation, provider booking and order persistence as separate steps
with durations and safe error codes. TTBooking `SELECTFR` and `CREATEBR` are
logged individually. Request context links these entries; passenger details,
contact details, booking tokens and raw provider payloads are excluded.

Creation requires `Idempotency-Key`. Creation loads the unexpired persisted
offer, validates passenger composition and ownership, and reserves a technical
attempt keyed by customer and idempotency key before contacting the provider.
The order is stored only after provider booking succeeds. A repeat returns an
existing order or reports an earlier attempt that needs verification; it does
not repeat an uncertain provider operation. Before booking, `SELECTFR` rechecks
the chosen flight. `CREATEBR`
uses the tokens returned by that selection. An unavailable flight stops the
booking. If the selected price changed, booking continues and the normalized
selected amount is stored in the order and used for payment.
Offer expiry is independently checked on the server using Temporal instants;
client-side countdowns do not replace this check.
The mismatch log records both normalized integer amounts, the configured
currency and multiplier, without passenger data or provider tokens. Currency
is currently configured, not validated against TTBooking `fareCurrency`.
TTBooking group, itinerary, flight and segment tokens may be strings or
numbers. Numeric zero is a valid token and is forwarded without conversion.
An explicit `BOOKING_NOT_CONFIRMED` response reporting identical buyer and
passenger phones maps to `FLIGHT_BOOKING_PHONE_MUST_DIFFER`; the customer is
directed to support. Raw provider messages are not sent to the client.
For a confirmed rejection containing the generic provider data-validation
message, the API returns `FLIGHT_BOOKING_PASSPORT_DATA_INVALID` and asks the
customer to check passport data. A specific phone rejection takes precedence.

Flight order responses keep `totalAmount` as an integer minor-unit string and
`currency` as a separate code for calculations. `formatted` is generated from
`MoneyValueObject`, localized by the backend, rounded to a whole currency unit
and is presentation-only;
clients should display it instead of concatenating the raw amount and currency.

Contact details are loaded from the authenticated customer's profile. A valid
email and international phone number are required before contacting TTBooking.
The legacy `contact` request field is optional and ignored. The backend stores
a contact snapshot on the order and sends `customer.phoneNumber` to TTBooking.

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
mock adapter supports the complete state flow. The TTBooking adapter maps:

- `CREATEBR` — create the booking;
- `SELECTFR` — recheck the selected flight and obtain booking tokens;
- `LOADBOOKING` — refresh remote status;
- `CANCELBOOKING` — cancel an unissued booking.

TTBooking enums and domain mappings shared by search and booking live in
`src/integrations/ttbooking`. `PAYDEPOSIT` and ticket issuance are intentionally not
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
