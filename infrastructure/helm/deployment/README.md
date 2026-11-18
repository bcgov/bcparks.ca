# Deploying and Upgrading

This is a quick overview on how to create deployments using the `bcparks` Helm chart

## Prerequisite

Install the tools. The commands are for macOS with Homebrew; see each tool's site for other platforms, including the [helm-secrets installation guide](https://github.com/jkroepke/helm-secrets/wiki/Installation).

```sh
# Helm 4 or later (https://helm.sh/docs/intro/install/). If Helm 3 is installed, use brew upgrade helm.
brew install helm
helm version --short # should print v4.x

# OpenShift CLI
brew install openshift-cli

# GnuPG, to convert the helm-secrets author's public key for signature verification
brew install gnupg
curl -sL https://github.com/jkroepke.gpg | gpg --dearmor > /tmp/helm-secrets.gpg

# helm-secrets plugin (Helm 4 needs all three packages)
helm plugin install oci://ghcr.io/jkroepke/helm-secrets/secrets:4.7.9 --keyring /tmp/helm-secrets.gpg
helm plugin install oci://ghcr.io/jkroepke/helm-secrets/secrets-getter:4.7.9 --keyring /tmp/helm-secrets.gpg
helm plugin install oci://ghcr.io/jkroepke/helm-secrets/secrets-post-renderer:4.7.9 --keyring /tmp/helm-secrets.gpg

# vals resolves the ref+vault:// references (0.22.0 or later)
brew install vals

# Vault CLI
brew tap hashicorp/tap
brew install hashicorp/tap/vault
```

Install [crunchy-postgres](../crunchy-postgres/README.md)

## Secrets

### Vault-managed secrets

Some secrets are managed in [BC Government HashiCorp Vault](https://vault.developer.gov.bc.ca). Vault is the source of truth.

Each release has one OpenShift secret, `<release>-vault-managed-secret` (for example `main-vault-managed-secret`), that holds every Vault-managed value. Its template contains `ref+vault://` references instead of values, and [helm-secrets](https://github.com/jkroepke/helm-secrets) replaces the references with values from Vault during `helm install` and `helm upgrade`. Deployments read each key they need with `secretKeyRef` instead of `envFrom`, so the notice doesn't end up in the container environment.

The secret also gets a `00_VAULT_MANAGED_NOTICE` key, from the `bcparks_vault_managed_notice` helper in `templates/_helpers.tpl`.

> [!WARNING]
> Always use `helm secrets --evaluate-templates` (as shown below) to install or upgrade. Plain `helm upgrade` writes the literal `ref+vault://...` text into the secret. The scheduler refuses to start if `ELASTIC_HOST` is an unresolved reference, so a bad upgrade shows up as a scheduler crash loop.

#### Log in to Vault

Log in with the namespace's `c1643c-vault` service account, which has read-only access to Vault. Use the `c1643c-prod` role for the prod namespace and `c1643c-nonprod` for the others.

First log in to the Gold cluster. In the OpenShift web console, open the menu under your name (top right), choose **Copy login command**, and run the `oc login ...` command it shows.

Then run the commands for the environment you're deploying.

##### Non-prod: dev, test, alpha-dev and alpha-test

```sh
export VAULT_ADDR=https://vault.developer.gov.bc.ca
export VAULT_NAMESPACE=platform-services
export HELM_SECRETS_BACKEND=vals
export VAULT_TOKEN=$(vault write -field=token auth/k8s-gold/login \
  role=c1643c-nonprod jwt="$(oc -n c1643c-dev create token c1643c-vault)")
```

##### Prod

```sh
export VAULT_ADDR=https://vault.developer.gov.bc.ca
export VAULT_NAMESPACE=platform-services
export HELM_SECRETS_BACKEND=vals
export VAULT_TOKEN=$(vault write -field=token auth/k8s-gold/login \
  role=c1643c-prod jwt="$(oc -n c1643c-prod create token c1643c-vault)")
```

#### Vault layout

Secrets are stored in two Vault mounts: `c1643c-prod` for the prod namespace and `c1643c-nonprod` for all the others. Inside each mount there is a folder per environment, named after `cms.env.environment` in the values file, with one path per service. Helm gathers the keys from these paths into the single `<release>-vault-managed-secret` in OpenShift.

```
c1643c-nonprod/
  dev/          main in c1643c-dev
  alpha-dev/    alpha in c1643c-dev
  test/         main in c1643c-test
  alpha-test/   alpha in c1643c-test

c1643c-prod/
  prod/         main in c1643c-prod
```

Paths in each environment folder:

| Vault path           | Vault keys                                                         | Key in `<release>-vault-managed-secret`                                                        | Used by                                                                                                                   |
| -------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `elasticsearch`      | `ELASTIC_HOST`, `ELASTIC_USERNAME`, `ELASTIC_PASSWORD`             | `ELASTIC_HOST`, `ELASTIC_USERNAME`, `ELASTIC_PASSWORD`                                         | CMS, scheduler                                                                                                            |
| `s3-strapi`          | `S3_ACCESS_KEY_ID`, `S3_ACCESS_SECRET`, `S3_BUCKET`, `S3_ENDPOINT` | `STRAPI_S3_ACCESS_KEY_ID`, `STRAPI_S3_ACCESS_SECRET`, `STRAPI_S3_BUCKET`, `STRAPI_S3_ENDPOINT` | CMS (Strapi media uploads), which reads them under the `S3_*` names                                                       |
| `park-names-api`     | `PARK_NAMES_API_KEY`                                               | `PARK_NAMES_API_KEY`                                                                           | ETL                                                                                                                       |
| `rec-space-keycloak` | `REC_SPACE_KEYCLOAK_CLIENT_SECRET`                                 | `REC_SPACE_KEYCLOAK_CLIENT_SECRET`                                                             | Scheduler                                                                                                                 |
| `s3-pgbackrest`      | `S3_ACCESS_KEY_ID`, `S3_ACCESS_SECRET`                             | — (in the separate `s3-pgbackrest` secret)                                                     | Database backups (test and prod only). See the [crunchy-postgres README](../crunchy-postgres/README.md#s3-backup-secret). |

Vault paths don't merge or fall back, so a value shared by more than one environment is copied into each path.

Every environment needs every path and key in the table except `s3-pgbackrest`, even if the feature that uses it is turned off (for example the ETL cron job in dev). A missing path or key makes `helm secrets` fail for that environment. Where a value isn't needed, create the key in Vault with an empty value.

#### Change a Vault-managed secret

1. Update the value in Vault.
2. Run a Helm upgrade (below).
3. Restart the deployments that use the value.

### Secrets managed by hand

Helm creates these secrets once with placeholder or generated values and never overwrites them. If one is deleted, the next upgrade recreates it. Edit them in OpenShift.

- `<release>-strapi-token`: `STRAPI_API_TOKEN`, used by the scheduler and the ETL cron job (the "Background Jobs Token" in Strapi). Create an API token in the Strapi admin panel (**Settings > API Tokens**), paste it into this secret in the OpenShift console, then restart the scheduler. The token isn't stored in Vault, because it can be regenerated in Strapi at any time. After the Strapi database is restored from another environment, regenerate it and update the secret.

- `<release>-scheduler-secret`: `EMAIL_RECIPIENT_WHITELIST`, edited by QA while testing.
- `<release>-cms-secret` and `<release>-redis-secret` are generated by Helm and don't need any changes.

### Moving to the Vault-managed secret (one time per release)

Before the first `helm secrets` upgrade of a release:

1. Copy the values from the old secrets (`<release>-etl-secret`, `<release>-elasticsearch-secret` and `bcparks-object-storage`) into the Vault paths listed in [Vault layout](#vault-layout). Check them against the team's password vault first.
2. Run the Helm upgrade.
3. Copy `STRAPI_API_TOKEN` from `<release>-etl-secret` into the new `<release>-strapi-token` secret.
4. Restart the scheduler deployment.
5. Delete `<release>-etl-secret` and `<release>-elasticsearch-secret`. Helm created them as hooks, so it won't delete them. Delete `bcparks-object-storage` once every release in the namespace has moved.

The `s3-pgbackrest` secret used for database backups is covered in the [crunchy-postgres README](../crunchy-postgres/README.md#s3-backup-secret).

## Deploying

The `install` command can be used when deploying to a namespace for the very first time.

Run the following commands from the `infrastructure/helm/deployment` directory.

Objects prefixed with `main-` in OpenShift are from the main branch in GitHub and objects prefixed with `alpha-` are from the alpha branch (alpha environments). There is no `alpha-` for prod because there is no alpha environment for prod.

### Alpha Dev (alpha branch)

`helm secrets --evaluate-templates -n c1643c-dev install alpha . -f values-alpha-dev.yaml`

### Alpha Test (alpha branch)

`helm secrets --evaluate-templates -n c1643c-test install alpha . -f values-alpha-test.yaml`

### Dev

`helm secrets --evaluate-templates -n c1643c-dev install main . -f values-dev.yaml`

### Test

`helm secrets --evaluate-templates -n c1643c-test install main . -f values-test.yaml`

### Prod

`helm secrets --evaluate-templates -n c1643c-prod install main . -f values-prod.yaml`

## Upgrading

The `upgrade` command can be used when updating existing deployments in a namespace.

Run the following commands from the `infrastructure/helm/deployment` directory.

### Alpha Dev (alpha branch)

`helm secrets --evaluate-templates -n c1643c-dev upgrade alpha . -f values-alpha-dev.yaml`

### Alpha Test (alpha branch)

`helm secrets --evaluate-templates -n c1643c-test upgrade alpha . -f values-alpha-test.yaml`

### Dev

`helm secrets --evaluate-templates -n c1643c-dev upgrade main . -f values-dev.yaml`

### Test

`helm secrets --evaluate-templates -n c1643c-test upgrade main . -f values-test.yaml`

### Prod

`helm secrets --evaluate-templates -n c1643c-prod upgrade main . -f values-prod.yaml`

## Teardown

The `uninstall` command can be used to remove all resources defined by the Helm chart. Please note that secrets and PVCs created by the Helm chart are not automatically removed.

Run the following commands from the `infrastructure/helm/deployment` directory.

### Alpha Dev (alpha branch)

`helm -n c1643c-dev uninstall alpha`

### Alpha Test (alpha branch)

`helm -n c1643c-test uninstall alpha`

### Dev

`helm -n c1643c-dev uninstall main`

### Test

`helm -n c1643c-test uninstall main`

### Prod

`helm -n c1643c-prod uninstall main`

## Manually created secrets

These secrets are created by hand in each namespace and are not managed by Helm.

- `bcparks-ssl-wildcard` (all namespaces): the `*.bcparks.ca` TLS certificate used by the `vanity-*` routes.
- `bcparks-ip-allowlist` (dev and test): the IP allowlist for the public `vanity-*` routes. If it's missing, those routes have no allowlist.

To create `bcparks-ip-allowlist` from an existing route:

`oc -n c1643c-dev create secret generic bcparks-ip-allowlist --from-literal=cidrs="$(oc -n c1643c-dev get route vanity-dev -o jsonpath='{.metadata.annotations.haproxy\.router\.openshift\.io/ip_whitelist}')"`
