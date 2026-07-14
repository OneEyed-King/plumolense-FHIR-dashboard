#!/bin/bash
# Deletes the 7 original generic/placeholder patients from the local HAPI FHIR server,
# keeping only the 3 patients that were built out with pulmonology clinical data:
#   4f083ce3-f12b-bb4b-7353-e17f0cd55b0a - Ezekiel Walter (asthma)
#   c86c400e-ff88-a1e3-2e23-caa4d8311f47 - Cristobal Montero (COPD)
#   eb5910f1-26e6-bc6f-b300-716eae678d6f - Larissa Nikolaus (severe allergic asthma)

FHIR_SERVER=http://localhost:8080/fhir

PLACEHOLDER_IDS=(
  "2d68ad16-268a-478c-1f84-d0f1976e1a46"
  "46ee9d82-b52c-856d-069b-5064ff052225"
  "76b20010-c318-5754-8c85-983aa538522f"
  "9661a432-4630-2cd9-142c-386845fae837"
  "a305a3c5-c2f8-e006-d7f5-8e772561fe56"
  "aee7bbe1-0c45-c028-1e62-1f4cdb30c273"
  "d3727ff2-5d7b-347f-d78c-edc4323cf890"
)

for id in "${PLACEHOLDER_IDS[@]}"; do
  echo "Deleting Patient/$id ..."
  curl -s -o /dev/null -w "  -> %{http_code}\n" -X DELETE "$FHIR_SERVER/Patient/$id"
done

echo "Done. Verify with:"
echo "  curl -s \"$FHIR_SERVER/Patient?_summary=count\""
