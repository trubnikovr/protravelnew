# ProTravel local infrastructure

This Compose stack runs only the PostgreSQL and Redis dependencies needed for
local application development. Production uses `infra/kubernetes`.

From the repository root:

```bash
npm run infra:local:up
npm run backend:dev
```

Inspect or stop the services with:

```bash
npm run infra:local:ps
npm run infra:local:logs
npm run infra:local:down
```

The scripts deliberately retain the former Compose project name
`backend-api`. Existing volumes named `backend-api_protravel_postgres` and
`backend-api_protravel_redis` therefore remain attached after moving the file
from `apps/backend-api` to `infra/local`.

`down` stops and removes containers and the Compose network but preserves
database volumes. Removing volumes requires an explicit manual action and is
not part of the repository scripts.
