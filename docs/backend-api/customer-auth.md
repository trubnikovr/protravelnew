# Customer authentication

Customer authentication is isolated from admin authentication under
`src/modules/customer-auth`. Customers have no password and no separate
registration endpoint.

The module does not import `CustomersService`, `CustomerRecord`, `Customer` or
`UserStatus`. It owns `CustomerAuthenticationAccountPort` and receives the
purpose-specific `CustomerAuthenticationContract` from
`src/shared/contracts/customer` through the `customer-auth-customers` bridge.
It contains identity, current first and last name, phone and status; these
fields are never copied into customer domain events.

## Flow

1. `POST /api/v1/auth/login` accepts an E.164 phone number.
2. `RequestCustomerLoginCodeUseCase` creates a five-minute challenge and calls
   `CustomerSmsSenderPort`.
3. With `SMS_PROVIDER=smspilot`, the backend generates a random four-digit code
   and sends it through SMSPilot over HTTPS. The code is not returned to the
   client. With `SMS_PROVIDER=mock`, no SMS is sent and the login response
   contains `developmentCode: "4322"` for local development.
4. `POST /api/v1/auth/verify` accepts `verificationId` and `code`.
5. `VerifyCustomerLoginCodeUseCase` consumes the challenge, finds the customer
   by phone or creates one, then returns access and refresh tokens.

Customer tokens contain `scope: customer` and are validated by the named
`customer-jwt` strategy using `CUSTOMER_JWT_*` secrets. The strategy loads the
current authentication contract on every protected request, rejects missing
or blocked customers and exposes current names through `AuthenticatedCustomer`
without embedding mutable profile data in the JWT. Admin tokens use a different
strategy, scope and secret.

Configure `SMSPILOT_API_KEY` as a secret, optionally set `SMSPILOT_FROM` to an
approved sender name, and use `SMSPILOT_TIMEOUT_MS` to control the request
timeout. See https://smspilot.ru/apikey.php?tab=api1. An accepted request does
not guarantee delivery; delivery tracking is not implemented.

Each challenge permits five incorrect verification attempts. The in-memory
challenge repository is temporary and is not suitable for multiple replicas or
process restarts. Replace it with shared storage and add per-phone sending
limits and delivery tracking before production.

`developmentCode` belongs only to the mock adapter. A production SMS adapter
must return no code to the client.
