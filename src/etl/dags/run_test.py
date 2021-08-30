#!/usr/bin/env python
# -*- coding: utf-8 -*-

from airflow import DAG
from datetime import timedelta
from airflow.utils.dates import days_ago
from airflow.operators.python_operator import PythonOperator

class Other:
    some_val = 'AZero'

class Utils:
    ret_val = 'Zero'

    #def __init__(self):
    #    #self.ret_val = None
    #    pass

    def send_value(self):
        Other.some_val = 'Whatever you return gets printed in the logs'
        print(f"============= {Other.some_val} =============")

    def get_value(self):
        print(f"============= {Other.some_val} =============")


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
        "run_test_etl",
        default_args=args,
        description='Run Test Run!',
        schedule_interval=timedelta(minutes=2),
        catchup=False
    ) as dag:

    proc = Utils()

    run_task_1 = PythonOperator(
        task_id="run_task_one",
        python_callable=proc.send_value
    )

    run_task_2 = PythonOperator(
        task_id="run_task_two",
        python_callable=proc.get_value
    )

    run_task_1 >> run_task_2

