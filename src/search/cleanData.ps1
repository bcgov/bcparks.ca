$jsondata = Get-Content -Raw -Path data.json | ConvertFrom-Json
Write-Output "["
foreach($park in $jsondata) {
 
    $description =""
    if ($park.description -ne $null)
    {
        $description = $park.description.replace("""","\""").replace("`n",",").replace("`r",",")
    }
    $reservations =""
    if ($park.reservations -ne $null)
    {
        $reservations = $park.reservations.replace("""","\""").replace("`n",",").replace("`r",",")
    }
    $reconciliationNotes =""
    if ($park.reconciliationNotes -ne $null)
    {
        $reconciliationNotes = $park.reconciliationNotes.replace("""","\""").replace("`n",",").replace("`r",",")
    }

    $parkactivities = "["
    if ($park.parkActivities -ne $null)
    {
        foreach( $parkactivity in $park.parkActivities)
        {
            if ($parkactivity.name -ne $null)
            {
               $name = $parkactivity.name.substring($parkactivity.name.IndexOf(':') + 1 , $parkactivity.name.Length - $parkactivity.name.IndexOf(':')-1)

               $parkactivities = $parkactivities + "`"" + $name + "`","
            }
        }

        $parkactivities = $parkactivities.Substring(0,$parkactivities.Length-1)
    }
    $parkactivities = $parkactivities + "]"

    $parkfacilities = "["
    if ($park.parkFacilities -ne $null)
    {
        foreach( $parkfacility in $park.parkFacilities)
        {
            if ($parkfacility.name -ne $null)
            {
               $name = $parkfacility.name.substring($parkfacility.name.IndexOf(':') + 1 , $parkfacility.name.Length - $parkfacility.name.IndexOf(':')-1)

               $parkfacilities = $parkfacilities + "`"" + $name + "`","
            }
        }

        $parkfacilities = $parkfacilities.Substring(0,$parkfacilities.Length-1)
    }
    $parkfacilities = $parkfacilities + "]"

    Write-Output "{"
    Write-Output "`"id`":`"$($park.id)`","
    Write-Output "`"orcs`":`"$($park.orcs)`","
    Write-Output "`"protectedareaname`":`"$($park.protectedAreaName)`","
    Write-Output "`"totalarea`":`"$($park.totalArea)`","
    Write-Output "`"uplandarea`":`"$($park.uplandArea)`","
    Write-Output "`"marinearea`":`"$($park.marineArea)`","
    Write-Output "`"marineprotectedarea`":`"$($park.marineProtectedArea)`","
    Write-Output "`"type`":`"$($park.type)`","
    Write-Output "`"class`":`"$($park.class)`","
    Write-Output "`"establisheddate`":`"$($park.establishedDate)`","
    Write-Output "`"repealeddate`":`"$($park.repealedDate)`","
    Write-Output "`"status`":`"$($park.status)`","
    Write-Output "`"url`":`"$($park.url)`","
    Write-Output "`"typecode`":`"$($park.typeCode)`","
    Write-Output "`"latitude`":`"$($park.latitude)`","
    Write-Output "`"longitude`":`"$($park.longitude)`","
    Write-Output "`"mapzoom`":`"$($park.mapZoom)`","
    Write-Output "`"isdayusepass`":`"$($park.isDayUsePass)`","
    Write-Output "`"isfogzone`":`"$($park.isFogZone)`","
    Write-Output "`"featureid`":`"$($park.featureId)`","
    Write-Output "`"hascampfireban`":`"$($park.hasCampfireBan)`","
    Write-Output "`"hassmokingban`":`"$($park.hasSmokingBan)`","
    Write-Output "`"hascampfirebanoverride`":`"$($park.hasCampfireBanOverride)`","
    Write-Output "`"hassmokingbanoverride`":`"$($park.hasSmokingBanOverride)`","
    Write-Output "`"campfirebanrescindeddate`":`"$($park.campfireBanRescindedDate)`","
    Write-Output "`"description`":`"$($description)`","
    Write-Output "`"safetyinfo`":`"$($park.safetyInfo)`","
    Write-Output "`"specialnotes`":`"$($park.specialNotes)`","
    Write-Output "`"locationnotes`":`"$($park.locationNotes)`","
    Write-Output "`"parkcontact`":`"$($park.parkContact)`","
    Write-Output "`"reservations`":`"$($reservations)`","
    Write-Output "`"natureandculture`":`"$($park.natureAndCulture)`","
    Write-Output "`"reconciliationnotes`":`"$($reconciliationNotes)`","
    Write-Output "`"slug`":`"$($park.slug)`","
    Write-Output "`"published_at`":`"$($park.published_at)`","
    Write-Output "`"created_at`":`"$($park.created_at)`","
    Write-Output "`"updated_at`":`"$($park.updated_at)`","
    Write-Output "`"parkactivities`":$($parkactivities),"
    Write-Output "`"parkfacilities`":$($parkfacilities)"
    Write-Output "},"
    
        
}
Write-Output "]"