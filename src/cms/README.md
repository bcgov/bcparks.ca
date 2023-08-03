# Backend Development - Strapi Localhost

Building a local version of Strapi is optional, as you can use a remote environment as the datasource. Using a local is useful for testing, and essential for development of new CMS features. If you don't need to run a local version of Strapi, you can skip to the Frontend development section, and ensure you point the .env file to a remote Strapi instance.

## Dev steps to run locally

1. Navigate to the bcparks.ca/src/cms directory.

2. Run the opensearch and postgres instances `docker-compose up -d`

3.  Copy the .env.example file to .env (`cp .env.example .env`). 

5.  Edit the .env file in a text editor and ensure that this line is set: `DATABASE_HOST=localhost` and `DATABASE_NAME=cms`

6. Run `npm install`.

7. Run `npm run build && npm run develop` to run webpack, start a dev server and create the db tables.

8. Create an admin user when prompted by your browser and log in


### Exporting PROD data

This step should be completed by someone familiar with OpenShift.  It involves running terminal commands on a prod server.  

1. Go to the terminal for a prod CMS pod on OpenShift

2. `npm run strapi export -- --no-encrypt --only content`

3. Navigate to the bcparks.ca/src/cms directory.

4. Log into OpenShift from your terminal using `oc`

5. Use `oc project` to switch to the prod project in OpenShift

6. oc cp \<name of pod where you did the export>:\<export file name>.tar.gz .\prod.tar.gz


### Importing PROD data

1. Run the export steps above or get someone with OpenShift permissions to run them for you. (make sure you call the file prod.tar.gz and copy it into the bcparks.ca/src/cms directory to follow these instructions)

##### Linux / Mac terminals

2. `npm run strapi import -- -f prod.tar.gz --force`

##### Powershell

2. `npm run strapi import "---" -f prod.tar.gz --force`

- Note: This is really slow and may take 1-2 hours

### Indexing data for searching

1. Navigate to the bcparks.ca/src/elastic directory.

2. Copy the .env.example file to .env (`cp .env.example .env`). 

3. Edit the .env file in a text editor and ensure that this line is set: `STRAPI_API_TOKEN` is set

4. Run `npm install`.

5. Run `npm run rebuild` to create the elasticsearch index

6. The cron task will run every 2 minutes on Openshift environments. On your local, you can periodically run `npm run once` to process the indexing jobs in your Strapi Queued-tasks collection. `npm run reindex`, `npm run rebuild` and `npm run deleteindex` scripts are also available on your local and on the terminal of the elasticmanager container (running on OpenShift).
