# Point-in-time restore from repo2 (S3)

Rolls the whole cluster back to a point in time, called **T** in this runbook (usually just before something went wrong), using the backups in `repo2` (the S3 bucket on the NRS object store). This applies to every database in the cluster.

For how a restore works, see [How it works](README.md#how-it-works) in the index.

- Everything written after T is lost.
- The database is down during the restore. The apps keep running and show errors until it's back.

Use this for a real restore or for a rehearsal. The one step that is different for a rehearsal is marked **Rehearsal only**.

**Environments:** test and prod only. No other environment has a repo2. Rehearse only in test, never in prod.

**You need:** `oc` logged in (in the OpenShift web console, your name in the top right → **Copy login command**) and `jq`.

## 1. Set the variables

Paste the block for your environment.

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

## 2. Check that no `restore` or `manual` section is left over

```sh
oc -n $NS get postgrescluster $C -o jsonpath='{.spec.backups.pgbackrest}' | jq 'del(.repos, .global, .repoHost, .sidecars, .configuration)'
```

This should print `{}`.

If it prints anything else, follow [Clear leftover config](clear-leftover-config.md), then run this check again.

## 3. Check the restore window

```sh
oc exec -n $NS $REPOHOST -- pgbackrest info --repo=2
```

Status is `ok`. T must be after the stop time of the oldest backup (the second time in its `timestamp start/stop` line), and before now.

> [!CAUTION]
> Nothing here proves that the WAL up to T is complete. If a piece is missing, the restore fails after the database has been shut down, and it stays down until a restore succeeds.
>
> For a planned restore, first try the same restore on a separate, temporary cluster that the apps don't use and that can't write to this repo (backup device). In an emergency, go ahead knowing the risk.

## 4. Note the current time and timeline

```sh
oc exec -n $NS $PRIMARY -- psql -Atc "select now()"
oc exec -n $NS $PRIMARY -- patronictl list
```

**Write down the TL** (timeline) of the leader. In step 15 you'll check that it went up by 1.

## 5. Set T

T is in UTC and must be in the form `YYYY-MM-DD HH:MM:SS+00`.

### Real restore

Set T to a time just before the problem. Edit the time in this line, then run it:

```sh
T='2026-10-23 22:40:00+00'
```

### Rehearsal only

Skip this block for a real restore.

Recovery stops at the first commit after T. If there isn't one, the restore can't reach T and fails, and a quiet non-prod database can go days without a write. This block sets T to the current database time and then forces a commit after it:

```sh
T=$(oc exec -n $NS $PRIMARY -- psql -Atc "select to_char(now() at time zone 'UTC', 'YYYY-MM-DD HH24:MI:SS') || '+00'")
oc exec -n $NS $PRIMARY -- psql -Atc "select txid_current()"
```

If you run this block again, also run step 6 again.

## 6. Send the latest WAL to the repo

This forces a WAL switch, so the latest changes are sent to the repo now rather than within the next minute, and waits until they arrive.

```sh
oc exec -n $NS $REPOHOST -- pgbackrest check --stanza=db
```

It succeeds if it prints no errors. **Don't go on until it succeeds.**

## 7. Check T

```sh
re='^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\+00$'; [[ $T =~ $re ]] && echo "T=$T OK" || echo "T=$T BAD FORMAT"
```

It must print `OK`, and T must be the time you want. If not, go back to step 5.

## 8. Add the `restore` section

This tells the operator how to restore, using T and repo2. Nothing happens to the database yet.

```sh
oc -n $NS patch postgrescluster $C --type=merge -p "{\"spec\":{\"backups\":{\"pgbackrest\":{\"restore\":{\"enabled\":true,\"repoName\":\"repo2\",\"options\":[\"--type=time\",\"--target=\\\"$T\\\"\"]}}}}}"
```

The output is `postgrescluster.postgres-operator.crunchydata.com/<cluster> patched`.

## 9. Check the `restore` section

```sh
oc -n $NS get postgrescluster $C -o jsonpath='{.spec.backups.pgbackrest.restore}'; echo
```

It shows something like this, with your T:

```text
{"enabled":true,"options":["--type=time","--target=\"2026-10-24 02:23:41+00\""],"repoName":"repo2"}
```

The quotes around T are part of the value, because T contains a space.

## 10. Start the restore (point of no return)

> [!WARNING]
> **This starts the restore. The database goes down straight away, and everything after T is lost.** Check T in step 7 and the section in step 9 before you run it.

```sh
oc -n $NS annotate postgrescluster $C --overwrite postgres-operator.crunchydata.com/pgbackrest-restore="$(date +%s)"
```

The output is `postgrescluster.postgres-operator.crunchydata.com/<cluster> annotated`.

The operator starts a restore whenever this annotation's value changes. The command uses the current Unix time, so the value is always new.

## 11. Watch the pods

```sh
oc -n $NS get pods -l $SEL -w
```

The instance pods stop, then a `<cluster>-pgbackrest-restore-*` pod runs, then the instances start again. Press Ctrl+C to stop watching.

> [!NOTE]
> This takes a long time. Be patient and **don't start the restore again**.
>
> - Pods can sit in `Terminating` for several minutes. After that there may be no instance pods for a while. The restore pod only appears once the instances are gone, and the instances only come back once the restore has finished.
> - If the watch seems frozen, press Ctrl+C and run `oc -n $NS get pods -l $SEL` to see the current state.
> - A scheduled backup can start while the database is down. Its `crunchy-postgres-backup-*` pods show `Error`. Ignore them.

## 12. Follow the restore log (optional)

```sh
oc -n $NS logs -f -l $SEL,postgres-operator.crunchydata.com/pgbackrest-restore
```

This only works while the restore pod exists. Once the restore finishes, you get `No resources found`.

## 13. Check that the restore finished

```sh
oc -n $NS get postgrescluster $C -o jsonpath='{.status.pgbackrest.restore}'; echo
```

It's done when this shows `"finished":true` and `"succeeded":1`.

## 14. Find the primary again

The primary may now be a different pod.

```sh
PRIMARY=$(oc -n $NS get pod -l $SEL,postgres-operator.crunchydata.com/role=master -o name)
echo "PRIMARY=$PRIMARY"
```

Patroni labels the primary a minute or so after it starts. If `PRIMARY` is empty, wait and run it again.

## 15. Check the timeline

```sh
oc exec -n $NS $PRIMARY -- patronictl list
```

The leader is `running`, and its TL is 1 higher than the one you wrote down in step 4. In test and prod, the replicas are `streaming` with lag 0.

## 16. Check where the restore stopped

```sh
oc exec -n $NS $PRIMARY -- psql -Atc "select pg_read_file('pg_wal/' || lpad(upper(to_hex(timeline_id)), 8, '0') || '.history') from pg_control_checkpoint()"
```

The last line says `before` with a time just after T, for example `9  64/0E0000A0  before 2026-10-23 22:40:07.512+00`.

For a real restore, also check the content that was damaged, in the Strapi admin or directly in the `cms` database (`oc exec -it -n $NS $PRIMARY -- psql -d cms`). Each content type's table name is the `collectionName` in `src/cms/src/api/<type>/content-types/<type>/schema.json`, for example `public_advisory_audits`.

## 17. Restart the apps

So the CMS and the scheduler reconnect cleanly.

```sh
oc -n $NS rollout restart deploy/$BRANCH-cms deploy/$BRANCH-scheduler
```

## 18. Check that there's no bootstrap `dataSource`

```sh
oc -n $NS get postgrescluster $C -o jsonpath='{.spec.dataSource}'; echo
```

The output must be empty.

If it isn't, the cluster was rebuilt from S3 and its `dataSource` was never removed. Removing `restore` in the next step can then trigger another restore from S3. Stop, and do step 9 (Remove the bootstrap `dataSource`) of [Rebuild from S3](rebuild-from-s3.md) first.

## 19. Remove the `restore` section

If you leave it there, the cluster restores again the next time anyone changes the annotation.

```sh
oc -n $NS patch postgrescluster $C --type=merge -p '{"spec":{"backups":{"pgbackrest":{"restore":null}}}}'
```

The output is `patched`.

## 20. Take a manual full backup to each repo

The restore started a new timeline, so take a fresh full backup to both repos now.

```sh
oc exec -n $NS $REPOHOST -- pgbackrest check --stanza=db
oc exec -n $NS $REPOHOST -- pgbackrest backup --stanza=db --repo=1 --type=full --log-level-console=info
oc exec -n $NS $REPOHOST -- pgbackrest backup --stanza=db --repo=2 --type=full --log-level-console=info
```

`check` prints no errors, and each backup ends with `expire command end: completed successfully`. The repo2 backup takes a lot longer. If a scheduled backup is running, a backup fails with a lock error: wait and run that line again.

## 21. Check backups

```sh
oc exec -n $NS $REPOHOST -- pgbackrest info
oc exec -n $NS $REPOHOST -- df -h /pgbackrest/repo1
```

Status is `ok` for every repo, and the last `full backup` of each repo is the one from step 20. `Use%` should be well below 100%.

## 22. Check that nothing is left over

```sh
oc -n $NS get postgrescluster $C -o jsonpath='{.spec.backups.pgbackrest}' | jq 'del(.repos, .global, .repoHost, .sidecars, .configuration)'
```

This should print `{}`.

If it prints anything else, follow [Clear leftover config](clear-leftover-config.md), then run this check again.

## Done

For a rehearsal, add a row to the rehearsal log in [the index](README.md#rehearsal-log).
