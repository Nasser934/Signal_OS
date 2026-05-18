'use client';

import Link from 'next/link';
import { useState } from 'react';

type Plan = 'creator' | 'pro' | 'agency';

const PLANS: Array<{
  id: Plan;
  name: string;
  price: string;
  description: string;
  bullets: string[];
}> = [
  {
    id: 'creator',
    name: 'Creator',
    price: '$19/mo',
    description: 'For solo builders who want action after the score.',
    bullets: ['Command Center', 'Reply Assistant', 'Weekly Reports'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$49/mo',
    description: 'For serious operators posting every week.',
    bullets: ['Everything in Creator', 'Advanced tracking', 'Higher usage limits'],
  },
  {
    id: 'agency',
    name: 'Agency',
    price: '$299/mo',
    description: 'For teams managing several accounts.',
    bullets: ['Everything in Pro', 'Team volume', 'Priority workflows'],
  },
];

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);
  const [message, setMessage] = useState('');

  async function startCheckout(plan: Plan) {
    setLoadingPlan(plan);
    setMessage('');

    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });
      const body = (await response.json()) as { checkoutUrl?: string; error?: string };

      if (!response.ok || !body.checkoutUrl) {
        setMessage(body.error ?? 'Checkout is not available yet.');
        return;
      }

      window.location.href = body.checkoutUrl;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to start checkout.');
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <h1>Choose the plan that matches your posting rhythm</h1>
          <p>Free gives you prediction. Paid plans unlock the action layer after publishing.</p>
          <div className="actions">
            <Link className="button-link secondary" href="/draft">Start free</Link>
          </div>
        </div>
      </section>

      <section className="pricing-grid">
        {PLANS.map((plan) => (
          <article className="card plan-card" key={plan.id}>
            <h2>{plan.name}</h2>
            <strong className="price">{plan.price}</strong>
            <p className="muted">{plan.description}</p>
            <ul>
              {plan.bullets.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <div className="plan-actions">
              <button onClick={() => startCheckout(plan.id)} disabled={loadingPlan === plan.id}>
                {loadingPlan === plan.id ? 'Loading...' : `Choose ${plan.name}`}
              </button>
            </div>
          </article>
        ))}
      </section>

      {message ? <section className="card">{message}</section> : null}
    </main>
  );
}
