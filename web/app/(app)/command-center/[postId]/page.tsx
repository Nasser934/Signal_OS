'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { LoopRail, PageHeader, StatTile } from '@/components/app-ui';
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
  const engagementRate = latest && latest.impressions > 0
    ? (((latest.likes + latest.replies + latest.reposts + latest.bookmarks) / latest.impressions) * 100).toFixed(1)
    : '0.0';
  const nextMove = latest && latest.replies > latest.likes
    ? 'Replies are leading. Open the queue and answer the highest-value threads first.'
    : 'Capture the next checkpoint and protect momentum with timely replies.';

  return (
    <>
      <PageHeader
        eyebrow="First-hour command center"
        title="Track momentum while it still matters"
        description="Capture the next checkpoint, see the live shape of the post, and decide what deserves attention right now."
        actions={<Link className="button-link secondary" href={`/autopsy/${params.postId}`}>Open autopsy</Link>}
      />
      <LoopRail active="Track" />

      <section className="card">
        <div className="form-grid">
          <div>
            <label htmlFor="checkpoint">Checkpoint</label>
            <select id="checkpoint" value={checkpoint} onChange={(event) => setCheckpoint(event.target.value as MetricPoint['checkpoint'])}>
              {CHECKPOINTS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="mode">Capture mode</label>
            <select id="mode" value={mode} onChange={(event) => setMode(event.target.value as ApiMode)}>
              <option value="manual">Manual</option>
              <option value="full_api">Full API</option>
              <option value="byo_api_key">BYO API key</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <button onClick={fetchCheckpoint}>Capture metrics</button>
          </div>
        </div>
        {error ? <p>Error: {error}</p> : null}
      </section>

      <div className="stat-grid">
        <StatTile label="Impressions" value={latest?.impressions ?? 0} note={latest ? latest.checkpoint : 'No snapshot yet'} />
        <StatTile label="Replies" value={latest?.replies ?? 0} note="Conversation signal" />
        <StatTile label="Engagement rate" value={`${engagementRate}%`} note="Visible response" />
        <StatTile label="Bookmarks" value={latest?.bookmarks ?? 0} note="Intent signal" />
      </div>

      <div className="grid-2" style={{ marginTop: '1rem' }}>
        <section className="card">
          <p className="eyebrow">What to do now</p>
          <h2>{nextMove}</h2>
          <div className="inline-actions">
            <Link className="button-link" href="/reply-assistant">Open reply queue</Link>
            <Link className="button-link secondary" href="/weekly-report">Weekly review</Link>
          </div>
        </section>

        <section className="card">
          <h2>Checkpoint history</h2>
          {metrics.length ? (
            <ul className="timeline">
              {metrics.map((item) => (
                <li key={`${item.capturedAt}-${item.checkpoint}`}>
                  <div className="split-row">
                    <strong>{item.checkpoint}</strong>
                    <span className="pill">{item.source}</span>
                  </div>
                  <span className="muted">{item.impressions} impressions, {item.replies} replies</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">No checkpoints yet. Capture the 10m snapshot after publishing.</p>
          )}
        </section>
      </div>
    </>
  );
}
