import { z } from 'zod';
import { AppError } from '@/lib/observability/logger';
import { env } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';
import type { AppUser } from '@/lib/server/auth';

export const pageSchema = z.enum([
  'dashboard',
  'timeline',
  'creators',
  'hashtags',
  'topics',
  'sentiment',
  'forecast',
  'insights',
  'reports',
  'settings',
]);

export type SignalPage = z.infer<typeof pageSchema>;

export interface SignalKpi {
  label: string;
  value: string;
  delta: string;
  tone?: 'good' | 'warn' | 'bad' | 'info';
}

export interface SignalPostRecord {
  id: string;
  postedAt: string;
  postText: string;
  creatorHandle: string;
  creatorName: string;
  topic: string;
  format: string;
  hookType: string;
  language: string;
  views: number;
  likes: number;
  replies: number;
  reposts: number;
  sentiment: 'positive' | 'neutral' | 'mixed' | 'negative';
  aiContentFlag: boolean;
  signalScore: number;
  hashtags: string[];
  newsCorrelation: string;
  forecast: 'up' | 'flat' | 'down';
  recommendedAction: string;
  decision: 'act' | 'monitor' | 'ignore';
}

export interface ExportJob {
  id: string;
  report: string;
  scope: string;
  format: string;
  status: 'queued' | 'running' | 'ready' | 'failed' | 'needs_source';
  owner: string;
  createdAt: string;
}

export interface SignalSettings {
  workspaceName: string;
  defaultDateRange: 'last_30_days' | 'last_7_days' | 'quarter_to_date';
  sources: Array<{ source: string; purpose: string; status: string; lastSync: string }>;
}

export interface SignalOverview {
  page: SignalPage;
  mode: 'demo' | 'database';
  kpis: SignalKpi[];
  posts: SignalPostRecord[];
  leaderboard: Array<{ rank: string; title: string; subtitle: string; score: number }>;
  topics: Array<{ topic: string; bestFormat: string; hookType: string; sentiment: string; newsCorrelation: string; forecast: string; recommendedAction: string; signalScore: number }>;
  creators: Array<{ creator: string; handle: string; topHook: string; language: string; views: number; replies: number; signal: number; action: string }>;
  hashtags: Array<{ hashtag: string; posts: number; views: number; reposts: number; sentiment: string; forecast: string; action: string }>;
  sentimentDrivers: Array<{ driver: string; samplePostText: string; sentiment: string; risk: string; recommendedAction: string }>;
  forecasts: Array<{ topic: string; forecast: string; confidence: number; newsDependency: string; recommendedAction: string }>;
  insights: Array<{ decision: string; title: string; body: string }>;
  reportJobs: ExportJob[];
  settings: SignalSettings;
}

export const exportRequestSchema = z.object({
  name: z.string().trim().min(1).max(120).default('Current dashboard report'),
  scope: z.string().trim().min(1).max(80).default('Last 30 days'),
  format: z.enum(['PDF', 'CSV', 'PDF + CSV']).default('PDF + CSV'),
});

export const settingsUpdateSchema = z.object({
  workspaceName: z.string().trim().min(1).max(120),
  defaultDateRange: z.enum(['last_30_days', 'last_7_days', 'quarter_to_date']),
});

export const analysisRequestSchema = z.object({
  topic: z.string().trim().min(1).max(120).default('AI workflow teardown'),
  decisionMode: z.string().trim().max(120).optional(),
});

const demoPosts: SignalPostRecord[] = [
  {
    id: 'demo-post-1',
    postedAt: '2026-05-24T09:20:00Z',
    postText: 'I rebuilt our reporting workflow with agents and cut review time.',
    creatorHandle: '@maya.builds',
    creatorName: 'Maya Chen',
    topic: 'AI workflow teardown',
    format: 'Short video',
    hookType: 'Before / after',
    language: 'EN',
    views: 1_800_000,
    likes: 74_000,
    replies: 3_920,
    reposts: 18_400,
    sentiment: 'positive',
    aiContentFlag: false,
    signalScore: 94,
    hashtags: ['#aiworkflow', '#agentstack'],
    newsCorrelation: 'Model release recap',
    forecast: 'up',
    recommendedAction: 'Act with creator briefs',
    decision: 'act',
  },
  {
    id: 'demo-post-2',
    postedAt: '2026-05-23T18:42:00Z',
    postText: 'The best AI stack is the one your ops team can audit.',
    creatorHandle: '@growthops',
    creatorName: 'Rafa Ortiz',
    topic: 'Agent stack evaluation',
    format: 'Thread',
    hookType: 'Tool comparison',
    language: 'ES',
    views: 840_000,
    likes: 31_200,
    replies: 1_240,
    reposts: 8_200,
    sentiment: 'mixed',
    aiContentFlag: false,
    signalScore: 86,
    hashtags: ['#agentstack', '#foundertools'],
    newsCorrelation: 'Enterprise AI policy',
    forecast: 'up',
    recommendedAction: 'Monitor quality',
    decision: 'monitor',
  },
  {
    id: 'demo-post-3',
    postedAt: '2026-05-22T12:14:00Z',
    postText: 'Everyone is shipping agents. Few are tracking failure modes.',
    creatorHandle: '@productintel',
    creatorName: 'Aiko Tan',
    topic: 'Generic AI tools',
    format: 'Carousel',
    hookType: 'Risk tension',
    language: 'JA',
    views: 520_000,
    likes: 16_100,
    replies: 980,
    reposts: 4_900,
    sentiment: 'negative',
    aiContentFlag: true,
    signalScore: 79,
    hashtags: ['#aitools'],
    newsCorrelation: 'Safety report coverage',
    forecast: 'flat',
    recommendedAction: 'Ignore broad angle',
    decision: 'ignore',
  },
];

const demoReportJobs: ExportJob[] = [
  { id: 'report-1', report: 'AI workflow momentum brief', scope: 'Last 30 days', format: 'PDF + CSV', status: 'ready', owner: 'Leah', createdAt: '2026-05-24T10:18:00Z' },
  { id: 'report-2', report: 'Creator cohort export', scope: 'QTD', format: 'CSV', status: 'running', owner: 'Omar', createdAt: '2026-05-24T09:41:00Z' },
  { id: 'report-3', report: 'Risk and sentiment pack', scope: 'Last 7 days', format: 'PDF', status: 'needs_source', owner: 'Maya', createdAt: '2026-05-23T16:20:00Z' },
];

const demoSettings: SignalSettings = {
  workspaceName: 'Apex Growth Lab',
  defaultDateRange: 'last_30_days',
  sources: [
    { source: 'Social import API', purpose: 'Posts, views, replies, reposts', status: 'Connected', lastSync: 'May 24 10:18' },
    { source: 'News correlation feed', purpose: 'Events mapped to trend movement', status: 'Connected', lastSync: 'May 24 09:41' },
    { source: 'Report storage', purpose: 'Exported PDFs and CSVs', status: 'Mock mode', lastSync: '-' },
  ],
};

export function buildDemoOverview(page: SignalPage = 'dashboard'): SignalOverview {
  const totalViews = demoPosts.reduce((sum, post) => sum + post.views, 0);
  const totalLikes = demoPosts.reduce((sum, post) => sum + post.likes, 0);
  const avgSignal = demoPosts.reduce((sum, post) => sum + post.signalScore, 0) / demoPosts.length;
  const aiFlagRate = Math.round((demoPosts.filter((post) => post.aiContentFlag).length / demoPosts.length) * 100);

  return {
    page,
    mode: 'demo',
    kpis: [
      { label: 'Composite signal score', value: avgSignal.toFixed(1), delta: '+12.8 vs previous cycle', tone: 'good' },
      { label: 'Tracked posts', value: '18,420', delta: '4 sources connected', tone: 'info' },
      { label: 'Total views', value: formatCompact(totalViews), delta: `${formatCompact(totalLikes)} likes captured`, tone: 'good' },
      { label: 'AI-content flag', value: `${aiFlagRate}%`, delta: 'needs review in generic tags', tone: 'warn' },
    ],
    posts: demoPosts,
    leaderboard: demoPosts.map((post, index) => ({
      rank: String(index + 1).padStart(2, '0'),
      title: post.topic,
      subtitle: `Hook: ${post.hookType}`,
      score: post.signalScore,
    })),
    topics: [
      { topic: 'AI workflow teardown', bestFormat: 'Short video', hookType: 'Before / after', sentiment: 'Positive', newsCorrelation: 'Model release recap', forecast: 'Up', recommendedAction: 'Act with creator briefs', signalScore: 94 },
      { topic: 'Agent stack evaluation', bestFormat: 'Thread', hookType: 'Tool comparison', sentiment: 'Mixed', newsCorrelation: 'Enterprise adoption news', forecast: 'Up', recommendedAction: 'Monitor quality', signalScore: 86 },
      { topic: 'Generic AI tools', bestFormat: 'Carousel', hookType: 'Listicle', sentiment: 'Mixed', newsCorrelation: 'Low', forecast: 'Flat', recommendedAction: 'Ignore broad angle', signalScore: 79 },
    ],
    creators: demoPosts.map((post) => ({
      creator: post.creatorName,
      handle: post.creatorHandle,
      topHook: post.hookType,
      language: post.language,
      views: post.views,
      replies: post.replies,
      signal: post.signalScore,
      action: post.recommendedAction,
    })),
    hashtags: [
      { hashtag: '#aiworkflow', posts: 4280, views: 12_600_000, reposts: 92_000, sentiment: 'Positive', forecast: 'Up', action: 'Act' },
      { hashtag: '#aitools', posts: 9840, views: 25_100_000, reposts: 140_000, sentiment: 'Mixed', forecast: 'Flat', action: 'Ignore broad use' },
      { hashtag: '#agentstack', posts: 1744, views: 6_400_000, reposts: 61_000, sentiment: 'Positive', forecast: 'Up', action: 'Monitor' },
    ],
    sentimentDrivers: [
      { driver: 'Workflow proof', samplePostText: 'This agent pipeline saved the team two review cycles.', sentiment: 'Positive', risk: 'Low', recommendedAction: 'Act' },
      { driver: 'Privacy concern', samplePostText: 'Teams are pasting sensitive data into every AI tool.', sentiment: 'Negative', risk: 'High', recommendedAction: 'Address in messaging' },
      { driver: 'Tool fatigue', samplePostText: 'Another AI dashboard, another learning curve.', sentiment: 'Mixed', risk: 'Medium', recommendedAction: 'Monitor' },
    ],
    forecasts: [
      { topic: 'AI workflow teardown', forecast: 'Up', confidence: 72, newsDependency: 'Model release cycle', recommendedAction: 'Act' },
      { topic: 'Generic AI tools', forecast: 'Flat', confidence: 61, newsDependency: 'Low', recommendedAction: 'Ignore' },
      { topic: 'Agent stack evaluation', forecast: 'Up', confidence: 68, newsDependency: 'Enterprise adoption news', recommendedAction: 'Monitor' },
    ],
    insights: [
      { decision: 'Act', title: 'Creator brief opportunity', body: 'Invite three high-signal creators to publish before/after workflow stories tied to the current model release news cycle.' },
      { decision: 'Monitor', title: 'Privacy concern thread', body: 'Negative sentiment is concentrated around data handling. Prepare trust messaging before scaling campaign spend.' },
      { decision: 'Ignore', title: 'Generic AI tools listicles', body: 'Views are high but signal quality is low, with elevated AI-content flags and weak reply depth.' },
    ],
    reportJobs: demoReportJobs,
    settings: demoSettings,
  };
}

export async function getSignalOverview(user: AppUser, page: SignalPage): Promise<SignalOverview> {
  if (env.APP_MODE === 'demo') return buildDemoOverview(page);

  const supabase = await createClient();
  const workspaceId = await getActiveWorkspaceId(supabase, user.id);
  if (!workspaceId) return buildDemoOverview(page);

  const [{ data: posts }, { data: reports }] = await Promise.all([
    supabase
      .from('signal_posts')
      .select('id, posted_at, post_text, format, hook_type, language, views, likes, replies, reposts, sentiment, ai_content_flag, signal_score, forecast, action, recommended_action')
      .eq('workspace_id', workspaceId)
      .order('posted_at', { ascending: false })
      .limit(50),
    supabase
      .from('signal_reports')
      .select('id, name, scope, format, status, owner_name, created_at')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  const overview = buildDemoOverview(page);
  const mappedPosts = (posts ?? []).map((post: any): SignalPostRecord => ({
    id: post.id,
    postedAt: post.posted_at,
    postText: post.post_text,
    creatorHandle: '@unknown',
    creatorName: 'Unknown creator',
    topic: 'Unclassified',
    format: post.format ?? 'Unknown',
    hookType: post.hook_type ?? 'Unknown',
    language: post.language ?? 'Unknown',
    views: Number(post.views ?? 0),
    likes: Number(post.likes ?? 0),
    replies: Number(post.replies ?? 0),
    reposts: Number(post.reposts ?? 0),
    sentiment: post.sentiment ?? 'neutral',
    aiContentFlag: Boolean(post.ai_content_flag),
    signalScore: Number(post.signal_score ?? 0),
    hashtags: [],
    newsCorrelation: 'Stored record',
    forecast: post.forecast ?? 'flat',
    recommendedAction: post.recommended_action ?? 'Monitor',
    decision: post.action ?? 'monitor',
  }));

  return {
    ...overview,
    mode: 'database',
    posts: mappedPosts.length ? mappedPosts : overview.posts,
    reportJobs: (reports ?? []).map((report: any) => ({
      id: report.id,
      report: report.name,
      scope: report.scope,
      format: report.format,
      status: report.status,
      owner: report.owner_name ?? 'Workspace',
      createdAt: report.created_at,
    })),
  };
}

export async function createExportJob(user: AppUser, input: z.infer<typeof exportRequestSchema>): Promise<ExportJob> {
  const parsed = exportRequestSchema.parse(input);
  if (env.APP_MODE === 'demo') {
    return {
      id: `demo-export-${Date.now()}`,
      report: parsed.name,
      scope: parsed.scope,
      format: parsed.format,
      status: 'queued',
      owner: 'Demo user',
      createdAt: new Date().toISOString(),
    };
  }

  const supabase = await createClient();
  const workspaceId = await getActiveWorkspaceId(supabase, user.id);
  if (!workspaceId) throw new AppError('Workspace is required before creating reports', 'VALIDATION_ERROR', 400);

  const { data, error } = await supabase
    .from('signal_reports')
    .insert({
      workspace_id: workspaceId,
      name: parsed.name,
      scope: parsed.scope,
      format: parsed.format,
      status: 'queued',
      owner_name: user.id,
    })
    .select('id, name, scope, format, status, owner_name, created_at')
    .single();
  if (error) throw error;

  return {
    id: data.id,
    report: data.name,
    scope: data.scope,
    format: data.format,
    status: data.status,
    owner: data.owner_name ?? 'Workspace',
    createdAt: data.created_at,
  };
}

export async function generateInsight(input: z.infer<typeof analysisRequestSchema>) {
  const parsed = analysisRequestSchema.parse(input);
  return {
    status: 'generated',
    source: 'heuristic',
    insight: `Recommendation: accelerate creator briefs around ${parsed.topic} while monitoring privacy and low-originality AI-content risks.`,
    generatedAt: new Date().toISOString(),
  };
}

export async function getSettings(user: AppUser): Promise<SignalSettings> {
  if (env.APP_MODE === 'demo') return demoSettings;
  const supabase = await createClient();
  const workspaceId = await getActiveWorkspaceId(supabase, user.id);
  if (!workspaceId) return demoSettings;
  const { data } = await supabase.from('workspaces').select('name, default_date_range').eq('id', workspaceId).maybeSingle();
  return {
    ...demoSettings,
    workspaceName: data?.name ?? demoSettings.workspaceName,
    defaultDateRange: normalizeDateRange(data?.default_date_range),
  };
}

export async function updateSettings(user: AppUser, input: z.infer<typeof settingsUpdateSchema>): Promise<SignalSettings> {
  const parsed = settingsUpdateSchema.parse(input);
  if (env.APP_MODE === 'demo') return { ...demoSettings, workspaceName: parsed.workspaceName, defaultDateRange: parsed.defaultDateRange };

  const supabase = await createClient();
  const workspaceId = await getActiveWorkspaceId(supabase, user.id);
  if (!workspaceId) throw new AppError('Workspace is required before saving settings', 'VALIDATION_ERROR', 400);
  const { error } = await supabase
    .from('workspaces')
    .update({ name: parsed.workspaceName, default_date_range: parsed.defaultDateRange, updated_at: new Date().toISOString() })
    .eq('id', workspaceId);
  if (error) throw error;
  return getSettings(user);
}

async function getActiveWorkspaceId(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<string | null> {
  const { data: settings } = await supabase.from('user_settings').select('active_workspace_id').eq('user_id', userId).maybeSingle();
  if (settings?.active_workspace_id) return settings.active_workspace_id;
  const { data: membership } = await supabase.from('workspace_members').select('workspace_id').eq('user_id', userId).limit(1).maybeSingle();
  return membership?.workspace_id ?? null;
}

function normalizeDateRange(value: unknown): SignalSettings['defaultDateRange'] {
  return value === 'last_7_days' || value === 'quarter_to_date' ? value : 'last_30_days';
}

function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}k`;
  return String(value);
}
