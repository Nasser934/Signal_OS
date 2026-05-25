import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AppError } from '@/lib/observability/logger';
import { getRequestUser } from '@/lib/server/auth';
import { analysisRequestSchema, generateInsight } from '@/lib/server/signalIntelligence';

export async function POST(req: Request) {
  try {
    await getRequestUser(req);
    const payload = analysisRequestSchema.parse(await req.json().catch(() => ({})));
    return NextResponse.json(await generateInsight(payload));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid analysis request', issues: error.flatten() }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    return NextResponse.json({ error: 'Failed to generate insight' }, { status: 500 });
  }
}
