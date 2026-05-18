'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageHeader, StatTile } from '@/components/app-ui';

type Autopsy = {
  predicted_low: number | null;
  predicted_high: number | null;
  actual_impressions: number;
  delta_vs_midpoint: number;
  outcome: string;
  summary: string;
  lessons: string[];
  generated_at: string;
};

export default function AutopsyPage() {
  const params = useParams<{ postId: string }>();
  const [autopsy, setAutopsy] = useState<Autopsy | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAutopsy() {
      const response = await fetch(`/api/autopsy/${params.postId}`);
      const body = (await response.json()) as { autopsy?: Autopsy; error?: string };
      if (!response.ok || !body.autopsy) {
        setError(body.error ?? 'Unable to generate autopsy');
        return;
      }
      setAutopsy(body.autopsy);
    }
    void loadAutopsy();
  }, [params.postId]);

  return (
    <>
      <PageHeader
        eyebrow="Post autopsy"
        title="Compare prediction with reality"
        description="See whether the post beat, missed, or matched its expected range and capture the lesson while the context is still fresh."
      />

      {error ? <section className="card">Error: {error}</section> : null}

      {autopsy ? (
        <>
          <div className="stat-grid">
            <StatTile label="Expected low" value={autopsy.predicted_low ?? 'n/a'} note="Prediction range" />
            <StatTile label="Expected high" value={autopsy.predicted_high ?? 'n/a'} note="Prediction range" />
            <StatTile label="Actual reach" value={autopsy.actual_impressions} note="Latest snapshot" />
            <StatTile label="Delta" value={autopsy.delta_vs_midpoint} note="Vs midpoint" />
          </div>

          <div className="grid-2" style={{ marginTop: '1rem' }}>
            <section className="card">
              <p className="eyebrow">{autopsy.outcome.replace('_', ' ')}</p>
              <h2>{autopsy.summary}</h2>
              <p className="muted">Generated {new Date(autopsy.generated_at).toLocaleString()}</p>
            </section>
            <section className="card">
              <h2>Lessons</h2>
              <ul className="signal-list">
                {autopsy.lessons.map((lesson) => <li key={lesson}>{lesson}</li>)}
              </ul>
            </section>
          </div>
        </>
      ) : (
        <section className="card">
          <p className="empty-state">Building autopsy...</p>
        </section>
      )}
    </>
  );
}
