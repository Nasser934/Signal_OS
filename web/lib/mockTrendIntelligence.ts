export type TrendDirection = 'rising' | 'stable' | 'cooling';
export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface TrendPost {
  id: string;
  text: string;
  creatorHandle: string;
  likes: number;
  views: number;
  reposts: number;
  replies: number;
  postedAt: string;
  topic: string;
  format: string;
  hookType: string;
  language: 'English' | 'Arabic';
  sentiment: Sentiment;
  aiContentFlag: boolean;
  signalScore: number;
  hashtags: string[];
  newsCorrelation: string;
  forecastDirection: TrendDirection;
  recommendedAction: string;
}

export const trendPosts: TrendPost[] = [
  {
    id: 'post-001',
    text: 'A small onboarding change lifted activation because it removed one decision from the first session.',
    creatorHandle: '@saas_ops',
    likes: 1840,
    views: 88200,
    reposts: 312,
    replies: 94,
    postedAt: '2026-05-22T09:20:00Z',
    topic: 'Product-led growth',
    format: 'Founder teardown',
    hookType: 'specific result',
    language: 'English',
    sentiment: 'positive',
    aiContentFlag: false,
    signalScore: 91,
    hashtags: ['#SaaS', '#ProductGrowth'],
    newsCorrelation: 'Connected to a broader discussion about lower-friction trials after two major PLG reports.',
    forecastDirection: 'rising',
    recommendedAction: 'Good candidate for content testing this week.',
  },
  {
    id: 'post-002',
    text: 'فرق النمو العربية بدأت تتفاعل أكثر مع أمثلة الذكاء الاصطناعي العملية وليس الأخبار العامة.',
    creatorHandle: '@mena_growth',
    likes: 970,
    views: 41100,
    reposts: 188,
    replies: 71,
    postedAt: '2026-05-22T16:45:00Z',
    topic: 'Arabic AI workflows',
    format: 'Market observation',
    hookType: 'regional contrast',
    language: 'Arabic',
    sentiment: 'positive',
    aiContentFlag: false,
    signalScore: 87,
    hashtags: ['#AI', '#Growth'],
    newsCorrelation: 'Regional AI adoption coverage increased after new enterprise tooling announcements.',
    forecastDirection: 'rising',
    recommendedAction: 'Arabic posts are outperforming English posts in engagement rate.',
  },
  {
    id: 'post-003',
    text: 'Every AI agent demo looks good until the approval workflow touches real customer data.',
    creatorHandle: '@ops_founder',
    likes: 642,
    views: 30500,
    reposts: 126,
    replies: 63,
    postedAt: '2026-05-23T07:10:00Z',
    topic: 'AI agent governance',
    format: 'Contrarian one-liner',
    hookType: 'risk tension',
    language: 'English',
    sentiment: 'neutral',
    aiContentFlag: false,
    signalScore: 82,
    hashtags: ['#AIAgents', '#Security'],
    newsCorrelation: 'Spike appears connected to a specific news event about enterprise AI approvals.',
    forecastDirection: 'stable',
    recommendedAction: 'Monitor for 48 hours before acting.',
  },
  {
    id: 'post-004',
    text: 'This hashtag has reach, but most posts under it are generic launch copy with weak buyer intent.',
    creatorHandle: '@agency_signal',
    likes: 411,
    views: 25600,
    reposts: 58,
    replies: 21,
    postedAt: '2026-05-23T12:30:00Z',
    topic: 'Launch messaging',
    format: 'Hashtag audit',
    hookType: 'quality warning',
    language: 'English',
    sentiment: 'negative',
    aiContentFlag: true,
    signalScore: 64,
    hashtags: ['#BuildInPublic', '#Launch'],
    newsCorrelation: 'No strong news correlation; movement is likely creator-driven saturation.',
    forecastDirection: 'cooling',
    recommendedAction: 'This hashtag has high reach but weak conversion intent.',
  },
];

export const kpis = {
  totalPostsAnalyzed: trendPosts.length * 1240,
  totalViews: trendPosts.reduce((sum, post) => sum + post.views, 0),
  totalLikes: trendPosts.reduce((sum, post) => sum + post.likes, 0),
  signalScore: Math.round(trendPosts.reduce((sum, post) => sum + post.signalScore, 0) / trendPosts.length),
  aiContentPercentage: Math.round((trendPosts.filter((post) => post.aiContentFlag).length / trendPosts.length) * 100),
  activeTrendCount: trendPosts.filter((post) => post.forecastDirection === 'rising').length,
};

export const topicPerformance = [
  { topic: 'Product-led growth', score: 91, velocity: 34 },
  { topic: 'Arabic AI workflows', score: 87, velocity: 41 },
  { topic: 'AI agent governance', score: 82, velocity: 22 },
  { topic: 'Launch messaging', score: 64, velocity: -12 },
];

export const timeline = [
  { label: 'Mon', score: 62 },
  { label: 'Tue', score: 69 },
  { label: 'Wed', score: 76 },
  { label: 'Thu', score: 72 },
  { label: 'Fri', score: 84 },
  { label: 'Sat', score: 89 },
  { label: 'Sun', score: 81 },
];

export const intelligenceInsights = [
  'This trend is gaining early momentum but has low creator diversity.',
  'Arabic posts are outperforming English posts in engagement rate.',
  'The trend spike appears connected to a specific news event.',
  'Monitor for 48 hours before committing paid distribution.',
];
