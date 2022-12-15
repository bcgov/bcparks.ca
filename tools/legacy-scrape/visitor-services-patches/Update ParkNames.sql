-- RUN THIS AS 5 SEPARATE UPDATE STATEMENTS AGAINST THE MS-ACCESS VISITOR SERVICES
-- DATABASE TO REFRESH THE PARKNAMES TABLE (LOCAL ACCESS TABLE) WITH DATA FROM THE
-- BCParksNames TABLE (SHAREPOINT TABLE)

DELETE FROM ParkNames;

INSERT INTO ParkNames 
SELECT BCParksNames.ORCSPrimary AS ORCS, BCParksNames.ParkNameLegal AS ParkName, 1 AS NameTypeID, '' AS Source, '' AS [Note]
FROM BCParksNames
WHERE BCParksNames.ORCSSecondary is null;

INSERT INTO ParkNames 
SELECT BCParksNames.ORCSPrimary AS ORCS, BCParksNames.ParkNameWeb AS ParkName, 2 AS NameTypeID, 'Custom' AS Source, '' AS [Note]
FROM BCParksNames
WHERE BCParksNames.ORCSSecondary is null;

INSERT INTO ParkNames 
SELECT BCParksNames.ORCSPrimary AS ORCS, BCParksNames.ParkNameBasic AS ParkName, 4 AS NameTypeID, 'Custom' AS Source, '' AS [Note]
FROM BCParksNames
WHERE BCParksNames.ORCSSecondary is null;

INSERT INTO ParkNames 
SELECT BCParksNames.ORCSPrimary AS ORCS, BCParksNames.OldName AS ParkName, 6 AS NameTypeID, 'Custom' AS Source, '' AS [Note]
FROM BCParksNames
WHERE BCParksNames.ORCSSecondary is null AND BCParksNames.OldName <> ''