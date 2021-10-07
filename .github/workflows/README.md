# Pipeline Basics

This is a quick overview of the pipeline.

## Dev Environment

Builds and deployments to the `dev` environment are performed automatically. Once a Pull Request is merged into the `main` branch a new dev build will kick off.

## Test Environment

Test deployments can be triggered by pushing a new `git tag` to the `bcparks.ca` repo. The tag must be in the form of `vx.x.x-rcx` where `x` is any number. For example, `v1.0.0-rc1`.

### Example Usage

```
git tag v1.0.0-rc1 23b0889bbf2a3206e86a3d95651b9b21b94fc50f
git push --tags
```

## Prod Environment

Prod deployments can be triggered by pushing a new `git tag` to the `bcparks.ca` repo. The tag must be in the form of `vx.x.x` where `x` is any number. For example, `v1.0.0`.

_Please note that `prod` OpenShift resources have not been completely configured, so the `prod` pipeline will not be able to correctly build the `public` Docker image._

### Example Usage

```
git tag v1.0.0 23b0889bbf2a3206e86a3d95651b9b21b94fc50f
git push --tags
```

## Triggering Public Refresh

The `public` beta site requires a new build to reflect data changes within the CMS. This build is automatically triggered when `dev`, `test`, or `prod` pipeline are triggered.

The `public` beta site build Github Action can also be triggered manually by making a `POST` request to the workflow. To do this, a user with at least `write` access to the `bcparks.ca` repo must first create a [Personal Access Token](https://github.com/settings/tokens) with `repo` scopes.

The `POST` request looks like the following:

### URL

`https://api.github.com/repos/bcgov/bcparks.ca/dispatches`

### Authorization Header

`'Authorization: Bearer <Personal Access Token Here>'`

### Payload:

Where `<env>` is the target environment you want to trigger a refresh. Values are `dev`, `test`, and `prod`.

```
{
    "event_type": "build-public",
    "client_payload": {
        "env": "<env>"
    }
}
```

### Example cURL command
```
curl --location --request POST 'https://api.github.com/repos/bcgov/bcparks.ca/dispatches' \
--header 'Authorization: Bearer <token>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "event_type": "build-public",
    "client_payload": {
        "env": "test"
    }
}'
```

### Example PowerShell command
```
$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
$headers.Add("Authorization", "Bearer <token>")
$headers.Add("Content-Type", "application/json")

$body = "{
`n    `"event_type`": `"build-public`",
`n    `"client_payload`": {
`n        `"env`": `"test`"
`n    }
`n}"

$response = Invoke-RestMethod 'https://api.github.com/repos/bcgov/bcparks.ca/dispatches' -Method 'POST' -Headers $headers -Body $body
$response | ConvertTo-Json
```