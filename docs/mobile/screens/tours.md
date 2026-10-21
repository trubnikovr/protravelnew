# Tours

## Routes

- Bottom tab: `Tours`;
- Tours stack: `TourCatalog`;
- Tours stack: `TourDetails`;
- Tours stack: `TourBooking`;
- Tours stack: `AddBookingTraveler`.

## Catalog

The tab opens a two-column catalog immediately; it does not show a second
search form. Cards come from the paginated `GET /api/v1/tours` endpoint.

The header filter button opens a bottom sheet. The sheet follows the mobile
reference layout and contains only destination and recommended/price sorting.
Traveller counts belong to checkout rather than catalog filtering. Draft
changes affect the catalog only after the primary Apply action. Active filters
can be reset from the result header.

Destination and sorting values are sent to the backend. A separate unfiltered
catalog query supplies stable destination options and shares the TanStack
Query cache.

Tour cards open the shared detail screen backed by `GET /api/v1/tours/:id`.
It renders every customer-facing field received from the API: descriptions,
destinations, duration, price, availability dates, departures, package or
excursion attributes, inclusions/exclusions, program days and gallery. The
cover and every `galleryImages` item form a horizontally paged carousel with a
visible current-page indicator when more than one image is available.

The Book action opens `TourBooking` for an authenticated customer. Otherwise
it opens phone/SMS authentication over `TourDetails` and continues to checkout
after verification without discarding the selected tour.

## States

- loading;
- recoverable backend error;
- empty after filtering;
- populated two-column catalog.
- detail loading/error/content.
