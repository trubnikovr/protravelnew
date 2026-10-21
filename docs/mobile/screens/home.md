# Home

## Source

PDF page 1, with the updated profile/header direction from page 54 where it
does not conflict.

## Routes

- Default application route: `Main` → `Home`.
- Bottom tab: `Home`.
- Home stack: `HomeOverview`.
- Home stack: `TourDetails`, parameter `tourId: string`.

## Sections

1. Generated customer initial badge, compass brand icon with the application title,
   and notification action.
2. Active backend-controlled system messages.
3. Search field and filter shortcut.
4. Product categories.
5. Recommended hotels.
6. Popular destinations.
7. Hot tours.

Recommended tours, popular destinations and hot tours are loaded together
from `GET /api/v1/home`. Product categories remain local navigation actions.
The screen handles loading, empty, error/retry and content states.

Active banners are loaded from `GET /api/v1/system-messages` and displayed
below the header. `info` uses the purple brand palette; `error` uses the red
danger palette. An empty or failed banner request does not block Home content.

Remote tour covers are rendered through
`GET /api/v1/files/image-transform` with the fixed backend-owned `home-card`
preset. Every cover and popular-destination card has the same fixed `140dp`
image height; the server returns a `600x420` cover-cropped WebP.
When a tour has no uploaded cover, the mobile application displays a bundled
design fallback image.

The four product categories use an adaptive four-column row. All category
cards must remain visible within the screen width without horizontal scrolling.

Recommended hotels, popular destinations and hot tours use adaptive
two-column rows. Both cards in every section remain visible within the screen
width without horizontal scrolling.

Recommended and hot-tour cards use the same 4:3 cover-image area so paired
photos and card rows remain equal in height.

## Actions

- Search field and filter open the Tours catalog. The Tours category opens the
  Tours tab, and the Flights category opens the Flights form.
- Notification bell opens the News tab and displays the current unread count;
  the badge is hidden when every news article has been read.
- The customer badge opens Profile and uses the first name initial or the last
  two phone digits while profile data is incomplete.
- Recommended and hot-tour cards open details for the selected backend tour.
- A selected card loads its full content from `GET /api/v1/tours/:id`; the
  primary action opens Bookings inside Profile.

## UI

Shared: `SectionHeader`, `ScreenHeader`, `PrimaryButton`.

Feature-specific: `CategoryCard`, `HotelCard`, `DestinationCard`.

The `home` TanStack Query owns the Home request and maps API DTOs to card view
models. Details use their own versioned generated DTO and TanStack Query cache.
The cache remains fresh for one minute, is retained for 30 minutes while
inactive, and refreshes in the background when Home receives focus again.
