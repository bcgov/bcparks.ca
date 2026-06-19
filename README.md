# BC Parks CMS <!-- omit in toc -->

[![Lifecycle:Stable](https://img.shields.io/badge/Lifecycle-Stable-97ca00)](<Redirect-URL>)

## Summary <!-- omit in toc -->

An API-driven, fully responsive web site that provides potential BC Park visitors with information on provincial parks, conservation areas, and ecological reserves.  Content on these pages includes descriptions, activities, amenities, park status, etc.

This site is built using [Strapi CMS](https://strapi.io), a headless CMS, and [Gatsby](https://www.gatsbyjs.com); an open-source static site generator built on top of [Node.js](https://nodejs.org/en/) using [React](https://reactjs.org) and [GraphQL](https://graphql.org).

## Table of Contents <!-- omit in toc -->

- [Links](#links)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Development - Strapi Localhost](#backend-development---strapi-localhost)
  - [Frontend development - Gatsby](#frontend-development---gatsby)
- [Commit/branching](#commitbranching)
- [Application walkthrough](#application-walkthrough)
- [Communication Channels](#communication-channels)
- [Additional Documentation](#additional-documentation)
- [Deployment](#deployment)


## Links

The application can be accessed using the links below:

Prod | Test | Dev | Alpha-Test | Alpha-Dev
--- | --- | --- | --- | ---
[Staff App](https://staff.bcparks.ca)                  | [Test - Staff App](https://test-staff.bcparks.ca)                  | [Dev - Staff App](https://dev-staff.bcparks.ca)                   | [Alpha-Test - Staff App](https://alpha-test-staff.bcparks.ca)                  | [Alpha-Dev - Staff App](https://alpha-dev-staff.bcparks.ca)                   |
[Public](https://beta.bcparks.ca)                      | [Test - Public](https://test.bcparks.ca)                           | [Dev - Public](https://dev.bcparks.ca)                            | [Alpha-Test - Public](https://alpha-test.bcparks.ca)                           | [Alpha-Dev - Public](https://alpha-dev.bcparks.ca)                       |
[CMS](https://cms.bcparks.ca)                          | [Test - CMS](https://test-cms.bcparks.ca)                          | [Dev - CMS](https://dev-cms.bcparks.ca)                           | [Alpha-Test - CMS](https://alpha-test-cms.bcparks.ca)                          | [Alpha-Dev - CMS](https://alpha-dev-cms.bcparks.ca)                           |
[API Docs](https://openapi.apps.gov.bc.ca/?url=https://raw.githubusercontent.com/bcgov/bcparks.ca/main/infrastructure/kong/public-documentation.json)       | [Test - API Docs](https://test-cms.bcparks.ca/documentation)       | [Dev - API Docs](https://dev-cms.bcparks.ca/documentation)        | [Alpha-Test - API Docs](https://alpha-test-cms.bcparks.ca/documentation)       | [Alpha-Dev - API Docs](https://alpha-dev-cms.bcparks.ca/documentation)        |
[Sample API endpoint](https://bcparks.api.gov.bc.ca/api/park-access-statuses?populate=*&accessStatus=Open&_limit=-1)| [Test - Sample API Endpoint](https://test-cms.bcparks.ca/api/urgencies)| [Dev - Sample API Endpoint](https://dev-cms.bcparks.ca/urgencies) | [Alpha-Test - Sample API Endpoint](https://alpha-test-cms.bcparks.ca/api/urgencies)| [Alpha-Dev - Sample API Endpoint](https://alpha-dev-cms.bcparks.ca/urgencies) |
[GraphQL](https://cms.bcparks.ca/graphql)              | [Test - GraphQL](https://test-cms.bcparks.ca/graphql)              | [Dev - GraphQL](https://dev-cms.bcparks.ca/graphql)               | [Alpha-Test - GraphQL](https://alpha-test-cms.bcparks.ca/graphql)              | [Alpha-Dev - GraphQL](https://alpha-dev-cms.bcparks.ca/graphql)               |

## Getting Started 

Running a local environment allows users to quickly see changes without waiting for a full build (10+ minutes). The local environment setup described below uses Gatsby JS to render the site frontend locally, and you can choose to set up a local Strapi CMS instance or use an external Strapi CMS instance (TEST or PROD) as the datasource.

IMPORTANT: this process is not currently working on Windows without virtualisation. It is known to work on OS X, and inside a Linux container running in VMWare Player.

### Prerequisites

1.  Ensure you have a command-line shell (like PowerShell, iTerm or the terminal integrated with Visual Studio Code) and Node JS 18 installed.

2. If you're running Strapi locally, you'll need to have [Docker](https://www.docker.com) installed. 

3. Create a fork of the repo from https://github.com/bcgov/bcparks.ca
    
4.  Clone your forked git repository into a local directory


### Backend Development - Strapi Localhost

- [Strapi setup instructions](src/cms/README.md)


### Frontend development - Gatsby

- [Gatsby setup instructions](src/gatsby/README.md)
    

## Commit/branching

Each developer should create a feature branch for work on their forked repo that relates to the associated JIRA issue. (example: `username/bcparks.ca/CM-123-brief-description`

Ensure you've added the upstream repo on your local: 
```git remote add upstream git@github.com:bcgov/bcparks.ca.git```

Prior to creating a PR, it's good practice to sync your fork with the upstream repo. `git checkout main` and then `git pull upstream main` followed by checking out your branch and then running `git rebase main`

Alternatively, you could do this in GitHub, and use the 'Sync fork' button in your forked repo, and then pull it into your local.

 
## Application walkthrough

For detailed instructions on how to perform common tasks in the CMS, contact [Leah Wilcock](mailto:Leah.Wilcock@gov.bc.ca), Manager of Information Services.

 
## Communication Channels

Most communications are handled through the BC Parks Service Transformation Microsoft Teams instance. Please reach out to your Project Manager for access.
  

## Additional Documentation

Coming soon.


## Deployment

For deployment and content sync information, contact [Leah Wilcock](mailto:Leah.Wilcock@gov.bc.ca), Manager of Information Services.
