# SSL Certificate Updates

We use the same wildcard certificate on all bcparks.ca routes on both the OpenShift Gold and OpenShift Silver clusters. The certificate expires every six months. Rob Fiddler usually sends me the new certificate a few weeks before expiry.

We use an OpenShift feature called `externalCertificate`, which lets routes reference a TLS secret instead of embedding the certificate in each route. There is a separate copy of the secret in each of our dev, test and prod namespaces on both Gold and Silver (six in total), but each one can be updated with a CLI command instead of editing every route by hand.

This document covers the three Gold namespaces used by bcparks.ca and the CMS (`c1643c-dev`, `c1643c-test` and `c1643c-prod`). The Silver namespaces are covered by the same document in the staff portal repo.

> **TODO:** `externalCertificate` is only a Technology Preview feature on OpenShift 4.18, so it doesn't work on Gold or Silver yet. Remove this note once the clusters are on 4.20.

> [!WARNING]
> **Back up `bcparks-ssl-wildcard` from Gold prod before changing anything (step 0).** Without a backup, a bad certificate can't be rolled back quickly, and bcparks.ca and cms.bcparks.ca stay broken until it's fixed.

0. **Back up the Gold prod secret. Do not skip this step.**

   Log in to the Gold cluster and save the current `bcparks-ssl-wildcard` secret from `c1643c-prod`:

   ```bash
   mkdir -p ~/cert-backups
   oc get secret bcparks-ssl-wildcard -n c1643c-prod -o yaml > ~/cert-backups/c1643c-prod-secret-$(date +%Y%m%d).yaml
   ```

   > [!CAUTION]
   > This file contains the **unencrypted private key**. Keep it outside the git repo and delete it once the new certificate is working everywhere.

1. Join `bcparks-ca.crt` and `bcparks-ca-chain.crt` together in VS Code and save the result as `fullchain.crt`.

   The file will look like this (but with longer base64 strings):

   ```
   -----BEGIN CERTIFICATE-----
   MIIFxzCCBK+gAwIBAgIQCp/0GEuIDB8witszppiRHDANBgkqhkiG9w0BAQsFADA8
   MQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRwwGgYDVQQDExNBbWF6b24g
   XHR1koGGW1uy4Abxnh5oIOf8+68TEyqMtXO+4jyAVM4a32JMIonUsX/ITehEzxge
   V8cV7PHdMPRw09e5A3YTwCsgvDxSxd3fx/Ix0OzTIxnQ/u0BUPz+GaFkkQ==
   -----END CERTIFICATE-----
   -----BEGIN CERTIFICATE-----
   MIIEXjCCA0agAwIBAgITB3MSOAudZoijOx7Zv5zNpo4ODzANBgkqhkiG9w0BAQsF
   ADA5MQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRkwFwYDVQQDExBBbWF6
   b24gUm9vdCBDQSAxMB4XDTIyMDgyMzIyMjEyOFoXDTMwMDgyMzIyMjEyOFowPDEL
   SJlbe4mBlqeInUsNYugExNf+tOiybcrswBy8OFsd34XOW3rjSUtsuafd9AWySa3h
   xRRrwszrzX/WWGm6wyB+f7C4
   -----END CERTIFICATE-----
   -----BEGIN CERTIFICATE-----
   MIIEkjCCA3qgAwIBAgITBn+USionzfP6wq4rAfkI7rnExjANBgkqhkiG9w0BAQsF
   ADCBmDELMAkGA1UEBhMCVVMxEDAOBgNVBAgTB0FyaXpvbmExEzARBgNVBAcTClNj
   b3R0c2RhbGUxJTAjBgNVBAoTHFN0YXJmaWVsZCBUZWNobm9sb2dpZXMsIEluYy4x
   0FE6/V1dN2RMfjCyVSRCnTawXZwXgWHxyvkQAiSr6w10kY17RSlQOYiypok1JR4U
   akcjMS9cmvqtmg5iUaQqqcT5NJ0hGA==
   -----END CERTIFICATE-----
   ```

2. Verify the certificate. This part is optional but recommended.

   ```
   openssl crl2pkcs7 -nocrl -certfile fullchain.crt | openssl pkcs7 -print_certs -noout
   ```

   You should see something like this. The `*.bcparks.ca` certificate must be listed first, and the "Root Certificate Authority" must be last.

   ```
   subject=/CN=*.bcparks.ca
   issuer=/C=US/O=Amazon/CN=Amazon RSA 2048 M01

   subject=/C=US/O=Amazon/CN=Amazon RSA 2048 M01
   issuer=/C=US/O=Amazon/CN=Amazon Root CA 1

   subject=/C=US/O=Amazon/CN=Amazon Root CA 1
   issuer=/C=US/ST=Arizona/L=Scottsdale/O=Starfield Technologies, Inc./CN=Starfield Services Root Certificate Authority - G2
   ```

3. Copy the datestamped key file (e.g., `bcparks-ca-20261008.key`) into the same folder and name it `server.key` so it works with the following instructions.

4. Run these commands. You will be prompted for the key's passphrase.
   The project name `c1643c-dev` assumes you are installing the secret in our dev namespace. Repeat for `c1643c-test` and `c1643c-prod`. The `main` and `alpha` releases share the secret in dev and test, so each namespace only needs updating once.

   ```
   printf "Key passphrase: "; read -rs KEYPASS; echo
   export KEYPASS
   oc set data secret/bcparks-ssl-wildcard \
   -n c1643c-dev \
   --from-file=tls.crt=fullchain.crt \
   --from-file=tls.key=<(openssl pkey -in server.key -passin env:KEYPASS)
   unset KEYPASS
   ```

   `oc set data` only updates an existing secret. If the namespace doesn't have `bcparks-ssl-wildcard` yet, create it instead with `oc create secret tls bcparks-ssl-wildcard -n c1643c-dev --cert=fullchain.crt --key=<(openssl pkey -in server.key -passin env:KEYPASS)`.

5. Check the new certificate. The `vanity-*` routes are created by the Helm chart (`infrastructure/helm/deployment/templates/public/public-vanity-route.yaml` and `infrastructure/helm/deployment/templates/cms/cms-vanity-route.yaml`) and already reference the `bcparks-ssl-wildcard` secret, so the router picks up the updated secret without any route edits or a Helm upgrade.

   Confirm that the new expiry date is being served. The CMS hostnames are used here because the non-prod public hostnames only accept connections from the IP allowlist.

   ```
   echo | openssl s_client -connect dev-cms.bcparks.ca:443 -servername dev-cms.bcparks.ca 2>/dev/null | openssl x509 -noout -subject -enddate
   ```

   Repeat with `test-cms.bcparks.ca` and `cms.bcparks.ca`, and check `bcparks.ca` as well after updating prod.
