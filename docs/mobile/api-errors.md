# API errors

`src/shared/i18n/api-errors.ru.ts` is the mobile error-message catalog, keyed
by backend machine codes. It is registered under `apiErrors` in i18next.
`src/shared/api/api-errors.ts` exports `ApiRequestError` and
`getApiErrorMessage(error, fallback?)`.

Resolution order: known API code, known HTTP status, generic server error for
5xx, then the screen fallback or generic message. A generic 404 does not imply
an expired flight: only `FLIGHT_OFFER_NOT_FOUND`, `FLIGHT_OFFER_UNAVAILABLE` or
`OFFER_EXPIRED` asks the customer to repeat flight search. Unknown backend
messages and validation internals are never displayed directly.

The HTTP transport retains `error.code` for server errors. The global connection
banner is shown only for HTTP 5xx responses; network errors and other HTTP
statuses are handled on the affected screen. Empty or non-JSON error responses still become
`ApiRequestError` with the original HTTP status. Caller cancellation remains
distinct from a connectivity failure.

Screens display the resolved message in their existing inline errors or state
cards. There is no additional global alert, automatic booking retry or silent
navigation. Query wrappers retain the error object as `errorCause`; mutation
handlers pass caught errors to the same resolver. New error codes should be
added to the catalog and consumed via this helper, not screen-specific switches.

Covered categories include authentication, validation, travelers/documents,
flight search and booking, tours, payment failures, news and connectivity.
