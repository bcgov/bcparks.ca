# SSL Certificate Updates

We use the same wildcard certificate on all bcparks.ca routes on both the OpenShift Gold and OpenShift Silver clusters. The certificate expires every six months. Rob Fiddler usually sends me the new certificate a few weeks before expiry.

We use an OpenShift feature called `externalCertificate`, which lets routes reference a TLS secret instead of embedding the certificate in each route. There is a separate copy of the secret in each of our dev, test and prod namespaces on both Gold and Silver (six in total), but each one can be updated with a CLI command instead of editing every route by hand.

> **TODO:** `externalCertificate` is only a Technology Preview feature on OpenShift 4.18, so it doesn't work on Gold or Silver yet. Finish these docs (see step 5) and remove this note once the clusters are on 4.20. The October 2026 update was applied by adding the secrets to all six OpenShift environments and running the commands in `cli-update.bash` for each.

> [!WARNING]
> **Back up `bcparks-ssl-wildcard` from Gold prod before changing anything (step 0).** Without a backup, a bad certificate can't be rolled back quickly, and the public bcparks.ca site stays broken until it's fixed.

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
   The project name `a7dd13-dev` assumes you are installing the secret in our dev namespace on the Silver cluster.

   ```
   printf "Key passphrase: "; read -rs KEYPASS; echo
   export KEYPASS
   oc create secret tls bcparks-ssl-wildcard \
   -n a7dd13-dev \
   --cert=fullchain.crt \
   --key=<(openssl pkey -in server.key -passin env:KEYPASS)
   unset KEYPASS
   ```

5. TO BE CONTINUED. The next step would be replacing the TLS info in our routes. However, it turns out that letting routes reference the cert secret (`externalCertificate`) is only a Technology Preview feature on OpenShift 4.18. The BC Government is in the process of rolling out 4.20.

   Once the feature is available, the route should look something like this:

   ```yaml
   apiVersion: route.openshift.io/v1
   kind: Route
   metadata:
     name: vanity-alpha-staff
   spec:
     host: alpha-dev-staff.bcparks.ca
     to:
       kind: Service
       name: alpha-frontend
     port:
       targetPort: frontend
     tls:
       termination: edge
       insecureEdgeTerminationPolicy: Redirect
       externalCertificate:
         name: bcparks-ssl-wildcard
   ```
