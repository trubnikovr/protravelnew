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

## Correlation

Pino records contain `trace_id` and `span_id`. HTTP response metadata contains
`traceId`, and Grafana's Loki data source defines a derived field linking the
log trace ID to Tempo.

## Health behavior

`/api/v1/health` checks Grafana, Collector, Tempo, Loki and Prometheus with a
short timeout. These components have `required: false` and `weight: 0`:

- an outage is visible in health output;
- an outage does not reduce the core score;
- checks execute only for the health request;
- normal API requests never call Grafana or another observability service.

Configuration-as-code lives in `infra/observability`. Docker Compose is not
part of the current architecture phase.
