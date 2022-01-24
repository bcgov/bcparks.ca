# Deploying and Upgrading

This is a quick overview on how to create deployments using the `bcparks` Helm chart

## Prerequisite

Install `helm` CLI from https://helm.sh/docs/intro/install/

## Deploying

The `install` command can be used when deploying to a namespace for the very first time.

Run the following commands from the `infrastructure/helm/bcparks` directory.

### Dev

`helm -n 61d198-dev install bcparks . -f values-dev.yaml`

### Test

`helm -n 61d198-test install bcparks . -f values-test.yaml`

### Prod

`helm -n 61d198-prod install bcparks . -f values-prod.yaml`

## Upgrading

The `upgrade` command can be used when updating existing deployments in a namespace.

Run the following commands from the `infrastructure/helm/bcparks` directory.

### Dev

`helm -n 61d198-dev upgrade bcparks . -f values-dev.yaml`

### Test

`helm -n 61d198-test upgrade bcparks . -f values-test.yaml`

### Prod

`helm -n 61d198-prod upgrade bcparks . -f values-prod.yaml`

## Teardown

The `uninstall` command ca be used to remove all resources defined by the Helm chart. Please note that secrets and PVCs created by the Helm chart are not automatically removed.

Run the following commands from the `infrastructure/helm/bcparks` directory.

### Dev

`helm -n 61d198-dev uninstall bcparks`

### Test

`helm -n 61d198-test uninstall bcparks`

### Prod

`helm -n 61d198-prod uninstall bcparks`