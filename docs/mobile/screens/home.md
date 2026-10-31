# Home

## Source

PDF page 1 for category and offer-card layout.

## Routes

- Default application route: `Main` → `Home`.
- Bottom tab: `Home`.
- Home stack: `HomeOverview`.
- Home stack: `TourDetails`, parameter `tourId: string`.

## Sections

1. Product categories in an evenly spaced four-column row.
2. Active backend-controlled system messages.
3. Recommended tours.
4. Popular destinations.
5. Hot tours.

Recommended tours, popular destinations and hot tours are loaded together
from `GET /api/v1/home`. Product categories remain local navigation actions.
The screen handles loading, empty, error/retry and content states.
The error state uses a compact branded travel emblem above its message: a
white takeoff-plane icon and route trail on the purple gradient, followed by
the retry action.

Active banners are loaded from `GET /api/v1/system-messages` and displayed
below the category row. `info` uses the purple brand palette; `error` uses the red
danger palette. An empty or failed banner request does not block Home content.

Remote tour covers are rendered through
`GET /api/v1/files/image-transform` with the fixed backend-owned `home-card`
preset. Every cover and popular-destination card has the same fixed `140dp`
image height; the server returns a `600x420` cover-cropped WebP.
When a tour has no uploaded cover, the mobile application displays a bundled
design fallback image.

The four product categories use an adaptive four-column row. All category
cards must remain visible within the screen width without horizontal scrolling.
The top inset above the categories and the gap below them before Recommended
use the same `24dp` spacing.

Recommended tours and hot tours use the shared `TourOfferCard` component, as
does the Tours catalog. Their cover, title, details, price, sizing and shadow
styles stay consistent; Home adds its rating and hot badges. Popular
destinations use adaptive
two-column rows. Both cards in every section remain visible within the screen
width without horizontal scrolling.
The price follows the location and duration with the standard `12dp` spacing;
the card does not add a flexible empty spacer before the price.

Recommended and hot-tour cards use the same 4:3 cover-image area so paired
photos and card rows remain equal in height.
Package-tour covers show the white star badge from the Home design. Its number
comes from the tour `hotelCategory` value managed in the admin dashboard; the
badge is hidden when the category is not set.

## Actions

- The Tours category opens the Tours tab, and the Flights category opens the
  Flights form.
- Recommended and hot-tour cards open details for the selected backend tour.
- A selected card loads its full content from `GET /api/v1/tours/:id`; the
  primary action opens Bookings inside Profile.

## UI

Shared: `SectionHeader`, `ScreenHeader`, `PrimaryButton`.

Feature-specific: `CategoryCard`, `RecommendedTourCard`, `DestinationCard`.

The `home` TanStack Query owns the Home request and maps API DTOs to card view
models. Details use their own versioned generated DTO and TanStack Query cache.
The cache remains fresh for one minute, is retained for 30 minutes while
inactive, and refreshes in the background when Home receives focus again.
