import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from('users').upsert({
        id: user.id,
        email: user.email,
        display_name: user.user_metadata?.display_name ?? null,
      });
    }
  }

  return NextResponse.redirect(new URL('/draft', requestUrl.origin));
}
