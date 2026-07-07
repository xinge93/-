import { createServer } from "node:http";
import { mkdirSync, readFileSync, appendFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.ANALYTICS_PORT || 8787);
const adminKey = process.env.ANALYTICS_ADMIN_KEY || "dev-key";
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
const dataFile = process.env.ANALYTICS_DATA_FILE || join(__dirname, "data", "events.jsonl");

mkdirSync(dirname(dataFile), { recursive: true });

function sendJson(response, statusCode, payload, origin = "*") {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,x-analytics-key",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function getIp(request) {
  const forwarded = request.headers["x-forwarded-for"];
  const firstForwarded = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return (
    request.headers["cf-connecting-ip"] ||
    request.headers["x-real-ip"] ||
    firstForwarded?.split(",")[0]?.trim() ||
    request.socket.remoteAddress ||
    "unknown"
  );
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 64000) {
        request.destroy();
        reject(new Error("Payload too large"));
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function readEvents() {
  if (!existsSync(dataFile)) return [];
  return readFileSync(dataFile, "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function summarize(events) {
  const pageViews = events.filter((event) => event.event === "page_view");
  const projectClicks = events.filter((event) => event.event === "project_click");
  const durationEvents = events.filter((event) => Number(event.durationMs) > 0);
  const visitors = new Set(events.map((event) => event.visitorId).filter(Boolean));
  const ips = new Set(events.map((event) => event.ip).filter(Boolean));
  const clickMap = new Map();

  for (const event of projectClicks) {
    const key = event.projectSlug || event.projectTitle || "unknown";
    const current = clickMap.get(key) || {
      slug: event.projectSlug,
      title: event.projectTitle || event.projectSlug,
      count: 0,
    };
    current.count += 1;
    clickMap.set(key, current);
  }

  const totalDuration = durationEvents.reduce((sum, event) => sum + Number(event.durationMs || 0), 0);

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      events: events.length,
      pageViews: pageViews.length,
      visitors: visitors.size,
      uniqueIps: ips.size,
      projectClicks: projectClicks.length,
      averageDurationMs: durationEvents.length ? Math.round(totalDuration / durationEvents.length) : 0,
    },
    projectClicks: [...clickMap.values()].sort((a, b) => b.count - a.count),
    recent: events
      .slice(-80)
      .reverse()
      .map((event) => ({
        id: event.id,
        time: event.time,
        ip: event.ip,
        event: event.event,
        path: event.path,
        projectTitle: event.projectTitle,
        durationMs: event.durationMs,
      })),
  };
}

createServer(async (request, response) => {
  const origin = allowedOrigin === "*" ? "*" : allowedOrigin;
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "OPTIONS") {
    sendJson(response, 204, {}, origin);
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/analytics") {
    try {
      const body = await readBody(request);
      const payload = JSON.parse(body || "{}");
      const event = {
        ...payload,
        id: randomUUID(),
        time: new Date().toISOString(),
        ip: getIp(request),
        userAgent: request.headers["user-agent"] || "",
        country: request.headers["cf-ipcountry"] || "",
      };

      appendFileSync(dataFile, `${JSON.stringify(event)}\n`);
      sendJson(response, 200, { ok: true }, origin);
    } catch (error) {
      sendJson(response, 400, { ok: false, error: error.message }, origin);
    }
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/analytics/summary") {
    const requestKey = request.headers["x-analytics-key"] || url.searchParams.get("key");
    if (requestKey !== adminKey) {
      sendJson(response, 401, { ok: false, error: "Unauthorized" }, origin);
      return;
    }

    sendJson(response, 200, summarize(readEvents()), origin);
    return;
  }

  sendJson(response, 404, { ok: false, error: "Not found" }, origin);
}).listen(port, () => {
  console.log(`Analytics server running at http://127.0.0.1:${port}`);
  console.log(`Dashboard key: ${adminKey}`);
});
