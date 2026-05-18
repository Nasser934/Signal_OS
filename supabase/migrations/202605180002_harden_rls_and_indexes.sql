-- Harden exposed helpers and improve RLS/index performance.

do $$
begin
  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'rls_auto_enable'
      and p.prosecdef
  ) then
    revoke execute on function public.rls_auto_enable() from anon, authenticated;
  end if;
end
$$;

create index if not exists idx_scores_draft_user on public.scores(draft_id, user_id);
create index if not exists idx_published_posts_draft_user on public.published_posts(draft_id, user_id);
create index if not exists idx_published_posts_score_user on public.published_posts(score_id, user_id);
create index if not exists idx_post_metrics_post_user on public.post_metrics(post_id, user_id);
create index if not exists idx_approval_actions_post_user on public.approval_actions(post_id, user_id);

drop policy if exists "users_select_own" on public.users;
drop policy if exists "users_update_own" on public.users;
drop policy if exists "users_insert_own" on public.users;
drop policy if exists "drafts_all_own" on public.drafts;
drop policy if exists "scores_all_own" on public.scores;
drop policy if exists "published_posts_all_own" on public.published_posts;
drop policy if exists "post_metrics_all_own" on public.post_metrics;
drop policy if exists "api_credentials_all_own" on public.api_credentials;
drop policy if exists "approval_actions_all_own" on public.approval_actions;

create policy "users_select_own" on public.users
  for select using ((select auth.uid()) = id);
create policy "users_update_own" on public.users
  for update using ((select auth.uid()) = id);
create policy "users_insert_own" on public.users
  for insert with check ((select auth.uid()) = id);

create policy "drafts_all_own" on public.drafts
  for all using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "scores_all_own" on public.scores
  for all using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "published_posts_all_own" on public.published_posts
  for all using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "post_metrics_all_own" on public.post_metrics
  for all using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "api_credentials_all_own" on public.api_credentials
  for all using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "approval_actions_all_own" on public.approval_actions
  for all using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
