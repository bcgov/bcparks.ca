# BC Parks CMS


## Summary 
A data driven progressive mobile web site that provides potential BC Park visitors with information on provincial parks, conservation areas, and ecological reserves.  Content on these pages includes descriptions, activies, amentities, park status, etc.

## HOW TO USE
The production application can be accessed here: TBD


## HOW TO RUN

Clone a copy of the code from this repository, then deploy the code using the
following Docker command in the TBD folder:

	docker-compose up --build
   

## HOW TO DEVELOP

To get the project up and running, install Docker and run the following
Docker command:

	docker-compose up --build

For full development, developer dependencies are the following:

	Visual Studio Code
  Strapi
	Gitlab
	Postman

The following technologies are used in this project:

	React
	Strapi
  Gatsby
  Kong
	PostgreSQL

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


### Technology Selection
* We hosted the application on OpenShift.  We built the application to be cloud-ready and able to work with a wide range of platforms and clouds.
* The Headless CMS loads in content/resources for the different sections of the application.


### Architecture and Technical Design

[Link to architecture](docs/Architecture.md)

#### Front-end

* React
* Gatsby
* Leaflet 

#### Backend

* Headless API - Strapi

### Database

* PostgresDB

### DevOps

* Docker - Local Build/Image Development
* Github Actions - Build and Deploy Images
* Dockerhub - Container Registry
* OpenShift - to host the frontend and API





