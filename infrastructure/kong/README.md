# KONG API Service Portal Setup

The public API is accessible at https://bcparks.api.gov.bc.ca (PROD) or
https://bcparks.test.api.gov.bc.ca (TEST). Dev does not have a corresponding API Gateway.

API access is controlled via Kong, administered via the BC Gov API Programme Services API Gateway.
**Kong configuration is not updated via Github Actions, and must be updated manually when there are changes.**

For an overview of the API Gateway update process, see:
https://developer.gov.bc.ca/docs/default/component/aps-infra-platform-docs/

Access to the web UI for creating service accounts can be requested in the `#aps-ops` rocketchat channel.

## Prerequisites

- Install GWA CLI v3.x from https://github.com/bcgov/gwa-cli/releases
- Verify installation: `gwa --version`

## Kong Config Update

1. Visit [Strapi admin](http://localhost:1337/admin/plugins/documentation) and under Plugins -> Documentation,
   click the circular arrow icon which says "Regenerate 1.0.0".
2. Copy the content of `src/cms/src/extensions/documentation/documentation/1.0.0/full_documentation.json` to
   `infrastructure/kong/public-documentation.json` (overwriting the existing content).
3. Run `node clean.js` to remove any private API endpoints from the file.
4. Commit the file.

**Note:** `public-documentation.json` is for documentation purposes only. The catch-all routes in `public-test.yaml` and `public-prod.yaml` handle all API traffic automatically.

## TEST Environment Publication

1. Log into https://api-gov-bc-ca.test.api.gov.bc.ca/
2. Select the BC Parks namespace
3. Create a service account with `GatewayConfig.Publish` scope and note down the client id and client secret
4. Download the GWA CLI from https://github.com/bcgov/gwa-cli/releases
5. In command prompt run the following commands (the first command create a .env file locally, which will need to be deleted if you need to create one for the other environment):

   ```sh
   # Set the gateway (use namespace name)
   gwa config set gateway bcparks

   # Set the host for TEST environment
   gwa config set host api-gov-bc-ca.test.api.gov.bc.ca

   # Login with service account credentials
   gwa login --client-id=<CLIENT_ID> --client-secret=<CLIENT_SECRET>

   # Publish the configuration
   gwa pg public-test.yaml
   ```

6. Check the Gateway in the API Service Portal to make sure that the routes have been published

## TEST and PROD Environment Publication

1. Log into https://api.gov.bc.ca/
2. Select the BC Parks namespace
3. Create a service account with `GatewayConfig.Publish` scope and note down the client id and client secret
4. Download the GWA CLI from https://github.com/bcgov/gwa-cli/releases
5. In command prompt run the following commands (the first command create a .env file locally, which will need to be deleted if you need to create one for the other environment):

   ```sh
   # Set the gateway (use namespace name)
   gwa config set gateway bcparks

   # Set the host for PROD environment
   gwa config set host api.gov.bc.ca

   # Login with service account credentials
   gwa login --client-id=<CLIENT_ID> --client-secret=<CLIENT_SECRET>

   # Publish the configuration
   gwa pg public-prod.yaml
   ```

6. Check the Gateway in the API Service Portal to make sure that the routes have been published
