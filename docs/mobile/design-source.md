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

Assets extracted from the `.fig` archive are renamed by purpose and stored in
`apps/mobile/src/shared/assets/images/`. Preserve the original bytes. Do not redraw or
replace an available source image with a placeholder.

The native launch screen uses
`travel-splash.png`: iOS stores its
runtime copy in the `TravelSplash` image set and renders it with aspect fill;
Android stores its runtime copy as the `drawable-nodpi/travel_splash` launch
window background.
