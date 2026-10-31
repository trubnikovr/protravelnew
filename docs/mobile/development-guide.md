# ProTravel Mobile — Development Guide

## Product context

ProTravel is a bare React Native travel application for iOS and Android.
The visual source of truth is `design/Travel Mobile App.pdf`. The matching
`design/Travel Mobile App.fig` archive is used only to retrieve original
raster assets.

Before implementing a screen, read:

1. `docs/mobile/README.md`
2. `docs/mobile/architecture.md`
3. `docs/mobile/design-system.md`
4. The matching file under `docs/mobile/screens/`

## Architecture

Use feature-based boundaries:

```text
apps/mobile/src/
  app/             # application bootstrap and navigation
  features/        # product features, grouped by user capability
  shared/          # theme, generic UI and shared assets
```

Each feature may contain:

```text
features/<feature>/
  components/      # UI used only by this feature
  data/            # fixtures, adapters and feature data
  screens/         # navigable screens
  hooks/           # feature-specific stateful logic
  index.ts         # public feature exports
```

Rules:

- `shared` must never import from `features`.
- A feature must not import another feature's internal file. Import its public
  `index.ts` when cross-feature reuse is genuinely necessary.
- `app` composes features and owns navigation.
- Keep product-specific cards inside their feature. Move a component to
  `shared/ui` only after it is used by at least two features.
- Keep screen files focused on composition; extract repeated visual blocks.

## Design system

- `src/shared/theme/theme.ts` is the single source of truth for every color,
  font family, font size, line height, radius, spacing scale and reusable
  shadow.
- Do not add hexadecimal, RGB/RGBA, or named colors outside the theme file.
- Do not declare `fontFamily`, ad-hoc font sizes, or font weights outside the
  theme file. Use `typography` presets and theme tokens.
- Reuse components documented in `docs/mobile/design-system.md` before adding new UI.
- Original design assets belong in `src/shared/assets/images/` with meaningful
  names. Do not ship PDF page screenshots as application UI.
- The PDF is a visual reference, not a runtime dependency.

## Localization

- Every user-facing string must use `react-i18next`.
- Dictionaries live in `src/shared/i18n/resources.ts`.
- Add every new key to the Russian dictionary.
- Do not translate proper names, IATA/currency codes or user-entered values.
- See `docs/mobile/localization.md` before adding screen copy.

## Screens and documentation

- Every navigable screen belongs to a feature and must have a matching entry in
  `docs/mobile/screens/`.
- Update the screen document when routes, states, actions, or reusable
  components change.
- Keep route parameter types in `src/app/navigation/types.ts`.
- New async states must cover loading, empty, error and content when applicable.

## API contracts

- Request and response interfaces come from
  `packages/api-contract/v1/mobile.openapi.json`; do not duplicate backend DTOs
  by hand in a mobile feature.
- Run `npm run mobile:api:generate` from the repository root after a mobile API
  controller or DTO changes. Generated code is written to
  `apps/mobile/src/shared/api/generated/v1` and must not be edited manually.
- Imports always name the API version explicitly. When `v2` is introduced its
  generated client lives beside `v1`, allowing screens to migrate separately.
- Feature API modules may keep the shared authenticated HTTP transport, but
  their inputs, outputs and JSON date conversion must use the generated models
  and serializers.
- Commit the backend DTO/controller, refreshed OpenAPI document and regenerated
  mobile client together.

## Verification

Временно тесты мобильного приложения не добавляем и не запускаем до отдельного
указания пользователя. Существующие тесты сохраняем. Проверки TypeScript и ESLint
остаются обязательными.

Use Node from the repository-root `.nvmrc` and JDK 17 for Android. The Android
npm script validates the active Java runtime, discovers JDK 17 automatically on
macOS and leaves Metro ownership to the separately started `mobile:start`
process.

Run before handing work off:

```sh
nvm use
npm run mobile:typecheck
npm run mobile:lint
```

For native dependency or navigation changes also run:

```sh
cd apps/mobile/ios && pod install && cd ../../..
npm run mobile:ios
npm run mobile:android
```

Do not apply `npm audit fix --force`; it can downgrade React Native.
