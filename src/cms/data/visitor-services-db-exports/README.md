# Scraping Content

Before exporting data, you need to ensure that parks have been scraped from PROD.

Scraping is done using an  MSAccess application called Visitor Services Database.

Prior to scraping data, apply the ScrapePatch.vb file to the scrape db (line 402 of the ContentScrape Module)
- `\tools\scrape-tool-patches\ScrapePatch -- ContentScrape line 402.vb`
- this patch modifies the scrape tool so it scrapes the production website instead of scraping the file server. This ensures that server side includes are processed.
- this is the line that you need to replace with the patch
```
Set ts = oFile.OpenAsTextStream(1, -2)
```

Map X: to the folder for the legacy BC Parks prod website

Click "Run Park Content Scrape" and point to each of the folders below
- X:\explore\parkpgs\
- X:\explore\consrvncy
- X:\protected-areas
- X:\parks
- X:\eco_reserve
- X:\conservancies (there are only 4 with park data)
- X:\ecological-reserves
- X:\recreation-areas

This command will sort the subfolders in descending order by size so you can find folders with data. It's much faster to scrape X:\\conservancies one at a time than to scrape the whole folder.

```
cmd /v /c "set zeropad=000,000,000,000,000,&for /f "delims=" %a in ('dir /ad /b') do @set bytes=!zeropad!000&(for /f "tokens=3" %b in ('dir /s "%a" 2^>NUL ^| find "File(s)"') do @set bytes=%b)& @for /f "tokens=1* delims=," %c in ('echo !bytes!') do @(set bytes=%c&@set bytes=000!bytes!&@set bytes=!bytes:~-3!& @set bytes=!zeropad!!bytes!&if "%d" NEQ "" set bytes=!bytes!,%d) & @echo !bytes:~-23! %a" | sort /R
```

## Notes
- It takes a really long time and there is no progress indicator (2+ hours forthe parkpgs folder)
    - occasionally you need to click "ok" to an alert
    - you can see what's going on if you look in the temp folder %TEMP%\ContentScrape

# Exporting Data

Raw data is exported via the Visitor Services Database (MSAccess Application).

The data is exported to Z:\\_shared\json after clicking a series of buttons in the MSAccess app (Map Z: to the folder for the legacy BC parks DEV server)

Also make sure you are connected to the Visitor Services Sharepoint instance before exporting data.

The following files are being re-exported as part of the content re-import (see https://apps.nrs.gov.bc.ca/int/confluence/display/BCPRS/Files+to+re-import)

Click on "Export Data Dashboard" in the MSAccess app and then click the buttons indicated below.

| #  | final file name                    | Export Data Dashboard button | Z:\\_shared\json                  | Scrape First | 
|--|--|--|--|--|
| 1  | park-activity.json                 | Export CMS Data              | park-activity.json                | X            |
| 2  | park-activity-xref.json            | Export CMS Data              | park-activity-xref.json           | X            |
| 3  | park-details.json                  | Park Details                 | protected-lands-details.json      | X            |
| 4  | park-facility.json                 | Export CMS Data              | park-facility.json                | X            |
| 5  | park-facility-xref.json            | Export CMS Data              | park-facility-xref.json           | X            |
| 6  | park-fire-zone-xref.json           | Park - Fire Centre/Zone      | park-fire-zone-xref.json          |              |
| 7  | park-name.json                     | BC Parks Names               | ParkNames.json                    |              |
| 8  | park-operation.json                | ParkOperation                | park-operation.json               |              |
| 9  | park-operation-sub-area-dates.json | ParkOperation                | park-operation-subarea-dates.json |              |
| 10 | park-operation-sub-areas.json      | ParkOperation                | park-operation-subareas.json      |              |
| 11 | park-operation-sub-area-types.json | ParkOperation                | park-operation-subarea-types.json |              |
| 12 | park-urls.json                     | Park URLs                    | park-urls.json                    |              |
| 13 | protected-area-coordinates.json    | Park and Site Coordinates ** | ProtectedArea.json                |              |
| 14 | site-coordinates.json              | Park and Site Coordinates    | Site.json                         |              |

** Before clicking "Park and Site Coordinates" you need to edit the query "cmsSiteCoordinates" so repealedDate is always blank and it doesn't prompt for a value.

Once the data has been exported, run the ProcessSeedData C# application located in /tools/json-data-cleanup. Make sure you still have Z: mapped when you run this app.

The files in /src/cms/data will be updated with the latest versions.
