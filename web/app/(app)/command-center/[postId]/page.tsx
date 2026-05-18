'use client';

import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { ApiMode, MetricPoint } from '@/lib/store/localStore';

const CHECKPOINTS: MetricPoint['checkpoint'][] = ['10m', '30m', '60m', '24h', '7d'];

export default function CommandCenterPage() {
  const params = useParams<{ postId: string }>();
  const [metrics, setMetrics] = useState<MetricPoint[]>([]);
  const [mode, setMode] = useState<ApiMode>('manual');
  const [checkpoint, setCheckpoint] = useState<MetricPoint['checkpoint']>('10m');
  const [error, setError] = useState<string | null>(null);

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

  async function fetchCheckpoint() {
    setError(null);
    try {
      const response = await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, postId: params.postId }),
      });
      const body = (await response.json()) as {
        result?: {
          source: MetricPoint['source'];
          capturedAt: string;
          metrics: Partial<MetricPoint>;
        };
        error?: string;
      };
      if (!response.ok || !body.result) {
        setError(body.error ?? 'Failed to capture metrics');
        return;
      }
      const item: MetricPoint = {
        postId: params.postId,
        checkpoint,
        capturedAt: body.result.capturedAt,
        source: body.result.source,
        impressions: Number(body.result.metrics.impressions ?? 0),
        likes: Number(body.result.metrics.likes ?? 0),
        replies: Number(body.result.metrics.replies ?? 0),
        reposts: Number(body.result.metrics.reposts ?? 0),
        bookmarks: Number(body.result.metrics.bookmarks ?? 0),
      };
      setMetrics((prev) => [item, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  const latest = useMemo(() => metrics[0], [metrics]);

  return (
    <>
      <h1>Command Center</h1>
      <section className="card">
        <p>Post ID: {params.postId}</p>
        <label htmlFor="checkpoint">Checkpoint</label>
        <select
          id="checkpoint"
          value={checkpoint}
          onChange={(e) => setCheckpoint(e.target.value as MetricPoint['checkpoint'])}
        >
          {CHECKPOINTS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button onClick={fetchCheckpoint}>Capture metrics</button>
        {error ? <p>Error: {error}</p> : null}
      </section>
      {latest ? (
        <section className="card">
          <h3>Latest snapshot ({latest.checkpoint})</h3>
          <p>
            Impressions: {latest.impressions} | Likes: {latest.likes} | Replies: {latest.replies}
          </p>
        </section>
      ) : null}
      <section className="card">
        <h3>History</h3>
        <ul>
          {metrics.map((m) => (
            <li key={`${m.capturedAt}-${m.checkpoint}`}>
              {m.checkpoint} — {m.impressions} impressions ({m.source})
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
