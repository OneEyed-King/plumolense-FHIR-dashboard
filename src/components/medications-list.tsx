import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MedicationRequest } from "@/lib/fhir-types";
import { formatDate } from "@/lib/utils";

export function MedicationsList({ medications }: { medications: MedicationRequest[] }) {
  const active = medications.filter((m) => m.status === "active");
  const sorted = [...active].sort(
    (a, b) => new Date(b.authoredOn ?? 0).getTime() - new Date(a.authoredOn ?? 0).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Medications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sorted.length === 0 && <p className="text-sm text-gray-500">No active medications.</p>}
        {sorted.map((m) => {
          const name = m.medicationCodeableConcept?.text ?? m.medicationCodeableConcept?.coding?.[0]?.display ?? "Unknown medication";
          const dosage = m.dosageInstruction?.[0]?.text;
          return (
            <div key={m.id ?? name + m.authoredOn} className="flex items-start justify-between gap-3 border-b border-border pb-2 last:border-0 last:pb-0">
              <div>
                <div className="text-sm font-medium text-gray-900">{name}</div>
                {dosage && <div className="mt-0.5 text-xs text-gray-500">{dosage}</div>}
                <div className="mt-0.5 text-xs text-gray-400">Started {formatDate(m.authoredOn)}</div>
              </div>
              <Badge tone="blue">{m.status}</Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
