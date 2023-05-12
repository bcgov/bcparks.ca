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

var_args = Variable.get("url_var", deserialize_json=True)
strapi_pw = BaseHook.get_connection('strapipw').password
#var_args = {"par": "", "bcgn": "", "strapi": "", "token": ""}

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

ETL_PROC_NAME = "bcparks_par_etl"


with DAG(
        ETL_PROC_NAME,
        default_args=args,
        description='Run BC-Parks PAR ETL!',
        schedule_interval=timedelta(days=1),
        catchup=False
    ) as dag:

    etl = Parks_ETL(strapi_pw, var_args)

    get_data_par_task = PythonOperator(
        task_id="etl_get_data_from_par",
        python_callable=etl._get_data_from_par
    )

    get_data_bcgn_task = PythonOperator(
        task_id="etl_get_data_from_bcgn",
        python_callable=etl._get_data_from_bcgn
    )

    transform_par_task = PythonOperator(
        task_id="etl_transform_data_par",
        python_callable=etl._transform_data_par
    )

    transform_bcgn_task = PythonOperator(
        task_id="etl_transform_data_bcgn",
        python_callable=etl._transform_data_bcgn
    )

    dump_par_task = PythonOperator(
        task_id="etl_dump_par",
        python_callable=etl._dump_par_data
    )

    dump_bcgn_task = PythonOperator(
        task_id="etl_dump_bcgn",
        python_callable=etl._dump_bcgn_data
    )


    # set task order/hierarchy
    get_data_par_task >> transform_par_task >> [get_data_bcgn_task, dump_par_task]

    get_data_bcgn_task >> transform_bcgn_task >> dump_bcgn_task
