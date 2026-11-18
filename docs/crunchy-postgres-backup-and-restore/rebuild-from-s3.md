# Rebuild from S3

Recreates a lost cluster from the backups in `repo2` (the S3 bucket on the NRS object store). Restores to the latest point available in S3.

Use this only when the `PostgresCluster` is gone (deleted, or the namespace was lost), so there's nothing to restore into. If the cluster still exists, use [Point-in-time restore from repo2](pitr-repo2.md) instead.

Use this for a real rebuild or for a rehearsal. The steps that are only for a rehearsal are marked **Rehearsal only**.

**Environments:** test and prod only. No other environment has a repo2. Rehearse only in test, never in prod.

**You need:**

- `oc` logged in (in the OpenShift web console, your name in the top right → **Copy login command**), and `jq`.
- Helm 4 and the helm-secrets plugins. See [Prerequisite](../../infrastructure/helm/deployment/README.md#prerequisite) in the deployment chart README.
- A checkout of bcparks.ca.

## 1. Go to the chart directory

Run every step from `infrastructure/helm/crunchy-postgres` in your bcparks.ca checkout, because the Helm steps use the chart and values files there.

```sh
cd <your-checkout>/infrastructure/helm/crunchy-postgres
```

## 2. Set the variables

Paste the block for your environment.

### test

```sh
ENV=test; NS=c1643c-test; C=crunchy-postgres; BRANCH=main
SEL=postgres-operator.crunchydata.com/cluster=$C
echo "ENV=$ENV NS=$NS C=$C"
```

### prod

```sh
ENV=prod; NS=c1643c-prod; C=crunchy-postgres; BRANCH=main
SEL=postgres-operator.crunchydata.com/cluster=$C
echo "ENV=$ENV NS=$NS C=$C"
```

## 3. Rehearsal only: delete the cluster

> [!CAUTION]
> **Test only. Never run this in prod.** Skip this step in a real disaster, because the cluster is already gone.

This simulates losing the cluster.

```sh
helm -n $NS uninstall crunchy
```

- The `s3-pgbackrest` secret survives, because Helm doesn't manage it (`createS3Secret: false`).
- repo1 is deleted along with the cluster, so S3 is the only copy left, as in a real disaster.
- The operator recreates the database user secrets with new passwords, so the app restart in step 10 is required.

Wait until the cluster's pods are gone:

```sh
oc -n $NS get pods -l $SEL
```

Run it again until it prints `No resources found`.

## 4. Check that the S3 secret exists

```sh
oc -n $NS get secret s3-pgbackrest
```

The secret is listed. If it isn't, recreate it from Vault (see "S3 backup secret" in `infrastructure/helm/crunchy-postgres/README.md`), then run this check again.

## 5. Install the chart with `dataSource` enabled

This creates the cluster and tells it to restore from S3 when it starts. `upgrade --install` upgrades the Helm release if it's still installed (for example if only the `PostgresCluster` was deleted), and installs it if it's gone.

```sh
helm -n $NS upgrade --install crunchy . -f values-$ENV.yaml \
  --set dataSource.enabled=true \
  --set dataSource.repo.s3.bucket=parks-cms-$ENV \
  --set dataSource.repo.s3.endpoint=nrs.objectstore.gov.bc.ca
```

## 6. Watch the pods

```sh
oc -n $NS get pods -l $SEL -w
```

A `<cluster>-pgbackrest-restore-*` pod runs, then the instance pods start. Press Ctrl+C to stop watching.

> [!NOTE]
> This takes a long time. Be patient and don't run step 5 again.
>
> - If the watch seems frozen, press Ctrl+C and run `oc -n $NS get pods -l $SEL` to see the current state.
> - A scheduled backup can start before the database is up. Its `crunchy-postgres-backup-*` pods show `Error`. Ignore them.

To follow the restore log while the restore pod exists (optional):

```sh
oc -n $NS logs -f -l $SEL,postgres-operator.crunchydata.com/pgbackrest-restore
```

## 7. Check that the restore finished

```sh
oc -n $NS get postgrescluster $C -o jsonpath='{.status.pgbackrest.restore}'; echo
```

It's done when this shows `"finished":true` and `"succeeded":1`.

## 8. Find the new pods and check the primary

```sh
PRIMARY=$(oc -n $NS get pod -l $SEL,postgres-operator.crunchydata.com/role=master -o name)
REPOHOST=$(oc -n $NS get pod -l $SEL,postgres-operator.crunchydata.com/data=pgbackrest -o name)
echo "PRIMARY=$PRIMARY REPOHOST=$REPOHOST"
```

Both must be set. Patroni labels the primary a minute or so after it starts. If `PRIMARY` is empty, wait and run it again.

```sh
oc exec -n $NS $PRIMARY -- patronictl list
oc exec -n $NS $PRIMARY -- psql -Atc "select now()"
```

The leader is `running` and the query prints the current time. **Don't go on until both are true.**

## 9. Remove the bootstrap `dataSource`

This turns off the restore-from-S3 setting in the Helm release and in the live `PostgresCluster`.

```sh
helm -n $NS upgrade crunchy . -f values-$ENV.yaml \
  --set dataSource.enabled=false
```

Check that the live resource no longer has a `dataSource`:

```sh
oc -n $NS get postgrescluster $C -o jsonpath='{.spec.dataSource}'; echo
```

The output must be empty.

> [!WARNING]
> Don't leave `dataSource` set. If you do, then after a later point-in-time restore, removing its `restore` section can make the operator restore from S3 again. Patching only the live resource isn't enough, because Helm would put the setting back on the next upgrade.

## 10. Restart the apps

The database passwords are new, so the CMS and the scheduler must restart to pick them up.

```sh
oc -n $NS rollout restart deploy/$BRANCH-cms deploy/$BRANCH-scheduler
```

## 11. Take a manual full backup to each repo (backup device)

repo1 is empty after a rebuild, so take a full backup to both repos now.

```sh
oc exec -n $NS $REPOHOST -- pgbackrest check --stanza=db
oc exec -n $NS $REPOHOST -- pgbackrest backup --stanza=db --repo=1 --type=full --log-level-console=info
oc exec -n $NS $REPOHOST -- pgbackrest backup --stanza=db --repo=2 --type=full --log-level-console=info
```

`check` prints no errors, and each backup ends with `expire command end: completed successfully`. The repo2 backup takes a lot longer. If a scheduled backup is running, a backup fails with a lock error: wait and run that line again.

## 12. Check backups

```sh
oc exec -n $NS $REPOHOST -- pgbackrest info
oc exec -n $NS $REPOHOST -- df -h /pgbackrest/repo1
```

Status is `ok` for both repos, and the last `full backup` of each repo is the one from step 11. `Use%` should be well below 100%.

## 13. Check that nothing is left over

```sh
oc -n $NS get postgrescluster $C -o jsonpath='{.spec.backups.pgbackrest}' | jq 'del(.repos, .global, .repoHost, .sidecars, .configuration)'
```

This should print `{}`.

If it prints anything else, follow [Clear leftover config](clear-leftover-config.md), then run this check again.

## 14. Rehearsal only: check that a later restore doesn't fall back to S3

Skip this step after a real rebuild.

1. Do a full rehearsal of [Point-in-time restore from repo2](pitr-repo2.md) on this cluster, including its step 19 (Remove the `restore` section).
2. Then watch the pods for a few minutes:

   ```sh
   oc -n $NS get pods -l $SEL -w
   ```

   No new `<cluster>-pgbackrest-restore-*` pod may appear, and the instance pods must not restart. Press Ctrl+C to stop watching.

## Done

For a rehearsal, add a row to the rehearsal log in [the index](README.md#rehearsal-log).
