# Pipeline Basics

This is a quick overview of the GitHub Actions pipeline. Images are built into the `<license plate>-tools` OpenShift namespace and promoted to the `-dev`, `-test` and `-prod` namespaces by retagging.

## Overview

### main

```
PR to main ──> Run Tests (on-pr.yaml)
        │
      merge
        ▼
Build dev (build-dev.yaml) ──> dev
        │
git tag vX.Y.Z-rc.N ──> Tag image on Git Tag Push (on-tag-push.yaml)
        │
Deploy to Test (releaseTag) ──> test
        │
Deploy to Prod (same releaseTag) ──> prod
```

### alpha

```
PR to alpha ──> Run Tests (on-pr.yaml)
        │
      merge
        ▼
Build dev (build-dev.yaml) ──> alpha-dev
        │
Deploy Alpha to Alpha-Test (no inputs) ──> alpha-test
```

Every deploy starts `publish-gatsby.yaml` to rebuild the public Gatsby site, and every Gatsby publish then starts the Playwright content check.

## Workflows

| Workflow | Trigger | Inputs | What it does |
|---|---|---|---|
| `build-dev.yaml` | Push to `main` or `alpha` | None | Builds the `strapi`, `public-builder`, `etl` and `scheduler` images for the branch. Restarts CMS and scheduler in dev, then publishes Gatsby to dev |
| `on-tag-push.yaml` | Push of any git tag | None | Adds the git tag name as an image tag on the `main` images built from the tagged commit. Does not deploy anything |
| `deploy-test.yaml` | Manual | `releaseTag` (required) | Promotes the `main` images for `releaseTag` to test, publishes Gatsby, and restarts CMS and scheduler |
| `deploy-prod.yaml` | Manual | `releaseTag` (required) | Same as `deploy-test.yaml`, for prod |
| `deploy-alpha-test.yaml` | Manual | None | Promotes the latest `alpha` images to alpha-test, publishes Gatsby, and restarts CMS and scheduler |
| `publish-gatsby.yaml` | Manual, or started by the workflows above | `branchName`: `main` (default) or `alpha`<br>`buildEnv`: `prod` (default), `test` or `dev` | Builds the public Gatsby site and deploys the `public` image, then runs the Playwright content check |
| `playwright.yaml` | PR to `main` that changes `tests/e2e/**`, manual, or started by `publish-gatsby.yaml` | `environment`: `prod` (default), `test`, `dev`, `alpha-test` or `alpha-dev`<br>`suite`: `full` (default) or `content-check` | Runs the end-to-end tests against an environment. PR runs use `prod` and `full` |
| `on-pr.yaml` | PR to `main` or `alpha` that changes `src/**` | None | Runs the CMS and Gatsby unit tests |

## Dev Environment

Builds and deployments to the `dev` environment are performed automatically. Once a Pull Request is merged into the `main` or `alpha` branch a new dev build will kick off. A newer push to the same branch cancels a build that is still running.

## Releases (Test and Prod)

Test and prod deployments are started manually. Pushing a git tag does not deploy anything, it only gives the images a release name. The same tag is deployed to test and then to prod.

1. Wait for the `build-dev.yaml` run for the commit to finish. The tag must be on a `main` commit, because only `main` builds get a commit SHA image tag.
2. Tag the commit and push the tag. `on-tag-push.yaml` finds the images by their commit SHA tag and adds the git tag to them.

   Release candidates use `vX.Y.Z-rc.N` (older ones used `vX.Y.Z-uat.N`). The final `vX.Y.Z` tag is added operationally and is not part of this process.

   ```
   git tag v3.3.0-rc.3 <commit sha>
   git push origin v3.3.0-rc.3
   ```

3. Run "Deploy to Test" from the Actions tab with the tag as `releaseTag`, or with the GitHub CLI:

   ```
   gh workflow run deploy-test.yaml --repo bcgov/bcparks.ca -f releaseTag=v3.3.0-rc.3
   ```

4. Once test is approved, run "Deploy to Prod" with the same tag:

   ```
   gh workflow run deploy-prod.yaml --repo bcgov/bcparks.ca -f releaseTag=v3.3.0-rc.3
   ```

The deploy fails early if `releaseTag` is not a git tag in the repo.

## Alpha

The `alpha` branch deploys to alpha-dev automatically on every push. To deploy to alpha-test, run "Deploy Alpha to Alpha-Test" from the Actions tab. It takes no inputs and promotes whatever was last built from `alpha`. `alpha` has no prod environment.

## Image Tags

Image tags in the `-tools` namespace:

| Tag | Set by | Meaning |
|---|---|---|
| `latest` | `build-dev.yaml` | Latest build of the branch, used by dev |
| `<8-char commit SHA>` | `build-dev.yaml` (`main` only) | Used by `on-tag-push.yaml` to find the images for a git tag |
| `<release tag>` | `on-tag-push.yaml` (`main` only) | A release that can be deployed to test or prod |
| `test`, `prod` | `deploy-*.yaml` | What is running in that environment |
| `public-main:rollback<YYYYMMDDTHHMM>` | `publish-gatsby.yaml` (prod only) | Copy of each prod Gatsby build, for rolling back |

ETL runs as a CronJob that always pulls its image, so it picks up a promoted image on its next run without a restart.

Old commit SHA and release tags are removed by the image tag pruner in `tools/imagetag-prune`, which keeps the 10 newest of each. A commit can only be released while its SHA tag is still there.

## Triggering Public Refresh

The public Gatsby site requires a new build to reflect data changes within the CMS. This build is automatically triggered by the `dev`, `test`, `prod` and `alpha-test` deploy workflows.

The build runs `publish-gatsby.yaml` with `workflow_dispatch`, using the triggering branch's copy of the workflow. After each publish, it waits for the rollout and then runs the Playwright content check (`playwright.yaml` with `suite=content-check`) against the same environment.

It can also be started manually from the Actions tab ("Publish Gatsby" > "Run workflow"), or with the GitHub CLI. `branchName` is `main` or `alpha`, and `buildEnv` is `dev`, `test` or `prod` (`alpha` has no `prod`):

```
gh workflow run publish-gatsby.yaml --repo bcgov/bcparks.ca --ref main -f branchName=main -f buildEnv=test
```

### Example cURL command

This needs a [Personal Access Token](https://github.com/settings/tokens) with write access to Actions on the `bcparks.ca` repo.

```
curl --location --request POST 'https://api.github.com/repos/bcgov/bcparks.ca/actions/workflows/publish-gatsby.yaml/dispatches' \
--header 'Authorization: Bearer <token>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "ref": "main",
    "inputs": {
        "branchName": "main",
        "buildEnv": "test"
    }
}'
```

## Playwright Tests

Playwright tests can be run manually from the Actions tab ("Playwright Tests" > "Run workflow"), or with the GitHub CLI:

```
gh workflow run playwright.yaml --repo bcgov/bcparks.ca --ref main -f environment=test -f suite=full
```

See [tests/e2e/README.md](../../tests/e2e/README.md) for details about the tests.

## Secrets

The workflows use these repository secrets:

- OpenShift: `OPENSHIFT_GOLD_LICENSE_PLATE`, `OPENSHIFT_GOLD_SERVER_URL`, `OPENSHIFT_GOLD_SERVICE_TOKEN`
- Image registry: `OPENSHIFT_GOLD_EXTERNAL_REPOSITORY`, `OPENSHIFT_GOLD_SA_USERNAME`, `OPENSHIFT_GOLD_SA_PASSWORD`
- Gatsby builds: `GATSBY_STRAPI_API_TOKEN__MAIN_PROD__GOLD`, `GATSBY_STRAPI_API_TOKEN__MAIN_TEST__GOLD`, `GATSBY_STRAPI_API_TOKEN__MAIN_DEV__GOLD`, `GATSBY_STRAPI_API_TOKEN__ALPHA_TEST`, `GATSBY_STRAPI_API_TOKEN__ALPHA_DEV`
