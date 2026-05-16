import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const payload = (await req.json()) as { draftText?: string; postUrl?: string; sourceMode?: 'full_api' | 'byo_api_key' | 'manual' };
  if (!payload.draftText?.trim() || !payload.postUrl?.trim()) {
    return NextResponse.json({ error: 'draftText and postUrl are required' }, { status: 400 });
  }

  return NextResponse.json({
    post: {
      id: randomUUID(),
      draftText: payload.draftText.trim(),
      postUrl: payload.postUrl.trim(),
      sourceMode: payload.sourceMode ?? 'manual',
      publishedAt: new Date().toISOString(),
    },
  });
}
