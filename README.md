# BC Parks CMS <!-- omit in toc -->

[![Lifecycle:Experimental](https://img.shields.io/badge/Lifecycle-Experimental-339999)](<Redirect-URL>)

## Summary <!-- omit in toc -->

An API-driven, fully responsive web site that provides potential BC Park visitors with information on provincial parks, conservation areas, and ecological reserves.  Content on these pages includes descriptions, activities, amenities, park status, etc.

This site is built using [Strapi CMS](https://strapi.io), a headless CMS, and [Gatsby](https://www.gatsbyjs.com); an open-source static site generator built on top of [Node.js](https://nodejs.org/en/) using [React](https://reactjs.org) and [GraphQL](https://graphql.org).

## Table of Contents <!-- omit in toc -->

- [Links](#links)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
- [Commit/branching](#commitbranching)
- [Application walkthrough](#application-walkthrough)
- [Communication Channels](#communication-channels)
- [Additional Documentation](#additional-documentation)
- [Deployment](#deployment)

- [Backend Development - Strapi Localhost](src/cms/README.md)
- [Frontend development - Gatsby/GraphQL](src/staging/README.md)

## Links

The application can be accessed using the links below:

Prod | Test | Dev
--- | --- | ---
[Staff App](https://staff.bcparks.ca)                  | [Test - Staff App](https://test-staff.bcparks.ca)                  | [Dev - Staff App](https://dev-staff.bcparks.ca)                   |
[Public](https://beta.bcparks.ca)                      | [Test - Public](https://test-beta.bcparks.ca)                      | [Dev - Public](https://dev-beta.bcparks.ca)                       |
[CMS](https://cms.bcparks.ca)                          | [Test - CMS](https://test-cms.bcparks.ca)                          | [Dev - CMS](https://dev-cms.bcparks.ca)                           |
[API Docs](https://cms.bcparks.ca/documentation)       | [Test - API Docs](https://test-cms.bcparks.ca/documentation)       | [Dev - API Docs](https://dev-cms.bcparks.ca/documentation)        |
[Sample API endpoint](https://cms.bcparks.ca/urgencies)| [Test - Sample API Endpoint](https://test-cms.bcparks.ca/urgencies)| [Dev - Sample API Endpoint](https://dev-cms.bcparks.ca/urgencies) |
[GraphQL](https://cms.bcparks.ca/graphql)              | [Test - GraphQL](https://test-cms.bcparks.ca/graphql)              | [Dev - GraphQL](https://dev-cms.bcparks.ca/graphql)               |

## Getting Started 

Running a local environment allows users to quickly see changes without waiting for a full build (10+ minutes). The local environment setup described below uses Gatsby JS to render the site frontend locally, and you can choose to set up a local Strapi CMS instance or use an external Strapi CMS instance (TEST or PROD) as the datasource.

IMPORTANT: this process is not currently working on Windows without virtualisation. It is known to work on OS X, and inside a Linux container running in VMWare Player.

### Prerequisites

1.  Ensure you have a command-line shell (like PowerShell, iTerm or the terminal integrated with Visual Studio Code) and Node JS 14 installed (the node version must be 14 - newer versions do not work).

2. If you're running Strapi locally, you'll need to have [Docker](https://www.docker.com) installed. 

3. Create a fork of the repo from https://github.com/bcgov/bcparks.ca
    
4.  Clone your forked git repository into a local directory


## Commit/branching

Each developer should create a feature branch for work on their forked repo that relates to the associated JIRA issue. (example: `username/bcparks.ca/CM-123-brief-description`

Ensure you've added the upstream repo on your local: 
```git remote add upstream git@github.com:bcgov/bcparks.ca.git```

Prior to creating a PR, it's good practice to sync your fork with the upstream repo. `git checkout main` and then `git pull upstream main` followed by checking out your branch and then running `git rebase main`

Alternatively, you could do this in GitHub, and use the 'Sync fork' button in your forked repo, and then pull it into your local.

For full details on how to create a PR, refer to the instructions on [Confluence](#additional-documentation).

 
## Application walkthrough

Detailed instructions on how to perform common tasks in the CMS can be found on [Confluence](#additional-documentation).

 
## Communication Channels

Most communications are handled through the BC Parks Service Transformation Microsoft Teams instance. Please reach out to your Project Manager for access.
  

## Additional Documentation

BCP Web Team Jira Board: https://bcparksdigital.atlassian.net/jira/software/projects/BWT/boards/5

Confluence: https://apps.nrs.gov.bc.ca/int/confluence/pages/viewpage.action?pageId=109185900


## Deployment

Deployment and content sync information can be found on the [Confluence](#additional-documentation) page.