# Exporting Data

Exporting is done using an  MSAccess application called Visitor Services Database.

Raw data is exported via the Visitor Services Database (MSAccess Application).

The data is exported to Z:\\_shared\json after clicking a series of buttons in the MSAccess app (Map Z: to the folder for the legacy BC parks DEV server)

Also make sure you are connected to the Visitor Services Sharepoint instance before exporting data.

The following files are being re-exported as part of the content re-import (see https://apps.nrs.gov.bc.ca/int/confluence/display/BCPRS/Files+to+re-import)

Click on "Export Data Dashboard" in the MSAccess app and then click the buttons indicated below.

| #  | final file name                    | Export Data Dashboard button | Z:\\_shared\json                  | Scrape First | 
|--|--|--|--|--|
| 8  | park-operation.json                | ParkOperation                | park-operation.json               |              |
| 9  | park-operation-sub-area-dates.json | ParkOperation                | park-operation-subarea-dates.json |              |
| 10 | park-operation-sub-areas.json      | ParkOperation                | park-operation-subareas.json      |              |
| 11 | park-operation-sub-area-types.json | ParkOperation                | park-operation-subarea-types.json |              |

Once the data has been exported, run the ProcessSeedData C# application located in /tools/json-data-cleanup. Make sure you still have Z: mapped when you run this app.

The files in /src/cms/data will be updated with the latest versions.
