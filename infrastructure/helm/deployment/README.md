# Deploying and Upgrading

This is a quick overview on how to create deployments using the `bcparks` Helm chart

## Prerequisite

Install `helm` CLI from https://helm.sh/docs/intro/install/

## Deploying

The `install` command can be used when deploying to a namespace for the very first time.

Run the following commands from the `infrastructure/helm/deployment` directory.

Objects prefixed with `main-` in OpenShift are from the main branch in GitHub and objects prefixed with `alpha-` are from the alpha branch (alpha environments). There is no `alpha-` for prod because there is no alpha environment for prod.

### Dev

`helm -n c1643c-dev install main . -f values-dev.yaml`

### Test

`helm -n c1643c-test install main . -f values-test.yaml`

### Prod

`helm -n c1643c-prod install main . -f values-prod.yaml`

### Alpha Dev (alpha branch)

`helm -n c1643c-dev install alpha . -f values-alpha-dev.yaml`

### Alpha Test (alpha branch)

`helm -n c1643c-test install alpha . -f values-alpha-test.yaml`

## Upgrading

The `upgrade` command can be used when updating existing deployments in a namespace.

Run the following commands from the `infrastructure/helm/deployment` directory.

### Dev

`helm -n c1643c-dev upgrade main . -f values-dev.yaml`

### Test

`helm -n c1643c-test upgrade main . -f values-test.yaml`

### Prod

`helm -n c1643c-prod upgrade main . -f values-prod.yaml`

### Alpha Dev (alpha branch)

`helm -n c1643c-dev upgrade alpha . -f values-alpha-dev.yaml`

### Alpha Test (alpha branch)

`helm -n c1643c-test upgrade alpha . -f values-alpha-test.yaml`

## Teardown

The `uninstall` command can be used to remove all resources defined by the Helm chart. Please note that secrets and PVCs created by the Helm chart are not automatically removed.

Run the following commands from the `infrastructure/helm/deployment` directory.

### Dev

`helm -n c1643c-dev uninstall main`

### Test

`helm -n c1643c-test uninstall main`

### Prod

`helm -n c1643c-prod uninstall main`

### Alpha Dev (alpha branch)

`helm -n c1643c-dev uninstall   alpha`

### Alpha Test (alpha branch)

`helm -n c1643c-test uninstall   alpha`

## Manually created secrets

These secrets are created by hand in each namespace and are not managed by Helm.

- `bcparks-ssl-wildcard` (all namespaces): the `*.bcparks.ca` TLS certificate used by the `vanity-*` routes.
- `bcparks-ip-allowlist` (dev and test): the IP allowlist for the public `vanity-*` routes. If it's missing, those routes have no allowlist.

To create `bcparks-ip-allowlist` from an existing route:

`oc -n c1643c-dev create secret generic bcparks-ip-allowlist --from-literal=cidrs="$(oc -n c1643c-dev get route vanity-dev -o jsonpath='{.metadata.annotations.haproxy\.router\.openshift\.io/ip_whitelist}')"`
