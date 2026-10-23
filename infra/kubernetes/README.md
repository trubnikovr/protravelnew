# ProTravel Kubernetes deployment

This directory contains an on-premise production baseline. It deploys the
current application without putting credentials in Git.

## Included resources

- production namespace with restricted Pod Security labels;
- three-replica NestJS backend, Service, HPA and PDB;
- two-replica Nginx dashboard and PDB;
- one-shot Drizzle migration Job with an Argo CD `PreSync` hook;
- three-instance PostgreSQL 17 cluster managed by CloudNativePG;
- persistent Redis 8 for BullMQ;
- RWX upload volume for the current local file-storage adapter;
- Envoy Gateway API routes and cert-manager Certificate;
- ingress NetworkPolicies;
- production Dockerfiles for the backend, migrator and dashboard;
- an optional Argo CD Application definition.
- a private single-replica observability stack under `observability/` with
  Grafana, Prometheus, Loki, Tempo and OpenTelemetry Collector.

The architecture and production blockers are documented in
[`../../docs/production-kubernetes.md`](../../docs/production-kubernetes.md).

## Cluster prerequisites

Install and validate these components before applying the application:

1. Kubernetes 1.33-1.36 with at least three schedulable worker nodes;
2. a CNI that enforces NetworkPolicy, preferably Cilium;
3. MetalLB or another implementation of `Service.type=LoadBalancer`;
4. Envoy Gateway with `GatewayClass` named `eg`;
5. cert-manager with Gateway API support enabled;
6. CloudNativePG operator;
7. metrics-server for HPA;
8. Prometheus Operator when `enablePodMonitor` remains enabled;
9. a default RWO StorageClass and an RWX StorageClass named `protravel-rwx`.

Longhorn can supply both RWO and RWX volumes on a local cluster. For serious
database workloads, benchmark its latency and IOPS first. PostgreSQL disks and
backups must not depend on one physical host.

Install controller versions from their official compatibility matrices and
pin the Helm chart version. Do not copy an old unpinned install command into
production.

## Build and push images

Build from the repository root. Replace the registry and tag with the real
immutable release coordinates:

```bash
docker build -f apps/backend-api/Dockerfile --target runtime \
  -t registry.example/protravel/backend-api:GIT_SHA .
docker build -f apps/backend-api/Dockerfile --target migrator \
  -t registry.example/protravel/backend-migrator:GIT_SHA .
docker build -f apps/frontend-dashboard/Dockerfile \
  -t registry.example/protravel/admin-dashboard:GIT_SHA .
```

Push the images, scan and sign them, then update the three `images` entries in
`overlays/production/kustomization.yaml`. A mature pipeline replaces tags with
image digests in the rendered release.

## Configure the deployment

Replace every `*.protravel.example`, registry name, TTBooking URL and image tag
under `overlays/production`. Update the ACME email in
`cluster-issuer.example.yaml`.

Copy the secret template locally:

```bash
cp infra/kubernetes/secrets.env.example infra/kubernetes/secrets.env
```

Fill it with production values. Create the application Secret without writing
secret YAML:

```bash
kubectl create namespace protravel-prod --dry-run=client -o yaml | kubectl apply -f -
kubectl -n protravel-prod create secret generic protravel-backend-secrets \
  --from-env-file=infra/kubernetes/secrets.env
```

CloudNativePG requires a basic-auth Secret. Use the same database password as
`DATABASE_PASSWORD` in `secrets.env`:

```bash
kubectl -n protravel-prod create secret generic protravel-postgres-auth \
  --type=kubernetes.io/basic-auth \
  --from-literal=username=protravel \
  --from-literal=password='REPLACE_WITH_DATABASE_PASSWORD'
```

For a maintained installation, replace these manual Secrets with Vault plus
External Secrets Operator. The checked-in template contains no real values.

## Sentry

The NestJS SDK is initialized at process startup. Unhandled errors and HTTP
5xx responses are sent when `SENTRY_DSN` is present in
`protravel-backend-secrets`. Set `SENTRY_RELEASE` to the same immutable Git SHA
as the backend image. Tracing is disabled by default; increase
`SENTRY_TRACES_SAMPLE_RATE` deliberately after estimating event volume.

The DSN may point either to Sentry SaaS or to a separately operated
self-hosted Sentry installation. Do not add a single `sentry` container to the
ProTravel application namespace: Sentry ingestion depends on several services
and stateful stores. The officially maintained self-hosted distribution uses
Docker Compose and is intended for low-volume deployments and proofs of
concept. If data residency requires self-hosting, run that distribution on
dedicated infrastructure, back it up independently, and expose only its Relay
ingestion endpoint and SSO-protected UI through DNS/TLS. ProTravel then needs
only the project DSN.

## Validate and deploy

Deploy the observability stack first by following
[`observability/README.md`](observability/README.md); the backend configuration
uses its internal Kubernetes DNS names.

Render locally and inspect the exact result:

```bash
kubectl kustomize infra/kubernetes/overlays/production > /tmp/protravel-rendered.yaml
kubectl apply --server-side --dry-run=server -f /tmp/protravel-rendered.yaml
```

Create the ClusterIssuer after Envoy Gateway and cert-manager are ready:

```bash
kubectl apply -f infra/kubernetes/cluster-issuer.example.yaml
```

Argo CD is the preferred deployment path. Edit and apply
`argocd-application.example.yaml`; the migration runs before the rollout.

Without Argo CD, do not apply the whole rendered file blindly because ordinary
Kubernetes does not interpret the `PreSync` annotation. Apply data resources,
run and wait for the migration Job, and only then apply the Deployments.

## Verify

```bash
kubectl -n protravel-prod get pods,svc,pvc,gateway,httproute,certificate
kubectl -n protravel-prod wait --for=condition=Available deployment/protravel-backend --timeout=5m
kubectl -n protravel-prod wait --for=condition=Available deployment/protravel-dashboard --timeout=5m
kubectl -n protravel-prod get cluster.postgresql.cnpg.io/protravel-postgres
kubectl -n protravel-prod logs job/protravel-database-migration
```

Run external smoke tests against `/api/v1/health/live`, `/api/v1/health`, the
admin page and a non-mutating TTBooking operation.

## Current limitations that remain visible in YAML

- Redis is currently a single persistent StatefulSet because the backend only
  accepts one Redis host/port and has no Sentinel configuration. It is not HA.
  Add Sentinel/managed Redis support before claiming full production HA.
- Backend API pods also run BullMQ processors. Split HTTP and worker NestJS
  entrypoints before scaling them independently.
- Uploads use an RWX volume because the S3 adapter is not implemented yet.
  Replace it with S3/MinIO object storage before operating at scale.
- Flight offers still use an in-memory repository. A later revalidation or
  booking request can reach another API replica and miss the offer until this
  repository moves to Redis with TTL.
- CloudNativePG backup configuration is environment-specific and must be added
  for the selected off-cluster S3/MinIO backup destination before launch.
- `PAYMENT_PROVIDER=mock` and placeholder TTBooking URLs deliberately prevent
  an accidental claim that live payment/provider configuration is complete.

These manifests are deployable infrastructure scaffolding, not evidence that
the unresolved application-level production blockers are complete.
