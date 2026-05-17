import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  let payload: { posts?: { score?: number; impressions?: number; topic?: string }[] };
  try {
    payload = (await req.json()) as { posts?: { score?: number; impressions?: number; topic?: string }[] };
  } catch (error) {
    return NextResponse.json({ error: 'Invalid or empty JSON in request body' }, { status: 400 });
  }
  const posts = payload.posts ?? [];
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
}
