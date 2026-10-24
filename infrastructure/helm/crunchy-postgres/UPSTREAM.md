# Upstream Source

This directory contains a copy of the upstream Helm chart so it can be versioned and maintained alongside this project:

- Repository: https://github.com/bcgov/crunchy-postgres
- Source path: charts/crunchy-postgres
- Source URL: https://github.com/bcgov/crunchy-postgres/tree/main/charts/crunchy-postgres
- Imported commit: `ec73314008b283fb66eb72dd196d6f266492bd5e` (chart version 0.6.6)
- Imported branch: `main`

## Editing Guidelines

To keep upstream updates simple, **all local customizations must be confined to specific files**.

### ✅ Allowed edits

- `values-alpha-dev.yaml`
- `values-alpha-test.yaml`
- `values-dev.yaml`
- `values-prod.yaml`
- `values-test.yaml`
- Documentation files:
  - `README.md`
  - `UPSTREAM.md`

### 🚫 Do not edit

All other files come directly from upstream and should be treated as read‑only, apart from the local modifications below. Keeping changes limited to the files above makes it easy to refresh from upstream, reduce merge conflicts, and clearly separate local configuration from upstream source.

## Local modifications

These vendored files differ from the imported commit on purpose. When refreshing from upstream, re-apply them unless upstream has made the same change.

- `templates/PostgresCluster.yaml`:
  - `dataSource` sets `repo2-s3-uri-style`, so restoring from S3 uses path-style addressing like the regular backups. Without it, the restore can't reach the NRS object store.
  - `postgresVersion` appears once. Upstream renders it twice.
