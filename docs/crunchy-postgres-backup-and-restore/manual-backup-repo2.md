# Take a manual full backup to repo2 (S3)

Takes a full backup to `repo2` (the S3 bucket on the NRS object store) now, rather than waiting for the schedule. Do this before risky work. The database stays up. It takes a lot longer than a repo1 backup.

**Environments:** test and prod only. No other environment has a repo2.

**You need:** `oc` logged in (in the OpenShift web console, your name in the top right → **Copy login command**).

## 1. Set the variables

Paste the block for your environment.

### test

```sh
NS=c1643c-test; C=crunchy-postgres; BRANCH=main
SEL=postgres-operator.crunchydata.com/cluster=$C
REPOHOST=$(oc -n $NS get pod -l $SEL,postgres-operator.crunchydata.com/data=pgbackrest -o name)
echo "NS=$NS C=$C REPOHOST=$REPOHOST"
```

### prod

```sh
NS=c1643c-prod; C=crunchy-postgres; BRANCH=main
SEL=postgres-operator.crunchydata.com/cluster=$C
REPOHOST=$(oc -n $NS get pod -l $SEL,postgres-operator.crunchydata.com/data=pgbackrest -o name)
echo "NS=$NS C=$C REPOHOST=$REPOHOST"
```

`REPOHOST` must be set.

## 2. Check that WAL archiving works

This forces a WAL switch and waits until the WAL reaches every repo (backup device), including repo2.

```sh
oc exec -n $NS $REPOHOST -- pgbackrest check --stanza=db
```

It succeeds if it prints no errors.

## 3. Take the backup

```sh
oc exec -n $NS $REPOHOST -- pgbackrest backup --stanza=db --repo=2 --type=full --log-level-console=info
```

The output ends with `expire command end: completed successfully`.

If a scheduled backup is running, this fails with a lock error. Wait a few minutes and run it again.

## 4. Check that the new backup is listed

```sh
oc exec -n $NS $REPOHOST -- pgbackrest info --repo=2
```

The last `full backup` listed has a `timestamp start/stop` from a few minutes ago.

The operator doesn't list manual backups in the `PostgresCluster` status, so this is the only place they show up.
