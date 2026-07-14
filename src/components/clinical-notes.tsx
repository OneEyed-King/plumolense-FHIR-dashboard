import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Composition, DiagnosticReport } from "@/lib/fhir-types";
import { formatDateTime } from "@/lib/utils";

interface NoteItem {
  date: string;
  kind: "note" | "report";
  title: string;
  body: React.ReactNode;
}

export function ClinicalNotes({
  compositions,
  diagnosticReports,
}: {
  compositions: Composition[];
  diagnosticReports: DiagnosticReport[];
}) {
  const noteItems: NoteItem[] = compositions.map((c) => ({
    date: c.date ?? "",
    kind: "note",
    title: c.title ?? "Progress note",
    body: (
      <div className="space-y-2">
        {c.section?.map((s, i) => (
          <div key={i}>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">{s.title}</div>
            <div
              className="mt-0.5 text-sm text-gray-700"
              dangerouslySetInnerHTML={{ __html: stripDivWrapper(s.text.div) }}
            />
          </div>
        ))}
      </div>
    ),
  }));

  const reportItems: NoteItem[] = diagnosticReports.map((r) => ({
    date: r.effectiveDateTime ?? r.issued ?? "",
    kind: "report",
    title: r.code.text ?? r.code.coding?.[0]?.display ?? "Diagnostic Report",
    body: <p className="text-sm text-gray-700">{r.conclusion ?? "No conclusion recorded."}</p>,
  }));

  const items = [...noteItems, ...reportItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes &amp; Diagnostic Reports</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length === 0 && <p className="text-sm text-gray-500">No notes or reports recorded.</p>}
        {items.map((item, idx) => (
          <details key={idx} className="rounded-md border border-border">
            <summary className="flex cursor-pointer items-center justify-between gap-3 px-3 py-2 text-sm font-medium text-gray-900">
              <span>{item.title}</span>
              <span className="flex items-center gap-2 text-xs font-normal text-gray-400">
                {formatDateTime(item.date)}
                <Badge tone={item.kind === "note" ? "blue" : "gray"}>
                  {item.kind === "note" ? "SOAP note" : "Report"}
                </Badge>
              </span>
            </summary>
            <div className="border-t border-border px-3 py-2">{item.body}</div>
          </details>
        ))}
      </CardContent>
    </Card>
  );
}

// Narrative divs come as `<div xmlns='...'>...inner html...</div>` — strip the wrapper
// since we render our own container and just want the inner markup.
function stripDivWrapper(div: string): string {
  return div.replace(/^<div[^>]*>/, "").replace(/<\/div>$/, "");
}
