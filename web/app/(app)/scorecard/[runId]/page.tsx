'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { STORE_KEYS, readJson } from '@/lib/store/localStore';
import type { StoredDraftRun } from '@/types/scoring';

export default function ScorecardPage() {
  const params = useParams<{ runId: string }>();
  const [item, setItem] = useState<StoredDraftRun | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`/api/scorecards/${params.runId}`);
        if (response.ok) {
          const body = (await response.json()) as { item: StoredDraftRun };
          setItem(body.item);
          return;
        }

        const list = readJson<StoredDraftRun[]>(STORE_KEYS.draftRuns, []);
        setItem(list.find((entry) => entry.id === params.runId) ?? null);
      } catch {
        const list = readJson<StoredDraftRun[]>(STORE_KEYS.draftRuns, []);
        setItem(list.find((entry) => entry.id === params.runId) ?? null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params.runId]);

  if (loading) {
    return <><h1>Loading...</h1></>;
  }

  if (!item) {
    return <><h1>Scorecard not found</h1></>;
  }

  return (
    <>
      <h1>Signal OS Scorecard</h1>
      <p>
        Score: <strong>{item.score.totalScore}/100</strong>
      </p>
      <p>{item.score.explanation}</p>
      <p><strong>Top strength:</strong> {item.score.topStrength}</p>
      <p><strong>Biggest weakness:</strong> {item.score.biggestWeakness}</p>
      <pre>{item.text}</pre>
    </>
  );
}
