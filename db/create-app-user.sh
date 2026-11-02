#!/bin/sh
set -eu

app_password="$(cat /run/secrets/app_db_password)"

psql \
    --username "$POSTGRES_USER" \
    --dbname "$POSTGRES_DB" \
    --set=ON_ERROR_STOP=1 \
    --set=app_password="$app_password" <<'SQL'
SELECT format('CREATE ROLE jyobiken_app LOGIN PASSWORD %L', :'app_password') \gexec
GRANT CONNECT ON DATABASE jyobiken TO jyobiken_app;
GRANT USAGE, CREATE ON SCHEMA public TO jyobiken_app;
SQL
