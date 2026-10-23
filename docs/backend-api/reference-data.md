# Reference data seed

## Mobile API

`GET /api/v1/reference/countries` returns a paginated country list for
citizenship and issuing-country selectors. `Accept-Language: ru|uz|en`
selects the localized name with Russian fallback; `search` matches ISO code
and every available translation.

`GET /api/v1/reference/suggest` searches countries, cities and airports for
mobile and administrative autocomplete fields. `types` accepts a comma-
separated subset, while `countryId` limits city and airport results. Each city
suggestion includes both its normalized country ID and display name so clients
can persist an unambiguous country/city pair.

Airport suggestions also match the linked city's localized names. This lets a
flight selector turn a query such as `Москва` into selectable airport codes
such as `DME`, `SVO` and `VKO`; city suggestions without an IATA code are not
sent as flight-search locations.

Flight-location autocomplete ranking is owned by this endpoint. Matching
active featured locations are resolved and returned first in their configured
order, followed by ordinary matches without duplicates. Featured matching
uses the location code, name and country. Independent database reads for the
featured, country, city and airport result sets run concurrently.

`GET /api/v1/reference/featured-flight-locations` exposes the active ordered
configuration when it is needed independently. Administrators with content
permissions manage the complete list through
`GET|PUT /api/v1/admin/featured-flight-locations`. The replacement operation
supports up to 30 IATA or metropolitan location codes.

The backend owns the source files under
`apps/backend-api/seeds/reference`:

- `country.csv` — legacy countries, semicolon-delimited;
- `city.csv` — legacy cities and regions, semicolon-delimited;
- `airoports.csv` — airport data, pipe-delimited; the historical filename and
  duplicated source columns are preserved deliberately.

Run:

```sh
npm run backend:db:migrate
npm run backend:seed:reference
```

The importer is idempotent. It creates deterministic UUIDs and uses upsert, so
running the command again updates reference values without duplicating rows.
Legacy country, city and region IDs are retained. Countries are enriched with
ISO and English names from the airport source. Countries and cities absent in
the legacy files are created from airport data, allowing every valid airport
to reference a normalized country and, where provided, a city.

The first verified import produced 245 countries, 18,911 cities and 9,375
airports. Every table contains `createdAt` and `updatedAt`; IATA and ISO codes
are protected by unique indexes.
