import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { scoreDraft, ScoringServiceError } from '@/lib/scoringClient';

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as { text: string; topic?: string; audience?: string; tone?: string };
    const data = await scoreDraft(payload);
    return NextResponse.json({ data, runId: randomUUID() });
  } catch (error) {
    if (error instanceof ScoringServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
