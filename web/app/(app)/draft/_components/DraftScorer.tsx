'use client';

import { useEffect, useState } from 'react';
import type { ScoreOutput } from '@/lib/scoringClient';

export function DraftScorer() {
  const [text, setText] = useState('');
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('');
  const [result, setResult] = useState<ScoreOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const raw = window.localStorage.getItem('signalos:draft');
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as { text?: string; topic?: string; audience?: string; tone?: string };
      setText(saved.text ?? '');
      setTopic(saved.topic ?? '');
      setAudience(saved.audience ?? '');
      setTone(saved.tone ?? '');
    } catch {
      window.localStorage.removeItem('signalos:draft');
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('signalos:draft', JSON.stringify({ text, topic, audience, tone }));
  }, [text, topic, audience, tone]);

  async function onScore() {
    setLoading(true);
    setError(null);
    const response = await fetch('/api/draft/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, topic, audience, tone }),
    });
    const body = (await response.json()) as { data?: ScoreOutput; error?: string };
    if (!response.ok || !body.data) {
      setError(body.error ?? 'Failed to score draft');
      setLoading(false);
      return;
    }
    setResult(body.data);
    setLoading(false);
  }

  return (
    <>
      <section className="card">
        <label>Draft text</label>
        <textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} />
        <label>Topic</label>
        <input value={topic} onChange={(e) => setTopic(e.target.value)} />
        <label>Audience</label>
        <input value={audience} onChange={(e) => setAudience(e.target.value)} />
        <label>Tone</label>
        <input value={tone} onChange={(e) => setTone(e.target.value)} />
        <button onClick={onScore} disabled={loading}>{loading ? 'Scoring…' : 'Score draft'}</button>
      </section>
      {error ? <section className="card">Error: {error}</section> : null}
      {result ? (
        <section className="card">
          <h2>{result.totalScore}/100</h2>
          <p>{result.explanation}</p>
          <p><strong>Biggest weakness:</strong> {result.biggestWeakness}</p>
          <h3>Components</h3>
          <ul>{result.components.map((c) => <li key={c.name}>{c.name}: {c.score} — {c.rationale}</li>)}</ul>
          <h3>Rewrites</h3>
          <ul>{result.rewriteRecommendations.map((r, i) => <li key={i}>{r}</li>)}</ul>
        </section>
      ) : null}
    </>
  );
}
