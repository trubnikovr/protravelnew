# Admin dashboard localization

The administrative interface supports Russian (`ru`) through `i18next` and
`react-i18next`.

- translations and the supported-language enum live in
  `src/shared/i18n/i18n.ts`;
- the interface defaults to Russian;
- dates are formatted with the Russian interface locale;
- tour list titles use Russian content.

New UI text must be added in Russian and rendered through
`useTranslation`. Backend error codes should be mapped to localization keys;
raw server error messages are only a fallback.
