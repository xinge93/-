import express from "express";
import multer from "multer";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile, appendFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = dirname(__dirname);
const publicDir = join(rootDir, "public");
const projectDataFile = join(publicDir, "data", "managed-projects.json");
const uploadDir = join(publicDir, "uploads");
const analyticsDataFile = process.env.ANALYTICS_DATA_FILE || join(__dirname, "data", "events.jsonl");
const port = Number(process.env.LOCAL_MANAGER_PORT || process.env.ANALYTICS_PORT || 8787);
const analyticsAdminKey = process.env.ANALYTICS_ADMIN_KEY || "dev-key";
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";

await Promise.all([
  mkdir(dirname(projectDataFile), { recursive: true }),
  mkdir(uploadDir, { recursive: true }),
  mkdir(dirname(analyticsDataFile), { recursive: true }),
]);

if (!existsSync(projectDataFile)) {
  await writeFile(projectDataFile, "[]\n", "utf8");
}

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024, files: 25 },
  fileFilter: (_request, file, callback) => {
    callback(null, file.mimetype.startsWith("image/"));
  },
});

app.use(express.json({ limit: "64kb" }));
app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type,x-analytics-key");
  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }
  next();
});

async function readProjects() {
  try {
    const raw = await readFile(projectDataFile, "utf8");
    const projects = JSON.parse(raw || "[]");
    return Array.isArray(projects) ? projects : [];
  } catch {
    return [];
  }
}

async function writeProjects(projects) {
  const temporaryFile = `${projectDataFile}.tmp`;
  await writeFile(temporaryFile, `${JSON.stringify(projects, null, 2)}\n`, "utf8");
  await rename(temporaryFile, projectDataFile);
}

function sanitizeId(id) {
  return /^[a-z0-9-]{10,}$/i.test(id || "") ? id : null;
}

function safeExtension(file) {
  const extension = extname(file.originalname || "").toLowerCase();
  return /^\.[a-z0-9]{1,8}$/.test(extension) ? extension : ".png";
}

async function persistImage(file, projectId, label, index = 0) {
  const projectDir = join(uploadDir, projectId);
  await mkdir(projectDir, { recursive: true });
  const filename = `${label}-${String(index + 1).padStart(2, "0")}-${Date.now()}${safeExtension(file)}`;
  await writeFile(join(projectDir, filename), file.buffer);
  return `/uploads/${projectId}/${filename}`;
}

function normalizeTags(tags) {
  return String(tags || "")
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function toProject(record) {
  return {
    ...record,
    image: record.coverUrl,
    pdfPages: record.imageUrls?.length ? record.imageUrls : [record.coverUrl],
    slug: `custom-${record.id}`,
    managed: true,
  };
}

async function parseProjectRequest(request, isNewProject) {
  const title = String(request.body.title || "").trim();
  const summary = String(request.body.summary || "").trim();
  if (!title || !summary) throw new Error("请填写项目标题和项目说明。");

  const coverFile = request.files?.cover?.[0];
  if (isNewProject && !coverFile) throw new Error("请先上传项目封面。");

  return {
    title,
    subtitle: String(request.body.subtitle || "").trim(),
    summary,
    tags: normalizeTags(request.body.tags),
    category: ["mobile", "web", "other"].includes(request.body.category) ? request.body.category : "other",
    coverFile,
    detailFiles: request.files?.images || [],
  };
}

app.get("/api/projects", async (_request, response) => {
  const projects = await readProjects();
  response.json(projects.map(toProject));
});

app.post("/api/projects", upload.fields([{ name: "cover", maxCount: 1 }, { name: "images", maxCount: 24 }]), async (request, response) => {
  try {
    const input = await parseProjectRequest(request, true);
    const id = randomUUID();
    const coverUrl = await persistImage(input.coverFile, id, "cover");
    const imageUrls = await Promise.all(input.detailFiles.map((file, index) => persistImage(file, id, "detail", index)));
    const project = {
      id,
      ...input,
      coverFile: undefined,
      detailFiles: undefined,
      coverUrl,
      imageUrls,
      createdAt: Date.now(),
      year: new Date().getFullYear().toString(),
      color: "cyan",
    };
    const projects = await readProjects();
    projects.unshift(project);
    await writeProjects(projects);
    response.status(201).json(toProject(project));
  } catch (error) {
    response.status(400).json({ error: error.message || "项目保存失败。" });
  }
});

app.put("/api/projects/:id", upload.fields([{ name: "cover", maxCount: 1 }, { name: "images", maxCount: 24 }]), async (request, response) => {
  try {
    const id = sanitizeId(request.params.id);
    if (!id) throw new Error("无效的项目编号。");
    const projects = await readProjects();
    const index = projects.findIndex((project) => project.id === id);
    if (index < 0) throw new Error("没有找到这个项目。");

    const input = await parseProjectRequest(request, false);
    const current = projects[index];
    const coverUrl = input.coverFile ? await persistImage(input.coverFile, id, "cover") : current.coverUrl;
    const imageUrls = input.detailFiles.length
      ? await Promise.all(input.detailFiles.map((file, fileIndex) => persistImage(file, id, "detail", fileIndex)))
      : current.imageUrls || [];
    const updated = {
      ...current,
      title: input.title,
      subtitle: input.subtitle,
      summary: input.summary,
      tags: input.tags,
      category: input.category,
      coverUrl,
      imageUrls,
    };
    projects[index] = updated;
    await writeProjects(projects);
    response.json(toProject(updated));
  } catch (error) {
    response.status(400).json({ error: error.message || "项目更新失败。" });
  }
});

app.delete("/api/projects/:id", async (request, response) => {
  const id = sanitizeId(request.params.id);
  if (!id) {
    response.status(400).json({ error: "无效的项目编号。" });
    return;
  }

  const projects = await readProjects();
  const remaining = projects.filter((project) => project.id !== id);
  if (remaining.length === projects.length) {
    response.status(404).json({ error: "没有找到这个项目。" });
    return;
  }

  await writeProjects(remaining);
  await rm(join(uploadDir, id), { recursive: true, force: true });
  response.status(204).end();
});

function getIp(request) {
  const forwarded = request.headers["x-forwarded-for"];
  const firstForwarded = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return request.headers["cf-connecting-ip"] || request.headers["x-real-ip"] || firstForwarded?.split(",")[0]?.trim() || request.socket.remoteAddress || "unknown";
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
    const current = clickMap.get(key) || { slug: event.projectSlug, title: event.projectTitle || event.projectSlug, count: 0 };
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
    recent: events.slice(-80).reverse(),
  };
}

app.post("/api/analytics", async (request, response) => {
  const event = {
    ...request.body,
    id: randomUUID(),
    time: new Date().toISOString(),
    ip: getIp(request),
    userAgent: request.headers["user-agent"] || "",
    country: request.headers["cf-ipcountry"] || "",
  };
  await appendFile(analyticsDataFile, `${JSON.stringify(event)}\n`);
  response.json({ ok: true });
});

app.get("/api/analytics/summary", async (request, response) => {
  const requestKey = request.headers["x-analytics-key"] || request.query.key;
  if (requestKey !== analyticsAdminKey) {
    response.status(401).json({ ok: false, error: "Unauthorized" });
    return;
  }
  const text = existsSync(analyticsDataFile) ? await readFile(analyticsDataFile, "utf8") : "";
  const events = text.split("\n").filter(Boolean).map((line) => {
    try { return JSON.parse(line); } catch { return null; }
  }).filter(Boolean);
  response.json(summarize(events));
});

app.use((error, _request, response, _next) => {
  response.status(400).json({ error: error.message || "请求处理失败。" });
});

app.listen(port, "127.0.0.1", () => {
  console.log(`Local manager API running at http://127.0.0.1:${port}`);
});
