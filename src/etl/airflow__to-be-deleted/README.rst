# DAG /Python #

## Unit Test

### How to Unit Test

```bash

$ pytest

```
## Syntax issues

## Fix Syntax in DAG

```bash

$ python src/etl/dag/dagfile.py

```


## Deploy DAG in AirFlow version 2

1. create service variables

```json
{
    "par": "https://a100.gov.bc.ca/pub/parws",
    "bcgn": "https://apps.gov.bc.ca/pub/bcgnws",
    "strapi": "http://dev-cms.bcparks.ca:1337"
    "bcwfs": "https://services6.arcgis.com/ubm4tcTYICKBpist/arcgis/rest/services/British_Columbia_Bans_and_Prohibition_Areas/FeatureServer/0/query"
}

```

2. Upload v2 dag files and dependencies into airflow

or 


- use the cli as below

```bash

```

3. Check and confirm dag schedule interval.


