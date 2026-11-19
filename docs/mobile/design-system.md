# Design system

## Theme

All visual tokens live in `apps/mobile/src/shared/theme/theme.ts`.

The exported `theme` contains:

- `colors` — brand, semantic, surface and text colors;
- `fonts` — families and supported weights;
- `fontSizes` and `lineHeights`;
- `spacing` — the 4/8/12/16/20/24/32/40 scale;
- `radii` — controls, cards and pill shapes;
- `sizes` — common control and layout dimensions;
- `shadows` — Home cards, general cards and floating elevation. Every category,
  recommended, destination and hot-tour card on Home uses the Figma shadow
  `0 2 13 0` with the exact `#0000000D` opacity (`13/255`); Android uses the
  closest platform elevation equivalent.

Home section headings use the Figma Gilroy Bold `18/18` style. Titles inside
Home cards use Gilroy Bold `14/15`; supporting gray text uses SF Pro Display
Regular `12/12`; prices use SF Pro Display Bold `16/16`. The provided Gilroy
package contains Light and ExtraBold only, so the ExtraBold face is used for
the requested bold style. SF Pro Display renders through the native iOS system
font; Android uses its system sans-serif fallback.
The Home section “Показать все” action uses SF Pro Display Semibold `14/24`
with zero letter spacing.
Labels under Home category icons use SF Pro Display Medium `12px`, `15px`
line-height, `-0.48px` letter spacing, centered.
All four category illustrations render proportionally inside the same fixed
`50x50dp` icon slot.

The exported `typography` object contains ready-to-use text presets. Screens
should spread a preset and only override its color with another theme token
when necessary.

The product typeface is SF Pro Display. On iOS it is provided through the
native `System` family so it works on physical devices with the correct Apple
font metrics. Android uses the platform sans-serif fallback because Apple font
files must not be bundled or redistributed there.

## Shared UI inventory

### `PrimaryButton`

Location: `apps/mobile/src/shared/ui/PrimaryButton.tsx`

Use for the main action on forms and sheets. Supports disabled and loading
states. The `booking` variant matches the pinned booking action used on flight
and tour details: 44dp height, 4dp corners and the booking primary color.

### `AppTextField`

Location: `apps/mobile/src/shared/ui/AppTextField.tsx`

Standard outlined form field with a floating-style label and an optional
trailing action/icon. Profile forms use it for text, date, select, telephone
and password inputs.

### `FilterChoice`

Location: `apps/mobile/src/shared/ui/FilterChoice.tsx`

Use for compact pill-shaped choices in filter and selection groups. The
component owns the default, pressed and selected appearance and exposes only
`label`, `selected` and `onPress`. Flight filters, cabin-class selection and
tour filters use this shared component. It is a UI selection control rather
than a form field because it does not own or validate form state.

Flight-card airline badges use `typography.airlineBadge` and dedicated theme
size tokens: 71×19, 8px radius and 6px horizontal padding. Their centered text
uses SF Pro Display Semibold at 12/14.
The adjacent baggage badge uses 72×20, the same 8px radius and 6px horizontal
padding.

### `SectionHeader`

Location: `apps/mobile/src/shared/ui/SectionHeader.tsx`

Use above horizontal content sections. Supports the standard “Показать все”
action and a light variant for brand-colored backgrounds.

### `ScreenHeader`

Location: `apps/mobile/src/shared/ui/ScreenHeader.tsx`

Use for standard inner-page headers. Supports an optional back action and a
right-side action slot. An optional one-line subtitle can display compact route
or context metadata without changing single-line headers elsewhere.

### `TourOfferCard`

Location: `apps/mobile/src/shared/ui/TourOfferCard.tsx`

Shared tour card layout for the Home recommendations and Tours catalog. Both
screens use the same image, text, price, sizing and shadow styles; Home can add
the hotel-category and hot-tour badges over the image through the optional
`hotelCategory` and `hot` props. Enabled badges are aligned in one horizontal
row rather than positioned independently. The shared card radius is `8dp`.

## Feature UI

### `SystemMessagesBanner`

Location:
`apps/mobile/src/features/system-messages/components/SystemMessagesBanner.tsx`

Displays backend-controlled operational messages near the top of Home. The
component supports only semantic `info` and `error` variants and uses existing
brand/danger theme tokens instead of screen-local colors.

Home-specific wrappers remain under
`apps/mobile/src/features/home/components/HomeCards.tsx`:

- `CategoryCard`
- `RecommendedTourCard`
- `DestinationCard`

`RecommendedTourCard` adapts Home data and badges to the shared `TourOfferCard`.

The bottom navigation uses the five product SVG shapes from
`apps/mobile/src/shared/assets/bottom-icons`, exposed as color-aware React
Native SVG components through `BottomTabIcons.tsx`.

They should move to `shared/ui` only when another feature uses the same visual
and behavioral contract.

Profile-specific `TravelerCard` remains under
`apps/mobile/src/features/profile/components/TravelerCard.tsx`.

## Adding components

Before creating a component:

1. Check this inventory.
2. Check the current feature's `components/`.
3. Prefer a variant of an existing component over a near-duplicate.
4. Add new colors and typography only through the theme.
5. Document reusable public components here.

### `ConnectionBanner`

Shared connection notice rendered above the bottom tab bar, within the layout
rather than over screen actions. Horizontal safe-area insets are respected; the
tab bar owns the bottom inset. Network failures, 60-second request timeouts and
HTTP 502/503/504 share one localized message. The notice remains until an API
request receives a reachable response. Retry refetches active queries only,
never booking/payment mutations. Connectivity is detected through API requests,
not through a native network monitor; idle connectivity changes appear on the
next request. Native modal windows retain their own error presentation.

### `TravelStateCard`

Shared by flight search results, the News feed and the Tours catalog for error states (also empty
states in flight search). Provides the travel icon, centered title and message,
white rounded surface with a shadow, and an optional retry action. Screens own
placement and localized copy.
