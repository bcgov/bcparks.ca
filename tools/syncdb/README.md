# Scripts to import/export Strapi data

## USE WITH CAUTION

These scripts are intended to do a bulk copy of Strapi content from one environment to another (e.g. from prod to test).

Import will wipe out all data in the target environment. If there are schema changes (e.g. a new column on a table),
those will also be lost.

The following tables are ignored:

* Strapi user and permission data (this means the user who created a page may be lost)
* "Core" Strapi configuration values
* API tokens
* Uploaded files; the expectation is that all image references use URLs

## Requirements

Requires installation of the [Openshift CLI](https://docs.openshift.com/container-platform/4.9/cli_reference/openshift_cli/getting-started-cli.htm)
and [PowerShell](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell?view=powershell-7.2).

Users will require access to the appropriate OpenShift project, and will need to login via ``oc login`` prior to import/export.

## Export data

Running the following command will copy a data dump to /dbexport on your local system:

```shell
pwsh export-db.ps1 -Project 61d198-test -OutputPath /dbexport
```

## Import data

Running the following command will update the dev db with a previously generated export:

```shell
pwsh import-db.ps1 -Project 61d198-dev -InputPath /dbexport
```
