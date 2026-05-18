'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LoopRail, PageHeader } from '@/components/app-ui';
import type { PublishedPost } from '@/lib/store/localStore';

export default function PublishPage() {
  const [draftText, setDraftText] = useState('');
  const [postUrl, setPostUrl] = useState('');
  const [msg, setMsg] = useState('');
  const [post, setPost] = useState<PublishedPost | null>(null);

  async function onPublish() {
    try {
      new URL(postUrl);
    } catch {
      setMsg('Post URL must be a valid URL');
      return;
    }
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftText, postUrl, sourceMode: 'manual' }),
      });
      const body = (await res.json()) as { post?: PublishedPost; error?: string };
      if (!res.ok || !body.post) {
        setMsg(body.error ?? 'Publish failed');
        return;
      }
      setPost(body.post);
      setMsg('Post marked as published.');
    } catch (error) {
      setMsg(`Network error: ${error instanceof Error ? error.message : 'Failed to publish'}`);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Publish"
        title="Move from prediction to action"
        description="Attach the live post URL, preserve the final wording, and open the first-hour workflow immediately after publishing."
      />
      <LoopRail active="Publish" />

      <div className="grid-2">
        <section className="card">
          <label htmlFor="publish-text">Final post text</label>
          <textarea
            id="publish-text"
            rows={9}
            value={draftText}
            onChange={(event) => setDraftText(event.target.value)}
            placeholder="Paste the exact wording that went live..."
          />
          <label htmlFor="publish-url">Live post URL</label>
          <input
            id="publish-url"
            value={postUrl}
            onChange={(event) => setPostUrl(event.target.value)}
            placeholder="https://x.com/..."
          />
          <div className="inline-actions">
            <button onClick={onPublish}>Mark published</button>
            <Link className="button-link secondary" href="/draft">Back to draft</Link>
          </div>
          {msg ? <p style={{ marginTop: '1rem' }}>{msg}</p> : null}
        </section>

        <div className="stack">
          <section className="card">
            <p className="eyebrow">Next 60 minutes</p>
            <h2>What happens after publishing</h2>
            <ul className="signal-list">
              <li>Capture 10m, 30m, and 60m checkpoints.</li>
              <li>Watch momentum before the post goes cold.</li>
              <li>Open the reply queue when valuable responses arrive.</li>
            </ul>
          </section>

          {post ? (
            <section className="card">
              <p className="eyebrow">Ready</p>
              <h2>Command center opened</h2>
              <p className="muted">The post is now tracked as a live experiment.</p>
              <div className="inline-actions">
                <Link className="button-link" href={`/command-center/${post.id}`}>Open command center</Link>
                <Link className="button-link secondary" href={`/autopsy/${post.id}`}>View autopsy</Link>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </>
  );
}
