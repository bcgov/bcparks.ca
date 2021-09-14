#!/usr/bin/env python
# -*- coding: utf-8 -*-
#import json
import requests
from datetime import datetime

# variables

headers = {
    'Content-Type': 'application/json'
}


class Parks_ETL:

    def __init__(self, downstream_pw, service_url):
        self.par_api_url_base = service_url["par"]
        self.bcgn_api_url_base = service_url["bcgn"]
        self.strapi_base = service_url["strapi"]
        self.bcwfs_api_url_base = service_url["bcwfs"]
        self.token = downstream_pw


    ### Import PAR functions
    def _get_data_from_par(self):
        api_url = f"{self.par_api_url_base}/protectedLands?protectedLandName=%25&protectedLandTypeCodes=CS,ER,PA,PK,RA"

        result = None

        try:
            response = requests.get(api_url, headers=headers)

            if response.status_code == 200:
                # convert json to Python object
                data = response.json()

                if 'data' in data:
                    result = data["data"]
                else:
                    print('data does not conform to expectations!')
           
            return result
        except Exception as e:
            print('Error invoking webservice', e)
            raise

    def _dump_par_data(self, task_instance):
        api_url = f'{self.strapi_base}/protected-areas?token={self.token}'
        data = task_instance.xcom_pull(task_ids='etl_transform_data_par')

        for pro_land in data:
            try:
                # check object relationships
                # sites
                index_count = 0
                for site in pro_land["sites"]:
                    pro_land["sites"][index_count] = self.create_or_update_site(site)
                    index_count = index_count + 1

                # managementAreas
                index_count = 0
                for mArea in pro_land["managementAreas"]:
                    pro_land["managementAreas"][index_count] = self.create_or_update_mgmt_area(mArea)
                    index_count = index_count + 1

                pro_area = self.get_protected_area_from_strapi(pro_land["orcs"])

                if pro_area is None:
                    api_url = f'{self.strapi_base}/protected-areas?token={self.token}'
                    #rectified_payload = python_to_proper_json_string(pro_land)
                    response = requests.post(api_url, json=pro_land, headers=headers)

                    if response.status_code == 200:
                        data = response.json()

                        print(f'Protected Area with id: {data["id"]} and ORCS:{pro_land["orcs"]}  successfully created!')
                    else:
                        print(f'dump par data: Unplanned status code returned - {response.status_code}')
                else:
                    print(f'Protected area ORCS:{pro_land["orcs"]} already exist in strapi')
                    api_url = f'{self.strapi_base}/protected-areas/{pro_area["id"]}?token={self.token}'
                    #rectified_payload = python_to_proper_json_string(pro_land)
                    #del pro_land["sites"]
                    #del pro_land["managementAreas"]
                    response = requests.put(api_url, json=pro_land, headers=headers)

                    if response.status_code == 200:
                        data = response.json()

                        print(f'Protected Area with id: {data["id"]} and ORCS:{pro_land["orcs"]}  successfully updated!')
                    else:
                        print(f'dump par data: Unplanned status code returned - {response.status_code}')

            except Exception as e:
                print('dump par data: Error invoking webservice', e)
                raise

    def create_or_update_site(self, site):
        newSite = self.get_site_from_strapi(site["orcsSiteNumber"])

        if newSite is None:
            #create new site
            newSite = self.create_site_in_strapi(site)
        else:
            print(f'Site with orcsSiteNumber: {site["orcsSiteNumber"]} already exists')
            newSite = self.update_site_in_strapi(newSite["id"],site)

        return newSite

    def create_or_update_mgmt_area(self, mArea):
        newMArea = self.get_mgmt_area_from_strapi(mArea["managementAreaNumber"])

        if newMArea is None:
            #create new mgmt area
            newMArea = self.create_mgmt_area_in_strapi(mArea)
        else:
            print(f'Management Area with managementAreaNumber: {mArea["managementAreaNumber"]} already exists')
            newSite = self.update_mgmt_area_in_strapi(newMArea["id"],mArea)

        return newMArea

    def get_or_create_section(self, section):
        newSection = self.get_section_from_strapi(section["sectionNumber"])

        if newSection is None:
            #create new section
            newSection = create_section_in_strapi(section)
            print(f'Section with sectionNumber: {section["sectionNumber"]} successfully created!')
        else:
            print(f'Section with sectionNumber: {section["sectionNumber"]} already exists')

        return newSection

    def get_or_create_region(self, region):
        newRegion = self.get_region_from_strapi(region["regionNumber"])

        if newRegion is None:
            #create new region
            newRegion = create_region_in_strapi(region)
            print(f'Section with regionNumber: {region["regionNumber"]} successfully created!')
        else:
            print(f'Section with regionNumber: {region["regionNumber"]} already exists')

        return newRegion

    def _get_data_from_bcgn(self, task_instance):
        data = task_instance.xcom_pull(task_ids='etl_get_data_from_par')
        result = []
        try:
            indx = 0
            for pro_land in data:
                featureId = pro_land["featureId"]

                api_url = f"{self.bcgn_api_url_base}/names/{featureId}.json"
                response = requests.get(api_url, headers=headers)

                if response.status_code == 200:
                    # convert json to Python object
                    data = response.json()
                    data["orcs"] = pro_land["orcNumber"]
                    result.append(data)

            return result
        except Exception as e:
            print('Error invoking webservice', e)
            raise

    def _dump_bcgn_data(self, task_instance):       
        data = task_instance.xcom_pull(task_ids='etl_transform_data_bcgn')        
        park_type_legal_id = self.get_park_type_legal_from_strapi()

        for park_name in data:
            try:                
                
                existing_park_name = self.get_park_names_legal_from_strapi(park_name["protectedArea"], park_type_legal_id)

                if existing_park_name is None:
                    api_url = f'{self.strapi_base}/park-names?token={self.token}'
                    #rectified_payload = python_to_proper_json_string(pro_land)
                    response = requests.post(api_url, json=park_name, headers=headers)

                    if response.status_code == 200:
                        data = response.json()
                        print(f'Park Name for ORCS:{park_name["orcs"]}  successfully created!')
                    else:
                        print(f'_dump_bcgn_data: dump par data: Unplanned status code returned - {response.status_code}  {park_name}')
                else:
                    print(f'Park Name for ORCS:{park_name["orcs"]} already exist in strapi')
                    api_url = f'{self.strapi_base}/park-names/{existing_park_name["id"]}?token={self.token}'
                    response = requests.put(api_url, json=park_name, headers=headers)

                    if response.status_code == 200:
                        result = response.json()
                        print(f'Protected Area with id: {result["id"]} and ORCS:{park_name["orcs"]}  successfully updated!')
                    else:
                        print(f'_dump_bcgn_data: Unplanned status code returned - {response.status_code}')

            except Exception as e:
                print('_dump_bcgn_data: Error invoking webservice', e)
                raise

    def _get_data_from_bcwfs(self, task_instance):
        #api_url = f"{self.bcwfs_api_url_base}/?f=json&where=1=1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=OBJECTID ASC&resultOffset=0&resultRecordCount=50&cacheHint=true&quantizationParameters={'mode':'edit'}"
        api_url = f"{self.bcwfs_api_url_base}?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=OBJECTID%20ASC&resultOffset=0&resultRecordCount=50&cacheHint=true&quantizationParameters=%7B%22mode%22%3A%22edit%22%7D"
        
        result = None

        try:
            response = requests.get(api_url, headers=headers)

            if response.status_code == 200:
                # convert json to Python object
                result = response.json()

            return result
        except Exception as e:
            print('Error invoking webservice', e)
            raise

    def _dump_bcwfs_data(self, task_instance):
        api_url = f'{self.strapi_base}/Fire-Ban-Prohibitions?token={self.token}'
        data = task_instance.xcom_pull(task_ids='etl_transform_data_bcwfs')
        print(f'dump data {data} ')
        self.delete_fireban_prohibitions_from_strapi()
        try:
            for feature in data:
                # persist object
                print(f'dump data: data - {feature}')
                response = requests.post(api_url, json=feature, headers=headers)

                if response.status_code == 200:
                    result = response.json()
                    print(f'Record with id: {result["id"]} successfully created!')
                else:
                    print(f'_dump_bcwfs_data: Unplanned status code returned - {response.status_code}')

        except Exception as e:
            print('_dump_bcwfs_data: Error invoking webservice', e)
            raise
 
    ### Transform

    def _transform_data_par(self, task_instance):
        data = task_instance.xcom_pull(task_ids='etl_get_data_from_par')

        json = []

        for pro_land in data:
            json.append(self.transform_par_to_proct_land(pro_land))

        return json
    
    def transform_par_to_proct_land(self, pro_land):
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
            "sites": self.transform_par_sites(pro_land["orcNumber"], pro_land["sites"]),
            "managementAreas": self.transform_par_mgmtAreas(pro_land["managementAreas"])
        }

        return json
 
    def transform_par_sites(self, orcsNumber, sites):
        json = []

        for site in sites:
            result = self.transform_par_site(orcsNumber, site)
            json.append(result)

        return json

    def transform_par_site(self, orcsNumber, site):
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

    def _transform_data_bcgn(self, task_instance):
        data = task_instance.xcom_pull(task_ids='etl_get_data_from_bcgn')
        json = []
        park_type_legal_id = self.get_park_type_legal_from_strapi()

        for item in data:
            json.append(self.transform_bcgn_data_to_park_names(item, park_type_legal_id))
        print(f'_transform_data_bcgn : End Dump {json}')
        return json

    def transform_par_mgmtAreas(self, areas):
        json = []

        for area in areas:
            result = self.transform_par_mgmtArea(area)
            json.append(result)

        return json

    def transform_par_mgmtArea(self, area):
        return {
            "managementAreaNumber": int(area["protectedLandManagementAreaNumber"]),
            "managementAreaName": area["protectedLandManagementAreaName"],
            "section": self.transform_par_section(int(area["protectedLandSectionNumber"]), \
                                             area["protectedLandSectionName"]),
            "region": self.transform_par_region(int(area["protectedLandRegionNumber"]), \
                                           area["protectedLandRegionName"])
        }

    def transform_par_section(self, number, name):
        return {
            "sectionNumber": number,
            "sectionName": name
        }

    def transform_par_region(self, number, name):
        return {
            "regionNumber": number,
            "regionName": name
        }
  
    def transform_bcwfs_feature(self, feature):
        attribute = feature["attributes"]
        eff_date = str(datetime.fromtimestamp(int(attribute["ACCESS_STATUS_EFFECTIVE_DATE"])/1000))
        fire_zone_id = self.get_firezone_from_strapi(attribute["FIRE_ZONE_NAME"])
        fire_center_id = self.get_firecenter_from_strapi(attribute["FIRE_CENTRE_NAME"])

        json = {
            "type": attribute["TYPE"],
            "prohibitionDescription": attribute["ACCESS_PROHIBITION_DESCRIPTION"],
            "effectiveDate": eff_date,
            "fireCentre": fire_center_id,
            "fireZone": fire_zone_id,
            "bulletinURL": attribute["BULLETIN_URL"],
            "area": attribute["FEATURE_AREA_SQM"],
            "length": attribute["FEATURE_LENGTH_M"]
        }
        return json

    def transform_bcgn_data_to_park_names(self, data, park_type_legal_id):

        pro_area = self.get_protected_area_from_strapi(data["orcs"])

        json = {
            "orcs": data["orcs"],
            "parkName": data["feature"]["properties"]["name"],
            "source": "BCGWNS",
            "protectedArea": pro_area["id"]
        }
        if data["feature"]["properties"]["isOfficial"]== 1:
            json["parkNameType"] = park_type_legal_id
        
        return json

    def _transform_data_bcwfs(self, task_instance):
        data = task_instance.xcom_pull(task_ids='etl_get_data_from_bcwfs')

        json = []

        for feature in data['features']:
            json.append(self.transform_bcwfs_feature(feature))

        return json

    ### Create/Update content in Strapi

    def create_site_in_strapi(self, site):
        api_url = f"{self.strapi_base}/sites?token={self.token}"
        result = None

        try:
            response = requests.post(api_url, json=site, headers=headers)

            if response.status_code == 200:
                result = response.json()
                print(f'Site with orcsSiteNumber: {site["orcsSiteNumber"]} successfully created!')
            else:
                print(f'create site: Unplanned status code returned - {response.status_code}')

            return result

        except:
            print('create site:Error invoking webservice')
            raise

    def update_site_in_strapi(self, id, site):
        api_url = f"{self.strapi_base}/sites/{id}?token={self.token}"
        result = None

        try:
            response = requests.put(api_url, json=site, headers=headers)

            if response.status_code == 200:
                result = response.json()                
                print(f'Site with orcsSiteNumber: {site["orcsSiteNumber"]} updated')
            else:
                print(f'update site: Unplanned status code returned - {response.status_code}')

            return result

        except:
            print('update site:Error invoking webservice')
            raise

    def create_region_in_strapi(self, region):
        api_url = f"{self.strapi_base}/sites?token={self.token}"
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

    def create_section_in_strapi(self, section):
        api_url = f"{self.strapi_base}/sites?token={self.token}"
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

    def create_mgmt_area_in_strapi(self, mArea):
        api_url = f"{self.strapi_base}/management-areas?token={self.token}"
        result = None

        try:
            # handle depencies - region, sections
            if 'region' in mArea:
                mArea["region"] = self.get_or_create_region(mArea["region"])

            if 'section' in mArea:
                mArea["section"] = self.get_or_create_section(mArea["section"])

            response = requests.post(api_url, json=mArea, headers=headers)

            if response.status_code == 200:
                result = response.json()

                print(f'Management Area with managementAreaNumber: {mArea["managementAreaNumber"]} successfully created!')
            else:
                print(f'create mgmt: Unplanned status code returned - {response.status_code}')

            return result

        except:
            print('Error invoking webservice')
            raise

    def update_mgmt_area_in_strapi(self, id, mArea):
        api_url = f"{self.strapi_base}/management-areas/{id}?token={self.token}"
        result = None

        try:
            del mArea["region"]
            del mArea["section"]

            response = requests.put(api_url, json=mArea, headers=headers)

            if response.status_code == 200:
                result = response.json()                
                print(f'Management Area with managementAreaNumber: {mArea["managementAreaNumber"]} updated')
            else:
                print(f'update Management Area: Unplanned status code returned - {response.status_code}')

            return result

        except:
            print('update Management Area:Error invoking webservice')
            raise

    ### Get content from Strapi

    def get_protected_area_from_strapi(self, orcs):
        api_url = f"{self.strapi_base}/protected-areas?orcs={orcs}"

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

    def get_site_from_strapi(self, orcsSiteNumber):
        api_url = f"{self.strapi_base}/sites?orcsSiteNumber={orcsSiteNumber}"

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

    def get_mgmt_area_from_strapi(self, mAreaNumber):
        api_url = f"{self.strapi_base}/management-areas?managementAreaNumber={mAreaNumber}"

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

    def get_region_from_strapi(self, regionNumber):
        api_url = f"{self.strapi_base}/regions?regionNumber={regionNumber}"

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

    def get_section_from_strapi(self, sectionNumber):
        api_url = f"{self.strapi_base}/sections?sectionNumber={sectionNumber}"

        try:
            response = requests.get(api_url, headers=headers)

            if response.status_code == 200:
                data = response.json()

                if len(data) == 0:
                    return None
                else:
                    return data
            else:
                print(f'Unable to get section with code {response.status_code}')
        except:
            print(f'Error invoking webservice - {api_url}')
            raise

    def get_park_names_legal_from_strapi(self, protectedAreaId, parkNameLegalId):
        api_url = f"{self.strapi_base}/park-names?protectedArea={protectedAreaId}&parkNameType={parkNameLegalId}"
        try:
            response = requests.get(api_url, headers=headers)

            if response.status_code == 200:
                data = response.json()

                if len(data) == 0:
                    return None
                else:
                    return data[0]
            else:
                print(f'get_park_names_legal_from_strapi: Unable to get park names with code {response.status_code}')
        except:
            print(f'get_park_names_legal_from_strapi: Error invoking webservice - {api_url}')
            raise
    
    def get_park_type_legal_from_strapi(self):
        api_url = f"{self.strapi_base}/park-name-types?nameType=Legal"
        try:
            response = requests.get(api_url, headers=headers)

            if response.status_code == 200:
                data = response.json()

                if len(data) == 0:
                    return None
                else:
                    return data[0]["id"]
            else:
                print(f'get_park_type_legal_from_strapi: Unable to get park name legal type with code {response.status_code}')
        except:
            print(f'get_park_type_legal_from_strapi: Error invoking webservice - {api_url}')
            raise

    def get_firezone_from_strapi(self, fireZoneName):
        api_url = f"{self.strapi_base}/Fire-Zones?fireZoneName_contains={fireZoneName}"
        try:
            response = requests.get(api_url, headers=headers)

            if response.status_code == 200:
                data = response.json()

                if len(data) == 0:
                    return 0
                else:
                    return data[0]["id"]
            else:
                print(f'get_firezone_from_strapi: Unable to get fire zone with code {response.status_code}')
        except:
            print(f'get_firezone_from_strapi: Error invoking webservice - {api_url}')
            raise

    def get_firecenter_from_strapi(self, fireCenterName):
        api_url = f"{self.strapi_base}/Fire-Centres?fireCentreName_contains={fireCenterName}"
        try:
            response = requests.get(api_url, headers=headers)

            if response.status_code == 200:
                data = response.json()

                if len(data) == 0:
                    return 0
                else:
                    return data[0]["id"]
            else:
                print(f'get_firezone_from_strapi: Unable to get fire zone with code {response.status_code}')
        except:
            print(f'get_firezone_from_strapi: Error invoking webservice - {api_url}')
            raise

    def delete_fireban_prohibitions_from_strapi(self):
        api_url = f"{self.strapi_base}/Fire-Ban-Prohibitions"
        try:
            response = requests.get(api_url, headers=headers)

            if response.status_code == 200:
                data = response.json()

                for fireban in data:
                    response = requests.delete(f'{api_url}/{fireban["id"]}?token={self.token}', headers=headers)
                
                print(f'delete_fireban_prohibitions_from_strapi: Deleted all Fire Ban Prohibitions')
            else:
                print(f'delete_fireban_prohibitions_from_strapi: Unable to get fire zone with code {response.status_code}')
        except:
            print(f'delete_fireban_prohibitions_from_strapi: Error invoking webservice - {api_url}')
            raise
    ### misc
    def clean_data(self):
        pass

    def validate_data(self):
        pass



if __name__ == "__main__":
    pass
