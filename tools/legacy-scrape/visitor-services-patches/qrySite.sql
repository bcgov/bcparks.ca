SELECT spParkSites.[ORCS Site Number] AS orc, spParkSites.[Site Number] AS SiteNumber, IIf([SiteNumber] Is Not Null,[spParkSites].[ORCS Site Number] & "-" & [SiteNumber],[spParkSites].[ORCS Site Number]) AS orcs_site, spParkSites.orcsSiteNumber, spParkSites.[Park Name] AS ParkName, spParkSites.[Site Name] AS SiteName, spParkSites.Status, spParkSites.[Established Date] AS EstablishedDate, spParkSites.URL, spParkSites.newURL, spParkSites.Latitude, spParkSites.Longitude, spParkSites.MapZoom, spParkSites.Note, spParkSites.[Repealed Date] AS RepealedDate
FROM spParkSites
WHERE (((spParkSites.Status)='Active'))
ORDER BY spParkSites.[Park Name], spParkSites.[Site Name];
