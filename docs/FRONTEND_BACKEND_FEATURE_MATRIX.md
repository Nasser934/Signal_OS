# Frontend Backend Feature Matrix

| Screen | Visible feature | Backend status | API/table | Remaining gap |
|---|---|---|---|---|
| Dashboard | KPI cards | Backed | `GET /api/signal-os/overview`, `signal_posts` | Live ingestion |
| Dashboard | Signal leaderboard | Backed | overview read model | Ranking from DB joins |
| Dashboard | Topic performance | Backed | `signal_topics` | Real classifier |
| Dashboard | AI recommendations | Backed by heuristic | `POST /api/signal-os/analyze`, `ai_insights` | AI provider |
| Timeline | Event correlation map/table | Backed | `signal_posts`, `news_correlations` | News provider |
| Creators | Creator cohort table | Backed | `signal_creators`, overview API | Save cohort |
| Hashtags | Hashtag performance table | Backed | `signal_hashtags` | Live hashtag ingest |
| Topics | Topic evidence table | Backed | `signal_topics` | Automated classification |
| Sentiment | Sentiment drivers | Backed read model | `signal_posts.sentiment`, `ai_content_flag` | Sentiment classifier |
| Forecast | Forecast scenarios | Backed | `signal_forecasts` | Scheduled forecast jobs |
| Insights | Generate insight | Backed stub | `POST /api/signal-os/analyze` | Real AI generation |
| Reports | Export jobs | Backed | `signal_reports`, reports API | PDF/CSV generation |
| Settings | Workspace settings | Backed | `workspaces`, `user_settings`, settings API | Roles/source UI persistence |
| Login/signup | Auth forms | Demo-backed intent | `POST /api/signal-os/auth` | Supabase Auth production flow |
| Topbar | Export view | Backed job queue | `POST /api/signal-os/reports` | File generation |
| Topbar | Search | Not backed | none | Search endpoint |
| Topbar | Date range | Not backed | none | Query filtering |
