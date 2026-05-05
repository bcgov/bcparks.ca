# Upstream Source

This directory contains a copy of the upstream Helm chart so it can be versioned and maintained alongside this project:

- Repository: https://github.com/bcgov/crunchy-postgres
- Source path: charts/crunchy-postgres
- Source URL: https://github.com/bcgov/crunchy-postgres/tree/main/charts/crunchy-postgres
- Imported commit: `ec73314008b283fb66eb72dd196d6f266492bd5e`
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

All other files come directly from upstream and should be treated as read‑only. Keeping changes limited to the files above makes it easy to refresh from upstream, reduce merge conflicts, and clearly separate local configuration from upstream source.
