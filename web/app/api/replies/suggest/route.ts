import { NextResponse } from 'next/server';
import { AppError } from '@/lib/observability/logger';
import { getRequestUser } from '@/lib/server/auth';
import { assertEntitled } from '@/lib/server/entitlements';

const RISK_TERMS = ['scam', 'fraud', 'idiot', 'hate', 'angry', 'boycott'];

export async function POST(req: Request) {
  try {
    const user = await getRequestUser(req);
    assertEntitled(user.plan, 'reply_assistant');
    const payload = (await req.json()) as { replies?: { id: string; text: string; likes?: number }[] };

    if (!payload.replies || !Array.isArray(payload.replies)) {
      return NextResponse.json({ error: 'replies must be an array' }, { status: 400 });
    }

  // Validate each reply has required fields
    for (const reply of payload.replies) {
    if (!reply || typeof reply !== 'object') {
      return NextResponse.json({ error: 'each reply must be an object' }, { status: 400 });
    }
    if (!reply.id || typeof reply.id !== 'string') {
      return NextResponse.json({ error: 'each reply must have a string id' }, { status: 400 });
    }
    if (!reply.text || typeof reply.text !== 'string') {
      return NextResponse.json({ error: 'each reply must have a non-empty string text' }, { status: 400 });
    }
  }

  // Enforce max batch size
    const replies = payload.replies.slice(0, 50);

    const ranked = replies
    .map((reply) => {
      const base = Number(reply.likes ?? 0);
      const hasQuestion = reply.text && reply.text.includes('?') ? 10 : 0;
      const risk = reply.text && RISK_TERMS.some((term) => reply.text.toLowerCase().includes(term));
      return {
        ...reply,
        responseValue: base + hasQuestion,
        riskLevel: risk ? 'high' : 'low',
        suggestedResponse: risk
          ? 'Thanks for the feedback. I want to keep this constructive—can you share one specific point we should improve?'
          : 'Great point—appreciate you jumping in. Curious: what part resonated most for you?',
        recommendedDelayMinutes: risk ? 30 : 5,
      };
    })
    .sort((a, b) => b.responseValue - a.responseValue);

    return NextResponse.json({ items: ranked });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
