#!/bin/bash
if [ -n $(printenv DATABASE_NAME) ]
then 
export PGPASSWORD=$(printenv DATABASE_PASSWORD)
fi

export logfile=bcparks_cms.log
# Wait for database connection
function PG_IS_READY() { 
printf "SELECT \'CREATE DATABASE ${DATABASE_NAME}\' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = \'${DATABASE_NAME}\')\gexec" | psql -h $DATABASE_HOST -U ${DATABASE_USERNAME}
psql -h $DATABASE_HOST -U ${DATABASE_USERNAME} -d ${DATABASE_NAME} -t -c "select 'READY'" | awk '{print $1}'
}

until PG_IS_READY | grep -m 1 "READY";
do
    echo "Waiting for the database ..." ;
    sleep 3 ;
done
echo -e "\nThe database is up."
npm start
tail -f $logfile
