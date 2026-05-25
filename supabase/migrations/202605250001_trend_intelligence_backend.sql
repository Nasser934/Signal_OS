-- Trend intelligence backend support for the static Signal OS frontend.
-- Adds workspace-scoped storage for dashboard, timeline, creators, hashtags,
-- topics, sentiment, forecasts, insights, reports, exports, settings, imports,
-- usage, and audit events. Existing migrations are intentionally left unchanged.

do $$
begin
  create type public.workspace_role as enum ('owner', 'admin', 'member', 'viewer');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.signal_sentiment as enum ('positive', 'neutral', 'mixed', 'negative');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.forecast_direction as enum ('up', 'flat', 'down');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.signal_action as enum ('act', 'monitor', 'ignore');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.export_status as enum ('queued', 'running', 'ready', 'failed', 'needs_source');
exception when duplicate_object then null;
end $$;

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  default_date_range text not null default 'last_30_days',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, name)
);

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role public.workspace_role not null default 'member',
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create table if not exists public.signal_creators (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  handle text not null,
  display_name text,
  language text,
  audience_fit text,
  created_at timestamptz not null default now(),
  unique (workspace_id, handle)
);

create table if not exists public.signal_topics (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  best_format text,
  hook_type text,
  signal_score numeric(5,2) not null default 0 check (signal_score >= 0 and signal_score <= 100),
  created_at timestamptz not null default now(),
  unique (workspace_id, name)
);

create table if not exists public.signal_hashtags (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  tag text not null,
  post_count integer not null default 0 check (post_count >= 0),
  views integer not null default 0 check (views >= 0),
  reposts integer not null default 0 check (reposts >= 0),
  sentiment public.signal_sentiment not null default 'neutral',
  forecast public.forecast_direction not null default 'flat',
  recommended_action text,
  created_at timestamptz not null default now(),
  unique (workspace_id, tag)
);

create table if not exists public.signal_posts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  creator_id uuid references public.signal_creators(id) on delete set null,
  topic_id uuid references public.signal_topics(id) on delete set null,
  post_text text not null check (char_length(post_text) between 1 and 10000),
  source_url text,
  posted_at timestamptz not null,
  format text,
  hook_type text,
  language text,
  views integer not null default 0 check (views >= 0),
  likes integer not null default 0 check (likes >= 0),
  replies integer not null default 0 check (replies >= 0),
  reposts integer not null default 0 check (reposts >= 0),
  sentiment public.signal_sentiment not null default 'neutral',
  ai_content_flag boolean not null default false,
  signal_score numeric(5,2) not null default 0 check (signal_score >= 0 and signal_score <= 100),
  forecast public.forecast_direction not null default 'flat',
  action public.signal_action not null default 'monitor',
  recommended_action text,
  created_at timestamptz not null default now()
);

create table if not exists public.signal_post_hashtags (
  post_id uuid not null references public.signal_posts(id) on delete cascade,
  hashtag_id uuid not null references public.signal_hashtags(id) on delete cascade,
  primary key (post_id, hashtag_id)
);

create table if not exists public.news_correlations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  post_id uuid references public.signal_posts(id) on delete cascade,
  topic_id uuid references public.signal_topics(id) on delete cascade,
  event_name text not null,
  event_time timestamptz,
  correlation_summary text not null,
  confidence numeric(4,3) not null default 0.5 check (confidence >= 0 and confidence <= 1),
  source text not null default 'manual',
  created_at timestamptz not null default now()
);

create table if not exists public.signal_forecasts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  topic_id uuid references public.signal_topics(id) on delete cascade,
  direction public.forecast_direction not null,
  confidence numeric(4,3) not null check (confidence >= 0 and confidence <= 1),
  peak_window_start date,
  peak_window_end date,
  rationale text not null,
  source text not null default 'heuristic',
  generated_at timestamptz not null default now()
);

create table if not exists public.ai_insights (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  topic_id uuid references public.signal_topics(id) on delete set null,
  decision public.signal_action not null,
  title text not null,
  body text not null,
  source text not null default 'heuristic',
  generated_at timestamptz not null default now()
);

create table if not exists public.signal_reports (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  scope text not null,
  format text not null,
  status public.export_status not null default 'queued',
  owner_name text,
  storage_path text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.signal_imports (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  source text not null,
  status text not null default 'queued',
  row_count integer not null default 0 check (row_count >= 0),
  error_message text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_settings (
  user_id uuid primary key references public.users(id) on delete cascade,
  active_workspace_id uuid references public.workspaces(id) on delete set null,
  default_date_range text not null default 'last_30_days',
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.signal_audit_logs (
  id bigserial primary key,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.signal_usage_events (
  id bigserial primary key,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  feature text not null,
  units integer not null default 1 check (units > 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_workspace_members_user on public.workspace_members(user_id, workspace_id);
create index if not exists idx_signal_posts_workspace_posted on public.signal_posts(workspace_id, posted_at desc);
create index if not exists idx_signal_posts_workspace_score on public.signal_posts(workspace_id, signal_score desc);
create index if not exists idx_signal_creators_workspace on public.signal_creators(workspace_id, handle);
create index if not exists idx_signal_topics_workspace_score on public.signal_topics(workspace_id, signal_score desc);
create index if not exists idx_signal_hashtags_workspace on public.signal_hashtags(workspace_id, tag);
create index if not exists idx_news_correlations_workspace on public.news_correlations(workspace_id, created_at desc);
create index if not exists idx_signal_forecasts_workspace on public.signal_forecasts(workspace_id, generated_at desc);
create index if not exists idx_ai_insights_workspace on public.ai_insights(workspace_id, generated_at desc);
create index if not exists idx_signal_reports_workspace on public.signal_reports(workspace_id, created_at desc);
create index if not exists idx_signal_audit_logs_workspace on public.signal_audit_logs(workspace_id, created_at desc);
create index if not exists idx_signal_usage_events_workspace on public.signal_usage_events(workspace_id, created_at desc);

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.signal_creators enable row level security;
alter table public.signal_topics enable row level security;
alter table public.signal_hashtags enable row level security;
alter table public.signal_posts enable row level security;
alter table public.signal_post_hashtags enable row level security;
alter table public.news_correlations enable row level security;
alter table public.signal_forecasts enable row level security;
alter table public.ai_insights enable row level security;
alter table public.signal_reports enable row level security;
alter table public.signal_imports enable row level security;
alter table public.user_settings enable row level security;
alter table public.signal_audit_logs enable row level security;
alter table public.signal_usage_events enable row level security;

create or replace function public.is_signal_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = target_workspace_id
      and wm.user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_signal_workspace_member(uuid) from public, anon;
grant execute on function public.is_signal_workspace_member(uuid) to authenticated;

create policy "workspaces_member_access" on public.workspaces
  for all using (public.is_signal_workspace_member(id))
  with check (owner_id = (select auth.uid()));

create policy "workspace_members_member_access" on public.workspace_members
  for all using (public.is_signal_workspace_member(workspace_id))
  with check (public.is_signal_workspace_member(workspace_id));

create policy "signal_creators_workspace_access" on public.signal_creators
  for all using (public.is_signal_workspace_member(workspace_id))
  with check (public.is_signal_workspace_member(workspace_id));
create policy "signal_topics_workspace_access" on public.signal_topics
  for all using (public.is_signal_workspace_member(workspace_id))
  with check (public.is_signal_workspace_member(workspace_id));
create policy "signal_hashtags_workspace_access" on public.signal_hashtags
  for all using (public.is_signal_workspace_member(workspace_id))
  with check (public.is_signal_workspace_member(workspace_id));
create policy "signal_posts_workspace_access" on public.signal_posts
  for all using (public.is_signal_workspace_member(workspace_id))
  with check (public.is_signal_workspace_member(workspace_id));
create policy "news_correlations_workspace_access" on public.news_correlations
  for all using (public.is_signal_workspace_member(workspace_id))
  with check (public.is_signal_workspace_member(workspace_id));
create policy "signal_forecasts_workspace_access" on public.signal_forecasts
  for all using (public.is_signal_workspace_member(workspace_id))
  with check (public.is_signal_workspace_member(workspace_id));
create policy "ai_insights_workspace_access" on public.ai_insights
  for all using (public.is_signal_workspace_member(workspace_id))
  with check (public.is_signal_workspace_member(workspace_id));
create policy "signal_reports_workspace_access" on public.signal_reports
  for all using (public.is_signal_workspace_member(workspace_id))
  with check (public.is_signal_workspace_member(workspace_id));
create policy "signal_imports_workspace_access" on public.signal_imports
  for all using (public.is_signal_workspace_member(workspace_id))
  with check (public.is_signal_workspace_member(workspace_id));
create policy "signal_audit_logs_workspace_access" on public.signal_audit_logs
  for select using (public.is_signal_workspace_member(workspace_id));
create policy "signal_usage_events_workspace_access" on public.signal_usage_events
  for select using (public.is_signal_workspace_member(workspace_id));

create policy "post_hashtags_workspace_access" on public.signal_post_hashtags
  for all using (
    exists (
      select 1 from public.signal_posts sp
      where sp.id = post_id and public.is_signal_workspace_member(sp.workspace_id)
    )
  )
  with check (
    exists (
      select 1 from public.signal_posts sp
      where sp.id = post_id and public.is_signal_workspace_member(sp.workspace_id)
    )
  );

create policy "user_settings_own" on public.user_settings
  for all using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
