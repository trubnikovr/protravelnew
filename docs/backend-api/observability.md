# ProTravel backend observability

The observability stack is optional and must never become a runtime dependency
of an API request.

## Signals

- OpenTelemetry auto-instruments inbound/outbound HTTP, PostgreSQL, Redis and
  supported Node.js libraries;
- OTLP traces are stored by Tempo;
- Pino/OpenTelemetry logs are stored by Loki;
- OTLP metrics are exposed to Prometheus by the Collector;
- Grafana provisions Prometheus, Loki and Tempo as data sources.
- Sentry captures unhandled backend exceptions when `SENTRY_DSN` is configured.
  Personal data is not sent by default, and Sentry performance tracing is
  disabled because OpenTelemetry owns distributed tracing.

The backend sends all telemetry only to the OpenTelemetry Collector using
batch exporters. Export failures are handled in the background and do not
change controller responses.

In development, `pino-pretty` renders HTTP access logs as concise single-line
messages (`METHOD URL STATUS DURATION`) and hides the expanded request/response
objects from the terminal. This formatting is transport-only: OpenTelemetry
still receives the original structured Pino record and exports it through the
Collector to Loki. The repository does not currently use Grafana Alloy.

Application code logs only through the transient `AppLogger` facade. The
facade publishes an `application.log.v1` event and performs no logging I/O.
An asynchronous infrastructure listener is the single writer to Pino, keeping
the side effect outside application and domain services. HTTP access logging
uses the same facade; `pino-http` retains request context and correlation but
has its direct auto-logging disabled.
Public flight-share tokens are redacted from access-log paths.

## Correlation

Pino records produced inside an HTTP request contain the optional correlation
fields `trace_id`, `span_id` and `requestId`. Authenticated requests also carry
the verified JWT identity as `userId` and `actorType` (`customer` or `admin`);
PII such as phone, email and names is not added. Public requests and background
work may legitimately omit identity or trace fields.

`HttpAccessLogInterceptor` captures this context once and stores it in
`LogContext` backed by `AsyncLocalStorage`. `AppLogger` merges the current
context into every application log event, so use cases must not add tracing
fields to domain input or pass them through method signatures. HTTP response
metadata contains `traceId`, and Grafana's Loki data source defines a derived
field linking the log trace ID to Tempo.

## Health behavior

`/api/v1/health` checks Grafana, Collector, Tempo, Loki and Prometheus with a
short timeout. These components have `required: false` and `weight: 0`:

- an outage is visible in health output;
- an outage does not reduce the core score;
- checks execute only for the health request;
- normal API requests never call Grafana or another observability service.

Configuration-as-code lives in `infra/observability`. Docker Compose is not
part of the current architecture phase.
