# Kubernetes observability stack

This directory deploys one instance each of OpenTelemetry Collector,
Prometheus, Loki, Tempo and Grafana into the private `observability` namespace.
It is intentionally a single-node starting point, not a highly available
monitoring platform.

Data flow:

```text
backend --OTLP--> collector --metrics--> Prometheus --\
                           --logs-----> Loki --------+--> Grafana
                           --traces---> Tempo -------/
```

Create the Grafana credentials without committing them:

```bash
cp infra/kubernetes/observability/secrets.env.example \
  infra/kubernetes/observability/secrets.env
kubectl create namespace observability --dry-run=client -o yaml | kubectl apply -f -
kubectl -n observability create secret generic observability-secrets \
  --from-env-file=infra/kubernetes/observability/secrets.env
```

Render, inspect and deploy:

```bash
kubectl kustomize infra/kubernetes/observability > /tmp/protravel-observability.yaml
kubectl apply --server-side --dry-run=server -f /tmp/protravel-observability.yaml
kubectl apply --server-side -f /tmp/protravel-observability.yaml
kubectl -n observability wait --for=condition=Available \
  deployment/otel-collector deployment/prometheus deployment/loki \
  deployment/tempo deployment/grafana --timeout=10m
```

Grafana is deliberately a `ClusterIP`, with Prometheus, Loki and Tempo already
provisioned as data sources. Open it from an administrator workstation:

```bash
kubectl -n observability port-forward service/grafana 3001:3000
```

Then visit `http://127.0.0.1:3001`. For permanent access, use a private
Gateway/VPN plus SSO; do not expose this Service anonymously.

The filesystem stores and single replicas are suitable for the requested
initial one-node topology. Before relying on this stack for serious production
operations, move Loki and Tempo to object storage, add off-cluster backups,
alerts, resource tuning and high availability.
