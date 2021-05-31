#!/usr/bin/env python
# -*- coding: utf-8 -*-
#import json
import requests

from airflow.models import Variable


# variables
base_url = Variable.get("base_url_data", deserialize_json=True)
par_api_url_base = base_url["par"]
bcgn_api_url_base = base_url["bcgn"]
strapi_base = base_url["strapi"]
token = base_url["token"]

headers = {
    'Content-Type': 'application/json'
}


### task pythons
def _get_data_from_par():
    api_url = f"{par_api_url_base}/protectedLands?protectedLandName=%25\
            &protectedLandTypeCodes=CS,ER,PA,PK,RA"

    result = None

    try:
        response = requests.get(api_url, headers=headers)

        if response.status_code == 200:
            # convert json to Python object
            data = response.json()

            if 'data' in data:
                result = data["data"]
            else:
                #TODO: write to aitflow
                print('data does not conform to expectations!')

        return result
    except:
    # del widgets_screen1[7:8]
        # TODO: write error into airflow
        print('Error invoking webservice')
        raise



def _get_data_from_bcgn():
    api_url = f"{bcgn_api_url_base}//names/search?outputFormat=\
            json&name=Victoria&exactSpelling=0"

    result = None

    try:
        response = requests.get(api_url, headers=headers)

        if response.status_code == 200:
            # convert json to Python object
            data = response.json()

            if 'data' in data:
                result = data["data"]
            else:
                #TODO: write to aitflow
                print('data does not conform to expectations!')

        return result
    except:
    # del widgets_screen1[7:8]
        # TODO: write error into airflow
        print('Error invoking webservice')
        raise


def _transform_data_par(task_instance):
    data = task_instance.xcom_pull(task_ids='etl_get_data_from_par')

    json = []

    for pro_land in data:
        json.append(transform_par_to_proct_land(pro_land))

    return json

def _transform_data_bcgn(task_instance):
    data = task_instance.xcom_pull(task_ids='etl_get_data_from_bcgn')

    json = []

    for pro_land in data:
        json.append(transform_par_to_proct_land(pro_land))

    return json

def _dump_data(task_instance):
    api_url = f'{strapi_base}/protected-areas?token={token}'
    data = task_instance.xcom_pull(task_ids='etl_transform_data_par')

    for pro_land in data:
        try:
            # check object relationships
            # sites
            index_count = 0
            for site in pro_land["sites"]:
                pro_land["sites"][index_count] = get_or_create_site(site)
                index_count = index_count + 1

            # managementAreas
            index_count = 0
            for mArea in pro_land["managementAreas"]:
                pro_land["managementAreas"][index_count] = get_or_create_mgmt_area(mArea)
                index_count = index_count + 1

            pro_area = get_protected_area_from_strapi(pro_land["orcs"])

            if pro_area is None:
                #rectified_payload = python_to_proper_json_string(pro_land)
                response = requests.post(api_url, json=pro_land, headers=headers)

                if response.status_code == 200:
                    data = response.json()

                    print(f'Record with id: {data["id"]} successfully created!')
                else:
                    print(f'dump data: Unplanned status code returned - {response.status_code}')
            else:
                print('Protected area already exist in strapi')

        except:
            # del widgets_screen1[7:8]
            # TODO: write error into airflow
            print('Error invoking webservice')
            raise

def get_or_create_site(site):
    newSite = get_site_from_strapi(site["orcsSiteNumber"])

    if newSite is None:
        #create new site
        newSite = create_site_in_strapi(site)

    return newSite

def get_or_create_mgmt_area(mArea):
    newMArea = get_mgmt_area_from_strapi(mArea["managementAreaNumber"])

    if newMArea is None:
        #create new mgmt area
        newMArea = create_mgmt_area_in_strapi(mArea)

    return newMArea


def get_or_create_section(section):
    newSection = get_section_from_strapi(section["sectionNumber"])

    if newSection is None:
        #create new mgmt area
        newSection = create_section_in_strapi(section)

    return newSection


def get_or_create_region(region):
    newRegion = get_region_from_strapi(region["regionNumber"])

    if newRegion is None:
        #create new mgmt area
        newRegion = create_region_in_strapi(region)

    return newRegion


### Transform
def transform_par_to_proct_land(pro_land):
    json = {
        "orcs": pro_land["orcNumber"],
        "protectedAreaName": pro_land["protectedLandName"],
        "totalArea": pro_land["totalArea"],
        "uplandArea": pro_land["uplandArea"],
        "marineArea": pro_land["marineArea"],
        "marineProtectedArea": pro_land["marineProtectedAreaInd"],
        "type": pro_land["protectedLandTypeDescription"],
        "typeCode": pro_land["protectedLandTypeCode"],
        "class": pro_land["protectedLandClassCode"],
        "status": pro_land["protectedLandStatusCode"],
        "establishedDate": pro_land["establishedDate"],
        "repealedDate": None,
        "url": "",
        "latitude": None,
        "longitude": None,
        "mapZoom": None,
        "sites": transform_par_sites(pro_land["orcNumber"], pro_land["sites"]),
        "managementAreas": transform_par_mgmtAreas(pro_land["managementAreas"])
    }

    return json

def transform_par_sites(orcsNumber, sites):
    json = []

    for site in sites:
        result = transform_par_site(orcsNumber, site)
        json.append(result)

    return json

def transform_par_site(orcsNumber, site):
    orcsSiteNumber = "{}-{}".format(orcsNumber, site["protectedLandSiteNumber"])

    json = {
        "orcsSiteNumber": orcsSiteNumber,
        "siteNumber": site["protectedLandSiteNumber"],
        "siteName": site["protectedLandSiteName"],
        "status": site["protectedLandSiteStatusCode"],
        "establishedDate": site["protectedLandSiteEstablishedDate"],
        "repealedDate": site["protectedLandSiteCanceledDate"],
        "url": "",
        "latitude": None,
        "longitude": None,
        "mapZoom": None
    }

    return json


def transform_par_mgmtAreas(areas):
    json = []

    for area in areas:
        result = transform_par_mgmtArea(area)
        json.append(result)

    return json

def transform_par_mgmtArea(area):
    return {
        "managementAreaNumber": int(area["protectedLandManagementAreaNumber"]),
        "managementAreaName": area["protectedLandManagementAreaName"],
        "section": transform_par_section(int(area["protectedLandSectionNumber"]), \
                                         area["protectedLandSectionName"]),
        "region": transform_par_region(int(area["protectedLandRegionNumber"]), \
                                       area["protectedLandRegionName"])
    }

def transform_par_section(number, name):
    return {
        "sectionNumber": number,
        "sectionName": name
    }

def transform_par_region(number, name):
    return {
        "regionNumber": number,
        "regionName": name
    }

def create_site_in_strapi(site):
    api_url = f"{strapi_base}/sites?token={token}"
    result = None

    try:
        response = requests.post(api_url, json=site, headers=headers)

        if response.status_code == 200:
            result = response.json()

            print(f'Record with id: {result["id"]} successfully created!')
        else:
            print(f'create site: Unplanned status code returned - {response.status_code}')

        return result

    except:
        print('Error invoking webservice')
        raise


def create_region_in_strapi(region):
    api_url = f"{strapi_base}/sites?token={token}"
    result = None

    try:
        response = requests.post(api_url, json=region, headers=headers)

        if response.status_code == 200:
            result = response.json()

            print(f'Record with id: {result["id"]} successfully created!')
        else:
            print(f'create region: Unplanned status code returned - {response.status_code}')

        return result

    except:
        print('Error invoking webservice')
        raise


def create_section_in_strapi(section):
    api_url = f"{strapi_base}/sites?token={token}"
    result = None

    try:
        response = requests.post(api_url, json=section, headers=headers)

        if response.status_code == 200:
            result = response.json()

            print(f'Record with id: {result["id"]} successfully created!')
        else:
            print(f'create section: Unplanned status code returned - {response.status_code}')

        return result

    except:
        print('Error invoking webservice')
        raise

def create_mgmt_area_in_strapi(mArea):
    api_url = f"{strapi_base}/management-areas?token={token}"
    result = None

    try:
        # handle depencies - region, sections
        if 'region' in mArea:
            mArea["region"] = get_or_create_region(mArea["region"])

        if 'section' in mArea:
            mArea["section"] = get_or_create_section(mArea["section"])

        response = requests.post(api_url, json=mArea, headers=headers)

        if response.status_code == 200:
            result = response.json()

            print(f'Record with id: {result["id"]} successfully created!')
        else:
            print(f'create mgmt: Unplanned status code returned - {response.status_code}')

        return result

    except:
        print('Error invoking webservice')
        raise

def get_protected_area_from_strapi(orcs):
    api_url = f"{strapi_base}/protected-areas?orcs={orcs}"

    try:
        response = requests.get(api_url, headers=headers)

        if response.status_code == 200:
            data = response.json()

            result = None
            if len(data) > 0:
                result = data[0]

            return result
        else:
            print(f'Unable to get protected area with code {response.status_code}')
    except:
        print(f'Error invoking webservice - {api_url}')
        raise

def get_site_from_strapi(orcsSiteNumber):
    api_url = f"{strapi_base}/sites?orcsSiteNumber={orcsSiteNumber}"

    try:
        response = requests.get(api_url, headers=headers)

        if response.status_code == 200:
            data = response.json()

            if len(data) == 0:
                return None
            else:
                return data[0]
        else:
            print(f'Unable to get site with code {response.status_code}')
    except:
        print(f'Error invoking webservice - {api_url}')
        raise

def get_mgmt_area_from_strapi(mAreaNumber):
    api_url = f"{strapi_base}/management-areas?managementAreaNumber={mAreaNumber}"

    try:
        response = requests.get(api_url, headers=headers)

        if response.status_code == 200:
            data = response.json()

            if len(data) == 0:
                return None
            else:
                return data[0]
        else:
            print(f'Unable to get mgmt area with code {response.status_code}')
    except:
        print(f'Error invoking webservice - {api_url}')
        raise


def get_region_from_strapi(regionNumber):
    api_url = f"{strapi_base}/regions?regionNumber={regionNumber}"

    try:
        response = requests.get(api_url, headers=headers)

        if response.status_code == 200:
            data = response.json()

            if len(data) == 0:
                return None
            else:
                return data[0]
        else:
            print(f'Unable to region with code {response.status_code}')
    except:
        print(f'Error invoking webservice - {api_url}')
        raise


def get_section_from_strapi(sectionNumber):
    api_url = f"{strapi_base}/sections?sectionNumber={sectionNumber}"

    try:
        response = requests.get(api_url, headers=headers)

        if response.status_code == 200:
            data = response.json()

            if len(data) == 0:
                return None
            else:
                return data[0]
        else:
            print(f'Unable to get section with code {response.status_code}')
    except:
        print(f'Error invoking webservice - {api_url}')
        raise

### misc
def clean_data():
    pass

def validate_data():
    pass



if __name__ == "__main__":
    pass
