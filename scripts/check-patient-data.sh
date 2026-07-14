#!/bin/bash
# Quick diagnostic: counts each resource type for the 3 pulmonology patients on the local server.

FHIR_SERVER=http://localhost:8080/fhir

PATIENTS=(
  "4f083ce3-f12b-bb4b-7353-e17f0cd55b0a:Ezekiel Walter (asthma)"
  "c86c400e-ff88-a1e3-2e23-caa4d8311f47:Cristobal Montero (COPD)"
  "eb5910f1-26e6-bc6f-b300-716eae678d6f:Larissa Nikolaus (severe allergic asthma)"
)

for entry in "${PATIENTS[@]}"; do
  id="${entry%%:*}"
  label="${entry##*:}"
  echo "=== $label ($id) ==="
  echo -n "  Patient exists: "
  curl -s -o /dev/null -w "%{http_code}\n" "$FHIR_SERVER/Patient/$id"
  for res in Condition MedicationRequest Observation DiagnosticReport AllergyIntolerance Encounter; do
    count=$(curl -s "$FHIR_SERVER/$res?patient=$id&_summary=count" | grep -o '"total":[0-9]*' | grep -o '[0-9]*')
    echo "  $res: ${count:-0}"
  done
  count=$(curl -s "$FHIR_SERVER/Composition?subject=$id&_summary=count" | grep -o '"total":[0-9]*' | grep -o '[0-9]*')
  echo "  Composition: ${count:-0}"
  echo
done
