-- Signal OS MVP schema (Supabase/Postgres)
-- Core loop: Score -> Improve -> Publish -> Track -> Learn

create extension if not exists pgcrypto;

-- ----------
-- Enums
-- ----------
create type api_mode as enum ('full_api', 'byo_api_key', 'manual');
create type metric_source as enum ('full_api', 'byo_api_key', 'manual');
create type score_status as enum ('draft', 'scored', 'published', 'archived');

-- ----------
-- Users (1:1 with auth.users)
-- ----------
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  display_name text,
  plan text not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------
-- Drafts
-- ----------
create table if not exists public.drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  text text not null check (char_length(text) between 1 and 10000),
  topic text,
  audience text,
  tone text,
  account_context jsonb not null default '{}'::jsonb,
  status score_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);

-- ----------
-- Scores (explainable, versioned)
-- ----------
create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid not null,
  user_id uuid not null references public.users(id) on delete cascade,
  model_version text not null default 'rules-v1',
  rule_version text not null default 'ruleset-2026-05',
  total_score numeric(5,2) not null check (total_score >= 0 and total_score <= 100),
  components jsonb not null,
  explanation text not null,
  weaknesses jsonb not null default '[]'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  prediction_range_low integer,
  prediction_range_high integer,
  score_confidence numeric(4,3) check (score_confidence >= 0 and score_confidence <= 1),
  created_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (draft_id, user_id) references public.drafts(id, user_id) on delete cascade
);

-- ----------
-- Published posts
-- ----------
create table if not exists public.published_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  draft_id uuid,
  score_id uuid,
  source_mode api_mode not null,
  x_post_id text,
  post_url text,
  final_text text not null,
  published_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (user_id, post_url),
  unique (id, user_id),
  foreign key (draft_id, user_id) references public.drafts(id, user_id) on delete set null,
  foreign key (score_id, user_id) references public.scores(id, user_id) on delete set null
);

-- ----------
-- Post metrics (time-series snapshots)
-- ----------
create table if not exists public.post_metrics (
  id bigserial primary key,
  post_id uuid not null,
  user_id uuid not null references public.users(id) on delete cascade,
  source metric_source not null,
  captured_at timestamptz not null,
  impressions integer,
  likes integer,
  replies integer,
  reposts integer,
  bookmarks integer,
  profile_visits integer,
  follower_growth integer,
  check (impressions is null or impressions >= 0),
  check (likes is null or likes >= 0),
  check (replies is null or replies >= 0),
  check (reposts is null or reposts >= 0),
  check (bookmarks is null or bookmarks >= 0),
  check (profile_visits is null or profile_visits >= 0),
  check (follower_growth is null or follower_growth >= 0),
  engagement_rate numeric(8,5),
  impression_velocity numeric(12,4),
  reply_velocity numeric(12,4),
  repost_velocity numeric(12,4),
  metric_confidence numeric(4,3) default 1 check (metric_confidence >= 0 and metric_confidence <= 1),
  missing_fields text[] not null default '{}',
  is_user_edited boolean not null default false,
  created_at timestamptz not null default now(),
  unique(post_id, captured_at),
  foreign key (post_id, user_id) references public.published_posts(id, user_id) on delete cascade
);

-- ----------
-- BYO API credentials (encrypted material only)
-- ----------
create table if not exists public.api_credentials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  provider text not null default 'x',
  mode api_mode not null check (mode in ('full_api', 'byo_api_key')),
  encrypted_key bytea not null,
  encrypted_secret bytea,
  key_fingerprint text not null,
  last_validated_at timestamptz,
  validation_status text not null default 'pending',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, provider, key_fingerprint)
);

-- ----------
-- Human approval queue (for post-publish actions)
-- ----------
create table if not exists public.approval_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  post_id uuid,
  action_type text not null, -- reply_suggestion, timing_recommendation, risk_flag
  payload jsonb not null,
  approval_status text not null default 'pending' check (approval_status in ('pending','approved','rejected')),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  foreign key (post_id, user_id) references public.published_posts(id, user_id) on delete cascade
);

-- ----------
-- Indexes
-- ----------
create index if not exists idx_drafts_user_created on public.drafts(user_id, created_at desc);
create index if not exists idx_scores_user_created on public.scores(user_id, created_at desc);
create index if not exists idx_scores_draft on public.scores(draft_id);
create index if not exists idx_published_posts_user_published on public.published_posts(user_id, published_at desc);
create index if not exists idx_post_metrics_post_captured on public.post_metrics(post_id, captured_at desc);
create index if not exists idx_post_metrics_user_captured on public.post_metrics(user_id, captured_at desc);
create index if not exists idx_api_credentials_user_active on public.api_credentials(user_id, is_active);
create index if not exists idx_approval_actions_user_status on public.approval_actions(user_id, approval_status, created_at desc);

-- ----------
-- RLS
-- ----------
alter table public.users enable row level security;
alter table public.drafts enable row level security;
alter table public.scores enable row level security;
alter table public.published_posts enable row level security;
alter table public.post_metrics enable row level security;
alter table public.api_credentials enable row level security;
alter table public.approval_actions enable row level security;

create policy "users_select_own" on public.users for select using (auth.uid() = id);
create policy "users_update_own" on public.users for update using (auth.uid() = id);
create policy "users_insert_own" on public.users for insert with check (auth.uid() = id);

create policy "drafts_all_own" on public.drafts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "scores_all_own" on public.scores for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "published_posts_all_own" on public.published_posts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "post_metrics_all_own" on public.post_metrics for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "api_credentials_all_own" on public.api_credentials for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "approval_actions_all_own" on public.approval_actions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
