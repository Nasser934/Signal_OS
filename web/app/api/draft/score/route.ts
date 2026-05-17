import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { scoreDraft, ScoringServiceError } from '@/lib/scoringClient';
import { saveScorecard } from '@/lib/server/scorecardStore';
import type { StoredDraftRun } from '@/types/scoring';

export async function POST(req: Request) {
  try {
    let payload: {
      text: string;
      topic?: string;
      audience?: string;
      tone?: string;
    };
    try {
      payload = (await req.json()) as {
        text: string;
        topic?: string;
        audience?: string;
        tone?: string;
      };
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    if (!payload.text || typeof payload.text !== 'string' || !payload.text.trim()) {
      return NextResponse.json({ error: 'text is required and must be a non-empty string' }, { status: 400 });
    }

    const data = await scoreDraft(payload);
    const runId = randomUUID();
    const run: StoredDraftRun = {
      id: runId,
      createdAt: new Date().toISOString(),
      text: payload.text,
      topic: payload.topic,
      audience: payload.audience,
      tone: payload.tone,
      score: data,
    };
    await saveScorecard(run);

    return NextResponse.json({ data, runId });
  } catch (error) {
    if (error instanceof ScoringServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
