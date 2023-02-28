# Helm scripts for Strapi v4 upgrade test environment

cd into /infrastructure/helm/strapi-upgrade

### Initial setup

```
helm -n 61d198-dev install strapi . -f values-dev.yaml
```

### Upgrade

```
helm -n 61d198-dev upgrade strapi . -f values-dev.yaml
```