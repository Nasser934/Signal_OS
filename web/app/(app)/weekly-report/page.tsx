'use client';

import { useState } from 'react';
import { STORE_KEYS, readJson, type MetricPoint } from '@/lib/store/localStore';
import type { StoredDraftRun } from '@/types/scoring';

type Report = {
  generatedAt: string;
  topicInsights: string;
  predictionAccuracy: string;
  nextWeekActions: string[];
  averageScore: number;
  averageImpressions: number;
};

export default function WeeklyReportPage() {
  const [report, setReport] = useState<Report | null>(null);

  async function generate() {
    const runs = readJson<StoredDraftRun[]>(STORE_KEYS.draftRuns, []);
    const metrics = readJson<MetricPoint[]>(STORE_KEYS.metrics, []);
    const posts = metrics.map((m) => ({
      score: runs[0]?.score.totalScore ?? 0,
      impressions: m.impressions,
      topic: runs[0]?.topic ?? 'general',
    }));

    const res = await fetch('/api/weekly-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ posts }),
    });
    const body = (await res.json()) as { report: Report | null };
    setReport(body.report);
  }

  return (
    <>
      <h1>Weekly Report</h1>
      <section className="card">
        <button onClick={generate}>Generate report</button>
      </section>
      {report ? (
        <section className="card">
          <p>{report.averageScore}</p>
          <ul>
            {report.nextWeekActions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
