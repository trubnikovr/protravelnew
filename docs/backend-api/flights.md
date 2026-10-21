# Flight search module

The flight module implements asynchronous provider-neutral flight search from
`docs/stdCBSapii.doc`. Its dependency direction is:

```text
mobile controller → application use case → FlightProviderPort
                                      ↘ MockFlightProvider | CbsFlightProvider
```

## API and orchestration

```text
POST /api/v1/flights/searches
GET  /api/v1/flights/searches/{searchId}
GET  /api/v1/flights/searches/{searchId}/results
GET  /api/v1/flights/offers/{offerId}
POST /api/v1/flights/offers/{offerId}/revalidate
GET  /api/v1/flights/offers/{offerId}/fare-rules
```

`CreateFlightSearchUseCase` validates input, creates the aggregate and queues
processing. `ProcessFlightSearchUseCase` calls the configured provider,
normalizes and saves offers, then completes or fails the search. The remaining
use cases read search state/results/offers, revalidate an offer and fetch fare
rules. Controllers contain no orchestration.

Search validation requires at least one adult, no more than nine passengers,
infants not exceeding adults, different origin/destination codes, non-past
dates and chronologically ordered multi-city legs.

CBS tokens exist only in the internal `FlightOffer.providerReference`. Public
consumers receive ProTravel UUIDs and never depend on a provider token.

## Providers

Local development defaults to the deterministic `mock` provider. CBS uses:

```dotenv
FLIGHT_PROVIDER=cbs
CBS_BASE_URL=https://provider.example/stdcbs
CBS_FARE_RULES_URL=https://provider.example/readFlightRules
CBS_AGENCY_ID=...
CBS_USER_ID=...
CBS_PASSWORD=...
CBS_LOCALE=ru
CBS_TIMEOUT_MS=30000
CBS_DEFAULT_CURRENCY=RUB
CBS_AMOUNT_MULTIPLIER=1
```

`CbsFlightProvider` maps `SEARCHFR`, `SELECTFR` and `readFlightRules` behind
`FlightProviderPort`. The signing implementation follows the supplied legacy
document: MD5 of the literal ordered string
`agency=<id>&password=<password hash>&time=<request time>&user=<id>`. The exact
same `time` value is sent in `context.time`. A real signing fixture must be
confirmed with the provider before production credentials are enabled.

The legacy response does not explicitly declare currency or minor-unit
semantics. `CBS_DEFAULT_CURRENCY` and `CBS_AMOUNT_MULTIPLIER` keep those
assumptions configurable. The public contract always returns an integer
minor-unit string and a currency enum.

CBS segment timestamps are local values without an offset and remain
`departureLocal`/`arrivalLocal`; they are not falsely marked as UTC. A CBS
`timeLimit` with an offset is normalized to ISO 8601.

Search departure dates are calendar values. CBS receives
`YYYY-MM-DDT00:00:00` without a fabricated offset. If the live provider
requires an offset, it must be calculated from the origin airport IANA time
zone for that departure date; a fixed `+05:00` is forbidden.

## Persistence and scaling

The application depends on `FlightSearchRepository`. Its current in-memory
adapter and 30-minute domain TTL are intended for one local Nest process.
Before multi-replica Kubernetes or production, add a Redis adapter implementing
the same port and enforcing TTL for searches, offers and provider tokens.
BullMQ already supplies the background processing boundary.

Provider failures set search status to `failed` with stable code
`PROVIDER_UNAVAILABLE`. Precise `PRICE_CHANGED`, `SOLD_OUT` and
`OFFER_EXPIRED` mapping needs real CBS error response fixtures.
