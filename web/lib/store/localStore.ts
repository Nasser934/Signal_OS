export type ApiMode = 'full_api' | 'byo_api_key' | 'manual';

export interface PublishedPost {
  id: string;
  draftText: string;
  postUrl: string;
  sourceMode: ApiMode;
  publishedAt: string;
}

export interface MetricPoint {
  postId: string;
  checkpoint: '10m' | '30m' | '60m' | '24h' | '7d';
  capturedAt: string;
  source: ApiMode;
  impressions: number;
  likes: number;
  replies: number;
  reposts: number;
  bookmarks: number;
}

export const STORE_KEYS = {
  posts: 'signalos:publishedPosts',
  metrics: 'signalos:postMetrics',
  mode: 'signalos:apiMode',
  draftRuns: 'signalos:draftRuns',
} as const;

export function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    window.localStorage.removeItem(key);
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}
