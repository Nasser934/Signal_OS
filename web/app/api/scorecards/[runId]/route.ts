import { NextResponse } from 'next/server';
import { getScorecard } from '@/lib/server/scorecardStore';

export async function GET(_req: Request, context: { params: Promise<{ runId: string }> }) {
  try {
    const { runId } = await context.params;
    const item = await getScorecard(runId);
    if (!item) {
      return NextResponse.json({ error: 'Scorecard not found' }, { status: 404 });
    }
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load scorecard' },
      { status: 500 }
    );
  }
}
