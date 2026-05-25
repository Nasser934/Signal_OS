import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AppError } from '@/lib/observability/logger';
import { getRequestUser } from '@/lib/server/auth';
import { getSignalOverview, pageSchema } from '@/lib/server/signalIntelligence';

const querySchema = z.object({
  page: pageSchema.default('dashboard'),
});

export async function GET(req: Request) {
  try {
    const user = await getRequestUser(req);
    const url = new URL(req.url);
    const query = querySchema.parse({ page: url.searchParams.get('page') ?? 'dashboard' });
    return NextResponse.json(await getSignalOverview(user, query.page));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid overview request', issues: error.flatten() }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    return NextResponse.json({ error: 'Failed to load signal overview' }, { status: 500 });
  }
}
