import Link from 'next/link';
import type { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <main className="app-shell">
      <aside className="side-nav">
        <Link className="brand" href="/">Signal OS</Link>
        <p className="side-kicker">Attention intelligence</p>
        <nav className="side-links" aria-label="Primary">
          <Link href="/draft">Draft Studio</Link>
          <Link href="/publish">Publish</Link>
          <Link href="/reply-assistant">Reply Queue</Link>
          <Link href="/weekly-report">Weekly Review</Link>
          <Link href="/settings/api-mode">Data Mode</Link>
        </nav>
        <Link className="button-link secondary side-upgrade" href="/pricing">
          Upgrade
        </Link>
      </aside>
      <section className="app-content">{children}</section>
    </main>
  );
}
