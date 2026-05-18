import { NextResponse } from 'next/server';
import { scoreDraft, ScoringServiceError } from '@/lib/scoringClient';
import { AppError } from '@/lib/observability/logger';
import { getRequestUser } from '@/lib/server/auth';
import { createClient } from '@/lib/supabase/server';
import type { StoredDraftRun } from '@/types/scoring';

export async function GET() {
  try {
    const user = await getRequestUser(new Request('http://local/drafts'));
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('scores')
      .select('id, created_at, total_score, explanation, components, recommendations, rule_version, drafts!inner(text, topic, audience, tone)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    const items: StoredDraftRun[] = (data ?? []).map((row) => {
      const draft = Array.isArray(row.drafts) ? row.drafts[0] : row.drafts;
      return {
        id: row.id,
        createdAt: row.created_at,
        text: draft.text,
        topic: draft.topic ?? undefined,
        audience: draft.audience ?? undefined,
        tone: draft.tone ?? undefined,
        score: {
          totalScore: Number(row.total_score),
          explanation: row.explanation,
          topStrength: '',
          biggestWeakness: '',
          components: row.components,
          rewriteRecommendations: row.recommendations,
          rulesVersion: row.rule_version,
        },
      };
    });

    return NextResponse.json({ items });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to load drafts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getRequestUser(req);
    let payload: {
      text: string;
      topic?: string;
      audience?: string;
      tone?: string;
    };
    try {
      payload = (await req.json()) as {
        text: string;
        topic?: string;
        audience?: string;
        tone?: string;
      };
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    if (!payload.text || typeof payload.text !== 'string' || !payload.text.trim()) {
      return NextResponse.json({ error: 'text is required and must be a non-empty string' }, { status: 400 });
    }

    const data = await scoreDraft(payload);
    const supabase = await createClient();
    const { data: draft, error: draftError } = await supabase
      .from('drafts')
      .insert({
        user_id: user.id,
        text: payload.text.trim(),
        topic: payload.topic || null,
        audience: payload.audience || null,
        tone: payload.tone || null,
        status: 'scored',
      })
      .select('id')
      .single();
    if (draftError) throw draftError;

    const { data: score, error: scoreError } = await supabase
      .from('scores')
      .insert({
        draft_id: draft.id,
        user_id: user.id,
        total_score: data.totalScore,
        components: data.components,
        explanation: data.explanation,
        weaknesses: [data.biggestWeakness],
        recommendations: data.rewriteRecommendations,
        rule_version: data.rulesVersion,
      })
      .select('id')
      .single();
    if (scoreError) throw scoreError;

    const runId = score.id;
    const run: StoredDraftRun = {
      id: runId,
      createdAt: new Date().toISOString(),
      text: payload.text,
      topic: payload.topic,
      audience: payload.audience,
      tone: payload.tone,
      score: data,
    };
    return NextResponse.json({ data, runId });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    if (error instanceof ScoringServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
