# Admin dashboard authentication

## API contract

The dashboard consumes the Backend API admin entrypoint:

- `POST /api/v1/admin/auth/login` accepts `login` and `password`;
- `GET /api/v1/admin/me` validates the bearer token and returns the current
  administrator.
- `POST /api/v1/admin/auth/revoke-all` increments the administrator token
  version and immediately invalidates all previously issued access tokens.

Both endpoints use the common Backend API success/error envelope. Endpoint and
DTO types are generated from `packages/api-contract/v1/admin.openapi.json` by
OpenAPI Generator. Handwritten feature code only provides session-aware client
configuration and user-facing error mapping.

## Session flow

1. The login form is validated with TanStack Form and Zod.
2. A successful login stores only the access token in `sessionStorage`.
3. The returned administrator is placed in the TanStack Query cache.
4. Before a protected route opens, the router verifies the token through
   `/admin/me`.
5. Invalid or expired tokens clear the local session and redirect to `/login`.
6. Logout clears both the token and Query cache.

Normal logout is local. Security-sensitive "log out everywhere" uses the
revoke-all endpoint before clearing the local session.

`sessionStorage` is intentional for the first version: closing the browser tab
removes the admin session. The dashboard does not persist passwords or admin
profile data.

## Security boundary

The route guard improves UI behavior but is not an authorization boundary.
Roles and permissions must always be enforced by Backend API guards. Future
screens may hide unavailable actions based on `admin.permissions`, but they
must still expect `403` from the API.

Refresh token support is not implemented because the current admin API exposes
only an access token. When the backend adds refresh-token rotation, prefer a
secure `HttpOnly`, `SameSite` cookie rather than browser storage.
