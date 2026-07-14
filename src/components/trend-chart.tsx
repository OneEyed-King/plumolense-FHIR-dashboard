"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { findByCode } from "@/lib/observations";
import type { Observation } from "@/lib/fhir-types";

export interface TrendSeries {
  label: string;
  codes: string[];
  color: string;
  unit?: string;
}

function buildSeriesData(observations: Observation[], series: TrendSeries[]) {
  const rows = new Map<string, Record<string, string | number>>();
  for (const s of series) {
    const matches = findByCode(observations, s.codes);
    for (const o of matches) {
      const value = o.valueQuantity?.value;
      if (!o.effectiveDateTime || value === undefined) continue;
      const dateKey = o.effectiveDateTime.slice(0, 10);
      const row = rows.get(dateKey) ?? { date: dateKey };
      row[s.label] = value;
      rows.set(dateKey, row);
    }
  }
  return Array.from(rows.values()).sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

export function TrendChart({
  title,
  observations,
  series,
  unitLabel,
}: {
  title: string;
  observations: Observation[];
  series: TrendSeries[];
  unitLabel?: string;
}) {
  const data = buildSeriesData(observations, series);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {title}
          {unitLabel && <span className="ml-1 font-normal text-gray-400">({unitLabel})</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-gray-500">No data points recorded.</p>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {series.map((s) => (
                  <Line
                    key={s.label}
                    type="monotone"
                    dataKey={s.label}
                    stroke={s.color}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
