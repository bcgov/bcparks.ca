# Backend Development - Strapi Localhost

Building a local version of Strapi is optional, as you can use a remote environment as the datasource. Using a local is useful for testing, and essential for development of new CMS features. If you don't need to run a local version of Strapi, you can skip to the Frontend development section, and ensure you point the .env file to a remote Strapi instance.

1. Navigate to the bcparks.ca/src/cms directory.

2. Run the postgres instance `docker run --name postgres-docker -e POSTGRES_PASSWORD=postgres -p 5432:5432 -e=POSTGRES_DB=cms -d postgres`

3.  Copy the .env.example file to .env (`cp .env.example .env`). 

4.  Edit the .env file in a text editor and ensure that this line is set: `DATABASE_HOST=localhost` and `DATABASE_NAME=cms`

5. Run `yarn`.

6. Run `yarn develop` to start a dev server and create the db tables.

- This step runs the Strapi server and must be running for the seed step to work. It is also required for admin and staging development servers.

7. Run `yarn seed` to load initial data (takes about 10 minutes). This data is out of date, but it will give you some data to start with.

- Going forward you might want to run `yarn build && yarn develop` to start the server so that you can ensure that webpack picks up any changes.
