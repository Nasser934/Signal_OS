const navItems = [
  ["dashboard.html", "Dashboard", "layout-dashboard"],
  ["timeline.html", "Trend Timeline", "activity"],
  ["creators.html", "Creator Intelligence", "users"],
  ["hashtags.html", "Hashtags", "hash"],
  ["topics.html", "Topic Analysis", "network"],
  ["sentiment.html", "Sentiment", "gauge"],
  ["forecast.html", "Forecasting", "trending-up"],
  ["insights.html", "AI Insights", "sparkles"],
  ["reports.html", "Reports / Exports", "file-down"],
  ["settings.html", "Settings", "settings"]
];

const iconPaths = {
  "activity": "M22 12h-4l-3 8L9 4l-3 8H2",
  "layout-dashboard": "M3 3h7v8H3z M14 3h7v5h-7z M14 12h7v9h-7z M3 15h7v6H3z",
  "users": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  "hash": "M4 9h16 M4 15h16 M10 3 8 21 M16 3l-2 18",
  "network": "M6 6h.01 M18 6h.01 M12 18h.01 M7 7l4 9 M17 7l-4 9 M8 6h8",
  "gauge": "M12 14l4-4 M3.34 19a10 10 0 1 1 17.32 0",
  "trending-up": "M22 7l-8.5 8.5-5-5L2 17 M16 7h6v6",
  "sparkles": "M12 3l1.7 5.2L19 10l-5.3 1.8L12 17l-1.7-5.2L5 10l5.3-1.8z M5 17l.8 2.2L8 20l-2.2.8L5 23l-.8-2.2L2 20l2.2-.8z",
  "file-down": "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M12 18v-6 M9 15l3 3 3-3",
  "settings": "M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5 M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.08A1.7 1.7 0 0 0 8 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3a2 2 0 1 1 0-4h.08A1.7 1.7 0 0 0 4.6 8a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3a2 2 0 1 1 4 0v.08A1.7 1.7 0 0 0 16 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.36.3.77.5 1.24.6H21a2 2 0 1 1 0 4h-.08a1.7 1.7 0 0 0-1.52 1.4",
  "zap": "M13 2L3 14h8l-1 8 10-12h-8z",
  "search": "M21 21l-4.3-4.3 M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15",
  "menu": "M4 6h16 M4 12h16 M4 18h16",
  "download": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3"
};

function icon(name) {
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${iconPaths[name] || iconPaths.zap}"/></svg>`;
}

function brand() {
  return `<a class="brand" href="index.html"><span class="mark">${icon("zap")}</span><span>Signal OS</span></a>`;
}

function renderSidebar(active) {
  const nav = navItems.map(([href, label, ic]) => `<a href="${href}" class="${active === href ? "active" : ""}">${icon(ic)}<span>${label}</span></a>`).join("");
  return `<aside class="sidebar">
    <div class="side-brand">${brand()}</div>
    <nav class="side-nav">${nav}</nav>
    <div class="sidebar-footer panel workspace">
      <div class="status good">Supabase ready</div>
      <p class="muted" style="font-size:12px;margin:10px 0 0">Workspace: Apex Growth Lab</p>
    </div>
  </aside>`;
}

function renderTopbar(title) {
  return `<header class="topbar">
    <button class="btn btn-ghost mobile-menu" data-nav-toggle aria-label="Open navigation">${icon("menu")}</button>
    <div class="search" role="search" style="display:flex;align-items:center;gap:10px">${icon("search")}<span class="muted">Search creators, hooks, hashtags, reports...</span></div>
    <select aria-label="Date range"><option>Last 30 days</option><option>Last 7 days</option><option>Quarter to date</option></select>
    <button class="btn btn-primary" data-export-view>${icon("download")}Export view</button>
  </header>`;
}

function mountShell(active, title, subtitle) {
  const root = document.querySelector("[data-app-shell]");
  if (!root) return;
  const body = root.innerHTML;
  root.innerHTML = `${renderSidebar(active)}<main class="main">${renderTopbar(title)}<div class="content"><div class="page-title"><div><h1>${title}</h1><p>${subtitle}</p></div><div class="route-tabs">${navItems.slice(0, 6).map(([href, label]) => `<a class="${active === href ? "active" : ""}" href="${href}">${label}</a>`).join("")}</div></div>${body}</div></main>`;
}

function sparkline(color = "var(--accent)") {
  return `<svg viewBox="0 0 640 220" preserveAspectRatio="none"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop stop-color="${color}" stop-opacity=".38"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs><path d="M0 168 C70 128 98 148 150 112 C210 72 236 136 292 92 C342 52 390 80 430 64 C492 38 528 72 640 30" fill="none" stroke="${color}" stroke-width="5"/><path d="M0 168 C70 128 98 148 150 112 C210 72 236 136 292 92 C342 52 390 80 430 64 C492 38 528 72 640 30 L640 220 L0 220z" fill="url(#g)"/></svg>`;
}

function bindInteractions() {
  document.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-nav-toggle]");
    if (toggle) document.body.classList.toggle("nav-open");
    if (document.body.classList.contains("nav-open") && !event.target.closest(".sidebar") && !event.target.closest("[data-nav-toggle]")) {
      document.body.classList.remove("nav-open");
    }
    const tab = event.target.closest("[data-tab]");
    if (tab) {
      const group = tab.closest("[data-tabs]");
      group.querySelectorAll("[data-tab]").forEach((el) => el.classList.remove("active"));
      tab.classList.add("active");
      group.querySelector("[data-tab-output]").textContent = tab.dataset.tab;
    }
    const run = event.target.closest("[data-run-analysis]");
    if (run) {
      const out = document.querySelector("[data-analysis-state]");
      run.setAttribute("aria-busy", "true");
      out.innerHTML = `<span class="status info">Running classifier</span><p class="muted" style="margin:10px 0 0">Cleaning 18,420 posts, tagging hooks, linking news events...</p>`;
      postJson("/api/signal-os/analyze", { topic: currentPageTopic(), decisionMode: "Act / monitor / ignore" }).then((body) => {
        out.innerHTML = `<span class="status good">Insight generated</span><p class="muted" style="margin:10px 0 0">${body.insight || "Backend generated an insight."}</p>`;
      }).catch((error) => {
        out.innerHTML = `<span class="status bad">Analysis failed</span><p class="muted" style="margin:10px 0 0">${safeMessage(error)}</p>`;
      }).finally(() => {
        run.removeAttribute("aria-busy");
      });
    }
    const copy = event.target.closest("[data-copy]");
    if (copy) {
      copy.textContent = "Copied";
      setTimeout(() => copy.textContent = "Copy insight", 1000);
    }
    const exportView = event.target.closest("[data-export-view], .btn");
    if (exportView && /export|report/i.test(exportView.textContent || "")) {
      createExportJob(exportView);
    }
    const saveSettings = event.target.closest(".btn");
    if (saveSettings && /save settings/i.test(saveSettings.textContent || "")) {
      saveWorkspaceSettings(saveSettings);
    }
  });

  document.addEventListener("submit", (event) => {
    const form = event.target.closest("form[data-auth-form]");
    if (!form) return;
    event.preventDefault();
    form.classList.remove("error");
    const email = form.querySelector("input[type=email]");
    if (!email.value.includes("@")) {
      form.classList.add("error");
      return;
    }
    const btn = form.querySelector("button[type=submit]");
    const originalText = btn.textContent;
    btn.textContent = "Opening workspace...";
    postJson("/api/signal-os/auth", {
      email: email.value,
      workspaceName: form.querySelector("input[type=text]")?.value || "Apex Growth Lab",
      mode: location.pathname.includes("signup") ? "signup" : "login"
    }).then((body) => {
      window.location.href = body.redirectTo || "dashboard.html";
    }).catch(() => {
      form.classList.add("error");
      btn.textContent = originalText;
    });
  });
}

async function getJson(url) {
  const response = await fetch(url, { headers: { "Accept": "application/json" } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || `Request failed (${response.status})`);
  return body;
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(payload || {})
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || `Request failed (${response.status})`);
  return body;
}

function currentPageName() {
  return (location.pathname.split("/").pop() || "dashboard.html").replace(".html", "") || "dashboard";
}

function currentPageTopic() {
  const input = document.querySelector("input[value]");
  return input?.value || "AI workflow teardown";
}

function safeMessage(error) {
  return error instanceof Error ? error.message : "Backend request failed";
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}

function setTableRows(table, rows) {
  const body = table?.querySelector("tbody");
  if (!body || !rows.length) return;
  body.innerHTML = rows.join("");
}

async function hydrateSignalBackend() {
  const page = currentPageName();
  if (!navItems.some(([href]) => href === `${page}.html`)) return;
  try {
    const data = await getJson(`/api/signal-os/overview?page=${encodeURIComponent(page)}`);
    document.body.dataset.backendMode = data.mode || "demo";
    hydrateKpis(data);
    hydrateTables(page, data);
    hydrateReports(data);
    hydrateSettings(data);
  } catch (error) {
    const shell = document.querySelector("[data-app-shell]");
    if (shell && !document.querySelector("[data-backend-error]")) {
      shell.insertAdjacentHTML("afterbegin", `<div class="panel panel-pad" data-backend-error><span class="status warn">Backend unavailable</span><p class="muted" style="margin:10px 0 0">${safeMessage(error)}</p></div>`);
    }
  }
}

function hydrateKpis(data) {
  const kpis = document.querySelectorAll(".kpi.panel");
  (data.kpis || []).slice(0, kpis.length).forEach((kpi, index) => {
    const node = kpis[index];
    node.querySelector("label").textContent = kpi.label;
    node.querySelector("strong").textContent = kpi.value;
    node.querySelector(".delta").textContent = kpi.delta;
  });
}

function hydrateTables(page, data) {
  if (page === "dashboard") {
    const tables = document.querySelectorAll("table");
    setTableRows(tables[0], (data.creators || []).map((item) => `<tr><td>${item.handle}</td><td>${item.topHook}</td><td class="num">${formatNumber(item.views)}</td><td class="num">${item.signal}</td><td>${item.action}</td></tr>`));
    setTableRows(tables[1], (data.hashtags || []).map((item) => `<tr><td>${item.hashtag}</td><td class="num">${formatNumber(item.posts)}</td><td>${item.forecast}</td></tr>`));
  }
  if (page === "timeline") {
    setTableRows(document.querySelector("table"), (data.posts || []).map((post) => `<tr><td class="num">${new Date(post.postedAt).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td><td>&quot;${post.postText}&quot;</td><td>${post.creatorHandle}</td><td>${post.newsCorrelation}</td><td class="num">${post.signalScore}</td><td>${post.decision}</td></tr>`));
  }
  if (page === "creators") {
    setTableRows(document.querySelector("table"), (data.creators || []).map((item) => `<tr><td>${item.creator}</td><td>${item.handle}</td><td>${item.topHook}</td><td>${item.language}</td><td class="num">${formatNumber(item.views)}</td><td class="num">${formatNumber(item.replies)}</td><td class="num">${item.signal}</td><td>${item.action}</td></tr>`));
  }
  if (page === "hashtags") {
    setTableRows(document.querySelector("table"), (data.hashtags || []).map((item) => `<tr><td>${item.hashtag}</td><td class="num">${formatNumber(item.posts)}</td><td class="num">${formatNumber(item.views)}</td><td class="num">${formatNumber(item.reposts)}</td><td>${item.sentiment}</td><td>${item.forecast}</td><td>${item.action}</td></tr>`));
  }
  if (page === "topics") {
    setTableRows(document.querySelector("table"), (data.topics || []).map((item) => `<tr><td>${item.topic}</td><td>${item.bestFormat}</td><td>${item.hookType}</td><td>${item.sentiment}</td><td>${item.newsCorrelation}</td><td>${item.forecast}</td><td>${item.recommendedAction}</td></tr>`));
  }
  if (page === "sentiment") {
    setTableRows(document.querySelector("table"), (data.sentimentDrivers || []).map((item) => `<tr><td>${item.driver}</td><td>&quot;${item.samplePostText}&quot;</td><td>${item.sentiment}</td><td>${item.risk}</td><td>${item.recommendedAction}</td></tr>`));
  }
  if (page === "forecast") {
    setTableRows(document.querySelector("table"), (data.forecasts || []).map((item) => `<tr><td>${item.topic}</td><td>${item.forecast}</td><td class="num">${item.confidence}%</td><td>${item.newsDependency}</td><td>${item.recommendedAction}</td></tr>`));
  }
}

function hydrateReports(data) {
  if (currentPageName() !== "reports") return;
  setTableRows(document.querySelector("table"), (data.reportJobs || []).map((job) => `<tr><td>${job.report}</td><td>${job.scope}</td><td>${job.format}</td><td><span class="status ${job.status === "ready" ? "good" : job.status === "needs_source" || job.status === "failed" ? "bad" : "info"}">${job.status.replace("_", " ")}</span></td><td>${job.owner}</td></tr>`));
}

function hydrateSettings(data) {
  if (currentPageName() !== "settings") return;
  const settings = data.settings || {};
  const workspace = document.querySelector("input[value='Apex Growth Lab']");
  if (workspace) workspace.value = settings.workspaceName || workspace.value;
  setTableRows(document.querySelector("table"), (settings.sources || []).map((source) => `<tr><td>${source.source}</td><td>${source.purpose}</td><td><span class="status ${source.status === "Connected" ? "good" : "warn"}">${source.status}</span></td><td class="num">${source.lastSync}</td></tr>`));
}

async function createExportJob(button) {
  const original = button.textContent;
  button.textContent = "Creating export...";
  try {
    await postJson("/api/signal-os/reports", { name: "Current dashboard report", scope: "Last 30 days", format: "PDF + CSV" });
    button.textContent = "Export queued";
    await hydrateSignalBackend();
  } catch (error) {
    button.textContent = safeMessage(error);
  }
  setTimeout(() => { button.textContent = original; }, 1400);
}

async function saveWorkspaceSettings(button) {
  const original = button.textContent;
  const workspaceName = document.querySelector("input[value], input")?.value || "Apex Growth Lab";
  const rangeText = document.querySelector("select")?.value || "Last 30 days";
  const defaultDateRange = rangeText.includes("7") ? "last_7_days" : rangeText.includes("Quarter") ? "quarter_to_date" : "last_30_days";
  button.textContent = "Saving...";
  try {
    await postJson("/api/signal-os/settings", { workspaceName, defaultDateRange });
    button.textContent = "Saved";
  } catch (error) {
    button.textContent = safeMessage(error);
  }
  setTimeout(() => { button.textContent = original; }, 1400);
}

document.addEventListener("DOMContentLoaded", () => {
  bindInteractions();
  hydrateSignalBackend();
});
