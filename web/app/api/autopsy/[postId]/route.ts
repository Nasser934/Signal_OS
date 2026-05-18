import { NextResponse } from 'next/server';
import { AppError } from '@/lib/observability/logger';
import { getRequestUser } from '@/lib/server/auth';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request, { params }: { params: Promise<{ postId: string }> }) {
  try {
    const user = await getRequestUser(req);
    const { postId } = await params;
    const supabase = await createClient();

    const { data: post, error: postError } = await supabase
      .from('published_posts')
      .select('id, score_id, scores(total_score, prediction_range_low, prediction_range_high)')
      .eq('user_id', user.id)
      .eq('id', postId)
      .single();
    if (postError) throw postError;

    const { data: metrics, error: metricsError } = await supabase
      .from('post_metrics')
      .select('impressions, likes, replies, reposts, bookmarks, captured_at')
      .eq('user_id', user.id)
      .eq('post_id', postId)
      .order('captured_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (metricsError) throw metricsError;

    const score = Array.isArray(post.scores) ? post.scores[0] : post.scores;
    const low = Number(score?.prediction_range_low ?? 0);
    const high = Number(score?.prediction_range_high ?? 0);
    const midpoint = low && high ? Math.round((low + high) / 2) : 0;
    const actual = Number(metrics?.impressions ?? 0);
    const delta = actual - midpoint;
    const outcome = !metrics
      ? 'insufficient_data'
      : actual > high
        ? 'overperformed'
        : actual < low
          ? 'underperformed'
          : 'within_range';
    const lessons = buildLessons(outcome, metrics);
    const summary = buildSummary(outcome, actual, low, high);

    const { data: autopsy, error: autopsyError } = await supabase
      .from('post_autopsies')
      .upsert({
        post_id: postId,
        user_id: user.id,
        score_id: post.score_id,
        predicted_low: low || null,
        predicted_high: high || null,
        actual_impressions: actual,
        delta_vs_midpoint: delta,
        outcome,
        summary,
        lessons,
        generated_at: new Date().toISOString(),
      }, { onConflict: 'post_id' })
      .select('predicted_low, predicted_high, actual_impressions, delta_vs_midpoint, outcome, summary, lessons, generated_at')
      .single();
    if (autopsyError) throw autopsyError;

    return NextResponse.json({ autopsy, latestMetrics: metrics, score });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to build autopsy' }, { status: 500 });
  }
}

function buildSummary(outcome: string, actual: number, low: number, high: number) {
  if (outcome === 'insufficient_data') return 'Capture at least one metric snapshot to generate a real autopsy.';
  if (outcome === 'overperformed') return `The post exceeded its expected range of ${low}-${high} impressions with ${actual}.`;
  if (outcome === 'underperformed') return `The post landed below its expected range of ${low}-${high} impressions with ${actual}.`;
  return `The post landed inside its expected range of ${low}-${high} impressions with ${actual}.`;
}

function buildLessons(outcome: string, metrics: { impressions?: number | null; likes?: number | null; replies?: number | null; bookmarks?: number | null } | null) {
  if (!metrics) return ['Capture 10m, 30m, and 60m metrics before judging the post.'];
  const impressions = Number(metrics.impressions ?? 0);
  const replies = Number(metrics.replies ?? 0);
  const bookmarks = Number(metrics.bookmarks ?? 0);
  const lessons = [];
  if (outcome === 'overperformed') lessons.push('Reuse the hook pattern from this post in the next batch.');
  if (outcome === 'underperformed') lessons.push('Review the opening line and audience fit before repeating this structure.');
  if (impressions > 0 && replies / impressions >= 0.015) lessons.push('Conversation quality was strong; reply quickly while momentum is live.');
  if (impressions > 0 && bookmarks / impressions >= 0.01) lessons.push('The post created save intent; test a follow-up with more depth.');
  if (!lessons.length) lessons.push('Keep collecting outcomes to improve account-specific calibration.');
  return lessons;
}
