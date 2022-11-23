Param (
  [Parameter(Mandatory)]
  $Project,
  [Parameter(Mandatory)]
  $OutputPath
)

$remoteTempPath="/tmp/db-export"
$exportFilename="export.sql"

oc project $Project

if (!$?) {
   Write-Host "Please make sure you are logged in via 'oc login' before executing."
   Exit 1
}

# Reading data should be safe on any patroni pod, so just use the first one (zero)
oc exec bcparks-patroni-0  -- /bin/bash -c "mkdir -p ${remoteTempPath} && \
    PGUSER=`$APP_USER PGPASSWORD=`$APP_PASSWORD pg_dump \
        --clean \
        --if-exists \
        --no-owner \
        --table=public.\* \
        --exclude-table=core_store* \
        --exclude-table=tokens* \
        --exclude-table=strapi_\* \
        --exclude-table=upload_file\* \
        --exclude-table=users-permissions\* \
        `$APP_DATABASE > ${remoteTempPath}/${exportFilename}"

if (!$?) {
   Write-Host "An error occurred."
   Exit 1
}

oc cp $Project/bcparks-patroni-0:$remoteTempPath/$exportFilename $OutputPath/$exportFilename > /dev/null

if (!$?) {
   Write-Host "An error occurred."
   Exit 1
}

oc exec bcparks-patroni-0  -- rm -r $remoteTempPath

if (!$?) {
   Write-Host "An error occurred."
   Exit 1
}
