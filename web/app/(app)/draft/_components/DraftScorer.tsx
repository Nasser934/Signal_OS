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
      setHistory((prev) => [entry, ...prev].slice(0, 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="grid-2">
        <section className="card">
          <label htmlFor="draft-text">Draft text</label>
          <textarea
            id="draft-text"
            rows={10}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Write the post you are thinking about publishing..."
          />

          <div className="form-grid">
            <div>
              <label htmlFor="draft-topic">Topic</label>
              <input id="draft-topic" value={topic} onChange={(event) => setTopic(event.target.value)} />
            </div>
            <div>
              <label htmlFor="draft-audience">Audience</label>
              <input id="draft-audience" value={audience} onChange={(event) => setAudience(event.target.value)} />
            </div>
            <div>
              <label htmlFor="draft-tone">Tone</label>
              <input id="draft-tone" value={tone} onChange={(event) => setTone(event.target.value)} />
            </div>
          </div>

          <div className="inline-actions">
            <button onClick={onScore} disabled={!canScore}>
              {loading ? 'Scoring...' : 'Score draft'}
            </button>
            {runId ? <Link className="button-link secondary" href={`/scorecard/${runId}`}>Share scorecard</Link> : null}
          </div>
        </section>

        <div className="stack">
          <section className="card">
            {result ? (
              <>
                <div className="split-row">
                  <div>
                    <p className="eyebrow">Current read</p>
                    <h2>{result.explanation}</h2>
                  </div>
                  <div className="score-badge">{result.totalScore}</div>
                </div>
                <ul className="signal-list">
                  <li><strong>Top strength:</strong> {result.topStrength || 'No clear strength yet.'}</li>
                  <li><strong>Biggest weakness:</strong> {result.biggestWeakness || 'No clear weakness detected.'}</li>
                </ul>
              </>
            ) : (
              <>
                <p className="eyebrow">What you will get</p>
                <h2>A fast publishing decision</h2>
                <p className="empty-state">Score the draft to see its strongest signal, weakest point, and the fixes most likely to improve performance.</p>
              </>
            )}
          </section>

          <section className="card">
            <h3>Recent versions</h3>
            {history.length ? (
              <ul className="timeline">
                {history.map((item) => (
                  <li key={item.id}>
                    <Link href={`/scorecard/${item.id}`}>
                      {item.score.totalScore}/100 - {new Date(item.createdAt).toLocaleString()}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">Saved versions appear here after your first score.</p>
            )}
          </section>
        </div>
      </div>

      {error ? <section className="card">Error: {error}</section> : null}

      {result ? (
        <div className="grid-2">
          <section className="card">
            <h2>Score breakdown</h2>
            {result.components.map((component) => (
              <div className="component-row" key={component.name}>
                <div className="split-row">
                  <strong>{component.name}</strong>
                  <span>{component.score}/100</span>
                </div>
                <div className="meter"><span style={{ width: `${component.score}%` }} /></div>
                <small className="muted">{component.rationale}</small>
              </div>
            ))}
          </section>

          <section className="card">
            <h2>Rewrite priorities</h2>
            <ul className="signal-list">
              {result.rewriteRecommendations.map((recommendation) => (
                <li key={recommendation}>{recommendation}</li>
              ))}
            </ul>
            <div className="inline-actions" style={{ marginTop: '1rem' }}>
              <Link className="button-link" href="/publish">Continue to publish</Link>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
