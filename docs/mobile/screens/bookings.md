# Bookings

## Routes

- Authenticated Profile stack: `Bookings`;
- Tours stack: `TourBooking`;
- Tours stack: `AddBookingTraveler`.

## Tour checkout

The tour detail primary action preserves the selected tour. An unauthenticated
customer completes phone and SMS-code authentication in a modal over the tour;
successful verification continues directly to `TourBooking` rather than
switching to Profile.

Checkout loads the current tour again. The customer:

- selects a published departure when departures exist;
- chooses a traveler count and optionally selects saved travelers;
- can open `AddBookingTraveler` and return to the unchanged checkout;
- reviews profile phone/email, per-person price and the backend-quoted total;
- may add notes and submits a `pending` booking request.

The checkout starts with the tour summary, a traveler counter and a selectable
list of saved travelers, followed by an action to add a traveler. Details may
be supplied to the manager later. Adding a traveler returns
to the checkout without discarding its current selections.

The price quote is refreshed when the departure or traveler count changes. The
backend revalidates publication, departure, seats and price at submission.
The submit action explains missing selections or consent; if the quote fails,
another press retries it. A successful retry still requires a separate submit.
It stores immutable traveler name, gender, birth-date and citizenship
snapshots, so profile edits do not rewrite an existing booking.

After creation the screen displays the booking number. `Bookings` loads the
customer's records from `GET /api/v1/me/tour-bookings` and renders status,
departure, traveler count and total. The empty state remains available when no
bookings exist.

## Payment

The `Оплатить` action is available for `confirmed` and `awaiting_payment`
bookings. Mobile creates a payment with an idempotency key, opens the hosted
Raiffeisen form through the system in-app browser and returns via
`protravel://payments/result`. The form offers SBP and card; card data never
enters React Native.

After the browser closes, mobile polls `GET /api/v1/me/payments/{id}`. It shows
success only for backend status `succeeded`; a deep link by itself is not proof
of payment. The booking list is invalidated after completion so the
event-updated `paid` status is displayed.

## States

- loading;
- empty;
- populated booking list;
- checkout validation and submission;
- booking success;
- recoverable error;
- hosted payment, confirmation pending and payment success/error.

## UI

Shared: `ScreenHeader`, `AppTextField`, `PrimaryButton`.

API failures use the shared [error-message catalog](../api-errors.md) in the
existing error UI, preserving backend machine codes for specific guidance.
