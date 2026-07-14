#!/bin/bash

FHIR_SERVER=http://localhost:8080/fhir

echo "Waiting for HAPI..."

until curl -s $FHIR_SERVER/metadata >/dev/null
do
    sleep 2
done

echo "Uploading bundle..."

curl \
-X POST \
-H "Content-Type: application/fhir+json" \
--data @../data/pulmonary-demo-bundle.json \
$FHIR_SERVER

echo
echo "Done!"