"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function PhysicianBrief({ patientId }: { patientId: string }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{ headline: string; points: string[] } | null>(null);
  const [generatedAt, setGeneratedAt] = React.useState<string | null>(null);

  const generate = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      setResult(data);
      setGeneratedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  // Auto-generate the brief as soon as the page loads, instead of waiting for a click.
  React.useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const mid = result ? Math.ceil(result.points.length / 2) : 0;
  const leftPoints = result?.points.slice(0, mid) ?? [];
  const rightPoints = result?.points.slice(mid) ?? [];

  return (
    <Card className="border-primary/20 bg-primary/[0.03]">
      <CardHeader className="flex-row items-center justify-between space-y-0 border-b-0 pb-0">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          AI Physician Brief
        </div>
        <Button size="sm" variant="outline" onClick={generate} disabled={loading}>
          {loading ? "Generating…" : result ? "Regenerate" : "Generate"}
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}
        {!error && !result && !loading && (
          <p className="text-sm text-muted-foreground">
            Generate an AI-assisted pre-visit brief summarizing what matters today for this patient.
          </p>
        )}
        {loading && <p className="text-sm text-muted-foreground">Analyzing chart…</p>}
        {result && (
          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <h3 className="font-display text-lg font-semibold text-gray-900">{result.headline}</h3>
              {generatedAt && (
                <span className="text-xs text-muted-foreground">Summarized from FHIR · {generatedAt}</span>
              )}
            </div>
            <div className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
              <ul className="space-y-1.5">
                {leftPoints.map((p, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-muted-foreground">•</span>
                    {p}
                  </li>
                ))}
              </ul>
              <ul className="space-y-1.5">
                {rightPoints.map((p, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-muted-foreground">•</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
