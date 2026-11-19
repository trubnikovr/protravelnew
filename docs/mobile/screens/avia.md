# Flights

## Source

PDF pages 2–9 and 49.

## Routes

- Bottom tab: `Flights`.
- Search stack: `AviaSearchForm`
- Search stack: `AviaPassengers`
- Search stack: `AviaSearchResults`
- Search stack: `AviaDetails`
- Search stack: `AviaBooking`

## Behavior

This stack is exclusively for airline tickets and no longer mixes tour search
into the same form. Departure and destination open a searchable selection
sheet backed by `GET /api/v1/reference/suggest` for city and airport results.
Each new visit to search results uses its own query session: previous results,
including an empty result, are not displayed while the new search loads. The
active results screen retains its data when opening a flight and navigating back.
The route-swap control sits directly below the departure airport code.
The backend places matching featured locations before regular results. Mobile
renders the returned order for typed queries. Before typing, and after clearing
input, it shows popular locations without a section heading from
`GET /api/v1/reference/featured-flight-locations` in the configured admin order.
Popular directions and search results show up to five rows, after excluding
the opposite field’s selected code and overlapping airport codes. The remaining
rows retain backend order. This list has loading, empty, error and retry states. Selecting a popular row
resolves its code through `/reference/suggest` to obtain the backend's full
`airportCodes` before applying the selection; it never substitutes a city code
for airport codes. Popular rows display only the city name; country and airport
code are omitted. Popular rows are hidden while entering a search query.
City rows carry all linked airport codes and can be selected as “all airports”;
individual airport rows remain selectable. Mobile passes the selected code
list unchanged in both outbound and return routes. It does not create provider
queries or merge offers locally.
Both dates open touch-friendly selection sheets. Passenger and cabin-class
selection uses a bottom sheet on the existing form. Both passenger selectors expose only adults, children and
“Младенцы без места” with the hint “До 2 лет, на руках у взрослого”.
Seated infants are unavailable until TTBooking documents support; the mobile
selection type and search/booking payloads no longer merge them into infants.
Complex multi-city routes are not supported.

In development, the form is prefilled with the specific airports `SVO → IST`
(Sheremetyevo to Istanbul Airport). In production, both fields start empty. Dates are initialized
relative to the device's local calendar day: departure is in two weeks and return
is the following day. Dates shown in the form use Russian weekday/day/month
formatting; API values are serialized as local `YYYY-MM-DD` strings without a
timezone conversion. The clear icon removes a date value; search remains
disabled until both cities and the departure date are selected. Clearing the
return date switches the request to one-way and sends only one route to backend;
selecting a return date restores the round trip.

Submitting the form calls `POST /api/v1/flights/search`. The results screen
owns loading, retryable error, empty and content states and renders normalized
provider offers rather than local fixtures.
Its light catalog header shows the selected city direction, cabin class and
passenger count. During initial loading, animated skeleton flight cards appear
under the rotating travel fact. It
does not repeat the editable route/date form. The compact horizontally
scrolling filter shortcuts precede the results. Offer cards render every outbound and return
itinerary with server-provided localized highlights. Remaining-seat and
low-cost badges are omitted until those fields exist in the flight API.

Results use backend pagination with 20 offers per page. Mobile renders them in
a virtualized `FlatList` and requests the next page near the end. Backend keeps
the complete normalized provider result in Redis for five minutes, so later pages
are sliced by the flight-search use case without repeating the provider search.
The same response exposes backend-calculated filter metadata for the complete
result set; mobile must not derive available values from a single page. The
filter sheet uses it to show available stop and airline options, baggage
availability, price and duration ranges, and the
departure-time range. Price and duration limits are entered directly, while
sorting remains a stable client-visible list.
Empty and error states are rendered on an elevated surface card with the shared
travel-state icon used on Home. Results,
including the empty and error states, support pull-to-refresh and repeat the
current search request without resetting its criteria.
The empty-state action returns to the still-mounted search form so customers
can change route, dates or passengers without losing the form values.
Flight-card durations omit zero units: `1 ч 0 мин` is rendered as `1 ч`, while
`0 ч 45 мин` is rendered as `45 мин`. A zero or invalid total duration is
rendered as “Уточняется”.
Direct/connection wording comes from the itinerary `stopsLabel` returned by
backend; mobile does not translate or pluralize the stop count.
Flight cards render the API offer `baggageLabel` verbatim. Flight details use
the segment `baggageLabel`. Mobile does not parse PC/KG, compose labels or
combine baggage allowances; the backend owns those display strings.
The validating airline is shown as a green pill beside the price. Its label is
the provider carrier name (falling back to the carrier code), not a fabricated
low-cost flag. Both price and airline label are constrained so long text cannot
overlap or leave the card. The airline pill fits its label rather than using a
fixed width; names longer than 12 characters end with an ellipsis.

Flight search and `GET /api/v1/travel-facts?limit=5` start as independent
parallel queries. While flight results are pending, the route title shows a
fixed-width, smoothly fading three-dot suffix and destination-specific
published facts rotate every five seconds with a short 3D card flip. The suffix never changes the title
width, so the route does not jump during loading. The former loading label is not rendered over the airport
illustration. The flight search form uses that illustration as a full-screen
background; completed results use the light catalog background.
Facts and their rotation timer are removed as soon as the flight search leaves
its pending state and are never rendered above completed results. The pending
fact request is aborted on cleanup and its query cache is immediately eligible
for collection. A missing or failed fact request is ignored, and completed
flight results never wait for facts.

## Search form implementation

`AviaSearchFormScreen` composes the form; `model/useAviaSearchForm.ts` owns its state,
selection handlers and navigation. Date helpers and form types live in
`model/aviaSearchForm.ts`. `AviaSelectionModal` and `AviaPassengersSheet` are separate
feature components with styles in `components/aviaSearchFormStyles.ts`.
The decorative background ignores touches, and the form scroll view fills the
available screen. Sheet backdrops are separate press targets behind their
content so inputs and scrolling do not share a dismissing parent pressable.

## Result filters

The single filter control on the results screen opens a scrollable bottom
sheet. Customers can
select an exact connection-count option returned by the backend, select airlines, require
included baggage, and sort by recommendation,
price, duration or departure time. Airline rows show the carrier name and code;
offer counts are intentionally omitted because they were ambiguous and change
after filters are applied. Airport and flight-number shortcuts are not shown
until those filters exist in the API contract. Applying the
sheet starts a new server-backed search with the selected query parameters.
Resetting restores the defaults in the sheet before they are applied. The
active-filter count is shown in a red badge inside the filter button, and the
icon turns red while filters are applied. The badge disappears after reset;
sorting is not included in
this count.

Selecting a result pushes `AviaDetails` above the still-mounted results
screen. The detail screen loads the selected normalized offer by its ProTravel
UUID and uses a compact route/date/passenger header. It renders the actual
airline and fare facts, outbound/return route sections, every segment on a
vertical timeline and calculated connection durations. The total price appears
only in the fixed booking bar. The cost breakdown and fare-description blocks
are omitted, and this screen does not request provider fare rules. Visa notices, low-cost status and fare/tax breakdowns are
not fabricated when those fields are absent from the API contract. A fixed
bottom action shows the price and starts booking. Unauthenticated customers first complete
the shared booking-auth flow. The booking form requires the exact passenger
count, saved travelers with documents and valid profile contacts; confirmation
books the flight and creates its order in one idempotent request. Returning with the native-stack back action
reveals the same `AviaSearchResults` instance, preserving FlatList scroll position,
loaded pages, selected filters and their draft state.

Flight checkout shows saved passport documents grouped by traveler on one
screen. Selecting a passport selects its owner as a passenger; selecting another
passport for the same traveler replaces the document. Selection is limited to
the required passenger count. Contact details and the booking action appear on
the same screen. The add form creates a traveler and passport, and the list is
reloaded after saving. Each selected traveler is submitted with the selected
`documentId`.
The traveler form follows the passenger data layout: gender, surname, first and
middle name, birth date, citizenship, passport type and number, validity, and
contact fields. The customer enters first and last name once, in Latin letters
as written in the passport; these values are saved for both the traveler and
the passport. Citizenship and the passport issuing country remain separate.
Flight checkout displays the profile phone and email. If email is missing, the
customer adds it in a modal, which saves it to the profile before booking.
Both contacts are required; the booking request does not contain contact data.
When an offer has a valid nonzero expiry, the details and checkout screens show
the remaining time. Once expired they direct the customer back to search and
prevent booking. Missing, zero or invalid expiry does not enable a client-side
expiry restriction. The server independently validates availability.
When the airline rejects identical buyer and passenger phone numbers, checkout
explains the restriction and directs the customer to support. A confirmed
rejection resets the idempotency key for a new attempt; ambiguous network or
server errors retain it to avoid duplicate bookings.
When order creation reports `FLIGHT_OFFER_NOT_FOUND` or `OFFER_EXPIRED`, the
screen explains that the offer is unavailable and asks the customer to return
to search for a current flight. The booking action is replaced with a button
that returns to the search form; unavailable provider offers behave the same
way. When that error is displayed, the header back action also returns to the
search form; otherwise it returns to the previous screen. The successful booking
screen displays the amount stored in the order.
The passenger-data modal has a fixed top header with a back arrow that closes
the form without saving; the fields scroll below it.
In development (`__DEV__`), the passenger/passport modal starts with editable
fictional values from `features/avia/data/passport.mock.json` on each opening.
The mock includes Latin document names, passport number and expiry, birth date
and contacts. Production keeps the empty form with its existing country and
document-type defaults. Data is saved only after explicit submission.

The share action creates a 30-day public link to a backend-rendered responsive
HTML itinerary. Recipients can open it in a browser without installing the app
or signing in. The page includes route segments, airline, baggage and the price
at sharing time, with a note that price and availability may change. The link
contains no passenger or provider booking data.

## UI

Shared: `PrimaryButton`, `ScreenHeader`.

Feature-owned: `AviaResultCard`.

## Flight details Figma styling

The detail screen follows Figma file `1QaY8axMh0mlQ4Iuk2leY4`, frame
`2055:7685`: 16dp horizontal page padding, 8dp card corners, Gilroy headings,
14/12dp segment typography, pale connection panels and the original local SVG
back/share/check/connection/info assets. Each timeline point includes its local
calendar date below the time. The booking bar stays below the scrolling content
and above the existing application tabs, without covering the route content.
`PrimaryButton` uses its `flightBooking` variant for this compact action.
Existing API data and booking/auth navigation remain the source of content.
The design's sample visa claims, low-cost restrictions and per-passenger tax
breakdown are not shown without corresponding API fields. Existing app tabs
and Android system typography remain platform-native.

Result cards show the local departure and arrival dates below their respective
times, followed by airport codes. Dates retain the provider's calendar day
without conversion to the device time zone, including overnight arrivals.
Duration and the backend stop label appear on separate lines without a slash.

Baggage pills fit their content and wrap when necessary; different segment
allowances use a middle-dot separator so a clipped slash cannot appear.

Connection filter choices and their labels come from `meta.filters.stops`.
The client sends the chosen numeric value as `stopsCount`, including zero;
“Любые” omits the field. For round trips, the count is the maximum of the
outbound and return connection counts (0 means both directions are direct).
Filter metadata covers all raw search offers, before result filters and
pagination, and remains available when filters produce no results.

The airlines shortcut opens the filter sheet scrolled to its airline section.
The general filter button opens at the top. Airline options arrive sorted by
name from the backend (case-insensitive Russian collation, code as tie-breaker).

Flight result error/empty cards use shared `TravelStateCard`, also used by News.

During flight search, the travel fact card changes every seven seconds with a
slow vertical fade transition.

Flight details show each segment’s baggage allowance inside that segment’s
route card, so outbound and return legs can display different conditions.
Each segment also has an information action showing its flight number, route
and available baggage allowance. Segment headers, timeline spacing and transfer
panels follow the flight card in Figma node `2062:1427`.

While flight results are loading, the header has no loading dots. Animated
skeleton flight cards show the expected results layout, with the rotating travel
fact displayed over them.
The skeleton list does not scroll and clips overflow to the available viewport.
Cards stretch across the available width with the same single horizontal inset
as the loaded results.

The Sheremetyevo–Istanbul Airport route is prefilled only in development (`__DEV__`).
Production starts with empty departure and destination fields; search is enabled
after both places and a departure date are selected.

API failures use the shared [error-message catalog](../api-errors.md) in the
existing error UI, preserving backend machine codes for specific guidance.

