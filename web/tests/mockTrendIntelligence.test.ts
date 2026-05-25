import { describe, expect, it } from 'vitest';
import { kpis, trendPosts } from '@/lib/mockTrendIntelligence';

describe('mock trend intelligence data', () => {
  it('uses production-like examples with required decision fields', () => {
    expect(trendPosts.length).toBeGreaterThanOrEqual(4);
    for (const post of trendPosts) {
      expect(post.text).not.toMatch(/lorem ipsum/i);
      expect(post.signalScore).toBeGreaterThanOrEqual(0);
      expect(post.signalScore).toBeLessThanOrEqual(100);
      expect(post.recommendedAction.length).toBeGreaterThan(12);
      expect(post.newsCorrelation.length).toBeGreaterThan(12);
    }
  });

  it('derives dashboard KPI values from the mock posts', () => {
    expect(kpis.totalViews).toBe(trendPosts.reduce((sum, post) => sum + post.views, 0));
    expect(kpis.totalLikes).toBe(trendPosts.reduce((sum, post) => sum + post.likes, 0));
  });
});
