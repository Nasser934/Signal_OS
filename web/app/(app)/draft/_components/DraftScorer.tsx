'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { ScoreOutput } from '@/lib/scoringClient';
import type { StoredDraftRun } from '@/types/scoring';

export function DraftScorer() {
  const [text, setText] = useState('');
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('');
  const [result, setResult] = useState<ScoreOutput | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [history, setHistory] = useState<StoredDraftRun[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadHistory() {
      const response = await fetch('/api/draft/score');
      if (!response.ok) return;
      const body = (await response.json()) as { items?: StoredDraftRun[] };
      setHistory(body.items ?? []);
    }
    void loadHistory();
  }, []);

  const canScore = useMemo(() => text.trim().length > 0 && !loading, [text, loading]);

  async function onScore() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/draft/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, topic, audience, tone }),
      });
      const body = (await response.json()) as { data?: ScoreOutput; error?: string; runId?: string };
      if (!response.ok || !body.data || !body.runId) {
        throw new Error(body.error ?? 'Failed to score draft');
      }

      setResult(body.data);
      setRunId(body.runId);

      const entry: StoredDraftRun = {
        id: body.runId,
        createdAt: new Date().toISOString(),
        text,
        topic,
        audience,
        tone,
        score: body.data,
      };
      const nextHistory = [entry, ...history].slice(0, 10);
      setHistory(nextHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="card">
        <label htmlFor="draft-text">Draft text</label>
        <textarea
          id="draft-text"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <label htmlFor="draft-topic">Topic</label>
        <input id="draft-topic" value={topic} onChange={(e) => setTopic(e.target.value)} />

        <label htmlFor="draft-audience">Audience</label>
        <input
          id="draft-audience"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
        />

        <label htmlFor="draft-tone">Tone</label>
        <input id="draft-tone" value={tone} onChange={(e) => setTone(e.target.value)} />

        <button onClick={onScore} disabled={!canScore}>
          {loading ? 'Scoring…' : 'Score draft'}
        </button>
      </section>

      {error ? <section className="card">Error: {error}</section> : null}

      {result ? (
        <section className="card">
          <h2>{result.totalScore}/100</h2>
          <p>{result.explanation}</p>
          <p><strong>Biggest weakness:</strong> {result.biggestWeakness}</p>
          <h3>Components</h3>
          <ul>
            {result.components.map((c) => (
              <li key={c.name}>{c.name}: {c.score} — {c.rationale}</li>
            ))}
          </ul>
          <h3>Rewrites</h3>
          <ul>
            {result.rewriteRecommendations.map((r) => <li key={r}>{r}</li>)}
          </ul>
          {runId ? <p><Link href={`/scorecard/${runId}`}>Open shareable scorecard</Link></p> : null}
        </section>
      ) : null}

      <section className="card">
        <h3>Recent draft versions</h3>
        <ul>
          {history.map((h) => (
            <li key={h.id}>
              <Link href={`/scorecard/${h.id}`}>
                {new Date(h.createdAt).toLocaleString()} — {h.score.totalScore}/100
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
