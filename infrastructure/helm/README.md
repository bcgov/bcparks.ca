# Helm Charts

Helm charts for deploying BC Parks infrastructure on OpenShift.

## Charts

- [crunchy-postgres](./crunchy-postgres/README.md) — Crunchy Postgres cluster
- [tools](./tools/README.md) — BC Parks CMS application tools
- [deployment](./deployment/README.md) — BC Parks CMS application deployment

## Usage

1. Download and install the [Helm CLI](https://helm.sh/docs/intro/install/)
2. Log into the OpenShift cluster:
   ```sh
   oc login --token=<your-token> --server=https://api.gold.devops.gov.bc.ca:6443
   ```
   Get your token from the [OpenShift console](https://console.apps.gold.devops.gov.bc.ca) under your profile → **Copy login command**
3. Run the install/upgrade commands found in the linked chart README files above
