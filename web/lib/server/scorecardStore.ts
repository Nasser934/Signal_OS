import { promises as fs } from 'fs';
import path from 'path';
import type { StoredDraftRun } from '@/types/scoring';

const STORE_FILE = path.join('/tmp', 'signalos-scorecards.json');
const LOCK_FILE = path.join('/tmp', 'signalos-scorecards.lock');

let lockPromise: Promise<void> | null = null;

async function acquireLock(): Promise<() => Promise<void>> {
  while (lockPromise) {
    await lockPromise;
  }

  let releaseLock: (() => void) | null = null;
  lockPromise = new Promise<void>((resolve) => {
    releaseLock = () => resolve();
  });

  return async () => {
    if (releaseLock) releaseLock();
    lockPromise = null;
  };
}

async function readAll(): Promise<Record<string, StoredDraftRun>> {
  try {
    const raw = await fs.readFile(STORE_FILE, 'utf8');
    return JSON.parse(raw) as Record<string, StoredDraftRun>;
  } catch {
    return {};
  }
}

async function writeAll(data: Record<string, StoredDraftRun>): Promise<void> {
  const tempFile = `${STORE_FILE}.tmp.${Date.now()}`;
  await fs.writeFile(tempFile, JSON.stringify(data), 'utf8');
  await fs.rename(tempFile, STORE_FILE);
}

export async function saveScorecard(run: StoredDraftRun): Promise<void> {
  const release = await acquireLock();
  try {
    const all = await readAll();
    all[run.id] = run;
    await writeAll(all);
  } finally {
    await release();
  }
}

export async function getScorecard(runId: string): Promise<StoredDraftRun | null> {
  const all = await readAll();
  return all[runId] ?? null;
}
