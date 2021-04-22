# BC Parks CMS


## Summary 
A data driven progressive mobile web site that provides potential BC Park visitors with information on provincial parks, conservation areas, and ecological reserves.  Content on these pages includes descriptions, activies, amentities, park status, etc.

## HOW TO USE
The production application can be accessed here: TBD

Development Environment:
| Name       | URL                                                            | Notes         |
|------------|----------------------------------------------------------------|---------------|
| Frontend   | http://web-61d198-test.apps.silver.devops.gov.bc.ca/           |               |
| .NET API   | http://api-61d198-test.apps.silver.devops.gov.bc.ca/swagger    | (Still a WIP) |
| Gatsby     | http://staging-61d198-test.apps.silver.devops.gov.bc.ca/       |               |
| Strapi     | http://cms-61d198-test.apps.silver.devops.gov.bc.ca/           |               |



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

