import { promises as fs } from 'fs';
import path from 'path';
import type { StoredDraftRun } from '@/types/scoring';

const STORE_FILE = path.join('/tmp', 'signalos-scorecards.json');

async function readAll(): Promise<Record<string, StoredDraftRun>> {
  try {
    const raw = await fs.readFile(STORE_FILE, 'utf8');
    return JSON.parse(raw) as Record<string, StoredDraftRun>;
  } catch {
    return {};
  }
}

async function writeAll(data: Record<string, StoredDraftRun>): Promise<void> {
  await fs.writeFile(STORE_FILE, JSON.stringify(data), 'utf8');
}

export async function saveScorecard(run: StoredDraftRun): Promise<void> {
  const all = await readAll();
  all[run.id] = run;
  await writeAll(all);
}

export async function getScorecard(runId: string): Promise<StoredDraftRun | null> {
  const all = await readAll();
  return all[runId] ?? null;
}
