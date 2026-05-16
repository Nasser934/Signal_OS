import { env } from '@/lib/env';

export interface ScoreInput {
  text: string;
  topic?: string;
  audience?: string;
  tone?: string;
}

export interface ScoreComponent {
  name: string;
  score: number;
  rationale: string;
}

export interface ScoreOutput {
  totalScore: number;
  explanation: string;
  topStrength: string;
  biggestWeakness: string;
  components: ScoreComponent[];
  rewriteRecommendations: string[];
  rulesVersion: string;
}

export class ScoringServiceError extends Error {
  readonly status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = 'ScoringServiceError';
    this.status = status;
  }
}

interface RawScoreResponse {
  total_score: number;
  explanation: string;
  top_strength: string;
  biggest_weakness: string;
  components: ScoreComponent[];
  rewrite_recommendations: string[];
  rules_version: string;
}

const DEFAULT_TIMEOUT_MS = 10_000;

export async function scoreDraft(input: ScoreInput, options?: { baseUrl?: string; timeoutMs?: number; signal?: AbortSignal }): Promise<ScoreOutput> {
  const text = input.text?.trim();
  if (!text) throw new ScoringServiceError('Draft text is required before scoring.', 400);

  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const baseUrl = options?.baseUrl ?? env.SCORING_SERVICE_URL;
  const timeoutController = new AbortController();
  const timeout = setTimeout(() => timeoutController.abort(), timeoutMs);
  const abortSignal = options?.signal ?? timeoutController.signal;

  try {
    const response = await fetch(`${baseUrl}/v1/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...input, text }),
      signal: abortSignal,
    });
    if (!response.ok) {
      const detail = await safeReadDetail(response);
      throw new ScoringServiceError(`Scoring service rejected request (${response.status}): ${detail}`, response.status);
    }
    return mapScoreResponse((await response.json()) as unknown);
  } catch (error) {
    if (error instanceof ScoringServiceError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ScoringServiceError(`Scoring request timed out after ${timeoutMs}ms.`, 504);
    }
    throw new ScoringServiceError(`Scoring service unreachable: ${error instanceof Error ? error.message : String(error)}`, 503);
  } finally {
    clearTimeout(timeout);
  }
}

function mapScoreResponse(raw: unknown): ScoreOutput {
  const r = raw as Partial<RawScoreResponse>;
  if (!r || typeof r.total_score !== 'number' || !Array.isArray(r.rewrite_recommendations)) {
    throw new ScoringServiceError('Scoring service returned an invalid payload shape.', 502);
  }
  return {
    totalScore: r.total_score,
    explanation: r.explanation ?? '',
    topStrength: r.top_strength ?? '',
    biggestWeakness: r.biggest_weakness ?? '',
    components: (r.components ?? []) as ScoreComponent[],
    rewriteRecommendations: r.rewrite_recommendations,
    rulesVersion: r.rules_version ?? 'unknown',
  };
}

async function safeReadDetail(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { detail?: string };
    return payload.detail ?? 'No error detail provided';
  } catch {
    return 'No error detail provided';
  }
}
