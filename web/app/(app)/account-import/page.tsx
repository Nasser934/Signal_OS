'use client';

import { useEffect, useState } from 'react';
import { PageHeader, StatTile } from '@/components/app-ui';

type Baseline = {
  sample_size: number;
  avg_impressions: number;
  median_impressions: number;
  avg_engagement_rate: number;
  recommended_window: string | null;
  x_accounts?: { handle?: string; display_name?: string } | Array<{ handle?: string; display_name?: string }>;
};

const exampleRows = `2026-05-10T09:00:00Z | We shipped a new onboarding flow today | 1800 | 72 | 18 | 6 | 12
2026-05-11T14:00:00Z | Three lessons from our first 100 users | 2400 | 110 | 24 | 8 | 20
2026-05-12T09:00:00Z | A pricing mistake we fixed this week | 1500 | 61 | 9 | 4 | 10`;

export default function AccountImportPage() {
  const [handle, setHandle] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [rawPosts, setRawPosts] = useState(exampleRows);
  const [baseline, setBaseline] = useState<Baseline | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function load() {
      const response = await fetch('/api/account/import');
      if (!response.ok) return;
      const body = (await response.json()) as { baseline?: Baseline };
      setBaseline(body.baseline ?? null);
    }
    void load();
  }, []);

  async function onImport() {
    const posts = rawPosts
      .split('\n')
      .map((line) => line.split('|').map((part) => part.trim()))
      .filter((parts) => parts.length >= 4)
      .map(([postedAt, text, impressions, likes = '0', replies = '0', reposts = '0', bookmarks = '0']) => ({
        postedAt,
        text,
        impressions: Number(impressions),
        likes: Number(likes),
        replies: Number(replies),
        reposts: Number(reposts),
        bookmarks: Number(bookmarks),
      }));
    const response = await fetch('/api/account/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle, displayName, posts }),
    });
    const body = (await response.json()) as { baseline?: Baseline; error?: string };
    if (!response.ok || !body.baseline) {
      setMessage(body.error ?? 'Import failed');
      return;
    }
    setBaseline(body.baseline);
    setMessage('Account baseline generated.');
  }

  const account = Array.isArray(baseline?.x_accounts) ? baseline?.x_accounts[0] : baseline?.x_accounts;

  return (
    <>
      <PageHeader
        eyebrow="Account baseline"
        title="Import history before asking the model to learn"
        description="Add a small batch of historical posts first. Signal OS uses that sample to calibrate future predictions against your actual account."
      />

      <div className="grid-2">
        <section className="card">
          <div className="form-grid">
            <div>
              <label htmlFor="handle">X handle</label>
              <input id="handle" value={handle} onChange={(event) => setHandle(event.target.value)} placeholder="@signalos" />
            </div>
            <div>
              <label htmlFor="displayName">Display name</label>
              <input id="displayName" value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
            </div>
          </div>
          <label htmlFor="posts">Historical posts</label>
          <textarea id="posts" rows={10} value={rawPosts} onChange={(event) => setRawPosts(event.target.value)} />
          <p className="muted">Format: ISO date | text | impressions | likes | replies | reposts | bookmarks</p>
          <button onClick={onImport}>Import and build baseline</button>
          {message ? <p style={{ marginTop: '1rem' }}>{message}</p> : null}
        </section>

        <section className="card">
          <p className="eyebrow">Why this matters</p>
          <h2>Prediction gets better when it knows your normal</h2>
          <ul className="signal-list">
            <li>Average reach becomes the default yardstick.</li>
            <li>Best and weakest historical posts expose account patterns.</li>
            <li>Recommended posting windows stop being generic advice.</li>
          </ul>
        </section>
      </div>

      {baseline ? (
        <>
          <div className="stat-grid">
            <StatTile label="Account" value={`@${account?.handle ?? handle}`} note={account?.display_name ?? 'Imported manually'} />
            <StatTile label="Sample size" value={baseline.sample_size} note="Historical posts" />
            <StatTile label="Average reach" value={baseline.avg_impressions} note="Impressions" />
            <StatTile label="Best window" value={baseline.recommended_window ?? 'n/a'} note="From imported sample" />
          </div>
          <div className="grid-2" style={{ marginTop: '1rem' }}>
            <section className="card">
              <h2>Baseline read</h2>
              <ul className="signal-list">
                <li>Median impressions: {baseline.median_impressions}</li>
                <li>Average engagement rate: {(baseline.avg_engagement_rate * 100).toFixed(2)}%</li>
                <li>This baseline will now guide future prediction ranges.</li>
              </ul>
            </section>
            <section className="card">
              <h2>Next step</h2>
              <p className="empty-state">Score a new draft so Signal OS can compare the prediction against your account history.</p>
            </section>
          </div>
        </>
      ) : null}
    </>
  );
}
