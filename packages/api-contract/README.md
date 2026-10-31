# ProTravel API contract

Эта директория — общая точка обмена API-контрактом между backend, mobile и
admin dashboard.

- `v1/mobile.openapi.json` генерируется из mobile controllers и DTO версии 1;
- `v1/admin.openapi.json` генерируется из admin controllers и DTO версии 1;
- новая версия добавляется рядом (`v2`, `v3`), не перезаписывая старую;
- файл нельзя редактировать вручную;
- контракты автоматически сохраняются при старте NestJS;
- изменение API и обновление соответствующего контракта входят в один commit.

Consumers do not maintain endpoint typings by hand:

- `npm run mobile:api:generate` generates the React Native TypeScript Fetch
  client in `src/shared/api/generated/v1` from `v1/mobile.openapi.json`;
- `npm run dashboard:api:generate` generates the admin TypeScript Fetch client from
  `v1/admin.openapi.json` in `src/shared/api/generated/v1`.

Version imports are always explicit (`generated/v1`, later `generated/v2`), so
an application can use both versions during a gradual migration. Each version
must be regenerated whenever its OpenAPI contract changes.

Swagger UI остаётся постоянным: mobile API доступен по адресу
`/api/mobile/docs`, admin API — `/api/admin/docs`. Версия выбирается в
выпадающем списке Swagger. Машиночитаемые контракты доступны отдельно, например
`/api/v1/mobile/openapi.json` и `/api/v1/admin/openapi.json`.

Корневые `mobile.openapi.json`, `admin.openapi.json` и соответствующие HTTP
JSON URL временно остаются алиасами текущей версии `v1` для совместимости.

Flight offer and segment responses include a required localized `baggageLabel`.
The API mapper owns baggage wording, plural forms and the deduplicated offer
summary; raw `baggage` remains available for compatibility. Unknown allowances
are labeled as pending rather than interpreted as no baggage. Mobile renders
these strings verbatim without PC/KG parsing or local fallback copy.

Flight search accepts optional `stopsCount` for an exact connection count,
including `0`. For multiple itineraries this is the maximum connection count
across directions, matching `meta.filters.stops[].value`. Existing `maxStops`
and `directOnly` parameters remain supported. Stop options include a localized
`label` from the API mapper. All filter metadata is calculated from raw provider
offers before filtering/pagination, including empty filtered results. Changing
`stopsCount` reuses the same raw search cache.
