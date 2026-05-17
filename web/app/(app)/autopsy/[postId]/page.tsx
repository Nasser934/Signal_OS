'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { STORE_KEYS, readJson, type MetricPoint } from '@/lib/store/localStore';
import type { StoredDraftRun } from '@/types/scoring';

export default function AutopsyPage() {
  const params = useParams<{ postId: string }>();
  const view = useMemo(() => {
    const runs = readJson<StoredDraftRun[]>(STORE_KEYS.draftRuns, []);
    const postMetrics = readJson<MetricPoint[]>(STORE_KEYS.metrics, []).filter(
      (m) => m.postId === params.postId
    );
    const predicted = runs[0]?.score.totalScore ?? 0;
    const actualImpressions = postMetrics[0]?.impressions ?? 0;
    const expectedImpressions = Math.round(predicted * 20);
    const delta = actualImpressions - expectedImpressions;
    return { predicted, actualImpressions, expectedImpressions, delta };
  }, [params.postId]);

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
    </>
  );
}
