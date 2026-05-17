import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  let payload: { draftText?: string; postUrl?: string; sourceMode?: 'full_api' | 'byo_api_key' | 'manual' };
  try {
    payload = (await req.json()) as { draftText?: string; postUrl?: string; sourceMode?: 'full_api' | 'byo_api_key' | 'manual' };
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
  }

  if (!payload.draftText?.trim() || !payload.postUrl?.trim()) {
    return NextResponse.json({ error: 'draftText and postUrl are required' }, { status: 400 });
  }

  try {
    const url = new URL(payload.postUrl);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return NextResponse.json({ error: 'postUrl must use http: or https: protocol' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'postUrl must be a valid URL' }, { status: 400 });
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
