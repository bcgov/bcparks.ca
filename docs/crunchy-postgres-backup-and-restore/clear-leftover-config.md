# Clear leftover config

You get here from another runbook, when its leftover check printed something other than `{}`. This runbook removes a leftover `restore` or `manual` section from the `PostgresCluster`. When you're done, go back to the runbook that sent you here.

Why it matters: a leftover `restore` section makes the cluster restore again the next time anyone changes the restore annotation. A leftover `manual` section is harmless on its own, but it shouldn't be left behind.

**Environments:** all.

**You need:** `oc` logged in (in the OpenShift web console, your name in the top right → **Copy login command**) and `jq`.

## 1. Set the variables

Paste the block for your environment.

### alpha-dev

```sh
NS=c1643c-dev; C=crunchy-postgres-alpha; BRANCH=alpha
SEL=postgres-operator.crunchydata.com/cluster=$C
echo "NS=$NS C=$C"
```

### alpha-test

```sh
NS=c1643c-test; C=crunchy-postgres-alpha; BRANCH=alpha
SEL=postgres-operator.crunchydata.com/cluster=$C
echo "NS=$NS C=$C"
```

### dev

```sh
NS=c1643c-dev; C=crunchy-postgres; BRANCH=main
SEL=postgres-operator.crunchydata.com/cluster=$C
echo "NS=$NS C=$C"
```

### test

```sh
NS=c1643c-test; C=crunchy-postgres; BRANCH=main
SEL=postgres-operator.crunchydata.com/cluster=$C
echo "NS=$NS C=$C"
```

### prod

```sh
NS=c1643c-prod; C=crunchy-postgres; BRANCH=main
SEL=postgres-operator.crunchydata.com/cluster=$C
echo "NS=$NS C=$C"
```

## 2. See what's left over

```sh
oc -n $NS get postgrescluster $C -o jsonpath='{.spec.backups.pgbackrest}' | jq 'del(.repos, .global, .repoHost, .sidecars, .configuration)'
```

- If it shows a `restore` key, do step 3.
- If it shows a `manual` key, do step 4.
- If it shows both, do both.

## 3. Remove a leftover `restore` section

### 3.1 Check that no restore is running

```sh
oc -n $NS get pods -l $SEL,postgres-operator.crunchydata.com/pgbackrest-restore
```

You should see `No resources found`. If a restore pod is listed, a restore is still in progress: don't continue until it's finished.

### 3.2 Check that there's no bootstrap `dataSource`

```sh
oc -n $NS get postgrescluster $C -o jsonpath='{.spec.dataSource}'; echo
```

The output must be empty.

If it isn't, the cluster was rebuilt from S3 and its `dataSource` was never removed. Removing `restore` now can trigger another restore from S3. Stop, and do step 9 (Remove the bootstrap `dataSource`) of [Rebuild from S3](rebuild-from-s3.md) first.

### 3.3 Remove it

```sh
oc -n $NS patch postgrescluster $C --type=merge -p '{"spec":{"backups":{"pgbackrest":{"restore":null}}}}'
```

The output is `patched`, or `patched (no change)` if there was no `restore` section.

## 4. Remove a leftover `manual` section

### 4.1 Check that no manual backup is running

```sh
oc -n $NS get jobs -l $SEL,postgres-operator.crunchydata.com/pgbackrest-backup=manual
```

You should see `No resources found`.

If a Job is listed, wait for it to finish. If it has been running for a long time, check its pod logs and delete it with `oc -n $NS delete job <job-name>`.

### 4.2 Remove it

Only once no manual backup is running:

```sh
oc -n $NS patch postgrescluster $C --type=merge -p '{"spec":{"backups":{"pgbackrest":{"manual":null}}}}'
```

## 5. Check again

```sh
oc -n $NS get postgrescluster $C -o jsonpath='{.spec.backups.pgbackrest}' | jq 'del(.repos, .global, .repoHost, .sidecars, .configuration)'
```

This should print `{}`. Now go back to the runbook that sent you here.
