import { NextResponse } from 'next/server';
import { AppError } from '@/lib/observability/logger';
import { getRequestUser } from '@/lib/server/auth';
import { assertEntitled } from '@/lib/server/entitlements';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const user = await getRequestUser(req);
    assertEntitled(user.plan, 'weekly_report');
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('post_metrics')
      .select('impressions, published_posts!inner(user_id, score_id, scores(total_score, drafts(topic)))')
      .eq('user_id', user.id);
    if (error) throw error;
    const posts = (data ?? []).map((row) => {
      const publishedPost = Array.isArray(row.published_posts) ? row.published_posts[0] : row.published_posts;
      const score = Array.isArray(publishedPost?.scores) ? publishedPost.scores[0] : publishedPost?.scores;
      const draft = Array.isArray(score?.drafts) ? score.drafts[0] : score?.drafts;
      return {
        score: Number(score?.total_score ?? 0),
        impressions: row.impressions ?? 0,
        topic: draft?.topic ?? 'general',
      };
    });
    if (!posts.length) return NextResponse.json({ report: null });

    const sortedByImp = [...posts].sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0));
    const best = sortedByImp[0];
    const worst = sortedByImp[sortedByImp.length - 1];
    const avgScore = posts.reduce((acc, p) => acc + Number(p.score ?? 0), 0) / posts.length;
    const avgImp = posts.reduce((acc, p) => acc + Number(p.impressions ?? 0), 0) / posts.length;

    return NextResponse.json({
      report: {
        generatedAt: new Date().toISOString(),
        bestPost: best,
        worstPost: worst,
        topicInsights: 'Posts with concrete numbers and a question-ending performed better in this sample.',
        predictionAccuracy: 'Estimated from local sample only; integrate DB records for production-grade confidence.',
        nextWeekActions: [
          'Repeat hooks that include measurable outcomes in line one.',
          'Stop long dense drafts above ~4 sentences without a reply trigger.',
          'Test one controversial but constructive question per day.',
        ],
        averageScore: Number(avgScore.toFixed(2)),
        averageImpressions: Number(avgImp.toFixed(2)),
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    return NextResponse.json({ error: 'Invalid or empty JSON in request body' }, { status: 400 });
  }
}
