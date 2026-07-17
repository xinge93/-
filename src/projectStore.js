import { isSupabaseConfigured, supabase } from "./supabase.js";

const PROJECTS_TABLE = "projects";
const ASSETS_BUCKET = "project-assets";

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("请先配置 Supabase 的项目地址、发布密钥和管理员邮箱。");
  }
}

function mapProject(row) {
  const imagePaths = (row.image_paths || []).filter((path) => path !== row.cover_path);
  const imageUrls = (row.image_urls || []).filter((url) => url !== row.cover_url);

  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle || "",
    summary: row.summary || "",
    tags: row.tags || [],
    category: row.category,
    year: new Date(row.created_at || Date.now()).getFullYear().toString(),
    color: "cyan",
    image: row.cover_url,
    slug: `custom-${row.id}`,
    pdfPages: imageUrls.length ? imageUrls : [row.cover_url],
    managed: true,
    createdAt: new Date(row.created_at || Date.now()).getTime(),
    coverUrl: row.cover_url,
    coverPath: row.cover_path,
    imageUrls,
    imagePaths,
    assetPaths: [row.cover_path, ...imagePaths].filter(Boolean),
  };
}

function fileExtension(file) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return extension && /^[a-z0-9]+$/.test(extension) ? extension : "png";
}

async function uploadImage(file, projectId, label, index = 0) {
  const path = `${projectId}/${label}-${String(index + 1).padStart(2, "0")}-${Date.now()}.${fileExtension(file)}`;
  const { error: uploadError } = await supabase.storage.from(ASSETS_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(ASSETS_BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export async function listManagedProjects() {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase
    .from(PROJECTS_TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map(mapProject);
}

export async function saveManagedProject({ form, coverFile, projectFiles }) {
  requireSupabase();

  const id = crypto.randomUUID();
  const uploadedPaths = [];

  try {
    const cover = await uploadImage(coverFile, id, "cover");
    uploadedPaths.push(cover.path);
    const detailImages = await Promise.all(
      projectFiles.map((file, index) => uploadImage(file, id, "detail", index))
    );
    uploadedPaths.push(...detailImages.map((image) => image.path));

    const { data, error } = await supabase
      .from(PROJECTS_TABLE)
      .insert({
        id,
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || null,
        summary: form.summary.trim(),
        tags: form.tags.split(/[,，]/).map((tag) => tag.trim()).filter(Boolean),
        category: form.category,
        cover_url: cover.url,
        cover_path: cover.path,
        image_urls: detailImages.map((image) => image.url),
        image_paths: detailImages.map((image) => image.path),
      })
      .select()
      .single();

    if (error) throw error;
    return mapProject(data);
  } catch (error) {
    if (uploadedPaths.length) await supabase.storage.from(ASSETS_BUCKET).remove(uploadedPaths);
    throw error;
  }
}

export async function updateManagedProject({ project, form, coverFile, projectFiles }) {
  requireSupabase();

  const uploadedPaths = [];
  const outdatedPaths = [];
  let coverUrl = project.coverUrl || project.image;
  let coverPath = project.coverPath;
  let imageUrls = project.imageUrls || [];
  let imagePaths = project.imagePaths || [];

  try {
    if (coverFile) {
      const cover = await uploadImage(coverFile, project.id, "cover");
      uploadedPaths.push(cover.path);
      if (coverPath) outdatedPaths.push(coverPath);
      coverUrl = cover.url;
      coverPath = cover.path;
    }

    if (projectFiles.length) {
      const detailImages = await Promise.all(
        projectFiles.map((file, index) => uploadImage(file, project.id, "detail", index))
      );
      uploadedPaths.push(...detailImages.map((image) => image.path));
      outdatedPaths.push(...imagePaths);
      imageUrls = detailImages.map((image) => image.url);
      imagePaths = detailImages.map((image) => image.path);
    }

    const { data, error } = await supabase
      .from(PROJECTS_TABLE)
      .update({
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || null,
        summary: form.summary.trim(),
        tags: form.tags.split(/[,，]/).map((tag) => tag.trim()).filter(Boolean),
        category: form.category,
        cover_url: coverUrl,
        cover_path: coverPath,
        image_urls: imageUrls,
        image_paths: imagePaths,
      })
      .eq("id", project.id)
      .select()
      .single();

    if (error) throw error;

    if (outdatedPaths.length) {
      const { error: storageError } = await supabase.storage.from(ASSETS_BUCKET).remove(outdatedPaths);
      if (storageError) console.warn("项目已更新，但部分旧图片未删除。", storageError);
    }

    return mapProject(data);
  } catch (error) {
    if (uploadedPaths.length) await supabase.storage.from(ASSETS_BUCKET).remove(uploadedPaths);
    throw error;
  }
}

export async function removeManagedProject(project) {
  requireSupabase();

  const { error } = await supabase.from(PROJECTS_TABLE).delete().eq("id", project.id);
  if (error) throw error;

  if (project.assetPaths?.length) {
    const { error: storageError } = await supabase.storage.from(ASSETS_BUCKET).remove(project.assetPaths);
    if (storageError) console.warn("项目数据已删除，但部分图片未删除。", storageError);
  }
}
