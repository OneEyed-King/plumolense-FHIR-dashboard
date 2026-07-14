import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AllergyIntolerance } from "@/lib/fhir-types";

export function AllergyList({ allergies }: { allergies: AllergyIntolerance[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Allergies &amp; Intolerances</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {allergies.length === 0 && <p className="text-sm text-gray-500">No known allergies recorded.</p>}
        {allergies.map((a) => {
          const name = a.code?.text ?? a.code?.coding?.[0]?.display ?? "Unknown allergen";
          const reaction = a.reaction?.[0]?.manifestation?.[0]?.text ?? a.reaction?.[0]?.manifestation?.[0]?.coding?.[0]?.display;
          return (
            <div key={a.id ?? name} className="flex items-start justify-between gap-3 border-b border-border pb-2 last:border-0 last:pb-0">
              <div>
                <div className="text-sm font-medium text-gray-900">{name}</div>
                {reaction && <div className="mt-0.5 text-xs text-gray-500">Reaction: {reaction}</div>}
              </div>
              {a.criticality && (
                <Badge tone={a.criticality === "high" ? "red" : "gray"}>{a.criticality}</Badge>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
