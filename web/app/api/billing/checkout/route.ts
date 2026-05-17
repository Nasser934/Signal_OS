import { NextResponse } from 'next/server';
import { AppError, auditLog, logError, logInfo } from '@/lib/observability/logger';

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as { plan?: 'starter' | 'pro' | 'team'; userId?: string };
    if (!payload.plan || !payload.userId) {
      throw new AppError('plan and userId are required', 'VALIDATION_ERROR', 400);
    }

    // Stripe integration stub
    const checkoutUrl = `https://billing.signalos.local/checkout?plan=${payload.plan}&user=${payload.userId}`;
    auditLog('billing.checkout_created', { plan: payload.plan, userId: payload.userId });
    logInfo('billing.checkout.ok', { checkoutUrl });
    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    logError('billing.checkout.failed', error);
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    return NextResponse.json({ error: 'Unexpected error', code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
