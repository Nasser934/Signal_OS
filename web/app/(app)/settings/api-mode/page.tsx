'use client';

import { useEffect, useState } from 'react';
import { STORE_KEYS } from '@/lib/store/localStore';

export default function ApiModePage() {
  const [mode, setMode] = useState<'full_api' | 'byo_api_key' | 'manual'>('manual');

  useEffect(() => {
    const saved = window.localStorage.getItem(STORE_KEYS.mode) as 'full_api' | 'byo_api_key' | 'manual' | null;
    if (saved) setMode(saved);
  }, []);

  function onChange(next: 'full_api' | 'byo_api_key' | 'manual') {
    setMode(next);
    window.localStorage.setItem(STORE_KEYS.mode, next);
  }

  return (
    <>
      <h1>API Mode</h1>
      <section className="card">
        <label><input type="radio" checked={mode === 'full_api'} onChange={() => onChange('full_api')} /> Full API Mode</label>
        <label><input type="radio" checked={mode === 'byo_api_key'} onChange={() => onChange('byo_api_key')} /> BYO API Key</label>
        <label><input type="radio" checked={mode === 'manual'} onChange={() => onChange('manual')} /> Manual Mode</label>
      </section>
    </>
  );
}
