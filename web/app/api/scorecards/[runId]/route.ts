import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _req: Request,
  context: { params: Promise<{ runId: string }> }
) {
  try {
    const { runId } = await context.params;
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('scores')
      .select('id, created_at, total_score, explanation, components, recommendations, rule_version, drafts!inner(text, topic, audience, tone)')
      .eq('id', runId)
      .single();
    if (error || !data) {
      return NextResponse.json({ error: 'Scorecard not found' }, { status: 404 });
    }
    const draft = Array.isArray(data.drafts) ? data.drafts[0] : data.drafts;
    const item = {
      id: data.id,
      createdAt: data.created_at,
      text: draft.text,
      topic: draft.topic ?? undefined,
      audience: draft.audience ?? undefined,
      tone: draft.tone ?? undefined,
      score: {
        totalScore: Number(data.total_score),
        explanation: data.explanation,
        topStrength: '',
        biggestWeakness: '',
        components: data.components,
        rewriteRecommendations: data.recommendations,
        rulesVersion: data.rule_version,
      },
    };
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load scorecard' },
      { status: 500 }
    );
  }
}
