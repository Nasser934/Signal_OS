'use client';

import { useState } from 'react';
import { LoopRail, PageHeader, StatTile } from '@/components/app-ui';

type Report = {
  generatedAt: string;
  topicInsights: string;
  predictionAccuracy: string;
  nextWeekActions: string[];
  averageScore: number;
  averageImpressions: number;
  bestPost?: { score: number; impressions: number; topic: string };
  worstPost?: { score: number; impressions: number; topic: string };
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
      <PageHeader
        eyebrow="Weekly review"
        title="Turn tracked posts into next-week decisions"
        description="Close the loop by seeing what worked, what missed, and which behaviors deserve another week of attention."
      />
      <LoopRail active="Learn" />

      <section className="card">
        <div className="inline-actions">
          <button onClick={generate}>Generate report</button>
        </div>
        {error ? <p style={{ color: 'var(--danger)', marginTop: '1rem' }}>Error: {error}</p> : null}
      </section>

      {report ? (
        <>
          <div className="stat-grid">
            <StatTile label="Average score" value={report.averageScore} note="Predicted quality" />
            <StatTile label="Average impressions" value={report.averageImpressions} note="Observed reach" />
            <StatTile label="Best topic" value={report.bestPost?.topic ?? 'n/a'} note="Highest reach" />
            <StatTile label="Generated" value={new Date(report.generatedAt).toLocaleDateString()} note="Latest review" />
          </div>

          <div className="grid-2" style={{ marginTop: '1rem' }}>
            <section className="card">
              <h2>What the week says</h2>
              <ul className="signal-list">
                <li>{report.topicInsights}</li>
                <li>{report.predictionAccuracy}</li>
                <li>Best post: {report.bestPost?.topic ?? 'n/a'} with {report.bestPost?.impressions ?? 0} impressions.</li>
                <li>Weakest post: {report.worstPost?.topic ?? 'n/a'} with {report.worstPost?.impressions ?? 0} impressions.</li>
              </ul>
            </section>

            <section className="card">
              <h2>Next-week actions</h2>
              <ul className="signal-list">
                {report.nextWeekActions.map((action) => <li key={action}>{action}</li>)}
              </ul>
            </section>
          </div>
        </>
      ) : (
        <section className="card">
          <p className="empty-state">Generate a report after you have tracked a few live posts.</p>
        </section>
      )}
    </>
  );
}
