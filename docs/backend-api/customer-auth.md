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
3. The current mock SMS adapter returns `developmentCode: "4322"` in the
   login response. No external SMS is sent.
4. `POST /api/v1/auth/verify` accepts `verificationId` and `code`.
5. `VerifyCustomerLoginCodeUseCase` consumes the challenge, finds the customer
   by phone or creates one, then returns access and refresh tokens.

Customer tokens contain `scope: customer` and are validated by the named
`customer-jwt` strategy using `CUSTOMER_JWT_*` secrets. The strategy loads the
current authentication contract on every protected request, rejects missing
or blocked customers and exposes current names through `AuthenticatedCustomer`
without embedding mutable profile data in the JWT. Admin tokens use a different
strategy, scope and secret.

The in-memory challenge repository is temporary and is not suitable for
multiple replicas. Replace it with Redis together with a real SMS adapter,
attempt limits and provider delivery tracking before production.

`developmentCode` belongs only to the mock adapter. A production SMS adapter
must return no code to the client.
