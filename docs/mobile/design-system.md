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
- `shadows` — card and floating elevation.

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
states.

### `AppTextField`

Location: `apps/mobile/src/shared/ui/AppTextField.tsx`

Standard outlined form field with a floating-style label and an optional
trailing action/icon. Profile forms use it for text, date, select, telephone
and password inputs.

### `SectionHeader`

Location: `apps/mobile/src/shared/ui/SectionHeader.tsx`

Use above horizontal content sections. Supports the standard “Показать все”
action and a light variant for brand-colored backgrounds.

### `ScreenHeader`

Location: `apps/mobile/src/shared/ui/ScreenHeader.tsx`

Use for standard inner-page headers. Supports an optional back action and a
right-side action slot.

## Feature UI

### `SystemMessagesBanner`

Location:
`apps/mobile/src/features/system-messages/components/SystemMessagesBanner.tsx`

Displays backend-controlled operational messages near the top of Home. The
component supports only semantic `info` and `error` variants and uses existing
brand/danger theme tokens instead of screen-local colors.

Home-specific cards remain under
`apps/mobile/src/features/home/components/HomeCards.tsx`:

- `CategoryCard`
- `HotelCard`
- `DestinationCard`

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
