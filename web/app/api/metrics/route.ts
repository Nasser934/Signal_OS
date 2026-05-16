import { NextResponse } from 'next/server';
import { ApiFallbackService } from '@/lib/apiFallbackService';

const service = new ApiFallbackService();

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as {
      mode: 'full_api' | 'byo_api_key' | 'manual';
      postId: string;
      byoCredentialId?: string;
    };

    if (!payload.postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 });
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
