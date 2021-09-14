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


## Deploy DAG in AirFlow

1. create service variables

```json
{
    "par": "https://a100.gov.bc.ca/pub/parws",
    "bcgn": "https://apps.gov.bc.ca/pub/bcgnws",
    "strapi": "http://10.10.2.80:1337"
}

```

2. Upload dag files and dependencies into airflow jupiter

or 


- use the cli as below

```bash

```

3. Check and confirm dag schedule interval. Set to every 2mins by default


