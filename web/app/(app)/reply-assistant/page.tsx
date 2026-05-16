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

export default function ReplyAssistantPage() {
  const [rawReplies, setRawReplies] = useState(
    'Love this breakdown. What tool did you use?\nThis is fraud. Totally fake numbers.\nInteresting take. Any examples?'
  );
  const [items, setItems] = useState<ReplyItem[]>([]);
  const [audit, setAudit] = useState<string[]>([]);

  async function rankReplies() {
    const replies = rawReplies
      .split('\n')
      .map((text, index) => ({
        id: `r${index + 1}`,
        text: text.trim(),
        likes: 0,
      }))
      .filter((r) => r.text.length > 0);

    const res = await fetch('/api/replies/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ replies }),
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
    const body = (await res.json()) as {
      action?: { approvalStatus: string; replyId: string };
    };
    if (body.action) {
      setAudit((prev) => [`${body.action?.replyId}: ${body.action?.approvalStatus}`, ...prev]);
    }
  }

  return (
    <>
      <h1>Reply Assistant</h1>
      <section className="card">
        <label htmlFor="reply-input">Replies (one per line)</label>
        <textarea
          id="reply-input"
          rows={5}
          value={rawReplies}
          onChange={(e) => setRawReplies(e.target.value)}
        />
        <button onClick={rankReplies}>Rank reply queue</button>
      </section>
      {items.map((item) => (
        <section className="card" key={item.id}>
          <p>{item.text}</p>
          <p>
            {item.responseValue} | {item.riskLevel} | {item.recommendedDelayMinutes}m
          </p>
          <p>{item.suggestedResponse}</p>
          <button onClick={() => approve(item.id, item.suggestedResponse, true)}>
            Approve
          </button>
          <button onClick={() => approve(item.id, item.suggestedResponse, false)}>
            Reject
          </button>
        </section>
      ))}
      <section className="card">
        <ul>
          {audit.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
