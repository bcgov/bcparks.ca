#!/usr/bin/env python
# -*- coding: utf-8 -*-

from datetime import timedelta
from airflow import DAG
from airflow.utils.dates import days_ago
from airflow.operators.python import PythonOperator

from utils import Parks_ETL
from airflow.models import Variable

var_args = Variable.get("base_url_data", deserialize_json=True)
#var_args = {"par": "", "bcgn": "", "strapi": "", "token": ""}

args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': days_ago(0,0,0,0,0),
    'email': ['dapo.onawole@gmail.com'],
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=1)
}


with DAG(
        "bcparks_par_etl",
        default_args=args,
        description='Run BC-Parks PAR ETL!',
        schedule_interval=timedelta(minutes=30),
        catchup=False
    ) as dag:

    etl = Parks_ETL(var_args)

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
