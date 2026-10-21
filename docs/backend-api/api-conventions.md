# ProTravel API response conventions

All JSON endpoints use a single response contract produced by the global
`ResponseEnvelopeInterceptor`. Controllers return only their response DTO and
must not construct the envelope manually.

## Success

```json
{
  "data": {
    "id": "c4bd9c70-6d41-4db1-9525-d7e7d8fa7512"
  },
  "meta": {
    "timestamp": "2026-08-03T10:00:00.000Z",
    "path": "/api/v1/admin/me",
    "statusCode": 200,
    "requestId": "local-request-id",
    "traceId": "4bf92f3577b34da6a3ce929d0e0e4736"
  }
}
```

`traceId` is optional when OpenTelemetry is disabled. `requestId` always
identifies the local HTTP request; `traceId` correlates distributed work.

## Pagination

```json
{
  "data": [],
  "meta": {
    "timestamp": "2026-08-03T10:00:00.000Z",
    "path": "/api/v1/admin/users?page=1&limit=20",
    "statusCode": 200,
    "requestId": "local-request-id",
    "traceId": "4bf92f3577b34da6a3ce929d0e0e4736",
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 0,
      "totalPages": 0
    }
  }
}
```

Pagination values belong to `meta.pagination`; list items remain in `data`.
Controllers return `new PaginatedResult(items, pagination)` and the global
interceptor places both parts into the contract shown above.

List request DTOs extend `BaseListRequestDto`, which provides `page`, `limit`,
`sortBy` and `sortDirection`. Each endpoint replaces `sortBy` with its own enum;
repositories map that enum through a whitelist and never interpolate a client
column name into SQL.

Dates, money, images and time zones follow the shared contracts documented in
[`domain-modeling.md`](domain-modeling.md).

## Error

Errors are produced by the global `AllExceptionsFilter`:

```json
{
  "error": {
    "code": "ADMIN_NOT_FOUND",
    "message": "Administrator not found",
    "details": null
  },
  "meta": {
    "timestamp": "2026-08-03T10:00:00.000Z",
    "path": "/api/v1/admin/me",
    "statusCode": 404,
    "requestId": "local-request-id",
    "traceId": "4bf92f3577b34da6a3ce929d0e0e4736"
  }
}
```

Rules:

- `error.code` is stable and machine-readable;
- `error.message` is safe for the API consumer;
- validation failures use `details.validationErrors`;
- raw exception messages, credentials and provider payloads are never exposed;
- unknown errors use `HTTP_500` and are logged with request/trace context.

## Exceptions

- HTTP `204` responses have no body;
- downloads, streams and provider webhooks that require an exact raw response
  use `@RawResponse()`;
- Swagger UI and generated contracts describe the same envelope through
  `@ApiOkEnvelope(ResponseDto)`, `@ApiEnvelope(ResponseDto, status)` and
  `@ApiErrorEnvelope(status)`;
- request DTO, response DTO and API mapper remain mandatory for entrypoints.
