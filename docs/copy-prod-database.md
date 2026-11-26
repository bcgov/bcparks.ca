# Copy the prod CMS database to dev or test

Replaces the `cms` database in dev, alpha-dev, test or alpha-test with a copy of prod. The copy streams from the prod primary to the target primary through your workstation, so nothing is written to disk on either side. It combines the Confluence page "Copying prod data to other environments" with the local copy command in the Staff Portal's [DATABASE.md](https://github.com/bcgov/bcparks-staff-portal/blob/alpha/backend/DATABASE.md).

**Everything in the target database is lost.**

**You need:** `oc` logged in to Gold (in the OpenShift web console, your name in the top right → **Copy login command**), with access to run commands in pods (`oc exec`) in both `c1643c-prod` and the target namespace.

## 1. Set the variables

Paste the block for the environment you're copying to.

### alpha-dev

```sh
NS=c1643c-dev; C=crunchy-postgres-alpha
SEL=postgres-operator.crunchydata.com/role=master
PRIMARY=$(oc -n $NS get pod -l postgres-operator.crunchydata.com/cluster=$C,$SEL -o name)
PROD_PRIMARY=$(oc -n c1643c-prod get pod -l postgres-operator.crunchydata.com/cluster=crunchy-postgres,$SEL -o name)
echo "NS=$NS C=$C PRIMARY=$PRIMARY PROD_PRIMARY=$PROD_PRIMARY"
```

### alpha-test

```sh
NS=c1643c-test; C=crunchy-postgres-alpha
SEL=postgres-operator.crunchydata.com/role=master
PRIMARY=$(oc -n $NS get pod -l postgres-operator.crunchydata.com/cluster=$C,$SEL -o name)
PROD_PRIMARY=$(oc -n c1643c-prod get pod -l postgres-operator.crunchydata.com/cluster=crunchy-postgres,$SEL -o name)
echo "NS=$NS C=$C PRIMARY=$PRIMARY PROD_PRIMARY=$PROD_PRIMARY"
```

### dev

```sh
NS=c1643c-dev; C=crunchy-postgres
SEL=postgres-operator.crunchydata.com/role=master
PRIMARY=$(oc -n $NS get pod -l postgres-operator.crunchydata.com/cluster=$C,$SEL -o name)
PROD_PRIMARY=$(oc -n c1643c-prod get pod -l postgres-operator.crunchydata.com/cluster=crunchy-postgres,$SEL -o name)
echo "NS=$NS C=$C PRIMARY=$PRIMARY PROD_PRIMARY=$PROD_PRIMARY"
```

### test

```sh
NS=c1643c-test; C=crunchy-postgres
SEL=postgres-operator.crunchydata.com/role=master
PRIMARY=$(oc -n $NS get pod -l postgres-operator.crunchydata.com/cluster=$C,$SEL -o name)
PROD_PRIMARY=$(oc -n c1643c-prod get pod -l postgres-operator.crunchydata.com/cluster=crunchy-postgres,$SEL -o name)
echo "NS=$NS C=$C PRIMARY=$PRIMARY PROD_PRIMARY=$PROD_PRIMARY"
```

`PRIMARY` and `PROD_PRIMARY` must both be set.

## 2. Recreate the target database

```sh
oc exec -n $NS $PRIMARY -c database -- psql -d postgres -c "DROP DATABASE IF EXISTS cms WITH (FORCE);" -c "CREATE DATABASE cms OWNER \"$C\";"
```

You see `DROP DATABASE` and `CREATE DATABASE`. `WITH (FORCE)` disconnects Strapi first, so you don't need to stop anything.

## 3. Copy prod into the target

```sh
set -o pipefail
oc exec -n c1643c-prod $PROD_PRIMARY -c database -- pg_dump --no-owner --no-privileges -N pgbouncer cms \
  | grep -v '^COMMENT ON EXTENSION' \
  | oc exec -i -n $NS $PRIMARY -c database -- env PGOPTIONS="-c role=$C" psql -v ON_ERROR_STOP=1 -1 -q -d cms
echo "exit=$?"
```

This takes a few minutes. It prints `exit=0` at the end.

If you run into problems, run steps 2 and 3 back to back, so nothing can connect to the empty database in between:

1. Copy step 2 to your clipboard and paste it into the terminal, without pressing Enter.
2. Copy step 3 to your clipboard.
3. Press Enter to run step 2.
4. As soon as it finishes, paste step 3 and press Enter.

The Crunchy operator has already set up the new database with its own `pgbouncer` schema and `pgaudit` extension. `-N pgbouncer` leaves that schema out of the copy. The `grep` drops the extension comments, which only the extension owner can set.

If `exit` isn't 0, go back to step 2 and try again. A SQL error rolls the whole copy back, but if the prod side fails partway through, part of the copy may already be saved.

## After the copy

Log in to the target's Strapi admin panel with your **prod** credentials, since the users came over with the database.

1. Restart Strapi (`main-cms` or `alpha-cms`).
2. Run the post-deploy tasks from the Jira ticket for each release on the target's branch that isn't in prod yet (for example "Post-deploy tasks for CMS v3.3.0"). The most important one is deleting the new migrations from `strapi_migrations` and restarting Strapi, so they run again.
3. Regenerate the API tokens in **Settings → API Tokens**:
   1. Gatsby token: update the GitHub Actions secret (for example `GATSBY_STRAPI_API_TOKEN__MAIN_DEV__GOLD`), delete the two Gatsby caches for the environment, then run the Gatsby build for it.
   2. Background Jobs token: update `STRAPI_API_TOKEN` in the `main-strapi-token` (or `alpha-strapi-token`) secret on Gold, then restart the scheduler.
   3. DOOT token: update `STRAPI_TOKEN` in the `main-strapi-token` (or `alpha-strapi-token`) secret on Silver, then restart the Staff Portal backend.
4. Rebuild the search index: run `node manage.js rebuild` in the scheduler pod (`main-scheduler` or `alpha-scheduler`). The copy doesn't go through Strapi, so nothing reindexes the parks on its own.
