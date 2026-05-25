import { NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '@/lib/env';

const authIntentSchema = z.object({
  email: z.string().email(),
  workspaceName: z.string().trim().max(120).optional(),
  mode: z.enum(['login', 'signup']).default('login'),
});

export async function POST(req: Request) {
  try {
    const payload = authIntentSchema.parse(await req.json());
    if (env.APP_MODE === 'demo') {
      return NextResponse.json({
        status: 'demo',
        redirectTo: '/signal-os/dashboard.html',
        message: `Demo ${payload.mode} accepted for ${payload.email}. Supabase Auth must be configured for production.`,
      });
    }

    return NextResponse.json(
      { status: 'configuration_required', message: 'Supabase Auth UI wiring is required for static frontend production login.' },
      { status: 501 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid auth request', issues: error.flatten() }, { status: 400 });
    return NextResponse.json({ error: 'Auth request failed' }, { status: 500 });
  }
}
