import 'dotenv/config';
import * as Sentry from '@sentry/nestjs';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-proto';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';

const enabled = process.env.OTEL_ENABLED === 'true';

Sentry.init({
  dsn: process.env.SENTRY_DSN || undefined,
  environment: process.env.NODE_ENV ?? 'development',
  release: process.env.npm_package_version,
  tracesSampleRate: 0,
});

if (enabled) {
  const endpoint = (
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://127.0.0.1:4318'
  ).replace(/\/$/, '');
  const exportIntervalMillis = Number(
    process.env.OTEL_EXPORT_INTERVAL_MS ?? 10_000,
  );
  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]:
        process.env.OTEL_SERVICE_NAME ?? 'protravel-backend-api',
      [ATTR_SERVICE_VERSION]: process.env.npm_package_version ?? '0.1.0',
      'deployment.environment.name': process.env.NODE_ENV ?? 'development',
    }),
    traceExporter: new OTLPTraceExporter({
      url: `${endpoint}/v1/traces`,
      timeoutMillis: 3_000,
    }),
    metricReaders: [
      new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
          url: `${endpoint}/v1/metrics`,
          timeoutMillis: 3_000,
        }),
        exportIntervalMillis,
        exportTimeoutMillis: 3_000,
      }),
    ],
    logRecordProcessors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: `${endpoint}/v1/logs`,
          timeoutMillis: 3_000,
        }),
        scheduledDelayMillis: exportIntervalMillis,
        exportTimeoutMillis: 3_000,
      }),
    ],
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': { enabled: false },
        '@opentelemetry/instrumentation-pino': {
          logHook: (span, record) => {
            const spanContext = span.spanContext();
            record.trace_id = spanContext.traceId;
            record.span_id = spanContext.spanId;
          },
        },
      }),
    ],
  });

  sdk.start();
  const shutdown = (): void => {
    void sdk.shutdown().catch(() => undefined);
  };
  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
}
