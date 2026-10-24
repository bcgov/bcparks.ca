# Crunchy Postgres backup and restore (bcparks.ca)

How to check and restore the bcparks.ca CMS database in any environment installed from `infrastructure/helm/crunchy-postgres`. The Staff Portal uses a copy of the same chart, and the same steps work there with its own names.

## 1. TL;DR: how it works

- The Helm chart creates a `PostgresCluster`. The Crunchy operator creates everything else from it. To make changes, edit the `PostgresCluster`, not the pods.
- **Instance pods** (`<cluster>-ha-*`) run Postgres. Patroni picks the primary and writes each pod's role onto it as the label `postgres-operator.crunchydata.com/role` (`master` or `replica`), so `oc` can find the primary without `patronictl list`.
- **The repo host** (`<cluster>-repo-host-0`) is a pod just for pgBackRest. It runs every backup, pulling data from the primary, and owns the `repo1` volume.
- **Repos:** `repo1` is a volume in the namespace. It's fast, but it's lost along with the namespace. `repo2` is an S3 bucket on the NRS object store (main test and prod only). It survives losing the namespace.
- **Backups:** a full backup daily, and an incremental every 4 hours (CronJobs). WAL is archived continuously, so you can restore to any point in time inside the retention window.
- **Restore:** you add a `restore` section to the `PostgresCluster`, then change an annotation. The operator stops Postgres, runs a restore Job, and starts it again. Every database in the cluster rolls back.

## 2. Environments

| Env        | Namespace   | Cluster                | S3 bucket      | Full backups kept |
| ---------- | ----------- | ---------------------- | -------------- | ----------------- |
| alpha-dev  | c1643c-dev  | crunchy-postgres-alpha | none           | 2                 |
| alpha-test | c1643c-test | crunchy-postgres-alpha | none           | 2                 |
| dev        | c1643c-dev  | crunchy-postgres       | none           | 2                 |
| test       | c1643c-test | crunchy-postgres       | parks-cms-test | 15                |
| prod       | c1643c-prod | crunchy-postgres       | parks-cms-prod | 15                |

All are on OpenShift Gold. The database is `cms`. Schedules (UTC): repo1 full at 08:00 and incrementals every 4h from 00:00; repo2 full at 09:00 and incrementals every 4h from 01:00. S3 keys are in Vault at `<env>/s3-pgbackrest`, copied into the `s3-pgbackrest` secret.

## 3. Where you run things

Everything runs from a terminal on your workstation, with `oc`. Section 7 (Rebuild from S3) also needs Helm 4 and its plugins (see [Prerequisite](../infrastructure/helm/deployment/README.md#prerequisite) in the deployment chart README). Log in with `oc` (in the OpenShift web console, your name in the top right → **Copy login command**), then set the variables below.

Commands that run inside a pod use `oc exec` from your workstation, so you never leave your own terminal.

Commands work in bash or zsh, except 6.4.1, which has a separate block for each.

### 3.1 Set the variables once per shell session. Run the line for your environment:

##### alpha-dev

```sh
NS=c1643c-dev; C=crunchy-postgres-alpha; BRANCH=alpha
```

#### alpha-test

```sh
NS=c1643c-test; C=crunchy-postgres-alpha; BRANCH=alpha
```

#### dev

```sh
NS=c1643c-dev; C=crunchy-postgres; BRANCH=main
```

#### test

```sh
NS=c1643c-test; C=crunchy-postgres; BRANCH=main
```

#### prod

```sh
NS=c1643c-prod; C=crunchy-postgres; BRANCH=main
```

### 3.2 Then, for every environment:

```sh
SEL=postgres-operator.crunchydata.com/cluster=$C
PRIMARY=$(oc -n $NS get pod -l $SEL,postgres-operator.crunchydata.com/role=master -o name)
REPOHOST=$(oc -n $NS get pod -l $SEL,postgres-operator.crunchydata.com/data=pgbackrest -o name)
echo "PRIMARY=$PRIMARY REPOHOST=$REPOHOST"
```

Both must be set.

The primary can change after a restore or failover, so set `PRIMARY` again before using it.

## 4. Check backups [read operations only / no changes]

### 4.1 Check that recent scheduled backups succeeded:

```sh
oc -n $NS get postgrescluster $C -o jsonpath='{range .status.pgbackrest.scheduledBackups[*]}{.type}{"\t"}{.repo}{"\t"}{.completionTime}{"\t"}succeeded={.succeeded}{"\n"}{end}'
```

Every backup shows `succeeded=1`. In test and prod, this includes repo2.

### 4.2 Check the backups on the repo host:

#### 4.2.1 List the backups:

```sh
oc exec -n $NS $REPOHOST -- pgbackrest info
```

Status is `ok` and there's a full backup from the last day. The earliest time you can restore to is the stop time of the oldest backup (the second time in its `timestamp start/stop` line). The `wal archive` min and max are WAL file names, not times.

In test and prod, run it again with `--repo=2` for S3.

#### 4.2.2 Check that every backup file is intact:

Takes about 10 seconds for repo1.

```sh
oc exec -n $NS $REPOHOST -- pgbackrest verify --stanza=db --repo=1 --output=text --verbose
```

Each backup shows `status: valid` and `checksum invalid: 0`.

This checks file integrity, not whether recovery to a particular time will succeed. Valid backups and zero checksum errors do not prove that the archived WAL is continuous through the target time.

In test and prod, run it again with `--repo=2` for S3. Verifying S3 downloads every backup, so it's slower.

#### 4.2.3 Check that the disk isn't filling up:

```sh
oc exec -n $NS $REPOHOST -- df -h /pgbackrest/repo1
```

This only works for repo1, which is a volume in the pod. repo2 is an S3 bucket, so there's nothing to run `df` against. For repo2, the closest equivalent is the `repo2: backup set size` lines from:

```sh
oc exec -n $NS $REPOHOST -- pgbackrest info --repo=2
```

### 4.3 Check that no `restore` or `manual` section is left over:

```sh
oc -n $NS get postgrescluster $C -o jsonpath='{.spec.backups.pgbackrest}' | jq 'del(.repos, .global, .repoHost, .sidecars, .configuration)'
```

This should print `{}`.

## 5. Take a manual full backup

Before risky work, and after every restore.

### 5.1 Check that WAL archiving reaches every repo:

This forces a WAL switch and checks that current WAL archiving works. It does not prove that older WAL is complete through a restore target.

```sh
oc exec -n $NS $REPOHOST -- pgbackrest check --stanza=db
```

### 5.2 Take the backup:

This is the same command the scheduled backup Jobs run, but the operator doesn't list manual backups in the `PostgresCluster` status.

```sh
oc exec -n $NS $REPOHOST -- pgbackrest backup --stanza=db --repo=1 --type=full --log-level-console=info
```

The output should end with `expire command end: completed successfully`.

In test and prod, run it again with `--repo=2` for S3. If a scheduled backup is running, it fails with a lock error: wait and run it again.

### 5.3 Check that the new full backup is listed:

```sh
oc exec -n $NS $REPOHOST -- pgbackrest info
```

## 6. Point-in-time restore (in place)

Rolls the whole cluster back to a time T. Everything after T is lost, and the database is down during the restore. The apps keep running and show errors until it's back. A restore can't be started from the repo host. It goes through the operator.

T is in UTC, just before the problem, for example `2026-10-23 22:40:00+00`.

### 6.1 Check the restore window:

```sh
oc exec -n $NS $REPOHOST -- pgbackrest info
```

T must be after the stop time of the oldest backup in the repo you'll restore from (see 4.2.1), and before now. Run 4.2.2 to check file integrity, but neither `verify` nor the current archiving check in 5.1 proves that all WAL needed to reach T is available.

For a planned in-place restore, first validate recovery to the same T from the same repository on an isolated cluster. Keep that cluster isolated from application traffic and prevent it from writing backups or WAL to the source repository.

In an emergency where an isolated recovery is not feasible, proceeding without it carries a risk: missing WAL or an unreachable target can make recovery fail after the database has been shut down, leaving it unavailable until recovery succeeds. Successful integrity and archiving checks do not remove that risk.

### 6.2 Check the database on the primary:

#### 6.2.1 Check the current database time:

```sh
oc exec -n $NS $PRIMARY -- psql -Atc "select now()"
```

#### 6.2.2 Check the current timeline:

```sh
oc exec -n $NS $PRIMARY -- patronictl list
```

Write down the TL.

### 6.3 Rehearsal only: set T and make sure there's a commit after it:

Recovery stops at the first commit after T. If there isn't one in the repo, the restore fails because it can't reach T, and a quiet non-prod database can go days without a write.

#### 6.3.1 Set T and force a commit after it:

This saves the current database time as T in a variable on your workstation, so you don't have to copy it, then forces a commit after T. They're in one block so they always run together: if you set T again, you also get a new commit after it. 6.4 uses T.

```sh
T=$(oc exec -n $NS $PRIMARY -- psql -Atc "select to_char(now() at time zone 'UTC', 'YYYY-MM-DD HH24:MI:SS') || '+00'")
echo "T=$T"
oc exec -n $NS $PRIMARY -- psql -Atc "select txid_current()"
```

If you run this again, run 6.3.2 again too.

#### 6.3.2 Send the WAL to the repo and check it arrived:

This is the same check as 5.1. It forces a WAL switch, so the WAL that contains the commit is sent now rather than within the next minute (`archive_timeout`), and waits until that WAL is in every repo.

```sh
oc exec -n $NS $REPOHOST -- pgbackrest check --stanza=db
```

It succeeds if it prints no errors. **Don't go on to 6.4 until it succeeds**: without it, the restore can't reach T and fails, and the database stays down until you restart it with an earlier T.

### 6.4 Start the restore:

The restore starts when the annotation changes in 6.4.4. Adding the `restore` section in 6.4.2 does nothing on its own.

#### 6.4.1 Set T and the repo:

Enter T in the form `YYYY-MM-DD HH:MM:SS+00`. In a rehearsal, the prompt already shows the T from 6.3.1: press Enter to keep it. Then enter `repo1`, or `repo2` to restore from S3. Each prompt repeats until the value is valid.

Run the version for your shell.

> [!WARNING]
> **macOS / zsh only.** Uses zsh's `vared` and `read "VAR?prompt"`, and macOS `date -j`. Won't work in bash or with GNU `date`.

```sh
while true; do vared -c -p "Target time (UTC): " T; date -j -u -f "%Y-%m-%d %H:%M:%S+00" "$T" >/dev/null 2>&1 && break; done
REPO=; until [[ $REPO == repo[12] ]]; do read "REPO?Repo (repo1 or repo2): "; done
echo "T=$T REPO=$REPO"
```

> [!WARNING]
> **Linux / bash only.** Uses GNU `date -d`. Won't work in zsh or with macOS `date`. The prompt shows the current T in brackets: press Enter to keep it.

```sh
re='^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\+00$'
while true; do read -e -p "Target time (UTC) [$T]: " IN; T=${IN:-$T}; [[ $T =~ $re ]] && date -u -d "${T%+00}" >/dev/null 2>&1 && break; done
REPO=; until [[ $REPO == repo[12] ]]; do read -p "Repo (repo1 or repo2): " REPO; done
echo "T=$T REPO=$REPO"
```

Check both values before going on.

#### 6.4.2 Add the `restore` section:

This adds a `restore` section to the `PostgresCluster`, using the T and REPO you just set. It only tells the operator how to restore. Nothing happens to the database yet.

```sh
oc -n $NS patch postgrescluster $C --type=merge -p "{\"spec\":{\"backups\":{\"pgbackrest\":{\"restore\":{\"enabled\":true,\"repoName\":\"$REPO\",\"options\":[\"--type=time\",\"--target=\\\"$T\\\"\"]}}}}}"
```

The output should be `postgrescluster.postgres-operator.crunchydata.com/<cluster> patched`.

#### 6.4.3 Check the `restore` section:

```sh
oc -n $NS get postgrescluster $C -o jsonpath='{.spec.backups.pgbackrest.restore}'; echo
```

It should show something like `{"enabled":true,"options":["--type=time","--target=\"2026-10-24 02:23:41+00\""],"repoName":"repo1"}`. In the YAML, that's:

```yaml
spec:
  backups:
    pgbackrest:
      restore:
        enabled: true # allows the operator to run a restore
        repoName: repo1 # which repo to restore from
        options: # passed to pgbackrest restore
          - --type=time # stop replaying WAL at a point in time...
          - --target="2026-10-24 02:23:41+00" # ...this one (T)
```

The quotes around T are part of the value, because T contains a space. The Helm chart doesn't know about this section, so it stays until you remove it in 6.9.

#### 6.4.4 Trigger the restore (point of no return):

**This starts the restore. The database goes down straight away, and everything after T is lost.** Check the `echo` output from 6.4.1 and the section from 6.4.3 before you run it.

The operator starts a restore when the value of the `postgres-operator.crunchydata.com/pgbackrest-restore` annotation changes. The value itself doesn't matter, only that it's different from last time. The command uses the current Unix time, so it's always new. `--overwrite` replaces the value from any earlier restore.

```sh
oc -n $NS annotate postgrescluster $C --overwrite postgres-operator.crunchydata.com/pgbackrest-restore="$(date +%s)"
```

The output should be `postgrescluster.postgres-operator.crunchydata.com/<cluster> annotated`. The operator then shuts down every instance and starts the restore Job. Follow it in 6.5.

### 6.5 Watch the restore:

#### 6.5.1 Watch the pods:

```sh
oc -n $NS get pods -l $SEL -w
```

The instance pods stop, a `<cluster>-pgbackrest-restore-*` pod runs, then the instances start again. Press Ctrl+C to stop watching.

#### 6.5.2 Follow the restore log:

```sh
oc -n $NS logs -f -l $SEL,postgres-operator.crunchydata.com/pgbackrest-restore
```

This only works while the restore pod exists. Once the restore Job finishes, its pod is removed and you get `No resources found`. Go on to 6.5.3.

#### 6.5.3 Check that the restore finished:

```sh
oc -n $NS get postgrescluster $C -o jsonpath='{.status.pgbackrest.restore}'; echo
```

It's done when the status shows `"finished":true` and `"succeeded":1`.

### 6.6 Find the primary again:

The primary may now be a different pod.

```sh
PRIMARY=$(oc -n $NS get pod -l $SEL,postgres-operator.crunchydata.com/role=master -o name)
echo "PRIMARY=$PRIMARY"
```

Patroni labels the primary a minute or so after the instance starts. If `PRIMARY` is empty, wait and run it again.

### 6.7 Check the restore on the primary:

#### 6.7.1 Check the timeline:

```sh
oc exec -n $NS $PRIMARY -- patronictl list
```

The leader is `running` and its TL is one higher than before. In test and prod, the replicas are `streaming` with lag 0.

#### 6.7.2 Check where the restore stopped:

```sh
oc exec -n $NS $PRIMARY -- psql -Atc "select pg_read_file('pg_wal/' || lpad(upper(to_hex(timeline_id)), 8, '0') || '.history') from pg_control_checkpoint()"
```

The last line of the new timeline's history file should say `before` with a time just after T, for example `9  64/0E0000A0  before 2026-10-23 22:40:07.512+00`.

For a real restore, also check the content that was damaged, for example in the Strapi admin, or in its table in the `cms` database. Each content type's table name is the `collectionName` in `src/cms/src/api/<type>/content-types/<type>/schema.json`, for example `public_advisory_audits`.

### 6.8 Restart the apps:

So they reconnect cleanly.

```sh
oc -n $NS rollout restart deploy/$BRANCH-cms deploy/$BRANCH-scheduler
```

### 6.9 Remove the `restore` section:

If it's left there, the cluster restores again the next time anyone changes the annotation.

If this cluster was rebuilt from S3, make sure the bootstrap `dataSource` was removed as described in 7.5.2 before removing `restore`. Otherwise, cleanup can trigger another restore from S3.

```sh
oc -n $NS patch postgrescluster $C --type=merge -p '{"spec":{"backups":{"pgbackrest":{"restore":null}}}}'
```

The output is `patched`, or `patched (no change)` if there was no `restore` section.

### 6.10 Take a manual full backup:

Follow section 5 (Take a manual full backup), to each repo in test and prod.

### 6.11 Check backups:

Follow section 4 (Check backups).

## 7. Rebuild from S3 (test and prod only)

Use this only when the `PostgresCluster` is gone (deleted, or the namespace was lost), so there's nothing to restore into. If the cluster still exists, use section 6 (Point-in-time restore) with `REPO=repo2` instead. The S3 secret and the repo2 configuration are already in place, so no Helm is needed.

The steps below need Helm 4 and the helm-secrets plugins. Set them up first: see [Prerequisite](../infrastructure/helm/deployment/README.md#prerequisite) in the deployment chart README.

Run every step in this section from `infrastructure/helm/crunchy-postgres` in your bcparks.ca checkout. 7.4 uses the chart and values files there.

### 7.1 Rehearsal only: delete the cluster:

Only in test, to simulate losing the cluster. Never do this in prod. Skip it in a real disaster: the cluster is already gone.

```sh
helm -n c1643c-test uninstall crunchy
```

- The `s3-pgbackrest` secret survives the uninstall, because Helm doesn't manage it (`createS3Secret: false`).
- repo1 is deleted with the cluster, so S3 is the only copy left, as in a real disaster.
- The operator recreates the database user secrets with new passwords, so the CMS restart in 7.7 is required.

### 7.2 Set the environment:

If you haven't already, set the section 3.1 variables for your environment first: 7.5 uses them.

Use `test` or `prod`.

```sh
ENV=test
SEL=postgres-operator.crunchydata.com/cluster=$C
```

### 7.3 Check that the S3 secret exists:

```sh
oc -n c1643c-$ENV get secret s3-pgbackrest
```

If it doesn't, recreate it from Vault (see "S3 backup secret" in the chart README).

### 7.4 Install or upgrade the chart with `dataSource` enabled:

One command for both cases: `upgrade --install` upgrades the Helm release if it's still installed (for example if only the `PostgresCluster` was deleted), and installs it if it's gone. You don't need to check which first.

```sh
helm -n c1643c-$ENV upgrade --install crunchy . -f values-$ENV.yaml \
  --set dataSource.enabled=true \
  --set dataSource.repo.s3.bucket=parks-cms-$ENV \
  --set dataSource.repo.s3.endpoint=nrs.objectstore.gov.bc.ca
```

### 7.5 Watch the restore:

#### 7.5.1 Wait for the restored primary:

Follow 6.5.

Then run 3.2 again to find the new pods, and check the primary:

```sh
oc exec -n $NS $PRIMARY -- patronictl list
oc exec -n $NS $PRIMARY -- psql -Atc "select now()"
```

The leader must be `running` and the SQL query must succeed before continuing.

#### 7.5.2 Remove the bootstrap `dataSource`:

Run this only after 7.5.1 succeeds. It disables the bootstrap configuration in both the Helm release and the live `PostgresCluster`:

```sh
helm -n c1643c-$ENV upgrade crunchy . -f values-$ENV.yaml \
  --set dataSource.enabled=false
```

Check that the live resource no longer has a `dataSource`:

```sh
oc -n $NS get postgrescluster $C -o jsonpath='{.spec.dataSource}'; echo
```

The output must be empty. Do not leave `dataSource` configured: after a later in-place restore, removing its `restore` section can make the operator switch back to the bootstrap restore ID and restore from S3 again. Patching only the live resource is not enough, because Helm could reintroduce the configuration on a later upgrade.

### 7.6 Check backups:

The pods are new, so run 3.2 again to set `PRIMARY` and `REPOHOST`. Then follow section 4 (Check backups).

### 7.7 Restart the apps:

```sh
oc -n c1643c-$ENV rollout restart deploy/main-cms deploy/main-scheduler
```

## 8. Rehearsal log

| Date       | Who  | Env       | Procedure             | Repo  | Notes                 |
| ---------- | ---- | --------- | --------------------- | ----- | --------------------- |
| 2026-10-23 | Mike | alpha-dev | Point-in-time restore | repo1 | Testing new docs      |
| 2026-10-23 | Mike | test      | Point-in-time restore | repo2 | Testing new docs - S3 |
| 2026-10-23 | Mike | test      | Rebuild from S3       | repo2 | Testing new docs - S3 |

For the S3 rebuild rehearsal, also verify the full lifecycle: rebuild, disable `dataSource`, perform a subsequent point-in-time restore, and remove `restore`. Confirm that cleanup does not trigger another restore.

## 9. References

- [pgBackRest](https://pgbackrest.org/)
- [Crunchy PGO disaster recovery](https://access.crunchydata.com/documentation/postgres-operator/latest/tutorials/backups-disaster-recovery/disaster-recovery)
- Chart README: `infrastructure/helm/crunchy-postgres/README.md`
