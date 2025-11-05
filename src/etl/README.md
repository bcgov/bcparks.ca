BCParks.ca ETL Services


## Setup

```
    npm install
```

Copy .env.example to .env and populate the `PARK_NAMES_API_KEY` and `STRAPI_API_TOKEN` secrets

## Run all scripts

```
    npm run start
```

## Run BC Wildfire Service Bans

#### with data from https://openmaps.gov.bc.ca
```
    npm run start bcwfs
```

#### with test data stored in a file
```
    npm run start bcwfs ./data/bcwfs-response.json
```

## Run BC Parks Data Register park name sync

#### with data from the BC Parks Data Register (PARK_NAMES_API_KEY needed)
```
    npm run start parknames
```

#### with test data stored in a file
```
    npm run start parknames ./data/park-names-response.json
```
