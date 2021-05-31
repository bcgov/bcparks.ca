#!/usr/bin/env python
# -*- coding: utf-8 -*-

from datetime import timedelta
from airflow import DAG
from airflow.utils.dates import days_ago
from airflow.operators.python import PythonOperator

from utils import _get_data_from_par, _transform_data_par, _dump_data

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
        schedule_interval=timedelta(minutes=5),
        catchup=False
    ) as dag:

    get_data_task = PythonOperator(
        task_id="etl_get_data_from_par",
        python_callable=_get_data_from_par
    )

    transform_task = PythonOperator(
        task_id="etl_transform_data_par",
        python_callable=_transform_data_par
    )

    dump_task = PythonOperator(
        task_id="etl_dump_par",
        python_callable=_dump_data
    )

    # set task order/hierarchy
    get_data_task >> transform_task >> dump_task
