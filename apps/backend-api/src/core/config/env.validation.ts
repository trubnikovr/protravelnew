import Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  API_PREFIX: Joi.string().default('api'),
  CORS_ORIGINS: Joi.string().default('http://localhost:8081'),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().port().default(5432),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().allow('').required(),
  DATABASE_SSL: Joi.boolean().truthy('true').falsy('false').default(false),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().port().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').default(''),
  CUSTOMER_JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  CUSTOMER_JWT_ACCESS_TTL_SECONDS: Joi.number()
    .integer()
    .positive()
    .default(900),
  CUSTOMER_JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  CUSTOMER_JWT_REFRESH_TTL_SECONDS: Joi.number()
    .integer()
    .positive()
    .default(2_592_000),
  ADMIN_JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  ADMIN_JWT_ACCESS_TTL_SECONDS: Joi.number().integer().positive().default(900),
  DOCUMENT_ENCRYPTION_KEY: Joi.string().hex().length(64).required(),
  NOTIFICATION_ENCRYPTION_KEY: Joi.string()
    .hex()
    .length(64)
    .allow('')
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.required().disallow(''),
      otherwise: Joi.string().allow('').default(''),
    }),
  DEFAULT_LOCALE: Joi.string().valid('ru', 'uz', 'en').default('ru'),
  DEFAULT_CURRENCY: Joi.string().valid('RUB', 'USD', 'EUR').default('RUB'),
  APP_TIME_ZONE: Joi.string().default('Asia/Tashkent'),
  PAYMENT_PROVIDER: Joi.string().valid('mock', 'raiffeisen').default('mock'),
  PAYMENT_RETURN_URL: Joi.string().default('protravel://payments/result'),
  RAIFFEISEN_BASE_URL: Joi.string().uri().default('https://pay-test.raif.ru'),
  RAIFFEISEN_PUBLIC_ID: Joi.string()
    .allow('')
    .default('')
    .when('PAYMENT_PROVIDER', {
      is: 'raiffeisen',
      then: Joi.required().disallow(''),
    }),
  RAIFFEISEN_SECRET_KEY: Joi.string()
    .allow('')
    .default('')
    .when('PAYMENT_PROVIDER', {
      is: 'raiffeisen',
      then: Joi.required().disallow(''),
    }),
  RAIFFEISEN_TIMEOUT_MS: Joi.number()
    .integer()
    .min(1_000)
    .max(60_000)
    .default(15_000),
  FLIGHT_PROVIDER: Joi.string().valid('mock', 'ttbooking').default('mock'),
  TTBOOKING_BASE_URL: Joi.string().uri().allow('').default(''),
  TTBOOKING_FARE_RULES_URL: Joi.string().uri().allow('').default(''),
  TTBOOKING_AGENCY_ID: Joi.string().allow('').default(''),
  TTBOOKING_USER_ID: Joi.string().allow('').default(''),
  TTBOOKING_PASSWORD: Joi.string().allow('').default(''),
  TTBOOKING_SECRET_KEY: Joi.string().allow('').default(''),
  TTBOOKING_LOCALE: Joi.string().valid('ru').default('ru'),
  TTBOOKING_TIMEOUT_MS: Joi.number()
    .integer()
    .min(1_000)
    .max(120_000)
    .default(30_000),
  TTBOOKING_DEFAULT_CURRENCY: Joi.string()
    .valid('RUB', 'USD', 'EUR')
    .default('RUB'),
  TTBOOKING_AMOUNT_MULTIPLIER: Joi.number().positive().default(1),
  UPLOAD_DIRECTORY: Joi.string().default('apps/backend-api/uploads'),
  PUBLIC_API_URL: Joi.string().uri().allow('').default(''),
  LOG_LEVEL: Joi.string()
    .valid('fatal', 'error', 'warn', 'info', 'debug', 'trace')
    .default('info'),
  SENTRY_DSN: Joi.string().uri().allow('').default(''),
  SENTRY_ENVIRONMENT: Joi.string().allow('').default(''),
  SENTRY_RELEASE: Joi.string().allow('').default(''),
  SENTRY_TRACES_SAMPLE_RATE: Joi.number().min(0).max(1).default(0),
  HEALTH_MAX_HEAP_PERCENT: Joi.number().min(50).max(100).default(90),
  OTEL_ENABLED: Joi.boolean().truthy('true').falsy('false').default(false),
  OTEL_SERVICE_NAME: Joi.string().default('protravel-backend-api'),
  OTEL_EXPORTER_OTLP_ENDPOINT: Joi.string()
    .uri()
    .default('http://127.0.0.1:4318'),
  OTEL_EXPORT_INTERVAL_MS: Joi.number().integer().min(1_000).default(10_000),
  OBSERVABILITY_HEALTH_TIMEOUT_MS: Joi.number()
    .integer()
    .min(100)
    .max(5_000)
    .default(500),
  GRAFANA_HEALTH_URL: Joi.string().uri().allow('').default(''),
  OTEL_COLLECTOR_HEALTH_URL: Joi.string().uri().allow('').default(''),
  TEMPO_HEALTH_URL: Joi.string().uri().allow('').default(''),
  LOKI_HEALTH_URL: Joi.string().uri().allow('').default(''),
  PROMETHEUS_HEALTH_URL: Joi.string().uri().allow('').default(''),
});
