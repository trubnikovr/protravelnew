# Design source

## Files

- `design/Travel Mobile App.pdf` — visual source of truth, 67 exported pages.
- `design/Travel Mobile App.fig` — binary Figma archive used to retrieve original
  image assets.

Neither file is bundled into the application.

## Relevant PDF groups

- Pages 1–12: primary home, search, passenger/filter, result and booking flow.
- Pages 27–31: tour listing, details and checkout flow.
- Pages 37–41: flight details and checkout flow.
- Pages 54–64: current home/profile/settings/personal-data variants.
- Page 67: news.

Other pages include references and visual explorations. When variants conflict,
prefer the consistent purple ProTravel system used on pages 1–12 and 54–64.

## Asset policy

The Android and iOS app icons use `design/app-icon-concepts/02-suitcase.png`.
Native icon resources are resized copies of that image; Android also has
circle-cropped launcher variants. Rebuild the native app to see icon changes.

Assets extracted from the `.fig` archive are renamed by purpose and stored in
`apps/mobile/src/shared/assets/images/`. Preserve the original bytes. Do not redraw or
replace an available source image with a placeholder.

The native launch screen uses
`travel-splash.png`: iOS stores its
runtime copy in the `TravelSplash` image set and renders it with aspect fill;
Android stores its runtime copy as the `drawable-nodpi/travel_splash` launch
window background.

The launch artwork is a people-free illustration matching the Profile and
Tours visual style: a plane above a coastal bay, lavender mountains,
terracotta buildings and an ochre suitcase with a map and sunhat. Both native
platforms use the same generated PNG. The built-in image generation prompt is
recorded in `design/splash-background-prompt.md`. Native app rebuilding is
required to update the launch image; Metro reload alone does not replace it.
