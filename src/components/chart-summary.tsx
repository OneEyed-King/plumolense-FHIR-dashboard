"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertTriangle } from "lucide-react";

export function ChartSummary({ patientId }: { patientId: string }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{ summary: string; flags: string[] } | null>(null);

  const generate = async () => {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Chart Summary
        </CardTitle>
        <Button size="sm" variant="outline" onClick={generate} disabled={loading}>
          {loading ? "Generating…" : result ? "Regenerate" : "Generate"}
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}
        {!error && !result && !loading && (
          <p className="text-sm text-gray-500">
            Generate an AI-assisted summary of this patient&apos;s respiratory status and trajectory before your
            visit.
          </p>
        )}
        {loading && <p className="text-sm text-gray-500">Analyzing chart…</p>}
        {result && (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-gray-800">{result.summary}</p>
            {result.flags.length > 0 && (
              <div className="space-y-1.5">
                {result.flags.map((flag, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-md bg-amber-50 px-2.5 py-1.5 text-xs text-amber-800">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
