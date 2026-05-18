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

  const plan = (user.user_metadata?.plan as Plan | undefined) ?? 'free';
  return { id: user.id, plan };
}
