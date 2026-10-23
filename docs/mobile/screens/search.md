# Flights

## Source

PDF pages 2–9 and 49.

## Routes

- Bottom tab: `Flights`.
- Search stack: `SearchForm`
- Search stack: `Passengers`
- Search stack: `SearchResults`

## Behavior

This stack is exclusively for airline tickets and no longer mixes tour search
into the same form. Departure and destination open a searchable selection
sheet backed by `GET /api/v1/reference/suggest` for city and airport results.
The backend places matching featured locations before regular results. Mobile
renders the returned order without loading, merging or sorting a separate
featured-locations list. The sheet stays empty before the customer starts
typing.
Both dates open touch-friendly selection sheets. Passenger selection uses a
separate typed route and returns the selected counters to the existing form.
Complex multi-city routes are not supported.

In development builds, the form is prefilled with `MOW → LED` for faster
manual testing. Production keeps the regular `TAS → PQC` defaults. The default
departure date is today and the return date is seven days later.

Submitting the form calls `POST /api/v1/flights/searches`. The results screen
owns loading, retryable error, empty and content states and renders normalized
provider offers rather than local fixtures.

## Follow-up states

Results will support recommended, cheapest, fastest and optimal sorting.
Filtering and details are separate screens/sheets in the search feature.

## UI

Shared: `PrimaryButton`, `ScreenHeader`.

Feature-owned: `FlightResultCard`.
