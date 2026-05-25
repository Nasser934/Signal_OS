import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AppError } from '@/lib/observability/logger';
import { getRequestUser } from '@/lib/server/auth';
import { getSettings, settingsUpdateSchema, updateSettings } from '@/lib/server/signalIntelligence';

export async function GET(req: Request) {
  try {
    const user = await getRequestUser(req);
    return NextResponse.json({ settings: await getSettings(user) });
  } catch (error) {
    if (error instanceof AppError) return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getRequestUser(req);
    const payload = settingsUpdateSchema.parse(await req.json());
    return NextResponse.json({ settings: await updateSettings(user, payload) });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid settings request', issues: error.flatten() }, { status: 400 });
    if (error instanceof AppError) return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
