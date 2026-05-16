'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { STORE_KEYS, readJson } from '@/lib/store/localStore';
import type { StoredDraftRun } from '@/types/scoring';

export default function ScorecardPage() {
  const params = useParams<{ runId: string }>();
  const [item, setItem] = useState<StoredDraftRun | null>(null);

  useEffect(() => {
    const list = readJson<StoredDraftRun[]>(STORE_KEYS.draftRuns, []);
    setItem(list.find((entry) => entry.id === params.runId) ?? null);
  }, [params.runId]);

  if (!item) return <main><h1>Scorecard not found</h1></main>;

  return (
    <main>
      <h1>Signal OS Scorecard</h1>
      <p>Score: <strong>{item.score.totalScore}/100</strong></p>
      <p>{item.score.explanation}</p>
      <p><strong>Top strength:</strong> {item.score.topStrength}</p>
      <p><strong>Biggest weakness:</strong> {item.score.biggestWeakness}</p>
      <pre>{item.text}</pre>
    </main>
  );
}
