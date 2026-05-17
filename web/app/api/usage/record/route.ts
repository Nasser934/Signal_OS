import { NextResponse } from 'next/server';
import { AppError, auditLog, logError } from '@/lib/observability/logger';

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as { userId?: string; feature?: string; units?: number; tier?: 'free' | 'pro' | 'team' };
    if (!payload.userId || !payload.feature) {
      throw new AppError('userId and feature are required', 'VALIDATION_ERROR', 400);
    }

    const limit = payload.tier === 'free' ? 100 : payload.tier === 'pro' ? 2000 : 10000;
    const used = Math.max(0, Number(payload.units ?? 1));
    const allowed = used <= limit;

    auditLog('usage.recorded', { ...payload, allowed, limit });
    return NextResponse.json({ allowed, limit, used });
  } catch (error) {
    logError('usage.record.failed', error);
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    return NextResponse.json({ error: 'Unexpected error', code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
