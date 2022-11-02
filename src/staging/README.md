# Frontend development - Gatsby
    
1.  Copy the .env.example file to .env (`cp .env.example .env`)
    
2.  Edit the .env file in a text editor and choose which datasource you want to use
- Localhost: `REACT_APP_CMS_BASE_URL=http://localhost:1337`
- Test:  `REACT_APP_CMS_BASE_URL=http://test-cms.bcparks.ca`
- Prod: `REACT_APP_CMS_BASE_URL=http://cms.bcparks.ca`
    
4.  Back in your shell, from /src/staging folder run: `yarn`
    
5.  Start Gatsby in develop mode by running: `yarn start`. It may take a few minutes to load the required data. When it completes, you should be able to view the site at http://localhost:8000.

6. If you are running gatsby in a VM, you can pin the websocket port in order to allow a forwarding rule to work consistently. `export INTERNAL_STATUS_PORT=<port number>` See [this issue](https://github.com/gatsbyjs/gatsby/blob/247b1dc0441fdade52a5ff7a71de8c9340ee05fd/packages/gatsby/src/commands/develop.ts#L213) for more info.


### Previewing Changes using GraphQL

1.  With Gatsby running, make changes in the Strapi CMS.
    
2.  Visit http://localhost:8000/___graphql and click "Refresh Data" (top right).
    
3. You should be able to view the updated content at http://localhost:8000