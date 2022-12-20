# this is a modified version of export-db.ps1 that does a full backup of the cms database
# it can be deleted after the December 2022 data import is complete

Param (
  [Parameter(Mandatory)]
  $Project,
  [Parameter(Mandatory)]
  $OutputPath
)

$remoteTempPath="/tmp/db-export"
$backupFilename="backup.sql"

oc project $Project

if (!$?) {
   Write-Host "Please make sure you are logged in via 'oc login' before executing."
   Exit 1
}

# Reading data should be safe on any patroni pod, so just use the first one (zero)
oc exec bcparks-patroni-0  -- /bin/bash -c "mkdir -p ${remoteTempPath} && \
    PGUSER=`$APP_USER PGPASSWORD=`$APP_PASSWORD pg_dump \
        `$APP_DATABASE > ${remoteTempPath}/${backupFilename}"

if (!$?) {
   Write-Host "An error occurred."
   Exit 1
}

oc cp $Project/bcparks-patroni-0:$remoteTempPath/$backupFilename $OutputPath/$backupFilename > /dev/null

if (!$?) {
   Write-Host "An error occurred."
   Exit 1
}

oc exec bcparks-patroni-0  -- rm -r $remoteTempPath

if (!$?) {
   Write-Host "An error occurred."
   Exit 1
}
