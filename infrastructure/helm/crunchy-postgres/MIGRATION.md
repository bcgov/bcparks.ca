# Migrating from Patroni to CrunchyDB

1. Install the `crunchy-postgres` helm charts for the environment you are setting up. Wait about 10 minutes.

1. Back up the existing database

   Run this from the terminal on the current patroni leader (e.g. main-patroni-X or alpha-patroni-X)

   ```
   pg_dump --no-owner --no-privileges "cms" > /tmp/strapi-backup.sql
   ```

1. Copy the backup to your local machine
   - Log into OpenShift with `oc login` first
   - Change `c1643c-dev` to the current environment being migrated
   - Substitute `alpha` for `main` where needed

   ```
   cd ~
   oc project c1643c-dev
   oc cp main-patroni-0:/tmp/strapi-backup.sql ./strapi-backup.sql
   ```

1. Create the `cms` database on the new crunchy leader

   main environments

   ```
   psql -U postgres

   CREATE database "cms" OWNER "crunchy-postgres";
   ```

   alpha environments

   ```
   psql -U postgres

   CREATE database "cms" OWNER "crunchy-postgres-alpha";
   ```

1. Copy the backup onto the crunchy primary with `oc cp`
   - I usually put it in `/tmp`
   - It will get removed in a few minutes so work fast

   e.g.

   ```
   oc cp ./strapi-backup.sql crunchy-postgres-alpha-ha-jrs7-0:/tmp/strapi-backup.sql
   ```

1. Restore the DB

   You will need the password for the app user!

   main environments:
   password secret is in `crunchy-postgres-pguser-crunchy-postgres`

   ```
   \q

   psql -h crunchy-postgres-primary -U crunchy-postgres -d cms < /tmp/strapi-backup.sql
   ```

   alpha environments:
   password secret is in `crunchy-postgres-alpha-pguser-crunchy-postgres-alpha`

   ```
   \q

   psql -h crunchy-postgres-alpha-primary -U crunchy-postgres-alpha -d cms < /tmp/strapi-backup.sql
   ```

1. Run the `upgrade` command in the `deployment` helm chart for the environment being migrated
