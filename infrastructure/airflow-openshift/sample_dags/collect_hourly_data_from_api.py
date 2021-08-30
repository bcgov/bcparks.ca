from datetime import timedelta
from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.operators.bash_operator import BashOperator
from airflow.utils.dates import days_ago
import requests
import pandas as pd
from datetime import datetime
import json

# This DAG is a skeleton template for a DAG that collects json-formatted data once per hour
# from two endpoints of an API and joins the data in a pandas DataFrame, which is finally 
# stored as a csv file.
#
# Data is first fetched from the api and saved into a file in /tmp/airflow, which in this
# deployment configuration is the place for temporary data storage. Here the final csv file
# is also saved there, but you might want to create separate pvc for data that is meant to be stored
# for longer.
#
# NOTE: This DAG requires that pip packages pandas and requests are installed

API_URL_BASE = "https://api.com/"
TMP_FOLDER = "/tmp/airflow/data"
FILE_NAME_1 = "data1.json"
FILE_NAME_2 = "data2.json"


def download_data(endpoint, filename):
    """Downloads data from given API endpoint to temporary storage"""
    response = requests.get(API_URL_BASE + endpoint, stream=True)

    if response.status_code == 200:
        # Data is temporarily saved to /tmp/airflow, which is temporary storage for workers
        with open(f"{TMP_FOLDER}/{filename}", "wb") as fd:
            for _ in response.iter_content():
                fd.write(_)
    else:
        raise Exception(f"Could not get the resource from endpoint {endpoint}. HTTP status code: {response.status_code}")


def data_as_dict(path):
    """Opens given json file and turns it into a dictionary object"""
    with open(path) as f:
        return json.loads(f.read())


def transform_data1():
    """Processes the data from the first API endpoint"""
    d = data_as_dict(f"{TMP_FOLDER}/{FILE_NAME_1}")
    df = pd.json_normalize(d)

    # Do your pandas magic here

    return df


def transform_data2():
    """Processes the data from the second API endpoint"""
    d = data_as_dict(f"{TMP_FOLDER}/{FILE_NAME_2}")
    df = pd.json_normalize(d)

    # Do your pandas magic here

    return df


def data_to_csv(file_path):
    """Merges the data from both endpoints and saves it into the given location as a csv file"""
    df = pd.merge(transform_data1(), transform_data2())

    # DataFrame is saved to specified location adding a timestamp to the file name
    df.to_csv(file_path + '-' + datetime.now().strftime('%Y-%m-%d-%H:%M'))


default_args = {
    'owner': 'airflow',
    'start_date': days_ago(0, minute=1),
    'retries': 4,
    'retry_delay': timedelta(minutes=5),
}

# In schedule_interval, the times to execute the DAG is specified in a similar syntax as cronjobs
# It would also possible to use for example timedelta(hours=1)
with DAG(dag_id='get_data', default_args=default_args, schedule_interval='15 * * * *') as dag:

    t1 = BashOperator(
        task_id='make_tmp_folder',
        bash_command=f'mkdir -p {TMP_FOLDER}',
    )

    t2 = PythonOperator(
        task_id='download_data1',
        python_callable=download_data,
        op_kwargs={'endpoint': 'api/data1', 'filename': FILE_NAME_1},   # You can give variables to a function with a dictionary
    )

    t3 = PythonOperator(
        task_id='download_data2',
        python_callable=download_data,
        op_kwargs={'endpoint': 'api/data2', 'filename': FILE_NAME_2},   # Here we use the same function as in previous task, but with different variables
    )

    t4 = PythonOperator(
        task_id='save_data',
        python_callable=data_to_csv,
        op_kwargs={'file_path': '/tmp/airflow'},  # You might want to create new pvc to store the data, instead of using volume meant to be temporary storage for workers
    )

    t5 = BashOperator(
        task_id='delete_tmp_folder',
        bash_command=f'rm -r {TMP_FOLDER}',
    )

# Set up the dependencies between the tasks
t1 >> [t2, t3] >> t4 >> t5
