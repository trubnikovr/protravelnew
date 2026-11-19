# ProTravel HTTP clients

JetBrains HTTP Client requests are grouped by API consumer:

- `mobile/` — public and customer-authenticated mobile API;
- `backend/` — health, files and administrative API.
- `providers/` — direct requests to external providers, including TTBooking.

Select the `local` environment from `http-client.env.json`. Secrets stay in
the ignored `http-client.private.env.json` file. Start the backend at
`http://localhost:3000` before running requests.

Swagger:

- mobile: `http://localhost:3000/api/mobile/docs`;
- admin/backend: `http://localhost:3000/api/admin/docs`.

Set request-specific IDs such as `tourId` in the JetBrains environment before
running detail scenarios.

For `providers/ttbooking.http`, select `local` and set `ttbookingBaseUrl`,
`ttbookingAgencyId`, `ttbookingUserId` and `ttbookingPassword` in the ignored
`http-client.private.env.json`. The request creates TTBooking's timestamp and
MD5 signature, then sends a sample `SEARCHFR` request directly to the provider.
