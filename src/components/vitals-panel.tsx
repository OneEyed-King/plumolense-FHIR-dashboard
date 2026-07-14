import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { latest, componentValue, quantityDisplay, LOINC } from "@/lib/observations";
import type { Observation } from "@/lib/fhir-types";
import { formatDateTime } from "@/lib/utils";

function VitalStat({ label, value, asOf }: { label: string; value: string; asOf?: string }) {
  return (
    <div className="rounded-md border border-border bg-gray-50 p-3">
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-gray-900">{value}</div>
      {asOf && <div className="mt-0.5 text-xs text-gray-400">{formatDateTime(asOf)}</div>}
    </div>
  );
}

export function VitalsPanel({ observations }: { observations: Observation[] }) {
  const bp = latest(observations, LOINC.BP_PANEL);
  const systolic = componentValue(bp, LOINC.SYSTOLIC)?.valueQuantity;
  const diastolic = componentValue(bp, LOINC.DIASTOLIC)?.valueQuantity;
  const bpDisplay =
    systolic?.value !== undefined && diastolic?.value !== undefined
      ? `${systolic.value}/${diastolic.value} mmHg`
      : "—";

  const hr = latest(observations, LOINC.HEART_RATE);
  const temp = latest(observations, LOINC.TEMPERATURE);
  const rr = latest(observations, LOINC.RESP_RATE);
  const spo2 = latest(observations, LOINC.SPO2);
  const height = latest(observations, LOINC.HEIGHT);
  const weight = latest(observations, LOINC.WEIGHT);
  const bmi = latest(observations, LOINC.BMI);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vital Signs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <VitalStat label="Blood Pressure" value={bpDisplay} asOf={bp?.effectiveDateTime} />
          <VitalStat label="Heart Rate" value={quantityDisplay(hr?.valueQuantity)} asOf={hr?.effectiveDateTime} />
          <VitalStat label="Temperature" value={quantityDisplay(temp?.valueQuantity)} asOf={temp?.effectiveDateTime} />
          <VitalStat
            label="Respiratory Rate"
            value={quantityDisplay(rr?.valueQuantity)}
            asOf={rr?.effectiveDateTime}
          />
          <VitalStat label="SpO₂" value={quantityDisplay(spo2?.valueQuantity)} asOf={spo2?.effectiveDateTime} />
          <VitalStat label="Height" value={quantityDisplay(height?.valueQuantity)} asOf={height?.effectiveDateTime} />
          <VitalStat label="Weight" value={quantityDisplay(weight?.valueQuantity)} asOf={weight?.effectiveDateTime} />
          <VitalStat label="BMI" value={quantityDisplay(bmi?.valueQuantity)} asOf={bmi?.effectiveDateTime} />
        </div>
      </CardContent>
    </Card>
  );
}
