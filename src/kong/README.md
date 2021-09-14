# KONG API Service Portal Setup

The public API is accessible at https://bcparks.api.gov.bc.ca (PROD) or https://bcparks-api-gov-bc-ca.test.api.gov.bc.ca (TEST) 

Steps to register the Strapi API in with DataBC KONG API Portal

## API Portal TEST Environment
1. Log into https://api-gov-bc-ca.test.api.gov.bc.ca/ 
2. Create a namespace called BCParks
3. Create a service account and note down the client id and cient secret
4. Download the GWA CLI (refer to https://api-gov-bc-ca.test/docs/platform-api-owner-user-journey)
5. In command prompt run the following commands

    gwa init -T --api-version=2 --namespace=bcparks --client-id=<ClientID from Step 3> --client-secret=<Client Secret from Step 3>
    
    gwa pg public-test.yaml

6. Check the Gateway in the API Service Portal to make sure that the routes have been published

## API Portal PROD Environment
1. Log into https://api.gov.bc.ca/ 
2. Create a namespace called BCParks
3. Create a service account and note down the client id and cient secret
4. Download the GWA CLI (refer to https://api.gov.bc.ca/docs/platform-api-owner-user-journey)
5. In command prompt run the following commands

    gwa init -P --api-version=2 --namespace=bcparks --client-id=<ClientID from Step 3> --client-secret=<Client Secret from Step 3>
    
    gwa pg public-prod.yaml

6. Check the Gateway in the API Service Portal to make sure that the routes have been published

If a new OpenAPI spec needs to be generated, the following steps need to be followed
1. Edit the public-documentation.json (this is a manually edited copy from the full_documentation.json from STRAPI)
2. In command prompt run the following command after the gwa init command

    gwa new public-documentation.json --route-host=bcparks.api.gov.bc.ca --service-url=<Openshift Service endpoint>--plugins rate-limiting cors  --outfile=public-prod.yaml
3. Add the generated YAML file with the following
    
    services:
    
      name: BCPARKS
    
        host: <Openshift Service endpoint>
    
        protocol: http
    
        port: 1337
