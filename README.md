# BC Parks CMS

[![Lifecycle:Experimental](https://img.shields.io/badge/Lifecycle-Experimental-339999)](<Redirect-URL>)

## Summary 
A data driven progressive mobile web site that provides potential BC Park visitors with information on provincial parks, conservation areas, and ecological reserves.  Content on these pages includes descriptions, activies, amentities, park status, etc.

## HOW TO USE
The application can be accessed using the links below:

Prod | Test | Dev
--- | --- | ---
[Staff App](https://staff.bcparks.ca)                  | [Test - Staff App](https://test-staff.bcparks.ca)                  | [Dev - Staff App](https://dev-staff.bcparks.ca)            | 
[Staging](https://staging.bcparks.ca)                  | [Test - Staging](https://test-staging.bcparks.ca)                  | [Dev - Staging](https://dev-staging.bcparks.ca)          | 
[CMS](https://cms.bcparks.ca)                          | [Test - CMS](https://test-cms.bcparks.ca)                          | [Dev - CMS](https://dev-cms.bcparks.ca)              | 
[API Docs](https://cms.bcparks.ca/documentation)       | [Test - API Docs](https://test-cms.bcparks.ca/documentation)       | [Dev - API Docs](https://dev-cms.bcparks.ca/documentation)|
[Sample API endpoint](https://cms.bcparks.ca/urgencies)| [Test - Sample API Endpoint](https://test-cms.bcparks.ca/urgencies)| [Dev - Sample API Endpoint](https://dev-cms.bcparks.ca/urgencies)
[GraphQL](https://cms.bcparks.ca/graphql)              | [Test - GraphQL](https://test-cms.bcparks.ca/graphql)              | [Dev - GraphQL](https://dev-cms.bcparks.ca/graphql)      | 





## HOW TO RUN

Clone a copy of the code from this repository, then deploy the code using the
following Docker command in the root folder:

	docker-compose up --build
   
## HOW TO DEVELOP

To get the project up and running, install Docker and run the following
Docker command:

	docker-compose up --build

For full development, developer dependencies are the following:

	Visual Studio Code
  	Strapi
	Github
	Postman

The following technologies are used in this project:

	React
	Strapi
  	Gatsby
  	Kong
	PostgreSQL
	NGINX

Your changes will be deployed automatically next time the app starts.

## HOW TO DEPLOY
Refer to the TBD for instructions on how to deploy the app.

## PROJECT STRUCTURE OVERVIEW

### Features
The application includes:
* Decoupling of content and its presentation.  
* Headless CMS using Strapi
* React front-end communicating with back-end Strapi API.  
* The API retrieves the content from the postgresql database and returns it to the presentation layer.
* NGINX acts as a reverse-proxy for all web applications.


### Technology Selection
* We hosted the application on OpenShift.  We built the application to be cloud-ready and able to work with a wide range of platforms and clouds.
* The Headless CMS loads in content/resources for the different sections of the application.
* NGINX was selected as a lightweight server and reverse proxy to handle routing and security.


### Architecture and Technical Design

[Link to architecture](docs/Architecture.md)

#### Front-end

* React
* Gatsby
* Leaflet 
* NGINX

#### Backend

* Headless API - Strapi

### Database

* PostgresDB

### DevOps

* Docker - Local Build/Image Development
* Github Actions - Build and Deploy Images
* Dockerhub - Container Registry
* OpenShift - to host the frontend and API

