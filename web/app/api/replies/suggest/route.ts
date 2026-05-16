import { NextResponse } from 'next/server';

const RISK_TERMS = ['scam', 'fraud', 'idiot', 'hate', 'angry', 'boycott'];

export async function POST(req: Request) {
  const payload = (await req.json()) as { replies?: { id: string; text: string; likes?: number }[] };
  const replies = payload.replies ?? [];

  const ranked = replies
    .map((reply) => {
      const base = Number(reply.likes ?? 0);
      const hasQuestion = reply.text.includes('?') ? 10 : 0;
      const risk = RISK_TERMS.some((term) => reply.text.toLowerCase().includes(term));
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
}
