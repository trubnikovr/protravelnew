# Tour bookings

`order-tour` owns administrative tour bookings independently from flight
orders. A booking stores the selected customer and tour, departure date,
traveler count, notes, and an immutable total price snapshot calculated from
the selected departure price (or the base tour price when no departure is
selected) and traveler count at creation time. Only active customers and
published tours can be booked; a selected departure must belong to the tour.

`order-tour` does not import customer or tour repositories. It consumes
`CustomerForTourBookingContract` and `TourForBookingContract` through its own
reader ports. Bridges under `src/integrations/customers-order-tour` and
`src/integrations/tours-order-tour` map producer use cases to those ports. The
booking stores customer name/email and tour title snapshots, so later profile
or catalog edits do not rewrite historical booking display data.

Customer checkout additionally stores booking-specific snapshots of every selected
traveler: source traveler ID, name, gender, birth date and citizenship. The
source ID becomes null if a traveler is later deleted, while the booking
snapshot remains intact. `TravelerForTourBookingContract` crosses the
customers/order-tour boundary through a consumer-owned reader port.
Administrators with `orders.write` can add missing traveler snapshots up to the
booked count or edit existing snapshots. These changes do not alter the saved
customer traveler profile. The booking row is locked during additions to enforce
the count under concurrent requests.

## Customer API

All endpoints require a customer JWT and restrict records to the authenticated
customer:

```text
GET  /api/v1/me/tour-bookings
GET  /api/v1/me/tour-bookings/{id}
POST /api/v1/me/tour-bookings
POST /api/v1/me/tour-bookings/price-quote
```

Creation accepts tour ID, traveler count, optional selected traveler IDs,
departure date and notes. For older clients, omitted count is derived from the
selected IDs. The number of IDs cannot exceed the count. Customer identity and contact snapshots are resolved from the JWT-owned
customer record. The service validates traveler ownership, tour publication,
departure membership, current seats and price, calculates the total on the
server and creates a `pending` request.

The price-quote endpoint accepts a tour, optional departure and traveler count,
then returns the current total as `MoneyResponseDto`. It uses the same tour
reader and availability checks as checkout so the client can display the
server-formatted total before submitting the request.

## Status lifecycle

```text
pending → confirmed → awaiting_payment → paid → completed
   └────────┐          └────────┐       └──────┐
            └→ cancelled        └→ cancelled   └→ cancelled
```

Allowed transitions are enforced in the domain model. Repeating the current
status is idempotent. `paid_at` is set when a booking first becomes `paid` and
is retained if the paid booking is later cancelled.

After manager confirmation, the customer creates a hosted payment through
`POST /api/v1/me/payments`. Creation moves the booking to
`awaiting_payment`; only `payment.succeeded.v1` moves it to `paid`.

## Admin API

All endpoints require admin JWT authentication:

```text
GET    /api/v1/admin/tour-bookings
GET    /api/v1/admin/tour-bookings/{id}
POST   /api/v1/admin/tour-bookings
PATCH  /api/v1/admin/tour-bookings/{id}/status
POST   /api/v1/admin/tour-bookings/{id}/travelers
PATCH  /api/v1/admin/tour-bookings/{id}/travelers/{travelerId}
POST   /api/v1/admin/tour-bookings/{id}/documents
GET    /api/v1/admin/tour-bookings/{id}/documents/{documentId}/download
DELETE /api/v1/admin/tour-bookings/{id}/documents/{documentId}
```

Reading and downloading requires `orders.read`; creation, status changes,
uploads, and deletion require `orders.write`.

## Private documents

Booking documents are not exposed through the public static file route. File
metadata is stored in `tour_booking_documents`, while local binary files are
stored under `UPLOAD_DIRECTORY/private/tour-bookings`. The public static file
handler is rooted only at `UPLOAD_DIRECTORY/images`, so every document download
passes through the authenticated admin endpoint.

Supported files are PDF, JPEG, PNG, WebP, Word (`doc`, `docx`) and Excel
(`xls`, `xlsx`), with a maximum size of 25 MB per file. The storage adapter uses
generated storage keys and never trusts the original filename as a path.

Migration `0015_late_lifeguard.sql` creates `tour_bookings`,
`tour_booking_documents`, their indexes, foreign keys, and the
`tour_booking_status` enum.

Migration `0016_greedy_black_queen.sql` renames `users` to `customers`, updates
foreign keys, and adds/backfills immutable customer and tour display snapshots.

Migration `0022_fantastic_zodiak.sql` adds the customer phone snapshot and the
`tour_booking_travelers` snapshot table.

Migration `0023_nebulous_patch.sql` adds `awaiting_payment` and shared payment
persistence.
