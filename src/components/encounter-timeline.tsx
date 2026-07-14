import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Encounter } from "@/lib/fhir-types";
import { formatDateTime } from "@/lib/utils";

const classTone: Record<string, "red" | "amber" | "blue" | "gray"> = {
  EMER: "red",
  AMB: "blue",
  IMP: "amber",
};

export function EncounterTimeline({ encounters }: { encounters: Encounter[] }) {
  const sorted = [...encounters].sort(
    (a, b) => new Date(b.period?.start ?? 0).getTime() - new Date(a.period?.start ?? 0).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Encounter Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 && <p className="text-sm text-gray-500">No encounters recorded.</p>}
        <ol className="relative space-y-4 border-l border-border pl-4">
          {sorted.map((e) => {
            const type = e.type?.[0]?.coding?.[0]?.display ?? e.type?.[0]?.text ?? "Encounter";
            const cls = e.class?.code ?? "AMB";
            return (
              <li key={e.id} className="relative">
                <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{formatDateTime(e.period?.start)}</span>
                  <Badge tone={classTone[cls] ?? "gray"}>{cls}</Badge>
                  <Badge tone="gray">{e.status}</Badge>
                </div>
                <div className="mt-0.5 text-sm text-gray-600">{type}</div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
