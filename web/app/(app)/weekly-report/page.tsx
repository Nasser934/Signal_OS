'use client';

import { useState } from 'react';

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
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setError(null);
    try {
      const res = await fetch('/api/weekly-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          const errBody = await res.json();
          setError(errBody.error ?? `Request failed with status ${res.status}`);
        } else {
          setError(`Request failed with status ${res.status}`);
        }
        setReport(null);
        return;
      }
      const body = (await res.json()) as { report: Report | null };
      setReport(body.report);
    } catch (err) {
      setError(`Network error: ${err instanceof Error ? err.message : 'Failed to generate report'}`);
      setReport(null);
    }
  }

  return (
    <>
      <h1>Weekly Report</h1>
      <section className="card">
        <button onClick={generate}>Generate report</button>
        {error ? <p style={{ color: 'red' }}>Error: {error}</p> : null}
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
