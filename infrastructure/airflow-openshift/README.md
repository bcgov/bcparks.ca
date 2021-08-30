# airflow-openshift
Run Apache Airflow on OpenShift

The purpose of this template is to run [Apache Airflow](https://airflow.apache.org) on Openshift. Acknowledgement: The template is a modified version of https://github.com/adyachok/incubator-airflow.git

##### Docker Image Used
https://github.com/CSCfi/docker-airflow

#### Useful Variables

The template can be imported via the Openshift web ui or added via the command line interface (oc)

The required variables which need to be present in order to run the template are:

1. APPLICATION_NAME: A unique name identifying the airflow deployment
2. AUTHENTICATION_USERNAME: Username for the Airflow web UI authentication
3. AUTHENTICATION_PASSWORD: Password for the Airflow web UI authentication
4. JUPYTER_PASSWORD: For accessing the Jupyter web interface

Rest of the variables are optional and have a value by default which can be changed, if needed.

Some of the useful variables to you as the user could be:

- WORKER_COUNT: The number of workers being deployed, by default 2 workers are deployed
- WORKER_CPU: CPU of each worker deployed
- WORKER_MEMORY: Memory of each worker deployed
- PIP_REQUIREMENTS: Python requirements

## How to Upload DAGs on the Airflow webserver

The current template deploys a Jupyter pod for writing the python code for DAGs. The password will be the one you set in JUPYTER_PASSWORD variable.
**Note** When accessing Jupyter, you need to click on **Upload** to upload an existing python code (.py extension) of the Airflow DAG or you could click on **New->Text File** and then write the python code in the text file itself, *but remember to save it with the .py extension*

## How to Install Custom Python Libraries

There are two ways of doing this as of now. 

1. Before Deployment: Using the *variable* **PIP_REQUIREMENTS** , where you can specify the name of the library separated by whitespace, for eg. pandas scipy

2. After Deployment: If you have a requirements.txt file, you could edit the *configmap* **requirements** and add your requirements there (Please keep in mind, *boto3* is a required library which is present by default, do not remove that otherwise there could trouble accessing the S3 Object store.) 
**NOTE** - when using this option, you need to redeploy the *webserver* and *worker* deployments for the changes to take place!

## Setting configuration variables
If you want to change the Airflow configuration, the best way to do it is to add new environment variables in the deployment configs of the pods. Be aware that some variables have to be set in the worker pods, while some have to be set in the webserver pod for the effect to take place! For more information about configuring Airflow with environment variables, check <https://airflow.apache.org/docs/stable/howto/set-config.html>. For a list of all available Airflow configurations, see <https://airflow.apache.org/docs/stable/configurations-ref.html>.

## Configuring email host
Airflow can be configured to send emails: you can both send custom emails through Airflow as a task, or receive alert emails yourself if one of your DAG runs have failed. For the email system to work the following configuration variables have to be set in the deployment config of *worker*:
* AIRFLOW__SMTP__SMTP_HOST
* AIRFLOW__SMTP__SMTP_USER
* AIRFLOW__SMTP__SMTP_PORT
* AIRFLOW__SMTP__SMTP_MAIL_FROM

And, if the smtp host requires it:
* AIRFLOW__SMTP__SMTP_PASSWORD

If you need CSC specific configuration, contact servicedesk@csc.fi.

To use a Google Gmail account as the email host, you first have to create an App Password to your account. To set up an App Password, follow instructions in <https://support.google.com/accounts/answer/185833?hl=en>.

When you have the password, enter these as environment variables in the worker deployment config:
* AIRFLOW__SMTP__SMTP_HOST = smtp.gmail.com
* AIRFLOW__SMTP__SMTP_USER = \<gmail address you used>
* AIRFLOW__SMTP__SMTP_PASSWORD = \<the password you just generated>
* AIRFLOW__SMTP__SMTP_PORT = 587
* AIRFLOW__SMTP__SMTP_MAIL_FROM = \<gmail address you used>

## How to create a connection to a custom S3 Object Store

This requires the presence of the boto3 library, which is added by default to the requirements configmap.

After that, you can create a connection via the Airflow web ui by clicking on *Admin->Connections* , then fill the following fields:

* Conn Id: use a unique id for the connection and then you need to pass this id in your DAG Python code when interacting with S3
* Conn Type: S3
* Extra: {"aws\_access\_key\_id":"your-access-key-id", "aws\_secret\_access\_key": "your-secret-access-key", "host": "the-s3-endpoint-url"}

## Logging issues
Airflow produces quite a lot of log files, and the log pvc gets full fairly easily, which in turn prevents the whole application from working. This is why a DAG that removes old log files is added and enabled by default. **It is strongly encouraged to keep this DAG enabled!**

By default log files get removed after two weeks, but you can define when log files get removed by either modifying the DAG directly or creating a variable in the web UI (Admin -> Variables):

* Key: airflow_log_cleanup__max_log_age_in_days
* Value: number of days after a log file is deleted, for example 30