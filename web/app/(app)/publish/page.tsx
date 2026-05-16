'use client';

import Link from 'next/link';
import { useState } from 'react';
import { STORE_KEYS, type PublishedPost } from '@/lib/store/localStore';

export default function PublishPage() {
  const [draftText, setDraftText] = useState('');
  const [postUrl, setPostUrl] = useState('');
  const [msg, setMsg] = useState('');
  const [post, setPost] = useState<PublishedPost | null>(null);

  async function onPublish() {
    const mode = (window.localStorage.getItem(STORE_KEYS.mode) as PublishedPost['sourceMode'] | null) ?? 'manual';
    const res = await fetch('/api/publish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ draftText, postUrl, sourceMode: mode }) });
    const body = (await res.json()) as { post?: PublishedPost; error?: string };
    if (!res.ok || !body.post) {
      setMsg(body.error ?? 'publish failed');
      return;
    }
    setPost(body.post);
    const raw = window.localStorage.getItem(STORE_KEYS.posts);
    const list = raw ? (JSON.parse(raw) as PublishedPost[]) : [];
    window.localStorage.setItem(STORE_KEYS.posts, JSON.stringify([body.post, ...list].slice(0, 25)));
    setMsg('Post marked as published.');
  }

  return (
    <>
      <h1>Publish Tracking</h1>
      <section className="card">
        <label>Final text</label>
        <textarea rows={4} value={draftText} onChange={(e) => setDraftText(e.target.value)} />
        <label>Post URL</label>
        <input value={postUrl} onChange={(e) => setPostUrl(e.target.value)} />
        <button onClick={onPublish}>Mark published</button>
        {msg ? <p>{msg}</p> : null}
        {post ? <p><Link href={`/command-center/${post.id}`}>Open command center</Link></p> : null}
      </section>
    </>
  );
}
