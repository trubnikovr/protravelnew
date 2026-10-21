# ProTravel Observability

Configuration-as-code for the optional observability stack:

- OpenTelemetry Collector receives OTLP HTTP/gRPC;
- Tempo stores traces;
- Loki stores structured logs;
- Prometheus stores metrics exposed by the Collector;
- Grafana visualizes and correlates all three signals.

No Docker Compose or runtime environment is defined at the current
architecture stage. Deployment must mount each configuration file into the
corresponding service.

Use the OpenTelemetry Collector Contrib distribution because the configuration
uses the Prometheus exporter. Grafana provisions all data sources and the
`ProTravel Backend Overview` dashboard from version-controlled files.

## Ports

| Service | Port | Purpose |
|---|---:|---|
| Grafana | 3001 | UI and `/api/health` |
| OTel Collector | 4317 | OTLP gRPC |
| OTel Collector | 4318 | OTLP HTTP |
| OTel Collector | 13133 | health extension |
| Tempo | 3200 | query API and readiness |
| Loki | 3100 | logs API and readiness |
| Prometheus | 9090 | metrics API and readiness |

The backend exports telemetry only to the Collector. Exporters use batching,
queues, short timeouts and retries, so an unavailable observability stack must
never fail an API request. Grafana, Tempo, Loki, Prometheus and Collector are
checked only when `/api/v1/health` is requested; they have zero score weight.
