import { NextResponse } from 'next/server';
import { AppError } from '@/lib/observability/logger';
import { getRequestUser } from '@/lib/server/auth';
import { createClient } from '@/lib/supabase/server';

type ImportedPostInput = {
  postedAt: string;
  text: string;
  impressions: number;
  likes?: number;
  replies?: number;
  reposts?: number;
  bookmarks?: number;
};

export async function POST(req: Request) {
  try {
    const user = await getRequestUser(req);
    const payload = (await req.json()) as {
      handle?: string;
      displayName?: string;
      posts?: ImportedPostInput[];
    };

    if (!payload.handle?.trim()) {
      return NextResponse.json({ error: 'handle is required' }, { status: 400 });
    }
    if (!Array.isArray(payload.posts) || payload.posts.length === 0) {
      return NextResponse.json({ error: 'posts are required' }, { status: 400 });
    }

    const posts = payload.posts.map((post) => ({
      posted_at: new Date(post.postedAt).toISOString(),
      text: String(post.text ?? '').trim(),
      impressions: Number(post.impressions ?? 0),
      likes: Number(post.likes ?? 0),
      replies: Number(post.replies ?? 0),
      reposts: Number(post.reposts ?? 0),
      bookmarks: Number(post.bookmarks ?? 0),
    }));

    if (posts.some((post) => !post.text || Number.isNaN(Date.parse(post.posted_at)) || post.impressions < 0)) {
      return NextResponse.json({ error: 'each post needs valid text, date, and non-negative impressions' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: account, error: accountError } = await supabase
      .from('x_accounts')
      .upsert({
        user_id: user.id,
        handle: payload.handle.trim().replace(/^@/, ''),
        display_name: payload.displayName?.trim() || null,
        source_mode: 'manual',
        imported_at: new Date().toISOString(),
      }, { onConflict: 'user_id,handle' })
      .select('id, handle, display_name')
      .single();
    if (accountError) throw accountError;

    const rows = posts.map((post) => ({ ...post, account_id: account.id, user_id: user.id }));
    const { data: importedPosts, error: postsError } = await supabase
      .from('imported_posts')
      .insert(rows)
      .select('id, posted_at, impressions, likes, replies, reposts, bookmarks');
    if (postsError) throw postsError;

    const impressions = importedPosts.map((post) => Number(post.impressions ?? 0)).sort((a, b) => a - b);
    const avgImpressions = impressions.reduce((sum, value) => sum + value, 0) / impressions.length;
    const medianImpressions = impressions.length % 2
      ? impressions[(impressions.length - 1) / 2]
      : (impressions[impressions.length / 2 - 1] + impressions[impressions.length / 2]) / 2;
    const avgEngagementRate = importedPosts.reduce((sum, post) => {
      const interactions = Number(post.likes ?? 0) + Number(post.replies ?? 0) + Number(post.reposts ?? 0) + Number(post.bookmarks ?? 0);
      return sum + (Number(post.impressions ?? 0) > 0 ? interactions / Number(post.impressions ?? 0) : 0);
    }, 0) / importedPosts.length;
    const ranked = [...importedPosts].sort((a, b) => Number(b.impressions ?? 0) - Number(a.impressions ?? 0));
    const best = ranked[0];
    const weakest = ranked[ranked.length - 1];
    const recommendedWindow = inferRecommendedWindow(payload.posts);

    const { data: baseline, error: baselineError } = await supabase
      .from('account_baselines')
      .upsert({
        account_id: account.id,
        user_id: user.id,
        sample_size: importedPosts.length,
        avg_impressions: Number(avgImpressions.toFixed(2)),
        median_impressions: Number(medianImpressions.toFixed(2)),
        avg_engagement_rate: Number(avgEngagementRate.toFixed(5)),
        best_post_id: best.id,
        weakest_post_id: weakest.id,
        recommended_window: recommendedWindow,
        generated_at: new Date().toISOString(),
      }, { onConflict: 'account_id' })
      .select('sample_size, avg_impressions, median_impressions, avg_engagement_rate, recommended_window')
      .single();
    if (baselineError) throw baselineError;

    return NextResponse.json({ account, baseline });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Import failed' }, { status: 500 });
  }
}

function inferRecommendedWindow(posts: ImportedPostInput[]) {
  const byHour = new Map<number, { total: number; count: number }>();
  for (const post of posts) {
    const hour = new Date(post.postedAt).getHours();
    const current = byHour.get(hour) ?? { total: 0, count: 0 };
    current.total += Number(post.impressions ?? 0);
    current.count += 1;
    byHour.set(hour, current);
  }
  const best = [...byHour.entries()]
    .map(([hour, value]) => ({ hour, avg: value.total / value.count }))
    .sort((a, b) => b.avg - a.avg)[0];
  return best ? `${String(best.hour).padStart(2, '0')}:00-${String((best.hour + 1) % 24).padStart(2, '0')}:00` : null;
}

export async function GET(req: Request) {
  try {
    const user = await getRequestUser(req);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('account_baselines')
      .select('sample_size, avg_impressions, median_impressions, avg_engagement_rate, recommended_window, x_accounts!inner(handle, display_name)')
      .eq('user_id', user.id)
      .order('generated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return NextResponse.json({ baseline: data });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to load baseline' }, { status: 500 });
  }
}
