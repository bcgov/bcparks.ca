"""An example DAG that sends an alert email to specified addresses if a DAG run fails."""

from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from datetime import datetime
from datetime import timedelta


# Airflow can send alert emails to user if a DAG run fails. The instructions how to set the configurations
# for the email system to work can be found in https://github.com/CSCfi/airflow-openshift/blob/master/README.md


default_args = {
    'owner': 'your-username',
    'start_date': datetime(2020, 1, 1),
    'email': ['your-email@email.com',
              'another-recipient@email.com'],   # You can specify all recipients of the email as a list
    'email_on_failure': True,                   # email_on_failure has to be set to True either in the DAG or in the individual task
    'email_on_retry': True,                     # you can also specify if you want to get an email from a retried attempt
    'retries': 1,
    'retry_delay': timedelta(seconds=10),
}


def failing_function():
    raise Exception('Failing or retried task should result in Airflow sending you an email')


with DAG(dag_id='email_on_failure', default_args=default_args, schedule_interval='@once') as dag:

    failing_task = PythonOperator(
        task_id='failing_task',
        python_callable=failing_function
    )
