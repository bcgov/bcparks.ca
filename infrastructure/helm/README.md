# Deploying and Upgrading

This is a quick overview on how to create deployments using the `bcparks` Helm chart

## Prerequisite

Install `helm` CLI from https://helm.sh/docs/intro/install/

## Deploying

The `install` command can be used when deploying to a namespace for the very first time.

Run the following commands from the `infrastructure/helm/bcparks` directory.

Objects prefixed with `main-` in OpenShift are from the main branch in GitHub and objects prefixed with `develop-` are from the develop branch (alpha environments). There is no `develop-` for prod because there is no alpha environment for prod.

### Dev

`helm -n 61d198-dev install main . -f values-dev-main.yaml`

### Test

`helm -n 61d198-test install main . -f values-test-main.yaml`

### Prod

`helm -n 61d198-prod install main . -f values-prod-main.yaml`

### Dev Alpha (develop branch)

`helm -n 61d198-dev install develop . -f values-dev-develop.yaml`

### Test Alpha (develop branch)

`helm -n 61d198-test install develop . -f values-test-develop.yaml`

## Upgrading

The `upgrade` command can be used when updating existing deployments in a namespace.

Run the following commands from the `infrastructure/helm/bcparks` directory.

### Dev

`helm -n 61d198-dev upgrade main . -f values-dev-main.yaml`

### Test

`helm -n 61d198-test upgrade main . -f values-test-main.yaml`

### Prod

`helm -n 61d198-prod upgrade main . -f values-prod-main.yaml`

### Dev Alpha (develop branch)

`helm -n 61d198-dev upgrade develop . -f values-dev-develop.yaml`

### Test Alpha (develop branch)

`helm -n 61d198-test upgrade develop . -f values-test-develop.yaml`

## Teardown

The `uninstall` command ca be used to remove all resources defined by the Helm chart. Please note that secrets and PVCs created by the Helm chart are not automatically removed.

Run the following commands from the `infrastructure/helm/bcparks` directory.

### Dev

`helm -n 61d198-dev uninstall main`

### Test

`helm -n 61d198-test uninstall main`

### Prod

`helm -n 61d198-prod uninstall main`

### Dev Alpha (develop branch)

`helm -n 61d198-dev uninstall develop`

### Test Alpha (develop branch)

`helm -n 61d198-test uninstall develop`