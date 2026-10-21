# ProTravel HTTP clients

JetBrains HTTP Client requests are grouped by API consumer:

- `mobile/` — public and customer-authenticated mobile API;
- `backend/` — health, files and administrative API.

Select the `local` environment from `http-client.env.json`. Secrets stay in
the ignored `http-client.private.env.json` file. Start the backend at
`http://localhost:3000` before running requests.

Swagger:

- mobile: `http://localhost:3000/api/mobile/docs`;
- admin/backend: `http://localhost:3000/api/admin/docs`.

Set request-specific IDs such as `tourId` in the JetBrains environment before
running detail scenarios.
