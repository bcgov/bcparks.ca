#!/usr/bin/env python
# -*- coding: utf-8 -*-

from dags.utils import transform_par_to_proct_land 


def test_transform_par():
    data = {
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

    result = transform_par_to_proct_land(data)

    control = {
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
                "siteNumber": 7,
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

    assert sorted(result) == sorted(control)

