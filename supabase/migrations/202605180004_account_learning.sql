create table if not exists public.x_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  handle text not null,
  display_name text,
  source_mode api_mode not null default 'manual',
  imported_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, handle),
  unique (id, user_id)
);

create table if not exists public.imported_posts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null,
  user_id uuid not null references public.users(id) on delete cascade,
  posted_at timestamptz not null,
  text text not null,
  impressions integer not null default 0,
  likes integer not null default 0,
  replies integer not null default 0,
  reposts integer not null default 0,
  bookmarks integer not null default 0,
  created_at timestamptz not null default now(),
  foreign key (account_id, user_id) references public.x_accounts(id, user_id) on delete cascade
);

create table if not exists public.account_baselines (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null,
  user_id uuid not null references public.users(id) on delete cascade,
  sample_size integer not null default 0,
  avg_impressions numeric(12,2) not null default 0,
  median_impressions numeric(12,2) not null default 0,
  avg_engagement_rate numeric(8,5) not null default 0,
  best_post_id uuid,
  weakest_post_id uuid,
  recommended_window text,
  generated_at timestamptz not null default now(),
  unique (account_id),
  foreign key (account_id, user_id) references public.x_accounts(id, user_id) on delete cascade,
  foreign key (best_post_id) references public.imported_posts(id) on delete set null,
  foreign key (weakest_post_id) references public.imported_posts(id) on delete set null
);

create table if not exists public.post_autopsies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null,
  user_id uuid not null references public.users(id) on delete cascade,
  score_id uuid,
  predicted_low integer,
  predicted_high integer,
  actual_impressions integer not null default 0,
  delta_vs_midpoint integer not null default 0,
  outcome text not null,
  summary text not null,
  lessons jsonb not null default '[]'::jsonb,
  generated_at timestamptz not null default now(),
  unique (post_id),
  foreign key (post_id, user_id) references public.published_posts(id, user_id) on delete cascade,
  foreign key (score_id, user_id) references public.scores(id, user_id) on delete set null
);

create index if not exists idx_x_accounts_user on public.x_accounts(user_id);
create index if not exists idx_imported_posts_account_posted on public.imported_posts(account_id, posted_at desc);
create index if not exists idx_account_baselines_user on public.account_baselines(user_id);
create index if not exists idx_post_autopsies_user on public.post_autopsies(user_id, generated_at desc);

alter table public.x_accounts enable row level security;
alter table public.imported_posts enable row level security;
alter table public.account_baselines enable row level security;
alter table public.post_autopsies enable row level security;

create policy "x_accounts_all_own" on public.x_accounts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "imported_posts_all_own" on public.imported_posts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "account_baselines_all_own" on public.account_baselines for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "post_autopsies_all_own" on public.post_autopsies for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
