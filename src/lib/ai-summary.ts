import "server-only";
import type { getPatientChart } from "./fhir";
import { humanName } from "./fhir-types";
import { sortByDate, findByCode, componentValue, LOINC } from "./observations";
import { calculateAge } from "./utils";

type PatientChart = Awaited<ReturnType<typeof getPatientChart>>;

/** Condenses a full FHIR chart into a compact, structured text block for the LLM prompt. */
export function buildClinicalContext(chart: PatientChart): string {
  const { patient, encounters, conditions, medications, observations, allergies } = chart;

  const lines: string[] = [];

  lines.push(
    `Patient: ${humanName(patient.name)}, ${patient.gender ?? "unknown gender"}, age ${
      calculateAge(patient.birthDate) ?? "unknown"
    } (DOB ${patient.birthDate ?? "unknown"}).`
  );

  lines.push("\nActive conditions:");
  const active = conditions.filter((c) => c.clinicalStatus?.coding?.[0]?.code === "active");
  for (const c of active) {
    const name = c.code?.text ?? c.code?.coding?.[0]?.display ?? "Unknown";
    lines.push(`- ${name} (onset ${c.onsetDateTime ?? "unknown"})${c.note?.[0]?.text ? `: ${c.note[0].text}` : ""}`);
  }

  lines.push("\nActive medications:");
  for (const m of medications.filter((m) => m.status === "active")) {
    const name = m.medicationCodeableConcept?.text ?? m.medicationCodeableConcept?.coding?.[0]?.display ?? "Unknown";
    lines.push(`- ${name}, started ${m.authoredOn ?? "unknown"}${m.dosageInstruction?.[0]?.text ? ` (${m.dosageInstruction[0].text})` : ""}`);
  }

  lines.push("\nAllergies:");
  if (allergies.length === 0) lines.push("- None recorded");
  for (const a of allergies) {
    const name = a.code?.text ?? a.code?.coding?.[0]?.display ?? "Unknown";
    lines.push(`- ${name}${a.criticality ? ` (criticality: ${a.criticality})` : ""}`);
  }

  lines.push(`\nEncounters (${encounters.length} total, most recent first):`);
  const sortedEncounters = [...encounters].sort(
    (a, b) => new Date(b.period?.start ?? 0).getTime() - new Date(a.period?.start ?? 0).getTime()
  );
  for (const e of sortedEncounters.slice(0, 8)) {
    const type = e.type?.[0]?.coding?.[0]?.display ?? e.type?.[0]?.text ?? "Encounter";
    lines.push(`- ${e.period?.start?.slice(0, 10) ?? "unknown date"}: ${type} (${e.class?.code ?? "?"}, ${e.status})`);
  }

  lines.push("\nKey pulmonary measurements over time (chronological):");
  const trendCodes: { label: string; codes: string[] }[] = [
    { label: "FEV1 (L)", codes: LOINC.FEV1 },
    { label: "FVC (L)", codes: LOINC.FVC },
    { label: "FEV1/FVC (%)", codes: LOINC.FEV1_FVC },
    { label: "PEF (L/min)", codes: LOINC.PEF },
    { label: "ACT score", codes: LOINC.ACT_SCORE },
    { label: "SpO2 (%)", codes: LOINC.SPO2 },
  ];
  for (const { label, codes } of trendCodes) {
    const points = sortByDate(findByCode(observations, codes))
      .filter((o) => o.valueQuantity?.value !== undefined)
      .map((o) => `${o.effectiveDateTime?.slice(0, 10)}=${o.valueQuantity!.value}`);
    if (points.length > 0) lines.push(`- ${label}: ${points.join(", ")}`);
  }

  lines.push("\nRespiratory labs (most recent):");
  const labCodes: { label: string; codes: string[] }[] = [
    { label: "Eosinophils (/uL)", codes: LOINC.EOSINOPHILS },
    { label: "Total IgE (IU/mL)", codes: LOINC.IGE },
    { label: "CRP (mg/L)", codes: LOINC.CRP },
    { label: "Pack-years", codes: LOINC.PACK_YEARS },
  ];
  for (const { label, codes } of labCodes) {
    const matches = sortByDate(findByCode(observations, codes));
    const last = matches[matches.length - 1];
    if (last?.valueQuantity?.value !== undefined) {
      lines.push(`- ${label}: ${last.valueQuantity.value} (as of ${last.effectiveDateTime?.slice(0, 10)})`);
    }
  }

  const smoking = sortByDate(findByCode(observations, LOINC.SMOKING_STATUS)).pop();
  if (smoking) {
    const status = smoking.valueCodeableConcept?.coding?.[0]?.display ?? smoking.valueCodeableConcept?.text;
    if (status) lines.push(`- Smoking status: ${status}`);
  }

  return lines.join("\n");
}

export const AI_SYSTEM_PROMPT = `You are a clinical decision support assistant generating a pre-visit physician brief for a pulmonologist, from a condensed structured summary of a patient's FHIR record (demographics, conditions, medications, encounter history, and pulmonary function/lab trends over time).

Respond with a JSON object with exactly these two keys:
- "headline": one short sentence framing who this patient is and why they're being seen today, in the style of a chart cover line (e.g. "58-year-old female presenting for asthma follow-up."). Base the reason for visit on the most recent/upcoming encounter type if known, otherwise on their primary active condition.
- "points": an array of 5-8 short, factual clinical statements (each under 20 words) covering a mix of what changed since the last visit — spirometry/PFT trend, medication changes, relevant lab trends (eosinophils, IgE, CRP), smoking status, stable vitals/measurements worth noting, and any exacerbations/ED visits. Write plain factual statements, not judgments — e.g. "FEV1 declined from 82% to 71% predicted since last PFT." Mix positive/stable and concerning findings naturally, the way a chart summary would, without labeling severity.

Only use information present in the provided data. Do not invent values, dates, or events. Respond with JSON only, no markdown formatting.`;
