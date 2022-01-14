# Strapi application

Strapi allows administration of site data.
## Pre-condition

Run a postgres instance
eg: docker run --name postgres-docker -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres

## Dev steps to run locally

1. Install and activate NodeJS 14.
2. Install and start up postgres locally. You'll need to create a user and database,
   and set ``DATABASE_HOST``, ``DATABASE_PORT``, ``DATABASE_NAME``, ``DATABASE_USERNAME``,
   ``DATABASE_PASSWORD`` appropriately in ``.env``.
3. Run ``npm install``.
4. Run ``npm run develop`` to start a dev server and create the db tables.
5. Run ``npm run seed`` to load initial data (takes about 10 minutes).
