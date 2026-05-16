'use client';

import { useState } from 'react';

type ReplyItem = {
  id: string;
  text: string;
  likes?: number;
  responseValue: number;
  riskLevel: 'high' | 'low';
  suggestedResponse: string;
  recommendedDelayMinutes: number;
};

const SAMPLE = [
  { id: 'r1', text: 'Love this breakdown. What tool did you use?', likes: 12 },
  { id: 'r2', text: 'This is fraud. Totally fake numbers.', likes: 4 },
  { id: 'r3', text: 'Interesting take. Any examples?', likes: 7 },
];

export default function ReplyAssistantPage() {
  const [items, setItems] = useState<ReplyItem[]>([]);
  const [audit, setAudit] = useState<string[]>([]);

  async function rankReplies() {
    const res = await fetch('/api/replies/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ replies: SAMPLE }),
    });
    const body = (await res.json()) as { items?: ReplyItem[] };
    setItems(body.items ?? []);
  }

  async function approve(replyId: string, draftResponse: string, approved: boolean) {
    const res = await fetch('/api/replies/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ replyId, draftResponse, approved }),
    });
    const body = (await res.json()) as { action?: { approvalStatus: string; replyId: string } };
    if (!body.action) return;
    setAudit((prev) => [`${body.action.replyId}: ${body.action.approvalStatus}`, ...prev]);
  }

  return (
    <>
      <h1>Reply Assistant</h1>
      <section className="card"><button onClick={rankReplies}>Rank reply queue</button></section>
      {items.map((item) => (
        <section className="card" key={item.id}>
          <p><strong>Reply:</strong> {item.text}</p>
          <p>Response value: {item.responseValue} | Risk: {item.riskLevel} | Timing: {item.recommendedDelayMinutes}m</p>
          <p><strong>Suggested response:</strong> {item.suggestedResponse}</p>
          <button onClick={() => approve(item.id, item.suggestedResponse, true)}>Approve</button>{' '}
          <button onClick={() => approve(item.id, item.suggestedResponse, false)}>Reject</button>
        </section>
      ))}
      <section className="card"><h3>Approval audit</h3><ul>{audit.map((a, i) => <li key={`${a}-${i}`}>{a}</li>)}</ul></section>
    </>
  );
}
