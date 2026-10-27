# KONG API Service Portal Setup

The public API is accessible at https://bcparks.api.gov.bc.ca (PROD) or
https://bcparks-test-api-gov-bc-ca.test.api.gov.bc.ca (TEST). Dev does not have a corresponding API Gateway.

API access is controlled via Kong, administered via the BC Gov API Programme Services API Gateway.
**Kong configuration is not updated via Github Actions, and must be updated manually when there are changes.**

For an overview of the API Gateway update process, see:
https://developer.gov.bc.ca/docs/default/component/aps-infra-platform-docs/

## Prerequisites

- Install GWA CLI v3.x from https://github.com/bcgov/gwa-cli/releases
- Verify installation: `gwa --version`

## Kong Config Update

1. Visit [Strapi admin](http://localhost:1337/admin/plugins/documentation) and under Plugins -> Documentation,
   click the "Regenerate" icon (circular arrow) to regenerate the API documentation.
2. Copy the content of `src/cms/src/extensions/documentation/documentation/1.0.0/full_documentation.json` to
   `infrastructure/kong/public-documentation.json` (overwriting the existing content).
3. Run `node clean.js` to remove any private API endpoints from the file.
4. Commit the file.

**Note:** `public-documentation.json` is for documentation purposes only. The catch-all routes in `public-test.yaml` and `public-prod.yaml` handle all API traffic automatically.

## TEST Environment Publication

1. Log into https://api-gov-bc-ca.test.api.gov.bc.ca/
2. Select **Gateways** > **Gateway bcparks** and check that your IDIR has the `GatewayConfig.Publish` permission under
   **Gateway Administration Access**
3. From `infrastructure/kong/`, run the following commands. `gwa` stores its settings globally in `~/.gwa-config.yaml`,
   so these commands also switch away from the other environment:

   ```sh
   # Set the host for TEST environment
   gwa config set host api-gov-bc-ca.test.api.gov.bc.ca

   # Set the gateway
   gwa config set gateway bcparks

   # Login with your IDIR
   gwa login

   # Preview the changes
   gwa pg --dry-run public-test.yaml
   ```

4. Review the dry run output, then publish the configuration and check the upstream status and published hostnames:

   ```sh
   gwa pg public-test.yaml
   gwa status --hosts
   ```

   `gwa pg` replaces all of the Gateway's Kong configuration tagged `ns.bcparks`, so any service or route that is not in
   the file will be deleted.

   In the TEST environment, route hosts are rewritten, so `bcparks.test.api.gov.bc.ca` in `public-test.yaml` is
   served at `bcparks-test-api-gov-bc-ca.test.api.gov.bc.ca`.

## PROD Environment Publication

1. Log into https://api.gov.bc.ca/
2. Select **Gateways** > **Gateway bcparks** and check that your IDIR has the `GatewayConfig.Publish` permission under
   **Gateway Administration Access**
3. From `infrastructure/kong/`, run the following commands. `gwa` stores its settings globally in `~/.gwa-config.yaml`,
   so these commands also switch away from the other environment:

   ```sh
   # Set the host for PROD environment
   gwa config set host api.gov.bc.ca

   # Set the gateway
   gwa config set gateway bcparks

   # Login with your IDIR
   gwa login

   # Preview the changes
   gwa pg --dry-run public-prod.yaml
   ```

4. Review the dry run output, then publish the configuration and check the upstream status and published hostnames:

   ```sh
   gwa pg public-prod.yaml
   gwa status --hosts
   ```

   `gwa pg` replaces all of the Gateway's Kong configuration tagged `ns.bcparks`, so any service or route that is not in
   the file will be deleted.

## Service Accounts

To log in without an IDIR (for example, from automation), select **Gateways** > **Gateway bcparks** > **Service Accounts**
in the portal and create a service account with the `GatewayConfig.Publish` permission. Note down the client id and
client secret, as they cannot be retrieved after the dialog is closed. Then log in with:

```sh
gwa login --client-id=<CLIENT_ID> --client-secret=<CLIENT_SECRET>
```

## Support

Ask questions in the API-ProgramServices-operations Microsoft Teams channel.
