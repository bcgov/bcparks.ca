# Strapi application

Strapi allows administration of site data.
## Pre-condition

Run a postgres instance
eg: docker run --name postgres-docker -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres

## Dev steps to initialize locally

1. Install and activate NodeJS 14.
2. Install and start up postgres locally. You'll need to create a user and database
    * ``docker container ls``
    * ``docker exec -it {{Container ID}} bash``
    * ``psql -U postgres``
    * ``CREATE DATABASE cms;``
3. Set ``DATABASE_HOST``, ``DATABASE_PORT``, ``DATABASE_NAME``, ``DATABASE_USERNAME``,
   ``DATABASE_PASSWORD`` appropriately in ``.env``.
    * Copy ``.env.example`` and save as ``.env``
    * By default, database client will be set to sqlite. If you are using Postgres locally make sure to set ``DATABASE_CLIENT=postgres`` in ``.env``.
    * It may also be a good idea to set database name to CMS. Set ``DATABASE_NAME=cms`` in ``.env``.
4. Run ``npm install``.
5. Run ``npm run develop`` to start a dev server and create the db tables.
6. Run ``npm run seed`` to load initial data (takes about 10 minutes).
