export interface PublishedPost {
  id: string;
  draftText: string;
  postUrl: string;
  sourceMode: 'full_api' | 'byo_api_key' | 'manual';
  publishedAt: string;
}

export interface MetricPoint {
  postId: string;
  checkpoint: '10m' | '30m' | '60m' | '24h' | '7d';
  capturedAt: string;
  source: 'full_api' | 'byo_api_key' | 'manual';
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
} as const;
