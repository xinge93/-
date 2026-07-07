const isBrowser = typeof window !== "undefined";
const endpoint =
  import.meta.env.VITE_ANALYTICS_ENDPOINT ||
  (import.meta.env.DEV ? "http://127.0.0.1:8787/api/analytics" : "/api/analytics");

const visitorKey = "portfolioVisitorId";
const sessionKey = "portfolioSessionId";
let initialized = false;
let pageStartedAt = Date.now();
let currentPath = "";

function createId(prefix) {
  const random = Math.random().toString(36).slice(2);
  return `${prefix}_${Date.now().toString(36)}_${random}`;
}

function getStoredId(key, prefix, storage = window.localStorage) {
  let value = storage.getItem(key);
  if (!value) {
    value = createId(prefix);
    storage.setItem(key, value);
  }
  return value;
}

function getVisitorId() {
  return getStoredId(visitorKey, "visitor");
}

function getSessionId() {
  return getStoredId(sessionKey, "session", window.sessionStorage);
}

function getPath() {
  return `${window.location.pathname}${window.location.hash || ""}`;
}

function safeJson(data) {
  return JSON.stringify(data);
}

function sendAnalytics(event, data = {}, useBeacon = false) {
  if (!isBrowser || !endpoint) return;
  if (window.location.hash === "#analytics") return;

  const payload = {
    event,
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    path: getPath(),
    title: document.title,
    referrer: document.referrer || "",
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    language: navigator.language || "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    ...data,
  };

  const body = safeJson(payload);
  if (useBeacon && navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
    return;
  }

  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: useBeacon,
  }).catch(() => {});
}

function trackPageView() {
  const now = Date.now();
  if (currentPath) {
    sendAnalytics("page_leave", {
      previousPath: currentPath,
      durationMs: Math.max(0, now - pageStartedAt),
    });
  }

  currentPath = getPath();
  pageStartedAt = now;
  sendAnalytics("page_view");
}

export function initAnalytics() {
  if (!isBrowser || initialized) return;
  initialized = true;

  sendAnalytics("session_start");
  trackPageView();

  window.addEventListener("hashchange", trackPageView);
  window.addEventListener("beforeunload", () => {
    const now = Date.now();
    sendAnalytics(
      "session_end",
      {
        durationMs: Math.max(0, now - pageStartedAt),
        previousPath: currentPath || getPath(),
      },
      true,
    );
  });

  window.setInterval(() => {
    sendAnalytics("heartbeat", {
      durationMs: Math.max(0, Date.now() - pageStartedAt),
      previousPath: currentPath || getPath(),
    });
  }, 15000);
}

export function trackProjectClick(project) {
  sendAnalytics("project_click", {
    projectSlug: project.slug,
    projectTitle: project.title,
  });
}

export function trackCaseOpen(project) {
  sendAnalytics("case_open", {
    projectSlug: project.slug,
    projectTitle: project.title,
  });
}

export function trackCaseClose(project, durationMs) {
  sendAnalytics(
    "case_close",
    {
      projectSlug: project.slug,
      projectTitle: project.title,
      durationMs,
    },
    true,
  );
}

export function getAnalyticsSummaryEndpoint() {
  return `${endpoint}/summary`;
}
