# Crunchy Postgres backup and restore runbooks

Developers use these runbooks, often under pressure during an incident. They copy commands from top to bottom without reading much. Keep every change in that spirit.

## Keep both repos in sync

These runbooks exist in two repos, at `docs/crunchy-postgres-backup-and-restore/` in each:

- bcparks-staff-portal (the Staff Portal)
- bcparks.ca (the CMS)

The two checkouts are usually side by side, for example `~/Work/bcparks-staff-portal` and `~/Work/bcparks.ca`, often on the same branch.

**Every change made in one repo must be made in the other**, unless it only concerns one app's values. This `AGENTS.md` is identical in both repos, so update it in both too.

The only intended differences:

|                                    | bcparks-staff-portal                                                                                           | bcparks.ca                                                                                  |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Namespaces                         | `a7dd13-*`                                                                                                     | `c1643c-*`                                                                                  |
| Environments                       | alpha-dev, alpha-test, dev, test, training, prod                                                               | no training                                                                                 |
| App variable in step 1             | `REL` (Helm release of the app)                                                                                | `BRANCH`                                                                                    |
| App database                       | same name as the cluster                                                                                       | `cms`                                                                                       |
| S3 buckets                         | `doottest`, `dootprod` (`doot$ENV`)                                                                            | `parks-cms-test`, `parks-cms-prod` (`parks-cms-$ENV`)                                       |
| App restart                        | `deploy/$REL-backend`                                                                                          | `deploy/$BRANCH-cms deploy/$BRANCH-scheduler`                                               |
| Damaged-data check after a restore | Staff Portal, tables in `backend/migrations`                                                                   | Strapi admin, `collectionName` in `src/cms/src/api/<type>/content-types/<type>/schema.json` |
| Chart path                         | `helm/crunchy-postgres`                                                                                        | `infrastructure/helm/crunchy-postgres`                                                      |
| Helm prerequisite link             | `../../helm/README.md#prerequisite`                                                                            | `../../infrastructure/helm/deployment/README.md#prerequisite`                               |
| README "Connections" bullet        | yes                                                                                                            | no                                                                                          |
| Rebuild from S3                    | marked "Not rehearsed yet"; the uninstall step notes that the alpha-test and training releases aren't affected | already rehearsed, so there's no note                                                       |
| Rehearsal log                      | its own                                                                                                        | its own                                                                                     |
| Prettier                           | `frontend/node_modules/.bin/prettier`                                                                          | `src/cms/node_modules/.bin/prettier`                                                        |

To check that the repos are in sync, run `diff -r` on the two folders. Every difference should be in this table.

## Layout

- `README.md` is the index: the "which runbook do I need?" table, How it works (concepts: repos, backups, WAL, point-in-time restore), environments, rehearsal log and references.
- Each task has its own runbook, with separate files for repo1 and repo2. repo2 (S3) exists only in test and prod.
- `clear-leftover-config.md` is never started on its own. Other runbooks link to it from every leftover check (`jq 'del(.repos, .global, .repoHost, .sidecars, .configuration)'`, which should print `{}`). If you add a runbook with that check, add the link.
- The restore and rebuild runbooks handle rehearsals with steps marked **Rehearsal only**, not with separate files.
- The runbooks were split from a single doc. The old version is in git history at `docs/crunchy-postgres-backup-and-restore.md`.

## Rules for runbooks

- **Self-contained.** Never make a runbook depend on finishing steps in another file. Write shared steps out in full in every runbook that needs them, such as setting variables, finding `PRIMARY` and `REPOHOST` again, manual backups and backup checks. The only allowed links to other runbooks are:
  - exception branches: a leftover check that fails, or a leftover `dataSource` (→ step 9 of `rebuild-from-s3.md`)
  - background reading in `README.md`
  - the rebuild rehearsal's lifecycle check
- **Step numbers are referenced elsewhere.** If you renumber, update the references. For example, `pitr-repo*.md` and `clear-leftover-config.md` point to step 9 of `rebuild-from-s3.md`, and `rebuild-from-s3.md` points to step 19 of `pitr-repo2.md`.
- **Step 1 sets the variables.** It has one paste-able block per applicable environment, and each block sets `NS`, `C`, the app variable, `SEL` (plus `PRIMARY` and `REPOHOST` when the runbook needs them) and echoes them. Only list environments the runbook applies to.
- **No prompts or choices in commands.** The repo is written into the commands (`--repo=1`, `"repoName":"repo1"`), with no `REPO` variable. T is set by one editable line (`T='YYYY-MM-DD HH:MM:SS+00'`), followed by a regex check that works in both bash and zsh. Don't add shell-specific blocks such as zsh `vared`, bash `read -e`, or macOS or GNU `date`.
- **Use `$NS` everywhere**, not `<namespace-prefix>-$ENV`. The rebuild runbook also sets `ENV`, for the Helm values file and the bucket name.
- **Each step:** one command block, then one line saying what you should see. Keep warnings (point of no return, don't restart a restore, never uninstall in prod, remove `dataSource` before `restore`) next to the step they apply to.
- **Keep cautions short.** Put explanations in How it works in `README.md`, not in the runbooks.

## Wording

- Readers are developers, not DBAs. Don't assume they know Postgres or pgBackRest terms. Explain concepts once, in `README.md`.
- The first time a file uses "repo" or "repos" on its own, not as `repo1` or `repo2`, write "repo (backup device)" or "repos (backup devices)". Use the plain word after that. "Repo host" (the pgBackRest pod) is left as is.
- T is the target time of a point-in-time restore. Define it at the top of each runbook that uses it.
- WAL is the write-ahead log, Postgres's transaction log. It's copied to every repo all the time, separately from the scheduled backups. A point-in-time restore restores the last backup before T (the full backup plus any incrementals after it), then replays the WAL up to T.

## Checks after editing (in both repos)

- Format with Prettier, using the path from the table above, for example `<prettier> --write docs/crunchy-postgres-backup-and-restore/*.md`. It turns example JSON into multi-line, so example `oc` output goes in a `text` block to stay on one line.
- Check that every relative link resolves.
- If you change the T check, test it in both `bash` and `zsh`.
- Run `diff -r` on the two repos' folders, as described above.
- In the Staff Portal, remove "Not rehearsed yet" from the top of `rebuild-from-s3.md` only once a rehearsal has been logged in its `README.md`.
