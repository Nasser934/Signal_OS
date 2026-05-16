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

  async function generate() {
    const res = await fetch('/api/weekly-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        posts: [
          { score: 81, impressions: 2200, topic: 'distribution' },
          { score: 63, impressions: 900, topic: 'product' },
          { score: 74, impressions: 1500, topic: 'growth' },
        ],
      }),
    });
    const body = (await res.json()) as { report: Report | null };
    setReport(body.report);
  }

  return (
    <>
      <h1>Weekly Report</h1>
      <section className="card"><button onClick={generate}>Generate report</button></section>
      {report ? (
        <section className="card">
          <p>Generated at: {new Date(report.generatedAt).toLocaleString()}</p>
          <p>Average score: {report.averageScore}</p>
          <p>Average impressions: {report.averageImpressions}</p>
          <p><strong>Topic insights:</strong> {report.topicInsights}</p>
          <p><strong>Prediction accuracy:</strong> {report.predictionAccuracy}</p>
          <h3>Next-week actions</h3>
          <ul>{report.nextWeekActions.map((a, i) => <li key={i}>{a}</li>)}</ul>
        </section>
      ) : null}
    </>
  );
}
