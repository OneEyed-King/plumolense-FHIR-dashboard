import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { humanName } from "@/lib/fhir-types";
import type { Patient, Condition, AllergyIntolerance, Encounter } from "@/lib/fhir-types";
import { formatDate, calculateAge, initials } from "@/lib/utils";

export function PatientHeader({
  patient,
  conditions,
  allergies,
  encounters,
}: {
  patient: Patient;
  conditions: Condition[];
  allergies: AllergyIntolerance[];
  encounters: Encounter[];
}) {
  const name = humanName(patient.name);
  const age = calculateAge(patient.birthDate);

  const activeConditions = conditions.filter((c) => c.clinicalStatus?.coding?.[0]?.code === "active");

  const lastVisit = [...encounters].sort(
    (a, b) => new Date(b.period?.start ?? 0).getTime() - new Date(a.period?.start ?? 0).getTime()
  )[0];

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-xl font-medium text-primary">
          {initials(name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Patient</p>
          <h1 className="mt-0.5 font-display text-3xl font-semibold tracking-tight leading-tight text-gray-900">{name}</h1>
          <p className="mt-1.5 font-mono text-xs text-muted-foreground">
            {age !== null ? `${age}y · ` : ""}
            {patient.gender ?? "unknown"} · DOB {formatDate(patient.birthDate)}
            {patient.id ? ` · ID ${patient.id.slice(0, 8)}` : ""}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {activeConditions.map((c) => (
              <Badge key={c.id ?? c.code?.text} tone="blue">
                {c.code?.text ?? c.code?.coding?.[0]?.display ?? "Condition"}
              </Badge>
            ))}
            {allergies.map((a) => (
              <Badge key={a.id ?? a.code?.text} tone="red">
                Allergy · {a.code?.text ?? a.code?.coding?.[0]?.display ?? "Unknown"}
              </Badge>
            ))}
          </div>
        </div>
        {lastVisit?.period?.start && (
          <div className="shrink-0 text-right">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Last Visit</p>
            <p className="mt-0.5 font-mono text-sm text-gray-700">{formatDate(lastVisit.period.start)}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
