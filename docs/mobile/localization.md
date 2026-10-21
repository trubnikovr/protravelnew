# Localization

ProTravel ships with Russian (`ru`) as its only UI language.

## Source files

- `apps/mobile/src/shared/i18n/resources.ts` — synchronized dictionaries;
- `apps/mobile/src/shared/i18n/i18n.ts` — i18next initialization and supported languages;
- `apps/mobile/src/shared/i18n/index.ts` — public exports.

The interface always starts in Russian. The i18next boundary remains so copy
does not have to be hardcoded in components.

## Rules

- Never place user-facing text directly in a component.
- Add every new key to the Russian dictionary.
- Proper names, IATA codes, currency codes and user-entered values are not
  translated.
- Use interpolation and plural rules for dynamic copy instead of assembling
  translated sentences from fragments.
- New features must include translations before their screens are considered
  complete.

Language persistence will be connected to the application storage layer when
local settings persistence is introduced.
