import type { ScoreOutput } from '@/lib/scoringClient';

export interface ScoreInputPayload {
  text: string;
  topic?: string;
  audience?: string;
  tone?: string;
}

export interface StoredDraftRun {
  id: string;
  createdAt: string;
  text: string;
  topic?: string;
  audience?: string;
  tone?: string;
  score: ScoreOutput;
}
