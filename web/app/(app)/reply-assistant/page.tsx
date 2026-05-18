'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/app-ui';

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
      .map((text, index) => ({ id: `r${index + 1}`, text: text.trim(), likes: 0 }))
      .filter((reply) => reply.text.length > 0);

    try {
      const res = await fetch('/api/replies/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replies }),
      });
      if (!res.ok) {
        let errorMsg = 'Failed to rank replies';
        try {
          const errBody = await res.json();
          errorMsg = errBody.error ?? errorMsg;
        } catch {
          errorMsg = await res.text();
        }
        setAudit((prev) => [`Error: ${errorMsg}`, ...prev]);
        setItems([]);
        return;
      }
      const body = (await res.json()) as { items?: ReplyItem[] };
      setItems(body.items ?? []);
    } catch (error) {
      setAudit((prev) => [`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`, ...prev]);
      setItems([]);
    }
  }

  async function approve(replyId: string, draftResponse: string, approved: boolean) {
    try {
      const res = await fetch('/api/replies/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyId, draftResponse, approved }),
      });
      if (!res.ok) {
        let errorMsg = 'Failed to approve reply';
        try {
          const errBody = await res.json();
          errorMsg = errBody.error ?? errorMsg;
        } catch {
          errorMsg = await res.text();
        }
        setAudit((prev) => [`Error: ${errorMsg}`, ...prev]);
        return;
      }
      const body = (await res.json()) as { action?: { approvalStatus: string; replyId: string } };
      if (body.action) {
        const action = body.action;
        setAudit((prev) => [`${action.replyId}: ${action.approvalStatus}`, ...prev]);
      }
    } catch (error) {
      setAudit((prev) => [`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`, ...prev]);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Reply assistant"
        title="Prioritize the replies worth your time"
        description="Rank incoming replies, separate opportunity from risk, and keep every outbound response under human approval."
      />

      <div className="grid-2">
        <section className="card">
          <label htmlFor="reply-input">Replies, one per line</label>
          <textarea id="reply-input" rows={8} value={rawReplies} onChange={(event) => setRawReplies(event.target.value)} />
          <button onClick={rankReplies}>Rank reply queue</button>
        </section>

        <section className="card">
          <p className="eyebrow">Queue logic</p>
          <h2>Respond where value is highest</h2>
          <ul className="signal-list">
            <li>High-value replies rise to the top.</li>
            <li>Risky threads stay visible instead of hiding in the noise.</li>
            <li>Every suggestion remains approval-gated.</li>
          </ul>
        </section>
      </div>

      <div className="stack">
        {items.map((item) => (
          <section className="card" key={item.id}>
            <div className="split-row">
              <strong>{item.text}</strong>
              <span className={`pill ${item.riskLevel === 'high' ? 'danger' : 'success'}`}>{item.riskLevel} risk</span>
            </div>
            <div className="stat-grid" style={{ marginTop: '.75rem' }}>
              <div className="stat-tile"><span>Response value</span><strong>{item.responseValue}</strong></div>
              <div className="stat-tile"><span>Suggested delay</span><strong>{item.recommendedDelayMinutes}m</strong></div>
            </div>
            <p style={{ marginTop: '1rem' }}>{item.suggestedResponse}</p>
            <div className="inline-actions">
              <button onClick={() => approve(item.id, item.suggestedResponse, true)}>Approve</button>
              <button className="button-link secondary" onClick={() => approve(item.id, item.suggestedResponse, false)}>Reject</button>
            </div>
          </section>
        ))}
      </div>

      <section className="card">
        <h2>Approval log</h2>
        {audit.length ? (
          <ul className="timeline">
            {audit.map((entry) => <li key={entry}>{entry}</li>)}
          </ul>
        ) : (
          <p className="empty-state">Actions will appear here after you approve or reject suggested replies.</p>
        )}
      </section>
    </>
  );
}
