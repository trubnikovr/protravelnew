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
into the same form. Departure, destination and both dates open touch-friendly
selection sheets. Passenger selection uses a separate typed route and returns
the selected counters to the existing form. Complex multi-city routes are not
supported.

## Follow-up states

Results will support recommended, cheapest, fastest and optimal sorting.
Filtering and details are separate screens/sheets in the search feature.

## UI

Shared: `PrimaryButton`, `ScreenHeader`.

Feature-owned: `FlightResultCard`.
