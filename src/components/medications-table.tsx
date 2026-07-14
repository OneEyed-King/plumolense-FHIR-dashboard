import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill } from "lucide-react";
import type { MedicationRequest } from "@/lib/fhir-types";
import { formatDate } from "@/lib/utils";

const statusTone: Record<string, "green" | "gray" | "amber"> = {
  active: "green",
  completed: "gray",
  stopped: "amber",
};

export function MedicationsTable({ medications }: { medications: MedicationRequest[] }) {
  const sorted = [...medications].sort(
    (a, b) => new Date(b.authoredOn ?? 0).getTime() - new Date(a.authoredOn ?? 0).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <Pill className="h-4 w-4 text-primary" />
          Medications
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {sorted.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">No medications recorded.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Medication</th>
                <th className="px-4 py-2">Dosage</th>
                <th className="px-4 py-2 font-mono">Started</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sorted.map((m) => {
                const name =
                  m.medicationCodeableConcept?.text ??
                  m.medicationCodeableConcept?.coding?.[0]?.display ??
                  "Unknown medication";
                return (
                  <tr key={m.id ?? name + m.authoredOn}>
                    <td className="px-4 py-2.5 font-medium text-gray-900">{name}</td>
                    <td className="px-4 py-2.5 text-gray-600">{m.dosageInstruction?.[0]?.text ?? "—"}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-gray-500">{formatDate(m.authoredOn)}</td>
                    <td className="px-4 py-2.5">
                      <Badge tone={statusTone[m.status ?? ""] ?? "gray"}>{m.status}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
