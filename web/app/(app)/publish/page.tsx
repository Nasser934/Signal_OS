'use client';

import Link from 'next/link';
import { useState } from 'react';
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
      const res = await fetch('/api/publish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ draftText, postUrl, sourceMode: 'manual' }) });
      const body = (await res.json()) as { post?: PublishedPost; error?: string };
      if (!res.ok || !body.post) {
        setMsg(body.error ?? 'publish failed');
        return;
      }
      setPost(body.post);
      setMsg('Post marked as published.');
    } catch (error) {
      setMsg(`Network error: ${error instanceof Error ? error.message : 'Failed to publish'}`);
      return;
    }
  }

  return (
    <>
      <h1>Publish Tracking</h1>
      <section className="card">
        <label htmlFor="publish-text">Final text</label>
        <textarea id="publish-text" rows={4} value={draftText} onChange={(e) => setDraftText(e.target.value)} />
        <label htmlFor="publish-url">Post URL</label>
        <input id="publish-url" value={postUrl} onChange={(e) => setPostUrl(e.target.value)} />
        <button onClick={onPublish}>Mark published</button>
        {msg ? <p>{msg}</p> : null}
        {post ? <p><Link href={`/command-center/${post.id}`}>Open command center</Link></p> : null}
      </section>
    </>
  );
}
