#!/usr/bin/env python
# -*- coding: utf-8 -*-

from datetime import timedelta
from airflow import DAG
from airflow.utils.dates import days_ago
from airflow.utils.db import provide_session
from airflow.operators.python import PythonOperator

from utils import Parks_ETL
from airflow.models import Variable
from airflow.hooks.base_hook import BaseHook
from airflow.models import XCom

var_args = Variable.get("url_var", deserialize_json=True)
strapi_pw = BaseHook.get_connection('strapipw').password

args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': days_ago(0,0,0,0,0),
    'email': ['Robert.Fiddler@gov.bc.ca'],
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=1)
}

ETL_PROC_NAME = "bcparks_bcwfs_etl"


with DAG(
        ETL_PROC_NAME,
        default_args=args,
        description='Run BC-Parks BCWFS ETL!',
        schedule_interval=timedelta(days=1),
        catchup=False
    ) as dag:

    etl = Parks_ETL(strapi_pw, var_args)

    get_data_bcwfs_task = PythonOperator(
        task_id="etl_get_data_from_bcwfs",
        python_callable=etl._get_data_from_bcwfs
    )

    transform_bcwfs_task = PythonOperator(
        task_id="etl_transform_data_bcwfs",
        python_callable=etl._transform_data_bcwfs
    )

    dump_bcwfs_task = PythonOperator(
        task_id="etl_dump_bcwfs",
        python_callable=etl._dump_bcwfs_data
    )

    # set task order/hierarchy
    get_data_bcwfs_task >> transform_bcwfs_task >> dump_bcwfs_task
