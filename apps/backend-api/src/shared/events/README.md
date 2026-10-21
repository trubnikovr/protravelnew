# Backend shared events

Versioned event contracts crossing backend module boundaries.

- producers and consumers depend on these event shapes, not on each other's
  domain classes;
- event payloads contain identifiers and stable non-sensitive facts only;
- event contracts are versioned independently from synchronous contracts in
  `src/shared/contracts`.

Move an event to the repository-level `packages` directory only when another
application or independently deployed service consumes it.
