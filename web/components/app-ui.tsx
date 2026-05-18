import Link from 'next/link';
import type { ReactNode } from 'react';

const LOOP_STEPS = [
  { label: 'Score', href: '/draft' },
  { label: 'Improve', href: '/draft' },
  { label: 'Publish', href: '/publish' },
  { label: 'Track', href: '/publish' },
  { label: 'Learn', href: '/weekly-report' },
];

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </header>
  );
}

export function LoopRail({ active }: { active: string }) {
  return (
    <nav className="loop-rail" aria-label="Core loop">
      {LOOP_STEPS.map((step, index) => (
        <Link
          className={step.label === active ? 'active' : undefined}
          href={step.href}
          key={`${step.label}-${index}`}
        >
          <span>{index + 1}</span>
          {step.label}
        </Link>
      ))}
    </nav>
  );
}

export function StatTile({
  label,
  value,
  note,
}: {
  label: string;
  value: string | number;
  note?: string;
}) {
  return (
    <section className="stat-tile">
      <span>{label}</span>
      <strong>{value}</strong>
      {note ? <small>{note}</small> : null}
    </section>
  );
}
