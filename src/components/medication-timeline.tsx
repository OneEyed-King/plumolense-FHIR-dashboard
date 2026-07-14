import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MedicationRequest } from "@/lib/fhir-types";
import { formatDate } from "@/lib/utils";

const statusTone: Record<string, "green" | "gray" | "amber"> = {
  active: "green",
  completed: "gray",
  stopped: "amber",
};

export function MedicationTimeline({ medications }: { medications: MedicationRequest[] }) {
  const sorted = [...medications].sort(
    (a, b) => new Date(a.authoredOn ?? 0).getTime() - new Date(b.authoredOn ?? 0).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medication Progression</CardTitle>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 && <p className="text-sm text-gray-500">No medications recorded.</p>}
        <ol className="relative space-y-4 border-l border-border pl-4">
          {sorted.map((m) => {
            const name =
              m.medicationCodeableConcept?.text ??
              m.medicationCodeableConcept?.coding?.[0]?.display ??
              "Unknown medication";
            return (
              <li key={m.id ?? name + m.authoredOn} className="relative">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{formatDate(m.authoredOn)}</span>
                  <Badge tone={statusTone[m.status ?? ""] ?? "gray"}>{m.status}</Badge>
                </div>
                <div className="mt-0.5 text-sm text-gray-700">{name}</div>
                {m.dosageInstruction?.[0]?.text && (
                  <div className="mt-0.5 text-xs text-gray-500">{m.dosageInstruction[0].text}</div>
                )}
                {m.note?.[0]?.text && <div className="mt-0.5 text-xs text-gray-400">{m.note[0].text}</div>}
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
