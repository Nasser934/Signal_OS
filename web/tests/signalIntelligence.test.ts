import { describe, expect, it } from 'vitest';
import { analysisRequestSchema, buildDemoOverview, exportRequestSchema, settingsUpdateSchema } from '@/lib/server/signalIntelligence';

describe('signal intelligence backend read model', () => {
  it('builds a complete dashboard overview for the static frontend', () => {
    const overview = buildDemoOverview('dashboard');

    expect(overview.kpis.length).toBeGreaterThanOrEqual(4);
    expect(overview.posts.length).toBeGreaterThanOrEqual(3);
    expect(overview.creators[0]).toMatchObject({ handle: expect.stringContaining('@') });
    expect(overview.hashtags[0].hashtag).toMatch(/^#/);
    expect(overview.reportJobs.length).toBeGreaterThan(0);
  });

  it('validates backend action payloads', () => {
    expect(exportRequestSchema.parse({ name: 'Board pack', scope: 'Last 30 days', format: 'PDF + CSV' }).format).toBe('PDF + CSV');
    expect(settingsUpdateSchema.parse({ workspaceName: 'Apex Growth Lab', defaultDateRange: 'last_30_days' }).workspaceName).toBe('Apex Growth Lab');
    expect(analysisRequestSchema.parse({ topic: 'AI workflow teardown' }).topic).toBe('AI workflow teardown');
  });
});
