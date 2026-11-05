# Verify repo1 backup files (optional)

Read-only. Checks that every backup file in `repo1` is intact. Nothing changes and nothing goes down.

**Environments:** alpha-dev, alpha-test and dev. In these environments, which keep 2 full backups, it takes about 45 seconds.

> [!WARNING]
> Don't run this on test or prod. They keep 15 full backups, and the pgBackRest pods don't have enough CPU: on test it ran for more than 7 minutes and was stopped. Verifying repo2 (S3) is even slower, because it downloads every backup.

**You need:** `oc` logged in (in the OpenShift web console, your name in the top right → **Copy login command**).

## 1. Set the variables

Paste the block for your environment.

### alpha-dev

```sh
NS=c1643c-dev; C=crunchy-postgres-alpha; BRANCH=alpha
SEL=postgres-operator.crunchydata.com/cluster=$C
REPOHOST=$(oc -n $NS get pod -l $SEL,postgres-operator.crunchydata.com/data=pgbackrest -o name)
echo "NS=$NS C=$C REPOHOST=$REPOHOST"
```

### alpha-test

```sh
NS=c1643c-test; C=crunchy-postgres-alpha; BRANCH=alpha
SEL=postgres-operator.crunchydata.com/cluster=$C
REPOHOST=$(oc -n $NS get pod -l $SEL,postgres-operator.crunchydata.com/data=pgbackrest -o name)
echo "NS=$NS C=$C REPOHOST=$REPOHOST"
```

### dev

```sh
NS=c1643c-dev; C=crunchy-postgres; BRANCH=main
SEL=postgres-operator.crunchydata.com/cluster=$C
REPOHOST=$(oc -n $NS get pod -l $SEL,postgres-operator.crunchydata.com/data=pgbackrest -o name)
echo "NS=$NS C=$C REPOHOST=$REPOHOST"
```

`REPOHOST` must be set.

## 2. Verify the backups

```sh
oc exec -n $NS $REPOHOST -- pgbackrest verify --stanza=db --repo=1 --output=text --verbose
```

Each backup shows `status: valid` and `checksum invalid: 0`.

This checks that the files are intact. It doesn't prove that a restore to a particular time will work: valid backups and zero checksum errors don't prove that the archived WAL is continuous up to that time.
