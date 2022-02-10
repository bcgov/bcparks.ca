# Strapi application

Strapi allows administration of site data.
## Pre-condition

## Dev steps to initialize locally

1. Install and activate NodeJS 14.
2. Run postgres instance ``docker run --name postgres-docker -e POSTGRES_PASSWORD=postgres -p 5432:5432 -e=POSTGRES_DB=cms -d postgres``
3. Set ``DATABASE_HOST``, ``DATABASE_PORT``, ``DATABASE_NAME``, ``DATABASE_USERNAME``,
   ``DATABASE_PASSWORD`` appropriately in ``.env``.
    * Copy ``.env.example`` and save as ``.env``
    * By default, database client will be set to sqlite. If you are using Postgres locally make sure to set ``DATABASE_CLIENT=postgres`` in ``.env``.
    * Set ```DATABASE_HOST=localhost```;
    * Set ``DATABASE_NAME=cms`` in ``.env``.
4. Run ``npm install``.
5. Run ``npm run develop`` to start a dev server and create the db tables.
    * This step runs the Strapi server and must be running for the seed step to work. It is also required for admin and staging development servers.
6. Run ``npm run seed`` to load initial data (takes about 10 minutes).
