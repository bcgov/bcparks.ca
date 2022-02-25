Param (
  [Parameter(Mandatory)]
  $Project,
  [Parameter(Mandatory)]
  $InputPath
)

$remoteTempPath="/tmp/db-import"
$exportFilename="export.sql"

oc project $Project

if (!$?) {
   Write-Host "Please make sure you are logged in via 'oc login' before executing."
   Exit 1
}

# Get patroni status to determine the current leader
# Writes on the replica can cause issues
$patroniInfo = oc exec bcparks-patroni-0  -- patronictl list --format json | ConvertFrom-Json
if (!$?) {
   Write-Host "An error occurred reading patroni info."
   Exit 1
}

$leaderName = ''
Foreach ($item in $patroniInfo) {
    if ($item.Role -eq 'Leader') {
        $leaderName = $item.Member
        break
    }
}
Write-Host "Current patroni leader: $leaderName"


oc rsync $InputPath $leaderName:$remoteTempPath 

if (!$?) {
   Write-Host "An error occurred."
   Exit 1
}

oc exec $leaderName  -- /bin/bash -c "PGUSER=`$APP_USER PGPASSWORD=`$APP_PASSWORD psql `$APP_DATABASE < ${remoteTempPath}/${exportFilename}"

if (!$?) {
   Write-Host "An error occurred."
   Exit 1
}

oc exec $leaderName -- rm -r $remoteTempPath

if (!$?) {
   Write-Host "An error occurred."
   Exit 1
}
