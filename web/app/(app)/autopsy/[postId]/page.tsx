'use client';

import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { PageHeader, StatTile } from '@/components/app-ui';
import type { MetricPoint } from '@/lib/store/localStore';

export default function AutopsyPage() {
  const params = useParams<{ postId: string }>();
  const [metrics, setMetrics] = useState<MetricPoint[]>([]);

  useEffect(() => {
    async function loadMetrics() {
      const response = await fetch(`/api/metrics?postId=${params.postId}`);
      if (!response.ok) return;
      const body = (await response.json()) as {
        items?: Array<{
          post_id: string;
          captured_at: string;
          source: MetricPoint['source'];
          impressions: number;
          likes: number;
          replies: number;
          reposts: number;
          bookmarks: number;
        }>;
      };
      setMetrics((body.items ?? []).map((item) => ({
        postId: item.post_id,
        checkpoint: '10m',
        capturedAt: item.captured_at,
        source: item.source,
        impressions: item.impressions,
        likes: item.likes,
        replies: item.replies,
        reposts: item.reposts,
        bookmarks: item.bookmarks,
      })));
    }
    void loadMetrics();
  }, [params.postId]);

  const view = useMemo(() => {
    const latest = metrics[0];
    const actualImpressions = latest?.impressions ?? 0;
    const expectedImpressions = 0;
    const delta = actualImpressions - expectedImpressions;
    return { actualImpressions, expectedImpressions, delta, latest };
  }, [metrics]);

  return (
    <>
      <PageHeader
        eyebrow="Post autopsy"
        title="Read the outcome, not just the activity"
        description="This is where Signal OS should explain the gap between expectation and reality. The current version now uses live stored metrics, with richer prediction comparison still remaining."
      />

      <div className="stat-grid">
        <StatTile label="Actual impressions" value={view.actualImpressions} note="Latest stored snapshot" />
        <StatTile label="Expected impressions" value={view.expectedImpressions} note="Prediction model pending" />
        <StatTile label="Delta" value={view.delta} note="Actual minus expected" />
        <StatTile label="Snapshots" value={metrics.length} note="Captured points" />
      </div>

      <div className="grid-2" style={{ marginTop: '1rem' }}>
        <section className="card">
          <h2>What happened</h2>
          {view.latest ? (
            <ul className="signal-list">
              <li>{view.latest.impressions} impressions captured at the latest checkpoint.</li>
              <li>{view.latest.likes} likes, {view.latest.replies} replies, {view.latest.bookmarks} bookmarks.</li>
              <li>Source mode: {view.latest.source}.</li>
            </ul>
          ) : (
            <p className="empty-state">No stored metrics yet for this post.</p>
          )}
        </section>

        <section className="card">
          <h2>What is still missing</h2>
          <ul className="signal-list">
            <li>Prediction-vs-actual comparison tied to the scored draft.</li>
            <li>Reason codes for overperformance and underperformance.</li>
            <li>Account-specific lessons learned from this result.</li>
          </ul>
        </section>
      </div>
    </>
  );
}
