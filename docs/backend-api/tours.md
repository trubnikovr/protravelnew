# Public tours

Tours may define `minTravelers` and `maxTravelers` (1–100) per booking.
Either can be null; the minimum cannot exceed the maximum. Quotes and booking
creation enforce these bounds independently of departure seat availability.
The data migration sets the limits to one and two for existing tours. New tours
default to one and two; either bound can be changed or left empty.

The mobile catalog uses backend-owned published tour data.

## Endpoints

- `GET /api/v1/tours` — paginated published catalog;
- `GET /api/v1/tours/:id` — full customer-facing tour details.

The list accepts `page`, `limit`, optional `destination`, and `sort` with
`recommended` or `price`. Destination matches a Russian country or city name.
Recommended order uses the administrative `sortOrder`; price order is
ascending. Draft and archived tours are never exposed.

List items contain card data, destinations, cover, duration, price and short
content. Details additionally contain departures, package or excursion
attributes, program days, gallery, active dates, inclusions and exclusions.
Administrative status, ordering and audit timestamps are intentionally absent
from the mobile contract.

Home tour cards also expose nullable `hotelCategory` from package details so
the mobile client can render the hotel star badge configured by an admin.

The v1 OpenAPI source is
`packages/api-contract/v1/mobile.openapi.json`. Mobile converts responses with
the generated v1 model serializers and caches catalog/detail queries with
TanStack Query.
