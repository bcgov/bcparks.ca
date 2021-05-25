#!/usr/bin/env python
# -*- coding: utf-8 -*-

from dags.utils import transform_par_to_proct_land 

def writetoafile(fname):
    with open(fname, 'w') as fp:
        fp.write('Hello\n')


def test_transform_par():
    data = {
        "sites": [],
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
        "sites": [],
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
    }

    assert result == control


def test_transform_null():
    assert 1 == 1
