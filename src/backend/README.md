# Strapi application

A quick description of your strapi application

## Pre-condition:
Run a postgres instance
eg: docker run --name postgres-docker -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres

## Dev steps to run locally:
1. Update \config\database.js with the postgres connection details
2. npm start or npm run develop (with hot code refresh)