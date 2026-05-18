'use client';

import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage('Check your email for the login link.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to send login link.');
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    setGoogleLoading(true);
    setMessage('');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) setMessage(error.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to start Google sign-in.');
      setGoogleLoading(false);
    }
  }

  return (
    <main>
      <h1>Sign in</h1>
      <section className="card">
        <button onClick={signInWithGoogle} disabled={googleLoading} style={{ width: '100%', marginBottom: '1rem' }}>
          {googleLoading ? 'Opening Google...' : 'Continue with Google'}
        </button>
        <form onSubmit={onSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <button disabled={loading || !email.trim()}>
            {loading ? 'Sending...' : 'Email me a login link'}
          </button>
        </form>
        {message ? <p>{message}</p> : null}
      </section>
    </main>
  );
}
