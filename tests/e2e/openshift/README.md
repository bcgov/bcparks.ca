# E2E tests on OpenShift

The `playwright.yaml` workflow runs the Playwright suite in `tests/e2e/` as a one-shot Job in the **tools** namespace (`c1643c-tools`) instead of on a GitHub Actions runner. GitHub Actions runners are blocked by the Kamloops Data Centre partway through each run. Running inside the cluster keeps test traffic off GitHub's IP addresses.

The Job reaches the site being tested only through its public URLs, so one setup can test every environment. Nothing is deployed alongside the app.

This pattern is based on [bcgov/range-web](https://github.com/bcgov/range-web).

## How it works

```
GitHub Actions (playwright.yaml)                  OpenShift: c1643c-tools
├─ Set target site (environment → BASE_URL/CMS_URL)
├─ oc start-build --from-archive (tests/e2e) ───▶ BuildConfig playwright-runner → image @sha256
├─ oc process | oc create ──────────────────────▶ Job bcparks-e2e-<run id>-<attempt>
├─ stream logs, wait for the exit code            ├─ e2e: npm run <suite script> ──▶ public URL
├─ oc cp report → upload-artifact                 └─ artifact-sync: sleep infinity, holds results
└─ delete the Job
```

Every run builds the image from the commit under test and pins the Job to that build's digest, so concurrent runs get separate builds, Jobs and reports.

| Path                                                                                    | Role                                                                                                                                                                                                            |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.github/workflows/playwright.yaml`                                                     | Builds the image, runs the Job, collects the report                                                                                                                                                             |
| `infrastructure/helm/tools/templates/builds/playwright-runner.yaml`                     | Helm template for BuildConfig for the test image                                                                                                                                                                |
| `infrastructure/helm/tools/templates/imagestreams/bcparks/playwright-runner.yaml`       | Helm template for ImageStream for the test image                                                                                                                                                                |
| `infrastructure/helm/tools/templates/rbac/playwright-test-runner-role.yaml`, `-rb.yaml` | Helm templates for extra permissions for the workflow, bound to the `builder` ServiceAccount                                                                                                                    |
| `tests/e2e/openshift/deployments/e2e.yaml`                                              | Job template: parameters, results volume, and sidecar. The GitHub Action workflow renders it with `oc process` and creates the Job in OpenShift; the template itself is not installed as a persistent resource. |
| `tests/e2e/Dockerfile.e2e`, `tests/e2e/.dockerignore`                                   | Test image                                                                                                                                                                                                      |

## One-time setup

### 1. Install the BuildConfig and RBAC

Both are part of the tools Helm chart. From `infrastructure/helm/tools`:

```bash
helm -n c1643c-tools upgrade bcparks-tools .
```

The BuildConfig has no triggers, so installing it doesn't start a build. The workflow starts one on every run. To build by hand from the last commit in your checkout (uncommitted changes aren't included):

```bash
git archive --format=tar -o e2e.tar HEAD tests/e2e
oc start-build playwright-runner --from-archive=e2e.tar --follow -n c1643c-tools
```

The archive keeps the `tests/e2e/` path, because the BuildConfig's `contextDir` is `tests/e2e`. Don't use `--from-dir=tests/e2e`: it uploads the folder's contents without that path, and the build fails with "provided context directory does not exist".

A plain `oc start-build playwright-runner`, or a build started from the OpenShift console, clones `bcgov/bcparks.ca` at `main` and builds `tests/e2e` from there.

The workflow logs in with the existing `OPENSHIFT_GOLD_SERVER_URL` and `OPENSHIFT_GOLD_SERVICE_TOKEN` secrets, which belong to the `builder` ServiceAccount in `c1643c-tools`. `builder` can already use ImageStreams and read builds. The chart's `playwright-test-runner` Role adds the rest of what the workflow does:

- read the BuildConfig, start binary builds (`buildconfigs/instantiatebinary`) and read build logs
- create and delete Jobs
- read pods and pod logs
- `pods/exec`, which `oc cp` needs to copy the report out

Nothing is needed in dev, test or prod.

### 2. Set the fsGroup repo variable

The Job's results volume needs an `fsGroup` inside the tools namespace's allowed range, or OpenShift rejects the pod:

```bash
oc describe ns c1643c-tools | grep supplemental-groups
# openshift.io/sa.scc.supplemental-groups=1001230000/10000  → use 1001230000
```

Save the first number as the `E2E_FS_GROUP` repository **variable** (Settings → Secrets and variables → Actions → Variables).

## Running

Run **Playwright Tests** from the Actions tab and pick an `environment` (prod, test, dev, alpha-test, alpha-dev) and a `suite` (full-all-browsers, full-chromium, full-firefox, full-webkit, smoke-test, content-check). The suite's exit code decides the workflow result, and the HTML report and test results are uploaded as the `playwright-report` artifact.

It also runs on PRs to `main` or `alpha` that change `tests/e2e/**` or the workflow. PRs run `full-chromium` against prod (PRs to `main`) or alpha-test (PRs to `alpha`), and PRs from forks are skipped because they don't get the secrets. A new push to the same PR cancels the previous run.

### Manual run (oc)

```bash
git archive --format=tar -o e2e.tar HEAD tests/e2e
build=$(oc start-build playwright-runner --from-archive=e2e.tar -o name -n c1643c-tools)
oc logs -f "$build" -n c1643c-tools
digest=$(oc get "$build" -n c1643c-tools -o jsonpath='{.status.output.to.imageDigest}')

oc process --local -f tests/e2e/openshift/deployments/e2e.yaml \
  -p JOB_NAME=bcparks-e2e-manual \
  -p E2E_IMAGE="image-registry.openshift-image-registry.svc:5000/c1643c-tools/playwright-runner@$digest" \
  -p ENV=dev \
  -p BASE_URL=https://main-public-c1643c-dev.apps.gold.devops.gov.bc.ca/ \
  -p CMS_URL=https://dev-cms.bcparks.ca/ \
  -p SUITE=full-chromium \
  -p FS_GROUP=<number from step 2> \
  | oc create -f - -n c1643c-tools
```

Watch the suite, then read the result:

```bash
pod=$(oc get pods -l job-name=bcparks-e2e-manual -n c1643c-tools -o jsonpath='{.items[0].metadata.name}')
oc logs -f "$pod" -c e2e -n c1643c-tools
oc get pod "$pod" -n c1643c-tools -o jsonpath='{.status.containerStatuses[?(@.name=="e2e")].state.terminated.exitCode}'
oc cp "$pod:/e2e/results/report/." ./playwright-report -c artifact-sync -n c1643c-tools
oc cp "$pod:/e2e/results/artifacts/." ./test-results -c artifact-sync -n c1643c-tools
oc delete job bcparks-e2e-manual -n c1643c-tools
```

The `e2e` container's exit code is the suite result (0 = passed). The `artifact-sync` sidecar keeps the shared volume alive so the report can be copied out.

## How the Job runs the tests

The Job sets `CI=true`, `ENV`, `BASE_URL`, `CMS_URL` and `SUITE`, then runs the npm script for the suite (`npm test` for `full-all-browsers`, `test:<browser>` for `full-<browser>`, `test:smoke` or `test:content-check`), the same scripts as locally. `playwright.config.js` doesn't need changes:

- `PLAYWRIGHT_HTML_OUTPUT_DIR=/e2e/results/report` moves the HTML report onto the shared volume.
- `--output=/e2e/results/artifacts` does the same for traces and screenshots.
- `BASE_URL` and `CMS_URL` come from the environment, so `env/.env.<ENV>` isn't needed in the image. `.dockerignore` keeps local env files, which can hold credentials, out of the image.

## Troubleshooting

- **Pod rejected / `fsGroup` not allowed:** `E2E_FS_GROUP` isn't in the tools namespace's range (setup step 2).
- **Build fails pulling the base image:** keep the Playwright version the same in three places: `@playwright/test` in `tests/e2e/package.json`, the `FROM` line in `tests/e2e/Dockerfile.e2e`, and `images.playwright.tag` in `infrastructure/helm/tools/values.yaml`. Run `helm upgrade` after changing the values file.
- **Chromium fails to launch:** Playwright launches Chromium without its sandbox by default, which is what OpenShift's restricted pods need. Check that nothing in the config sets `chromiumSandbox: true`.
- **Can't reach the site:** test from a debug pod: `oc run curl --rm -it --image=curlimages/curl -n c1643c-tools -- curl -I <url>`. For prod, the vanity route's `ip_whitelist` may not include the cluster's egress IP.
- **Job left behind:** a cancelled run can't delete its Job. The `artifact-sync` sidecar keeps the pod running until the 1-hour `activeDeadlineSeconds`, and `ttlSecondsAfterFinished` deletes the Job an hour after that. To clean up sooner: `oc delete jobs -l app=bcparks-e2e -n c1643c-tools`.
- **Out of quota:** each run requests about 1.1Gi of memory (no CPU requests, which the tools namespace's 500m `requests.cpu` quota can't fit), plus the build. Builds queue (`runPolicy: Serial`), but Jobs don't.
