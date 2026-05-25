import { AppError } from '@/lib/observability/logger';
import { env } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';

export type Plan = 'free' | 'creator' | 'pro' | 'agency';

export interface AppUser {
  id: string;
  plan: Plan;
}

const DEMO_USER: AppUser = {
  id: 'demo-user',
  plan: 'agency',
};

export async function getRequestUser(req: Request): Promise<AppUser> {
  if (env.APP_MODE === 'demo') {
    return DEMO_USER;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new AppError('Authentication required', 'UNAUTHORIZED', 401);
  }

  const { data: profile } = await supabase
    .from('users')
    .select('plan')
    .eq('id', user.id)
    .maybeSingle();
  const plan = isPlan(profile?.plan) ? profile.plan : 'free';
  return { id: user.id, plan };
}

function isPlan(value: unknown): value is Plan {
  return value === 'free' || value === 'creator' || value === 'pro' || value === 'agency';
}
