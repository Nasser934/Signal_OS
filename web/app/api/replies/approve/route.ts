import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  let payload: { replyId?: string; approved?: boolean; draftResponse?: string };
  try {
    payload = (await req.json()) as { replyId?: string; approved?: boolean; draftResponse?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
  }
  if (!payload.replyId) {
    return NextResponse.json({ error: 'replyId is required' }, { status: 400 });
  }
  if (typeof payload.approved !== 'boolean') {
    return NextResponse.json({ error: 'approved must be a boolean value' }, { status: 400 });
  }
  return NextResponse.json({
    action: {
      id: randomUUID(),
      replyId: payload.replyId,
      approvalStatus: payload.approved ? 'approved' : 'rejected',
      draftResponse: payload.draftResponse ?? '',
      createdAt: new Date().toISOString(),
    },
  });
}
