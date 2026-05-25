import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AppError } from '@/lib/observability/logger';
import { createExportJob, exportRequestSchema, getSignalOverview } from '@/lib/server/signalIntelligence';
import { getRequestUser } from '@/lib/server/auth';

export async function GET(req: Request) {
  try {
    const user = await getRequestUser(req);
    const overview = await getSignalOverview(user, 'reports');
    return NextResponse.json({ items: overview.reportJobs });
  } catch (error) {
    if (error instanceof AppError) return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    return NextResponse.json({ error: 'Failed to load report jobs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getRequestUser(req);
    const payload = exportRequestSchema.parse(await req.json().catch(() => ({})));
    return NextResponse.json({ job: await createExportJob(user, payload) }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid export request', issues: error.flatten() }, { status: 400 });
    if (error instanceof AppError) return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    return NextResponse.json({ error: 'Failed to create export job' }, { status: 500 });
  }
}
