import Link from 'next/link';
import type { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <nav className="card">
        <Link href="/draft">Draft</Link>{' | '}
        <Link href="/publish">Publish</Link>{' | '}
        <Link href="/reply-assistant">Reply Assistant</Link>{' | '}
        <Link href="/weekly-report">Weekly Report</Link>{' | '}
        <Link href="/settings/api-mode">API Mode</Link>
      </nav>
      {children}
    </main>
  );
}
