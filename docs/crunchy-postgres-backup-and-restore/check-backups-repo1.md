# Check repo1 backups

Read-only. Checks that the backups on `repo1` (the volume in the namespace) are recent and healthy. Nothing changes and nothing goes down.

**Environments:** all.

**You need:** `oc` logged in (in the OpenShift web console, your name in the top right → **Copy login command**) and `jq`.

## 1. Set the variables

Paste the block for your environment.

### alpha-dev

```sh
NS=c1643c-dev; C=crunchy-postgres-alpha; BRANCH=alpha
SEL=postgres-operator.crunchydata.com/cluster=$C
PRIMARY=$(oc -n $NS get pod -l $SEL,postgres-operator.crunchydata.com/role=master -o name)
REPOHOST=$(oc -n $NS get pod -l $SEL,postgres-operator.crunchydata.com/data=pgbackrest -o name)
echo "NS=$NS C=$C PRIMARY=$PRIMARY REPOHOST=$REPOHOST"
```

### alpha-test

```sh
NS=c1643c-test; C=crunchy-postgres-alpha; BRANCH=alpha
SEL=postgres-operator.crunchydata.com/cluster=$C
PRIMARY=$(oc -n $NS get pod -l $SEL,postgres-operator.crunchydata.com/role=master -o name)
REPOHOST=$(oc -n $NS get pod -l $SEL,postgres-operator.crunchydata.com/data=pgbackrest -o name)
echo "NS=$NS C=$C PRIMARY=$PRIMARY REPOHOST=$REPOHOST"
```

### dev

```sh
NS=c1643c-dev; C=crunchy-postgres; BRANCH=main
SEL=postgres-operator.crunchydata.com/cluster=$C
PRIMARY=$(oc -n $NS get pod -l $SEL,postgres-operator.crunchydata.com/role=master -o name)
REPOHOST=$(oc -n $NS get pod -l $SEL,postgres-operator.crunchydata.com/data=pgbackrest -o name)
echo "NS=$NS C=$C PRIMARY=$PRIMARY REPOHOST=$REPOHOST"
```

### test

```sh
NS=c1643c-test; C=crunchy-postgres; BRANCH=main
SEL=postgres-operator.crunchydata.com/cluster=$C
PRIMARY=$(oc -n $NS get pod -l $SEL,postgres-operator.crunchydata.com/role=master -o name)
REPOHOST=$(oc -n $NS get pod -l $SEL,postgres-operator.crunchydata.com/data=pgbackrest -o name)
echo "NS=$NS C=$C PRIMARY=$PRIMARY REPOHOST=$REPOHOST"
```

### prod

```sh
NS=c1643c-prod; C=crunchy-postgres; BRANCH=main
SEL=postgres-operator.crunchydata.com/cluster=$C
PRIMARY=$(oc -n $NS get pod -l $SEL,postgres-operator.crunchydata.com/role=master -o name)
REPOHOST=$(oc -n $NS get pod -l $SEL,postgres-operator.crunchydata.com/data=pgbackrest -o name)
echo "NS=$NS C=$C PRIMARY=$PRIMARY REPOHOST=$REPOHOST"
```

`PRIMARY` and `REPOHOST` must both be set.

## 2. Check that recent scheduled backups succeeded

```sh
oc -n $NS get postgrescluster $C -o jsonpath='{range .status.pgbackrest.scheduledBackups[*]}{.type}{"\t"}{.repo}{"\t"}{.completionTime}{"\t"}succeeded={.succeeded}{"\n"}{end}'
```

Every `repo1` line shows `succeeded=1`. In test and prod you also see `repo2` lines; [Check repo2 backups](check-backups-repo2.md) covers those.

## 3. List the backups in repo1

```sh
oc exec -n $NS $REPOHOST -- pgbackrest info --repo=1
```

Status is `ok`, and there's a full backup from the last day.

The earliest time you can restore to is the stop time of the oldest backup (the second time in its `timestamp start/stop` line). The `wal archive` min and max are WAL file names, not times.

## 4. Check that the disk isn't filling up

```sh
oc exec -n $NS $REPOHOST -- df -h /pgbackrest/repo1
```

`Use%` should be well below 100%.

## 5. Check that no `restore` or `manual` section is left over

```sh
oc -n $NS get postgrescluster $C -o jsonpath='{.spec.backups.pgbackrest}' | jq 'del(.repos, .global, .repoHost, .sidecars, .configuration)'
```

This should print `{}`.

If it prints anything else, follow [Clear leftover config](clear-leftover-config.md), then run this check again.

## Optional: check every backup file is intact

Outside test and prod, you can also run [Verify repo1 backup files](verify-backup-files-repo1.md). It's slow and isn't practical on test or prod.
