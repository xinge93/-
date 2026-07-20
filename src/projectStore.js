const LOCAL_API = "/api/projects";

function isLocalHost() {
  return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
}

function requireLocalManager() {
  if (!isLocalHost()) {
    throw new Error("项目上传仅在本机项目管理页面可用。");
  }
}

async function request(url, options = {}) {
  const response = await fetch(url, options);
  if (response.ok) {
    return response.status === 204 ? null : response.json();
  }

  const payload = await response.json().catch(() => ({}));
  throw new Error(payload.error || "本地项目服务暂不可用，请确认 npm run dev 正在运行。");
}

function appendProjectData(payload) {
  const data = new FormData();
  data.append("title", payload.form.title);
  data.append("subtitle", payload.form.subtitle);
  data.append("summary", payload.form.summary);
  data.append("tags", payload.form.tags);
  data.append("category", payload.form.category);
  if (payload.coverFile) data.append("cover", payload.coverFile);
  payload.projectFiles.forEach((file) => data.append("images", file));
  return data;
}

export async function listManagedProjects() {
  try {
    const response = await fetch("/data/managed-projects.json", { cache: "no-store" });
    if (!response.ok) return [];
    const projects = await response.json();
    return Array.isArray(projects)
      ? projects.map((project) => ({
        ...project,
        image: project.coverUrl,
        pdfPages: project.imageUrls?.length ? project.imageUrls : [project.coverUrl],
        slug: `custom-${project.id}`,
        managed: true,
      }))
      : [];
  } catch {
    return [];
  }
}

export async function saveManagedProject(payload) {
  requireLocalManager();
  return request(LOCAL_API, { method: "POST", body: appendProjectData(payload) });
}

export async function updateManagedProject(payload) {
  requireLocalManager();
  return request(`${LOCAL_API}/${payload.project.id}`, { method: "PUT", body: appendProjectData(payload) });
}

export async function removeManagedProject(project) {
  requireLocalManager();
  return request(`${LOCAL_API}/${project.id}`, { method: "DELETE" });
}
