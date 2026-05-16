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

/**
 * Client for the Stage-1 scoring engine.
 * Keeps UI logic strongly typed and decoupled from snake_case API payloads.
 */
export async function scoreDraft(
  input: ScoreInput,
  options?: { baseUrl?: string; timeoutMs?: number; signal?: AbortSignal }
): Promise<ScoreOutput> {
  const text = input.text?.trim();
  if (!text) {
    throw new ScoringServiceError('Draft text is required before scoring.', 400);
  }

  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const baseUrl = options?.baseUrl ?? process.env.SCORING_SERVICE_URL ?? 'http://localhost:8000';

  const timeoutController = new AbortController();
  const timeout = setTimeout(() => timeoutController.abort(), timeoutMs);
  const abortSignal = mergeAbortSignals(options?.signal, timeoutController.signal);

  try {
    const response = await fetch(`${baseUrl}/v1/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...input, text }),
      signal: abortSignal,
    });

    if (!response.ok) {
      const detail = await safeReadDetail(response);
      throw new ScoringServiceError(
        `Scoring service rejected request (${response.status}): ${detail}`,
        response.status
      );
    }

    const raw = (await response.json()) as unknown;
    return mapScoreResponse(raw);
  } catch (error) {
    if (error instanceof ScoringServiceError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      const timedOut = timeoutController.signal.aborted;
      throw new ScoringServiceError(
        timedOut
          ? `Scoring request timed out after ${timeoutMs}ms.`
          : 'Scoring request was aborted by caller.',
        timedOut ? 504 : 499
      );
    }

    const message = error instanceof Error ? error.message : String(error);
    throw new ScoringServiceError(`Scoring service unreachable: ${message}`, 503);
  } finally {
    clearTimeout(timeout);
  }
}

function mapScoreResponse(raw: unknown): ScoreOutput {
  if (!isRawScoreResponse(raw)) {
    throw new ScoringServiceError('Scoring service returned an invalid payload shape.', 502);
  }

  return {
    totalScore: raw.total_score,
    explanation: raw.explanation,
    topStrength: raw.top_strength,
    biggestWeakness: raw.biggest_weakness,
    components: raw.components,
    rewriteRecommendations: raw.rewrite_recommendations,
    rulesVersion: raw.rules_version,
  };
}

function isRawScoreResponse(value: unknown): value is RawScoreResponse {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<RawScoreResponse>;
  return (
    typeof candidate.total_score === 'number' &&
    typeof candidate.explanation === 'string' &&
    typeof candidate.top_strength === 'string' &&
    typeof candidate.biggest_weakness === 'string' &&
    typeof candidate.rules_version === 'string' &&
    Array.isArray(candidate.components) &&
    candidate.components.every(isScoreComponent) &&
    Array.isArray(candidate.rewrite_recommendations) &&
    candidate.rewrite_recommendations.every((item) => typeof item === 'string')
  );
}

function isScoreComponent(component: unknown): component is ScoreComponent {
  if (!component || typeof component !== 'object') {
    return false;
  }

  const candidate = component as Partial<ScoreComponent>;
  return (
    typeof candidate.name === 'string' &&
    typeof candidate.score === 'number' &&
    typeof candidate.rationale === 'string'
  );
}

function mergeAbortSignals(
  upstream: AbortSignal | undefined,
  timeoutSignal: AbortSignal
): AbortSignal {
  if (!upstream) {
    return timeoutSignal;
  }

  if (upstream.aborted) {
    return upstream;
  }

  const mergedController = new AbortController();
  const onAbort = () => mergedController.abort();

  upstream.addEventListener('abort', onAbort, { once: true });
  timeoutSignal.addEventListener('abort', onAbort, { once: true });

  return mergedController.signal;
}

async function safeReadDetail(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { detail?: string };
    return payload.detail ?? 'No error detail provided';
  } catch {
    return 'No error detail provided';
  }
}
