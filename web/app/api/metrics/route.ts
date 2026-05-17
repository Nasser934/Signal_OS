import { NextResponse } from 'next/server';
import { ApiFallbackService } from '@/lib/apiFallbackService';

const service = new ApiFallbackService();

export async function POST(req: Request) {
  try {
    let payload: {
      mode: 'full_api' | 'byo_api_key' | 'manual';
      postId: string;
      byoCredentialId?: string;
    };
    try {
      payload = (await req.json()) as {
        mode: 'full_api' | 'byo_api_key' | 'manual';
        postId: string;
        byoCredentialId?: string;
      };
    } catch (error) {
      return NextResponse.json({ error: 'Malformed JSON' }, { status: 400 });
    }

    if (!payload || typeof payload !== 'object') {
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
    }

    if (!payload.postId || typeof payload.postId !== 'string' || !payload.postId.trim()) {
      return NextResponse.json({ error: 'postId is required and must be a non-empty string' }, { status: 400 });
    }

    const allowedModes = ['full_api', 'byo_api_key', 'manual'];
    if (payload.mode && !allowedModes.includes(payload.mode)) {
      return NextResponse.json({ error: 'mode must be one of: full_api, byo_api_key, manual' }, { status: 400 });
    }

    const result = await service.fetchMetrics(
      { mode: payload.mode ?? 'manual', userId: 'local-user', byoCredentialId: payload.byoCredentialId },
      { postId: payload.postId }
    );

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unexpected metrics error' },
      { status: 500 }
    );
  }
}
