import { describe, expect, it, vi } from 'vitest';
import { readJson, writeJson } from '@/lib/store/localStore';

describe('localStore helpers', () => {
  it('writes and reads JSON values', () => {
    const storage = new Map<string, string>();
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
      },
    });

    writeJson('key', { hello: 'world' });
    expect(readJson('key', { hello: '' })).toEqual({ hello: 'world' });

    vi.unstubAllGlobals();
  });

  it('returns fallback and clears invalid JSON', () => {
    const storage = new Map<string, string>([['bad', '{']]);
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
      },
    });

    expect(readJson('bad', { ok: true })).toEqual({ ok: true });
    expect(storage.has('bad')).toBe(false);

    vi.unstubAllGlobals();
  });
});
