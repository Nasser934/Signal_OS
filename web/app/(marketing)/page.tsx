import Link from 'next/link';

export default function MarketingPage() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <h1>Signal OS</h1>
          <p>
            Know which X posts are worth publishing before you post them, then track what happens in the first hour when timing still matters.
          </p>
          <div className="actions">
            <Link className="button-link" href="/draft">Try Draft Score</Link>
            <Link className="button-link secondary" href="/pricing">View pricing</Link>
            <Link className="button-link secondary" href="/login">Sign in</Link>
          </div>
        </div>
      </section>

      <section className="feature-grid">
        <article className="card feature-card">
          <h2>Score</h2>
          <p className="muted">Explainable draft scoring before you publish.</p>
        </article>
        <article className="card feature-card">
          <h2>Track</h2>
          <p className="muted">First-hour checkpoints for posts that need fast decisions.</p>
        </article>
        <article className="card feature-card">
          <h2>Learn</h2>
          <p className="muted">Autopsies and weekly reports that turn posts into signal.</p>
        </article>
      </section>
    </main>
  );
}
