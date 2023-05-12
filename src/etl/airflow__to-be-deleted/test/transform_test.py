#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
from dags.v2.utils import Parks_ETL
from unittest.mock import patch, MagicMock

var_fakes = {"par": "", "bcgn": "", "strapi": "", "token": ""}
etl = Parks_ETL(None, var_fakes)


# data
par_data = {
    "sites": [
        {
            "protectedLandSiteCanceledDate": None,
            "protectedLandSiteName": "Refuge Bay Site",
            "protectedLandSiteStatusCode": "A",
            "protectedLandSiteEstablishedDate": "1996-04-30",
            "protectedLandSiteNumber": 3,
            "protectedLandSiteStatusDescription": "Active"
        }
    ],
    "protectedLandStatusCode": "A",
    "establishedDate": "2005-03-22",
    "protectedLandTypeDescription": "Protected Area",
    "orcNumber": 481,
    "marineArea": 11,
    "protectedLandClassDescription": "None",
    "uplandArea": 191,
    "nonLegislatedSiteInd": "Y",
    "protectedLandClassCode": "N",
    "protectedLandStatusDescription": "Active",
    "managementAreas": [
        {
            "protectedLandManagementAreaNumber": "16",
            "protectedLandManagementAreaName": "Lakelse Douglas Channel",
            "protectedLandSectionNumber": "13",
            "protectedLandRegionName": "North Coast Skeena",
            "protectedLandRegionNumber": "7",
            "protectedLandSectionName": "Skeena West"
        }
    ],
    "protectedLandId": 1658,
    "protectedLandTypeCode": "PA",
    "featureId": 70145,
    "protectedLandName": "Brim River Hot Springs Protected Area",
    "totalArea": 202,
    "marineProtectedAreaInd": "Y"
}

par_control = {
    "orcs": 481,
    "protectedAreaName": "Brim River Hot Springs Protected Area",
    "totalArea": 202,
    "uplandArea": 191,
    "marineArea": 11,
    "marineProtectedArea": "Y",
    "type": "Protected Area",
    "typeCode": "PA",
    "class": "N",
    "status": "A",
    "establishedDate": "2005-03-22",
    "repealedDate": None,
    "url": "",
    "latitude": None,
    "longitude": None,
    "mapZoom": None,
    "sites": [
        {
            "orcsSiteNumber": "481-3",
            "siteNumber": 3,
            "siteName": "Refuge Bay Site",
            "status": "A",
            "establishedDate": "1996-04-30",
            "repealedDate": None,
            "url": "",
            "latitude": None,
            "longitude": None,
            "mapZoom": None
        }
    ],
    "managementAreas": [
        {
            "managementAreaNumber": 16,
            "managementAreaName": "Lakelse Douglas Channel",
            "section": { "sectionNumber": 13, "sectionName": "Skeena West" },
            "region": { "regionNumber": 7, "regionName": "North Coast Skeena" },
        }
    ],
}

bcgn_data = {
  "type": "FeatureCollection",
  "crs": {
    "type": "name",
    "properties": {
      "name": "EPSG:3005"
    }
  },
  "feature": {
    "type": "Feature",
    "properties": {
      "uri": "apps.gov.bc.ca/pub/bcgnws/names/1059",
      "name": "Allison Lake Park",
      "language": "not defined",
      "status": "adopted",
      "isOfficial": 1,
      "nameAuthority": {
        "resourceUrl": "apps.gov.bc.ca/pub/bcgnws/nameAuthorities/1",
        "id": "1",
        "nameAuthority": "BC Geographical Names Office",
        "webSiteUrl": "http://www2.gov.bc.ca/gov/content/governments/celebrating-british-columbia/historic-places/geographical-names"
      },
      "cgndbCode": "A1",
      "cgndbKey": "JACBO",
      "nameKey": "ALLISONLAKEPARK",
      "tags": [],
      "official": [
        "apps.gov.bc.ca/pub/bcgnws/names/1059"
      ],
      "feature": {
        "id": "9615",
        "uuid": "0c8b18d6849c20c3d728f5a04f675d95",
        "uri": "apps.gov.bc.ca/pub/bcgnws/features/9615",
        "relativeLocation": "S end of Allison Lake, NE of Princeton",
        "landDistrict": "Kamloops Division Yale Land District",
        "mapsheets": [
          "apps.gov.bc.ca/pub/bcgnws/features/9615/mapsheets/92H/10"
        ],
        "names": [
          "apps.gov.bc.ca/pub/bcgnws/names/1059"
        ],
        "changeDate": "1996-10-31"
      },
      "changeDate": "2010-04-27",
      "decisionDate": "1969-10-03",
      "featureCategory": 4,
      "featureCategoryDescription": "Parks, Protected Reserves, etc.",
      "featureCategoryURI": "apps.gov.bc.ca/pub/bcgnws/featureCategories/4",
      "featureType": "Provincial Park",
      "featureTypeURI": "apps.gov.bc.ca/pub/bcgnws/featureTypes/Provincial+Park",
      "featureCode": "545",
      "featureCodeURI": "apps.gov.bc.ca/pub/bcgnws/featureCodes/545",
      "featureClass": "2",
      "featureClassURI": "apps.gov.bc.ca/pub/bcgnws/featureClasses/2",
      "featurePoint": {
        "outputSRS": "3005",
        "easting": "1389377.1000348674",
        "northing": "533268.8960440274"
      },
      "lonAsRecorded": 1203604,
      "latAsRecorded": 494054,
      "datumAsRecorded": "WGS84",
      "position": "CENTRE",
      "ntsMap": "92H/10"
    },
    "geometry": {
      "type": "Point",
      "coordinates": [
        1389377.1000348674,
        533268.8960440274
      ]
    }
  },
  "legal": {
    "disclaimerURI": "http://www.gov.bc.ca/com/disclaimer.html",
    "privacyURI": "http://www.gov.bc.ca/com/privacy.html",
    "copyrightNotice": "Copyright (c) 2021, Province of British Columbia",
    "copyrightLicenseURI": "http://www.gov.bc.ca/com/copyright.html"
  }
}

bcgn_control = {
}


def test_transform_par():
    result = etl.transform_par_to_proct_land(par_data)
    assert sorted(result) == sorted(par_control)


def test_transform_bcgn():
    result = etl.transform_par_to_proct_land(par_data)
    assert sorted(result) == sorted(par_control)


def test_get_data_from_par():
    with patch('requests.get') as mock_request:
        mock_request.return_value.status_code = 200
        mock_request.return_value.json.return_value = { "data" : par_data }

        etl = Parks_ETL(None, var_fakes)
        result = etl._get_data_from_par()

        mock_request.assert_called_once()
        assert sorted(result) == sorted(par_data)


def test_get_data_from_bcgn():
    ti_mock = MagicMock()

    with patch('requests.get') as mock_request:
        mock_request.return_value.status_code = 200
        mock_request.return_value.json.return_value = bcgn_data

        etl = Parks_ETL(None, var_fakes)

        json_str = f'[ {json.dumps(par_data)} ]'
        out_data = json.loads(json_str)

        ti_mock.xcom_pull.return_value = out_data
        result = etl._get_data_from_bcgn(ti_mock)

        mock_request.assert_called_once()


        json_str = f'[ {json.dumps(bcgn_data)} ]'
        out_control = json.loads(json_str)
        
        assert sorted(result) == sorted(out_control)


def test_transform_data_par():
    ti_mock = MagicMock()

    # prepare input
    json_str = f'[ {json.dumps(par_data)} ]'
    payload = json.loads(json_str)

    # prepare output
    json_str = f'[ {json.dumps(par_control)} ]'
    out_control = json.loads(json_str)

    ti_mock.xcom_pull.return_value = payload
    result = etl._transform_data_par(ti_mock)

    assert sorted(result) == sorted(out_control)

def test_transform_data_bcgn():
    pass

def test_dump_par_data():
    pass


def test_dump_bcgn_data():
    pass

