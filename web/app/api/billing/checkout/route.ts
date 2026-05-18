import { NextResponse } from 'next/server';
import { env } from '@/lib/env';
import { AppError, auditLog, logError, logInfo } from '@/lib/observability/logger';
import { getRequestUser } from '@/lib/server/auth';

export async function POST(req: Request) {
  try {
    const user = await getRequestUser(req);
    const payload = (await req.json()) as { plan?: 'creator' | 'pro' | 'agency' };
    if (!payload.plan) {
      throw new AppError('plan is required', 'VALIDATION_ERROR', 400);
    }

    if (!env.STRIPE_SECRET_KEY) {
      throw new AppError('Stripe is not configured', 'UPSTREAM_ERROR', 503);
    }

    const priceId =
      payload.plan === 'creator'
        ? env.STRIPE_PRICE_CREATOR
        : payload.plan === 'pro'
          ? env.STRIPE_PRICE_PRO
          : env.STRIPE_PRICE_AGENCY;

    if (!priceId) {
      throw new AppError(`Missing Stripe price for ${payload.plan}`, 'UPSTREAM_ERROR', 503);
    }

    const body = new URLSearchParams({
      mode: 'subscription',
      success_url: `${env.NEXT_PUBLIC_APP_URL}/settings/api-mode?checkout=success`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/settings/api-mode?checkout=cancelled`,
      client_reference_id: user.id,
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
    });

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    const session = (await response.json()) as { url?: string; error?: { message?: string } };
    if (!response.ok || !session.url) {
      throw new AppError(session.error?.message ?? 'Stripe checkout creation failed', 'UPSTREAM_ERROR', 502);
    }

    const checkoutUrl = session.url;
    auditLog('billing.checkout_created', { plan: payload.plan, userId: user.id });
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
