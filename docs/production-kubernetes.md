# ProTravel production Kubernetes architecture

This document is the production deployment baseline for the ProTravel
monorepo. It covers the backend API and admin dashboard. The React Native
mobile application is built and signed in CI and distributed through the app
stores; it does not run in Kubernetes.

## Decision summary

- Use a managed Kubernetes control plane and managed PostgreSQL/object storage
  whenever the selected provider offers them.
- Run production in at least three availability zones or three independent
  failure domains.
- Use Kubernetes Gateway API with Envoy Gateway instead of starting a new
  deployment on the legacy Ingress API.
- Keep PostgreSQL and Redis private. Only the public Gateway receives a public
  address.
- Deploy immutable images by digest. Tags are human-readable metadata, not the
  deployment identity.
- Keep application configuration in ConfigMaps and secrets in an external
  secret manager synchronized by External Secrets Operator.
- GitOps is the source of truth for cluster state. Argo CD applies Helm/Kustomize
  manifests; CI never receives cluster-admin credentials.

The initial production SLO is 99.9% monthly availability for the public API
and dashboard. The baseline recovery objectives are RPO <= 15 minutes and
RTO <= 60 minutes. A stricter target changes database, region and cost choices.

## Node topology

### Recommended managed-cluster baseline

The provider owns the highly available control plane. ProTravel starts with
two autoscaled worker pools:

| Pool          |   Nodes | Per-node baseline                | Runs                                                                                          | Notes                                                              |
| ------------- | ------: | -------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `system`      | 3 fixed | 2 vCPU, 4-8 GiB RAM, 50 GiB SSD  | CoreDNS, CNI, CSI, Envoy Gateway controller, cert-manager, External Secrets, Argo CD, metrics | One node per zone, tainted for platform workloads                  |
| `application` |     3-9 | 4 vCPU, 8-16 GiB RAM, 80 GiB SSD | backend API, workers, dashboard, Envoy data plane                                             | One initial node per zone; cluster autoscaler/Karpenter expands it |

This is the smallest recommended HA production layout. Do not call a
single-node or two-worker cluster production: maintenance or one node failure
would remove safe rollout capacity.

Create a separate `observability` pool only when telemetry starts competing
with customer traffic: 3 nodes, 4-8 vCPU and 16-32 GiB RAM. Until then,
observability can use the application pool with lower priority and strict
resource limits.

### Self-managed alternative

If managed Kubernetes is unavailable, use three control-plane nodes and at
least three workers on separate failure domains. Control-plane nodes need at
least 4 vCPU, 8 GiB RAM and low-latency SSD; workers use the application sizes
above. Use containerd with systemd cgroups, an API-server load balancer and
automated etcd snapshots copied off-cluster. Self-managed Kubernetes adds
24/7 responsibility for etcd, certificates, upgrades, CNI, CSI and node OS
patching and is therefore not the preferred first production deployment.

## Namespaces and scheduling

```text
protravel-prod       application Deployments, Services, Jobs and policies
protravel-system     shared platform components owned by ProTravel
observability        OTel Collector, metrics, logs, traces and dashboards
argocd               GitOps controller
external-secrets     secret synchronization controller
cert-manager         ACME certificate automation
envoy-gateway-system Gateway API controller
```

Every application workload must have CPU/memory requests and limits, a
PodDisruptionBudget, topology spread across zones and nodes, and
`runAsNonRoot`, read-only root filesystem, dropped Linux capabilities and
`seccompProfile: RuntimeDefault`. Default-deny ingress and egress NetworkPolicy
is applied per namespace, with explicit rules for DNS, PostgreSQL, Redis,
object storage, OTLP and approved external providers such as TTBooking and the
payment gateway.

## Images

Application images are built for `linux/amd64` and, only if the node pool uses
it, `linux/arm64`. CI scans them and generates an SBOM before signing them with
keyless Cosign. Production admission policy accepts signed images from the
project registry only.

| Image                                                   | Base                                                                                   | Purpose                                               |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `registry.example/protravel/backend-api:<git-sha>`      | build: `node:24-bookworm-slim`; runtime: distroless Node.js 24 or hardened Debian slim | NestJS HTTP process                                   |
| `registry.example/protravel/backend-worker:<git-sha>`   | same build artifacts as API                                                            | BullMQ notification consumers after worker separation |
| `registry.example/protravel/backend-migrator:<git-sha>` | `node:24-bookworm-slim`                                                                | Drizzle migration Job; never receives public traffic  |
| `registry.example/protravel/admin-dashboard:<git-sha>`  | build: `node:24-bookworm-slim`; runtime: `nginx:stable-alpine`                         | Static Vite bundle, SPA fallback and `/config.js`     |
| `otel/opentelemetry-collector-contrib:<pinned-version>` | upstream                                                                               | OTLP gateway/agent                                    |
| `grafana/grafana:<pinned-version>`                      | upstream                                                                               | dashboards                                            |
| `grafana/loki:<pinned-version>`                         | upstream                                                                               | logs                                                  |
| `grafana/tempo:<pinned-version>`                        | upstream                                                                               | traces                                                |
| `prom/prometheus:<pinned-version>`                      | upstream                                                                               | metrics                                               |

All production references use a registry digest, for example
`backend-api@sha256:...`. Floating `latest`, `alpine`, `stable-alpine` and
unpinned Helm chart versions are forbidden in rendered production manifests;
the labels above describe the build source only.

Native modules (`argon2` and `sharp`) make Debian/glibc the safer backend base
than Alpine/musl. The runtime image contains compiled `dist`, production
dependencies, CA certificates and no compiler, package manager cache or source
maps exposed by the web server.

## Application workloads

### Backend API

- Deployment with 3 replicas, rolling update `maxUnavailable: 0` and
  `maxSurge: 1`.
- Start at `500m` CPU / `768Mi` memory requests and `2` CPU / `2Gi` limits.
- Service is `ClusterIP` on port 3000.
- Startup and liveness probe: `/api/v1/health/live`.
- Readiness probe: `/api/v1/health`; the pod leaves service when PostgreSQL or
  Redis is unavailable.
- HPA: 3-12 replicas, target 65% CPU and 75% memory. Add request-rate and p95
  latency signals after baseline traffic metrics exist.
- Graceful shutdown must stop accepting traffic, close the HTTP server,
  PostgreSQL pool and Redis clients, with `terminationGracePeriodSeconds: 45`.

The API remains stateless. Sessions, search state and idempotency state must
not live in process memory.

### BullMQ workers

Target architecture uses a separate process and Deployment for notification
workers so API autoscaling does not unintentionally change queue concurrency.
Start with 2 replicas, `500m` CPU / `512Mi` requests, and scale through KEDA
from BullMQ queue depth and oldest-job age. A PodDisruptionBudget keeps at least
one worker available. Flight search is synchronous and does not use BullMQ.

The current application registers BullMQ processors inside the NestJS API
process. Until separate API/worker entrypoints exist, every API replica is also
a worker. This is functional but must use conservative per-process concurrency
and must not be presented as the final production topology.

### Admin dashboard

- Deployment with 2 replicas, `50m` CPU / `64Mi` requests and `250m` CPU /
  `256Mi` limits.
- `ClusterIP` Service on port 8080.
- Readiness/liveness endpoint served by Nginx, for example `/healthz`.
- `/config.js` is mounted from a ConfigMap and contains only the public API URL.
- Static assets use immutable cache headers; `index.html` and `config.js` do
  not.

### Database migrations

Run migrations as a dedicated, idempotent Kubernetes Job before the API
rollout. Argo CD uses a `PreSync` hook and fails the release if the migration
fails. Never run migrations independently in every API pod. Backward-compatible
expand/migrate/contract changes are mandatory because old and new pods overlap
during rolling deployment.

## Data services

### PostgreSQL

Preferred: managed PostgreSQL 17, private networking, multi-zone standby,
encrypted disks, TLS, connection pooling and point-in-time recovery. Start at
4 vCPU, 16 GiB RAM and 200 GiB SSD with storage autoscaling, then size from
measured CPU, connections, cache hit ratio, IOPS and slow queries.

Backups:

- continuous WAL/PITR with at least 14 days retention;
- daily snapshots retained 30 days;
- monthly snapshot retained 12 months if policy requires it;
- automated restore test into an isolated database at least monthly.

If PostgreSQL must run in Kubernetes, use a maintained operator such as
CloudNativePG with three instances, anti-affinity and object-storage backups.
A handwritten PostgreSQL StatefulSet is not acceptable for production.

### Redis

Preferred: managed Redis/Valkey with authentication, TLS, private networking,
one primary and at least one replica across zones. Start with 2-4 GiB memory,
noeviction for queues, persistence enabled, and alerts at 70/85% memory.
BullMQ data must use a dedicated instance or at least a dedicated ACL user and
explicit key prefix; cache eviction must never delete queue state.

### Object storage

Use private S3-compatible object storage for public images, generated variants
and private booking documents. Public images are served through a CDN; private
documents use short-lived signed URLs or authenticated streaming. Enable
versioning, server-side encryption, lifecycle rules and access logging.

The existing pod-local `UPLOAD_DIRECTORY` implementation is not safe for more
than one replica and is a production blocker. A shared RWX volume is only a
temporary migration option, not the target architecture.

## Public traffic and DNS

Use Envoy Gateway and Gateway API. The initial routes are:

```text
api.protravel.example   -> backend-api:3000
admin.protravel.example -> admin-dashboard:8080
```

The load balancer terminates TLS 1.2/1.3 using cert-manager certificates. Add
HTTP-to-HTTPS redirect, HSTS after validation, request/body limits, per-route
timeouts, security headers and rate limits. Preserve the real client IP only
through trusted proxy hops. A CDN/WAF sits in front of the Gateway when public
traffic or abuse risk justifies it. PostgreSQL, Redis, Grafana, Prometheus,
Loki, Tempo and Argo CD have no public Services; operators access them through
SSO-protected private connectivity.

## Configuration and secrets

Non-secret settings belong in a versioned ConfigMap. Secrets are stored in a
cloud secret manager or Vault and synchronized by External Secrets Operator.
Do not commit `Secret` YAML or plaintext values to Git.

Required production secret groups include:

- PostgreSQL and Redis credentials;
- customer/admin JWT secrets;
- document and notification encryption keys;
- TTBooking/TTBooking agency, user and password hash;
- payment provider credentials;
- S3 credentials when workload identity is unavailable;
- Sentry DSN and notification provider credentials.

`TTBOOKING_SECRET_KEY` is retained only if TTBooking documents a separate use for it;
the current request signature uses agency, password hash, time and user. Pods
should obtain object-storage access through workload identity rather than
long-lived access keys wherever supported.

## Observability and operations

- Applications write structured JSON to stdout/stderr; node agents collect it.
- Backend exports OTLP to an in-cluster Collector Service.
- Prometheus collects application, Envoy, Kubernetes and node metrics.
- Backend exceptions are reported through the Sentry SDK when `SENTRY_DSN` is
  configured. Sentry SaaS is the simplest production option. A self-hosted
  Sentry installation is a separate multi-service platform, not a sidecar or a
  single application Deployment, and must have independent storage, backups,
  upgrades and capacity planning.
- Tempo, Loki and Prometheus use object storage/retention sized independently
  from application data.
- Grafana dashboards cover RED metrics, saturation, queue depth/age, provider
  latency/errors, PostgreSQL, Redis and Kubernetes rollouts.
- Pager alerts cover API availability, p95 latency, 5xx rate, queue age,
  payment webhook failures, database capacity, certificate expiry and backup
  failures. Health checks alone are not sufficient monitoring.

Use the existing files under `infra/observability` as development inputs, not
as final HA production manifests. Production needs replicated components,
retention, object storage and resource limits.

## Delivery workflow

1. Pull request runs lint, typecheck, unit/integration tests, dependency and
   secret scanning.
2. Merge builds application images once, creates an SBOM, scans and signs the
   digests, and pushes them to the private registry.
3. CI updates the image digest in the GitOps environment repository.
4. Argo CD applies the migration Job, then rolls out backend, workers and
   dashboard.
5. Automated smoke tests verify liveness, readiness, authentication and one
   non-mutating provider path.
6. Argo Rollouts may add canary delivery (10%, 25%, 50%, 100%) after reliable
   service metrics exist. Initial releases may use standard rolling updates.

Production access uses SSO, least-privilege RBAC and audited break-glass
accounts. Direct manual edits to production resources are reverted by GitOps.

## Mandatory work before production

1. Replace in-memory flight offer persistence with Redis and preserve offer
   TTL and provider tokens across replicas.
2. Implement the S3-compatible storage adapter for images, transformations and
   private booking documents.
3. Split BullMQ workers from the HTTP entrypoint or explicitly constrain queue
   concurrency while running the transitional combined pods.
4. Add production Dockerfiles, non-root users, graceful shutdown and container
   smoke tests.
5. Ensure `TTBOOKING_BASE_URL` and `TTBOOKING_FARE_RULES_URL` are configured and validate
   real TTBooking signing/time behavior from provider fixtures.
6. Add a production migration image/command and test forward/backward-compatible
   rollouts.
7. Confirm payment production credentials, webhook ingress policy and webhook
   signature verification.
8. Load-test API, queues and image transformation; use results to replace the
   initial resource estimates.
9. Restore PostgreSQL and object-storage backups in an isolated environment and
   record the measured RPO/RTO.
10. Run a security review covering RBAC, NetworkPolicy, secrets, container
    images, dependency vulnerabilities and externally reachable routes.

Kubernetes manifests should be added only after the cloud/provider, registry,
DNS zones, secret manager and storage classes are selected. Those choices
change Gateway addresses, workload identity, CSI configuration, annotations
and backup implementation; inventing them in a generic manifest would create
false production readiness.

## Version policy

Use a provider-supported Kubernetes minor and upgrade at least quarterly. At
the time this baseline was written, Envoy Gateway 1.9 supports Kubernetes
1.33-1.36; select a mutually supported version rather than blindly taking the
newest Kubernetes release. Pin all controllers, charts and images, subscribe
to security advisories, and test upgrades in staging first.

References:

- [Kubernetes production environment](https://kubernetes.io/docs/setup/production-environment/)
- [Kubernetes container runtimes](https://kubernetes.io/docs/setup/production-environment/container-runtimes/)
- [Envoy Gateway compatibility matrix](https://gateway.envoyproxy.io/news/releases/matrix/)
