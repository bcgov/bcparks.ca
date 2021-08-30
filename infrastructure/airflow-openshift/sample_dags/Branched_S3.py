from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.operators.bash_operator import BashOperator
from airflow.operators.python_operator import BranchPythonOperator
from airflow.sensors.s3_key_sensor import S3KeySensor
from datetime import datetime, timedelta
from airflow.hooks.S3_hook import S3Hook
import os

default_args = {
    'owner': 'your-username',
    'start_date': datetime(2020, 1, 1),
    'retry_delay': timedelta(minutes=5)
}

MAIN_DAG_NAME = 'Branch_Pipeline'

# The directory /tmp/airflow is created by default in the template, to work with temporary file storage across all the workers

def path_picker():
    for fname in os.listdir('/tmp/airflow/'):
        if fname.endswith('.py'):
            return "branch_python"
        else:
            return "branch_java"


def download_file_from_s3(bucket_name, key, filename):

    hook = S3Hook('s3conn')  # You need to create the connection in the Airflow UI first !
    client = hook.get_conn()
    client.download_file(
        Bucket=bucket_name,
        Key=key,
        Filename=filename
    )


# def upload_file_to_s3(bucket_name, key, filename):
#     localpath = '/tmp/airflow'
#     hook = S3Hook('s3conn')
#     hook.load_file(
#         filename=localpath + filename,
#         key=key,
#         bucket_name=bucket_name)


# Using the context manager alllows you not to duplicate the dag parameter in each operator
with DAG(MAIN_DAG_NAME, default_args=default_args, schedule_interval='@once') as main_dag:

	# Parameters required in S3:
	# 1. bucket_name: You need to create a bucket in your S3 first
	# 2. bucket_key (as a prefix) , for example, your file is called datafile.py, the key could be anything which sounds like a prefix, like dat*
	# 3. aws_conn_id: you need to create this via Airflow UI first

    inputsensor = S3KeySensor(
        task_id='check_s3_for_file_in_s3',
        bucket_key='dat*',
        wildcard_match=True,
        bucket_name='your-bucket-name',
        aws_conn_id='s3conn',
        timeout=18 * 60 * 60,
        poke_interval=30,
        dag=main_dag)


    # Parameters required in S3:
    # 1. bucket_name: You need to create a bucket in your S3 first
    # 2. key : a file called 'datafile.py' should be present in your bucket
        
    download_file_from_S3_task = PythonOperator(
        task_id='download_file_from_S3',
        depends_on_past=True,
        python_callable=download_file_from_s3,
        op_kwargs={
            'filename': '/tmp/airflow/datafile.py', # this will store it in a temp location created by default
            'key': 'datafile.py',  # This file needs to be present in your S3 Bucket, it can be empty as well
            'bucket_name': 'your-bucket-name',
        },
        dag=main_dag
    )

    branch_task = BranchPythonOperator(
        task_id='run_this_first',
        python_callable=path_picker,
        trigger_rule="all_done",
        dag=main_dag)

    branch_python = BashOperator(
        task_id='branch_python',
        depends_on_past=True,
        bash_command='echo Python task called',
        dag=main_dag)

    branch_java = BashOperator(
        task_id='branch_java',
        depends_on_past=True,
        bash_command='echo Java task called',
        dag=main_dag)

    # Use arrows to set dependencies between tasks
    inputsensor >> download_file_from_S3_task
    download_file_from_S3_task >> branch_task
    branch_task >> branch_python
    branch_task >> branch_java