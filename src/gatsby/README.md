# Frontend development - Gatsby

## Prerequisites

1. Make sure Strapi is running. Follow the steps found in ``src/cms/``

## Dev steps to run locally

1.  Navigate to the bcparks.ca/src/gatsby directory.
    
2.  Copy the .env.example file to .env (`cp .env.example .env`)
    
3.  Edit the .env file in a text editor and choose which datasource you want to use
- Localhost: `REACT_APP_CMS_BASE_URL=http://localhost:1337`
- Dev:  `REACT_APP_CMS_BASE_URL=https://dev-cms.bcparks.ca` (needs VPN)
- Test:  `REACT_APP_CMS_BASE_URL=https://test-cms.bcparks.ca` (needs VPN)
- Prod: `REACT_APP_CMS_BASE_URL=https://cms.bcparks.ca`
- Alpha Dev:  `REACT_APP_CMS_BASE_URL=https://alpha-dev-cms.bcparks.ca` (needs VPN)
- Alpha Test:  `REACT_APP_CMS_BASE_URL=https://alpha-test-cms.bcparks.ca` (needs VPN)

4.  Generate a full-access Strapi API token on the selected environment and set the STRAPI_TOKEN varibale in your .env file.
    
5.  Back in your shell, from /src/gatsby folder run: `npm install`
    
6.  Start Gatsby in develop mode by running: `npm run start`. It may take a few minutes to load the required data. When it completes, you should be able to view the site at http://localhost:8000.

7. If you are running gatsby in a VM, you can pin the websocket port in order to allow a forwarding rule to work consistently. `export INTERNAL_STATUS_PORT=<port number>` See [this issue](https://github.com/gatsbyjs/gatsby/blob/247b1dc0441fdade52a5ff7a71de8c9340ee05fd/packages/gatsby/src/commands/develop.ts#L213) for more info.

### Previewing Changes using Gatsby GraphQL

1.  With Gatsby running in develop mode, make changes in the Strapi CMS.
    
2.  Visit http://localhost:8000/___graphql and click "Refresh Data" (top right).
    
3. You should be able to view the updated content at http://localhost:8000

- Note: Strapi and Gatsby both have their own GraphQL.  Strapi GraphQL can be accessed from http://localhost:1337/graphql
