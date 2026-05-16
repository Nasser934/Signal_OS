'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type StoredDraftRun = {
  id: string;
  createdAt: string;
  text: string;
  topic?: string;
  audience?: string;
  tone?: string;
  score: {
    totalScore: number;
    explanation: string;
    biggestWeakness: string;
    topStrength: string;
    components: { name: string; score: number; rationale: string }[];
    rewriteRecommendations: string[];
    rulesVersion: string;
  };
};

export default function ScorecardPage() {
  const params = useParams<{ runId: string }>();
  const [item, setItem] = useState<StoredDraftRun | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem('signalos:draftRuns');
    if (!raw) return;
    const list = JSON.parse(raw) as StoredDraftRun[];
    setItem(list.find((entry) => entry.id === params.runId) ?? null);
  }, [params.runId]);

  if (!item) {
    return <main><h1>Scorecard not found</h1><p>Run this draft again to generate a new shareable scorecard.</p></main>;
  }

  return (
    <main>
      <h1>Signal OS Scorecard</h1>
      <p>Score: <strong>{item.score.totalScore}/100</strong></p>
      <p>{item.score.explanation}</p>
      <p><strong>Top strength:</strong> {item.score.topStrength}</p>
      <p><strong>Biggest weakness:</strong> {item.score.biggestWeakness}</p>
      <h3>Draft</h3>
      <pre>{item.text}</pre>
    </main>
  );
}
