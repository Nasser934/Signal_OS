import Link from 'next/link';

export default function MarketingPage() {
  return (
    <main>
      <h1>Signal OS</h1>
      <p>Score → Improve → Publish → Track → Learn</p>
      <Link href="/draft">Go to Draft Score</Link>
      {' | '}
      <Link href="/login">Sign in</Link>
    </main>
  );
}
