import Link from 'next/link';
import type { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <main className="app-shell">
      <nav className="top-nav">
        <Link className="brand" href="/">Signal OS</Link>
        <div className="nav-links">
          <Link href="/draft">Draft</Link>
          <Link href="/publish">Publish</Link>
          <Link href="/reply-assistant">Replies</Link>
          <Link href="/weekly-report">Weekly</Link>
          <Link href="/settings/api-mode">API Mode</Link>
          <Link href="/pricing">Pricing</Link>
        </div>
      </nav>
      {children}
    </main>
  );
}
