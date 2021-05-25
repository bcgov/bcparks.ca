#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json
import requests

from airflow.models import Variable


# variables
base_url = Variable.get("base_url_data", deserialize_json=True)
par_api_url_base = base_url["par"]
bcgn_api_url_base = base_url["bcgn"]

headers = {
    'Content-Type': 'application/json'
}

### task pythons
def _get_data_from_par(task_instance):
    api_url = f"{par_api_url_base}/protectedLands?protectedLandName=%25&protectedLandTypeCodes=CS,ER,PA,PK,RA"

    try:
        response = requests.get(api_url, headers=headers)
        
        if response.status_code == 200:
            # convert json to Python object 
            data = response.json()

            if 'data' in data:
                return data["data"]
            else:
                #TODO: write to aitflow
                print('data does not conform to expectations!')
    except:
    # del widgets_screen1[7:8]
        # TODO: write error into airflow
        print('Error invoking webservice')
        raise



def _get_data_from_bcgn(task_instance):
    api_url = f"{bcgn_api_url_base}//names/search?outputFormat=json&name=Victoria&exactSpelling=0"

    try:
        response = requests.get(api_url, headers=headers)
        
        if response.status_code == 200:
            # convert json to Python object 
            data = response.json()

            if 'data' in data:
                return data["data"]
            else:
                #TODO: write to aitflow
                print('data does not conform to expectations!')
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
    pass


def _dump_data(task_instance):
    api_url = ''
    data = task_instance.xcom_pull(task_ids='etl_transform_data')
    
    return None

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
        "sites": pro_land["sites"],
        "managementAreas": pro_land["managementAreas"]
    }

    return json



### misc
def clean_data():
    pass

def validate_data():
    pass



if __name__ == "__main__":
    _get_data_from_par(None)
