# Travel facts

Travel facts are short, administrator-managed messages shown while the mobile
application waits for flight search results.

## Persistence

`travel_facts` stores Russian text, optional ISO 3166-1 alpha-2 country code,
optional IATA destination code, tags and publication state. An entry with no
country or destination is a global fallback.

## Mobile API

`GET /api/v1/travel-facts?destinationCode=PQC&limit=5` returns up to ten
published facts for a client-side rotation; five is the default. The endpoint
randomizes the returned set so the mobile application needs only one request
per loading state. `GET /api/v1/travel-facts/random` remains available for
consumers that need one fact. Selection priority is:

1. exact destination IATA code;
2. the destination airport's country from reference data;
3. a global fact.

Only the best available scope is used, and records within that scope are
selected randomly. An empty list is a valid result and must not block flight
search.

## Admin API

Administrators with `content.read` can list all facts. `content.write` allows
creation, partial update, publication changes and deletion under
`/api/v1/admin/travel-facts`.

Facts concerning laws, entry requirements, safety, money or other changing
conditions must be reviewed before publication. Runtime AI generation is not
used; the database contains the reviewed source of truth.

## Initial content

Migration `0027_seed_travel_facts.sql` publishes 50 stable cultural,
geographical and historical facts: five each for Moscow (`MOW`), Saint
Petersburg (`LED`), Tashkent (`TAS`), Bangkok (`BKK`), Phuket (`HKT`), Cairo
(`CAI`), Sharm El Sheikh (`SSH`), Phu Quoc (`PQC`), Dubai (`DXB`) and Istanbul
(`IST`). Administrators can revise or unpublish every seeded record through the
same CRUD interface.
