'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export default function AutopsyPage() {
  const params = useParams<{ postId: string }>();

  const view = useMemo(() => {
    const predicted = 74;
    const actualImpressions = 1200;
    const expectedImpressions = 1500;
    const delta = actualImpressions - expectedImpressions;
    return { predicted, actualImpressions, expectedImpressions, delta };
  }, []);

  return (
    <>
      <h1>Post Autopsy</h1>
      <section className="card">
        <p>Post ID: {params.postId}</p>
        <p>Predicted score: {view.predicted}/100</p>
        <p>Expected impressions: {view.expectedImpressions}</p>
        <p>Actual impressions: {view.actualImpressions}</p>
        <p>Delta: {view.delta}</p>
      </section>
      <section className="card">
        <h3>Repeat / Stop / Test</h3>
        <ul>
          <li>Repeat: Start with outcome-first hooks.</li>
          <li>Stop: Dense middle sections without line breaks.</li>
          <li>Test: End with one polarizing but respectful question.</li>
        </ul>
      </section>
    </>
  );
}
