import { NextResponse } from 'next/server';
import { AppError } from '@/lib/observability/logger';
import { getRequestUser } from '@/lib/server/auth';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  let user;
  try {
    user = await getRequestUser(req);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    throw error;
  }
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

  const supabase = await createClient();
  const publishedAt = new Date().toISOString();
  const { data: latestScore } = await supabase
    .from('scores')
    .select('id, draft_id, drafts!inner(text)')
    .eq('user_id', user.id)
    .eq('drafts.text', payload.draftText.trim())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  const { data, error } = await supabase
    .from('published_posts')
    .insert({
      user_id: user.id,
      draft_id: latestScore?.draft_id ?? null,
      score_id: latestScore?.id ?? null,
      source_mode: payload.sourceMode ?? 'manual',
      post_url: payload.postUrl.trim(),
      final_text: payload.draftText.trim(),
      published_at: publishedAt,
    })
    .select('id, final_text, post_url, source_mode, published_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    post: {
      id: data.id,
      draftText: data.final_text,
      postUrl: data.post_url,
      sourceMode: data.source_mode,
      publishedAt: data.published_at,
    },
  });
}
