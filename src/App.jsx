import React, { useEffect, useMemo, useState } from "react";
import BorderGlow from "./BorderGlow.jsx";
import SoftAurora from "./SoftAurora.jsx";
import SplitText from "./SplitText.jsx";
import TiltedPhoto from "./TiltedPhoto.jsx";
import AnalyticsDashboard from "./AnalyticsDashboard.jsx";
import { initAnalytics, trackCaseClose, trackCaseOpen, trackProjectClick } from "./analytics.js";
import { listManagedProjects, removeManagedProject, saveManagedProject, updateManagedProject } from "./projectStore.js";

const email = "516295798@qq.com";

const navItems = [
  ["经历", "#experience"],
  ["项目", "#projects"],
  ["优势", "#strengths"],
  ["联系", "#contact"],
];

const profileFacts = [
  { label: "求职意向", value: "高级UI设计师" },
  { label: "最高学历", value: "本科" },
  { label: "联系方式", value: "13530677578" },
  { label: "邮箱地址", value: email },
  { label: "设计经验", value: "10+ UI/UX" },
  { label: "项目落地", value: "30+" },
];

const profileSkills = [
  "B端设计",
  "C端设计",
  "交互设计",
  "AIGC工作流",
  "金融证券",
  "OA系统",
  "SaaS平台",
  "CRM系统",
  "组件搭建",
  "AE动效",
  "Lottie动效",
  "矢量插画",
];

const workExperiences = [
  {
    period: "2016.08–2019.08（3年）",
    company: "深圳市思迪信息技术股份有限公司",
    role: "UI设计师",
    description:
      "参与证券及金融科技类产品的 UI / UX 设计以及品牌设计工作，覆盖行情交易类产品、证券投顾、开户及智能客服系统、卡通形象、LOGO设计，支持金融业务的数字化运营与产品落地。",
  },
  {
    period: "2019.08–2023.01（3年）",
    company: "平安国际智慧城市科技股份有限公司",
    role: "中级UI设计师",
    description:
      "智慧城市与企业级数字化领域，参与多款 SaaS 平台、行业系统及移动端产品的 UI / UX 设计工作以及LOGO设计工作，覆盖从 0-1 体系建设到持续迭代优化的完整产品周期。",
  },
  {
    period: "2023.01–2024.12（1年）",
    company: "平安金融壹账通",
    role: "中级UI/UX设计师",
    description:
      "负责城市公共服务及政务类产品的 UI / UX 设计，服务对象涵盖大型用户量 App、政务平台及行业系统，例如深圳地铁小程序等。",
  },
  {
    period: "2024.05–至今",
    company: "柏威运连网国际物流有限公司",
    role: "高级UI设计师/AIGC设计师",
    description:
      "负责集团核心业务系统的 UI / UX 设计工作，涵盖 OA 管理系统、卡通形象设计、LOGO设计及海外仓业务系统，支持集团内部管理与跨境仓储业务的数字化运行。",
  },
];

const baseProjects = [
  {
    title: "运连网集团OA系统",
    subtitle: "Gotfreight OA System",
    type: "OA系统 / WEB端 / 系统设计",
    year: "2024-2025",
    summary:
      "从0-1负责运连网集团的OA系统界面设计工作，包括风格定调、图标设计、卡通形象设计、产品交互优化，配合开发人员跟踪产品效果等，共计页面200+。",
    tags: ["OA 系统", "B端系统", "组件规范", "交互设计"],
    stat: "集团上线",
    color: "cyan",
    image: "/images/project-oa-cover.png",
    slug: "oa-system",
    category: "web",
    featured: true,
    pdf: "/pdfs/oa-system.pdf",
    pdfPages: Array.from({ length: 13 }, (_, index) => `/cases/oa-system/page-${String(index + 1).padStart(2, "0")}.png`),
  },
  {
    title: "证券AI财富顾问",
    subtitle: "Securities AI Wealth Advisor",
    type: "金融科技 / APP / AI智能体",
    year: "2016-2019",
    summary:
      "通过AI智能助手重构人与金融服务之间的交互方式，让专业投资服务从“功能查找”转变为“自然对话”，帮助用户更高效地完成信息获取、投资分析与业务办理。",
    tags: ["金融证券", "AI 顾问", "APP", "交互设计"],
    stat: "多券商上线",
    color: "coral",
    image: "/images/project-ai-wealth-cover.png",
    slug: "ai-wealth-advisor",
    category: "mobile",
    featured: true,
    pdf: "/pdfs/ai-wealth-advisor.pdf",
    pdfPages: Array.from({ length: 7 }, (_, index) => `/cases/ai-wealth-advisor/page-${index + 1}.png`),
  },
  {
    title: "插画&卡通形象设计",
    subtitle: "Illustration design",
    type: "品牌视觉 / 插画 / 卡通形象",
    year: "2024",
    summary:
      "负责宣传插画、卡通形象等视觉设计，搭建统一的品牌视觉规范，并结合 AI 工作流提升设计效率与创意产出。",
    tags: ["插画设计", "卡通形象"],
    stat: "成功交付",
    color: "green",
    image: "/images/project-illustration-logo-cover.png",
    layout: "wide",
    visualClass: "illustration",
    slug: "illustration-logo",
    category: "other",
    featured: true,
    pdfPages: Array.from({ length: 8 }, (_, index) => `/cases/illustration-logo/page-${String(index + 1).padStart(2, "0")}.png`),
  },
  {
    title: "园企通LOGO设计",
    subtitle: "Park-Enterprise Connect",
    type: "品牌视觉 / LOGO / 品牌包装",
    year: "2024",
    summary:
      "整体造型呈现网状延展感，体现平台对园区服务的整合与覆盖能力，打通企业服务、资源对接与线上交流等场景，持续为园区及企业创造更大价值。",
    tags: ["LOGO设计", "品牌包装"],
    stat: "品牌交付",
    color: "cyan",
    image: "/images/project-park-enterprise-cover.png",
    slug: "park-enterprise-connect",
    category: "other",
    pdfPages: Array.from({ length: 9 }, (_, index) => `/cases/park-enterprise-connect/page-${String(index + 1).padStart(2, "0")}.png`),
  },
  {
    title: "数字孪生可视化大屏",
    subtitle: "Digital twin visualization screen",
    type: "数据可视化 / 大屏 / Lottie",
    year: "2021",
    summary:
      "负责青羊数字孪生可视化大屏整体视觉风格定义、信息可视化设计和动态展示方案，用于展示与决策支持场景。",
    tags: ["数字孪生", "大屏设计"],
    stat: "成功交付",
    color: "violet",
    image: "/images/project-digital-visual-cover.png",
    slug: "digital-twin-visualization",
    category: "web",
    featured: true,
    pdf: "/pdfs/digital-twin-visualization.pdf",
    pdfPages: Array.from({ length: 8 }, (_, index) => `/cases/digital-twin-visualization/page-${index + 1}.png`),
  },
  {
    title: "亦庄 SaaS 数字服务平台",
    subtitle: "Yizhuang SaaS Digital Platform",
    type: "智慧城市 / SaaS / 设计系统",
    year: "2019-2023",
    summary:
      "从 0-1 主导 Web 平台设计体系建设，包括设计规范、公共组件与业务组件库，支撑平台企业服务场景稳定落地。",
    tags: ["SaaS平台", "B端系统"],
    stat: "正式投用",
    color: "amber",
    image: "/images/yizhuang-saas-cover.png",
    slug: "yizhuang-saas",
    category: "web",
    featured: true,
    pdf: "/pdfs/yizhuang-saas.pdf",
    pdfPages: Array.from({ length: 11 }, (_, index) => `/cases/yizhuang-saas/page-${String(index + 1).padStart(2, "0")}.png`),
  },
  {
    title: "智慧园区平台APP",
    subtitle: "Smart Park Platform APP",
    type: "智慧园区 / APP / 办公服务",
    year: "2023",
    summary:
      "通明湖信息城app是一款专为园区打造的线上效率办公服务软件，能够为用户提供多样化的优质办公服务。",
    tags: ["智慧园区", "APP"],
    stat: "正式投用",
    color: "coral",
    image: "/images/smart-park-app-cover.png",
    slug: "shenzhen-metro",
    category: "mobile",
    pdfPages: Array.from({ length: 10 }, (_, index) => `/cases/shenzhen-metro/page-${String(index + 1).padStart(2, "0")}.png`),
  },
];

const strengths = [
  {
    index: "01",
    title: "复杂业务系统设计",
    text: "长期服务金融、政务、物流与企业级平台，擅长把复杂流程拆解为清晰的信息架构和可落地的交互路径。",
  },
  {
    index: "02",
    title: "设计系统搭建",
    text: "具备从设计规范、公共组件、业务组件到多端交付标准的完整体系建设经验，提升一致性和协作效率。",
  },
  {
    index: "03",
    title: "AIGC 设计赋能",
    text: "将 AIGC 用于设计分析、方案探索、IP 形象延展与缺省图生产，让视觉探索和交付效率形成闭环。",
  },
  {
    index: "04",
    title: "数据可视化表达",
    text: "覆盖数据看板、智慧城市大屏和数字孪生展示，能够平衡信息密度、视觉秩序与决策效率。",
  },
  {
    index: "05",
    title: "移动端体验塑造",
    text: "熟悉 App、小程序和 PDA 场景，关注核心任务、弱势人群体验、操作反馈和多端一致性。",
  },
  {
    index: "06",
    title: "跨团队落地推动",
    text: "参与需求评审、方案讨论、版本评估和研发验收，能推动设计方案高还原上线并持续迭代。",
  },
];

function useRevealOnScroll(enabled, refreshKey) {
  useEffect(() => {
    if (!enabled) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [enabled, refreshKey]);
}

function useHeroVideoPlayback(enabled) {
  useEffect(() => {
    if (!enabled) return undefined;

    const hero = document.querySelector(".hero-section");
    const video = document.querySelector(".hero-video");
    if (!hero || !video) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [enabled]);
}

function useActiveCase(projects) {
  const getActiveCase = () => {
    const slug = window.location.hash.replace("#case/", "");
    return projects.find((project) => project.slug === slug && project.pdfPages) || null;
  };

  const [activeCase, setActiveCase] = useState(getActiveCase);

  useEffect(() => {
    const handleHashChange = () => setActiveCase(getActiveCase());
    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [projects]);

  useEffect(() => {
    if (activeCase) window.scrollTo(0, 0);
  }, [activeCase]);

  return activeCase;
}

function useCurrentHash() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return hash;
}

function scrollToHomeSection(href) {
  const targetId = href.replace("#", "");
  const scroll = () => {
    if (targetId === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const target = document.getElementById(targetId);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  window.setTimeout(scroll, 80);
  window.setTimeout(scroll, 260);
}

function SiteHeader() {
  const handleAnchorClick = (event, href) => {
    const shouldRestoreHome = window.location.hash.startsWith("#case/")
      || window.location.hash === "#analytics"
      || window.location.hash === "#project-manager";
    if (!shouldRestoreHome) return;

    event.preventDefault();
    window.location.hash = href;
    scrollToHomeSection(href);
  };

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="返回首页" onClick={(event) => handleAnchorClick(event, "#top")}>
          <span className="brand-symbol">
            <img src="/images/brand-logo.png" alt="" />
          </span>
          <span>
            <strong>李晓鑫</strong>
            <small>Visual / AI / UI Designer</small>
          </span>
        </a>
        <nav className="main-nav" aria-label="主导航">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} onClick={(event) => handleAnchorClick(event, href)}>
              {label}
            </a>
          ))}
        </nav>
      </header>

      <nav className="mobile-bottom-nav" aria-label="移动端主导航">
        {navItems.map(([label, href]) => (
          <a key={href} href={href} onClick={(event) => handleAnchorClick(event, href)}>
            {label}
          </a>
        ))}
      </nav>
    </>
  );
}

function CasePdfPage({ project }) {
  useEffect(() => {
    const startedAt = Date.now();
    trackCaseOpen(project);
    return () => trackCaseClose(project, Date.now() - startedAt);
  }, [project]);

  return (
    <>
      <SiteHeader />
      <main className="case-page">
        <section className="case-shell">
          <div className="case-page-stack" aria-label={`${project.title}作品集`}>
            {project.pdfPages.map((page, index) => (
              <img
                alt={`${project.title}作品集第${index + 1}页`}
                className="case-page-image"
                key={page}
                loading={index === 0 ? "eager" : "lazy"}
                src={page}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

function ProjectManager({ projects, onCreate, onDelete, onUpdate }) {
  const [coverFile, setCoverFile] = useState(null);
  const [projectFiles, setProjectFiles] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [uploadKey, setUploadKey] = useState(0);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    summary: "",
    tags: "",
    category: "other",
  });

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const resetEditor = () => {
    setEditingProject(null);
    setForm({ title: "", subtitle: "", summary: "", tags: "", category: "other" });
    setCoverFile(null);
    setProjectFiles([]);
    setUploadKey((current) => current + 1);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setForm({
      title: project.title,
      subtitle: project.subtitle || "",
      summary: project.summary,
      tags: project.tags.join(", "),
      category: project.category,
    });
    setCoverFile(null);
    setProjectFiles([]);
    setError("");
    setUploadKey((current) => current + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setError("");

    if (!coverFile && !editingProject) {
      setError("请先上传项目封面。");
      return;
    }

    setIsSaving(true);
    try {
      if (editingProject) {
        await onUpdate({ project: editingProject, form, coverFile, projectFiles });
      } else {
        await onCreate({ form, coverFile, projectFiles });
      }
      formElement.reset();
      resetEditor();
    } catch (saveError) {
      setError(saveError.message || "图片保存失败，请检查 Storage 配置和图片体积。");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="project-manager-page">
      <section className="shell project-manager-shell">
        <div className="project-manager-heading">
          <span className="eyebrow">Project Manager</span>
          <h1>{editingProject ? "编辑项目" : "上传新项目"}</h1>
          <p>{editingProject ? "可直接更新项目资料；不选择新图片时会保留当前图片。" : "封面用于项目卡片，多张项目图片会展示在二级详情页面。"}</p>
        </div>

        <form className="project-manager-form" onSubmit={handleSubmit}>
          <label className="upload-field">
            <span>项目封面</span>
            <input accept="image/*" key={`cover-${uploadKey}`} onChange={(event) => setCoverFile(event.target.files?.[0] || null)} type="file" />
            <small>{coverFile ? coverFile.name : editingProject ? "留空则保留当前封面" : "选择封面图片"}</small>
          </label>
          <label>
            <span>项目标题</span>
            <input onChange={updateField("title")} placeholder="例如：园企通LOGO设计" required value={form.title} />
          </label>
          <label>
            <span>英文标题</span>
            <input onChange={updateField("subtitle")} placeholder="例如：Park-Enterprise Connect" value={form.subtitle} />
          </label>
          <label className="form-wide">
            <span>项目说明</span>
            <textarea onChange={updateField("summary")} placeholder="填写项目背景、设计亮点或成果。" required rows="5" value={form.summary} />
          </label>
          <label>
            <span>标签</span>
            <input onChange={updateField("tags")} placeholder="用逗号分隔，例如：LOGO设计, 品牌包装" value={form.tags} />
          </label>
          <label>
            <span>项目分类</span>
            <select onChange={updateField("category")} value={form.category}>
              <option value="mobile">移动端</option>
              <option value="web">Web端</option>
              <option value="other">其他设计</option>
            </select>
          </label>
          <label className="upload-field form-wide">
            <span>项目图片</span>
            <input accept="image/*" key={`detail-${uploadKey}`} multiple onChange={(event) => setProjectFiles(Array.from(event.target.files || []))} type="file" />
            <small>{projectFiles.length ? `已选择 ${projectFiles.length} 张项目图片` : editingProject ? "选择新图片后将替换当前详情图" : "可一次选择多张，用于详情页面"}</small>
          </label>
          {error ? <p className="form-error form-wide">{error}</p> : null}
          <div className="form-actions form-wide">
            {editingProject ? <button className="button secondary" onClick={resetEditor} type="button">取消编辑</button> : null}
            <button className="button primary" disabled={isSaving} type="submit">{isSaving ? "正在保存..." : editingProject ? "保存修改" : "发布项目"}</button>
          </div>
        </form>

        <section className="managed-projects" aria-labelledby="managed-projects-title">
          <div className="managed-projects-heading">
            <h2 id="managed-projects-title">已上传项目</h2>
            <span>{projects.length} 个项目</span>
          </div>
          {projects.length ? (
            <div className="managed-project-list">
              {projects.map((project) => (
                <article className="managed-project-row" key={project.id}>
                  <img alt="" src={project.image} />
                  <div>
                    <h3>{project.title}</h3>
                    <p>{project.subtitle || "未填写英文标题"}</p>
                  </div>
                  <div className="managed-project-actions">
                    <button className="edit-button" onClick={() => handleEdit(project)} type="button">编辑</button>
                    <button className="text-button" onClick={() => onDelete(project)} type="button">删除</button>
                  </div>
                </article>
              ))}
            </div>
          ) : <p className="managed-empty">还没有上传项目。</p>}
        </section>
      </section>
    </main>
  );
}

function App() {
  const currentHash = useCurrentHash();
  const [projectFilter, setProjectFilter] = useState("all");
  const [managedProjects, setManagedProjects] = useState([]);
  const allProjects = useMemo(() => [...baseProjects, ...managedProjects], [managedProjects]);
  const activeCase = useActiveCase(allProjects);
  const isLocalManagerHost = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
  const isAnalyticsPage = isLocalManagerHost && currentHash === "#analytics";
  const isProjectManagerPage = isLocalManagerHost && currentHash === "#project-manager";
  const isHomePage = !activeCase && !isAnalyticsPage && !isProjectManagerPage;
  const projectTabs = [
    ["全部", "all"],
    ["移动端", "mobile"],
    ["Web端", "web"],
    ["其他设计", "other"],
  ];
  const visibleProjects = allProjects.filter((project) => {
    if (projectFilter === "all") return true;
    if (projectFilter === "featured") return project.featured;
    return project.category === projectFilter;
  });

  useRevealOnScroll(isHomePage, projectFilter);
  useHeroVideoPlayback(isHomePage);

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    if (!isLocalManagerHost && (currentHash === "#analytics" || currentHash === "#project-manager")) {
      window.location.hash = "#top";
    }
  }, [currentHash, isLocalManagerHost]);

  useEffect(() => {
    listManagedProjects().then(setManagedProjects).catch((error) => {
      console.warn("无法读取云端项目。", error);
      setManagedProjects([]);
    });
  }, []);

  const handleProjectCreate = async (payload) => {
    const project = await saveManagedProject(payload);
    setManagedProjects((current) => [project, ...current]);
  };

  const handleProjectDelete = async (project) => {
    await removeManagedProject(project);
    setManagedProjects((current) => current.filter((item) => item.id !== project.id));
  };

  const handleProjectUpdate = async (payload) => {
    const project = await updateManagedProject(payload);
    setManagedProjects((current) => current.map((item) => (item.id === project.id ? project : item)));
  };

  if (isAnalyticsPage) {
    return (
      <>
        <SiteHeader />
        <AnalyticsDashboard />
      </>
    );
  }

  if (isProjectManagerPage) {
    return (
      <>
        <SiteHeader />
        <ProjectManager
          onCreate={handleProjectCreate}
          onDelete={handleProjectDelete}
          onUpdate={handleProjectUpdate}
          projects={managedProjects}
        />
      </>
    );
  }

  if (activeCase) {
    return (
      <>
        <CasePdfPage project={activeCase} />
      </>
    );
  }

  return (
    <>
      <SiteHeader />

      <main id="top">
        <section className="hero-section">
          <div className="hero-video-fallback" aria-hidden="true">
            <video
              className="hero-video"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              src="/videos/opa-home-header.mp4"
            />
          </div>

          <div className="hero-content shell">
            <p className="hero-kicker reveal">Portfolio 2026 - Shenzhen based designer</p>
            <h1 className="reveal">Xiaoxin</h1>
            <p className="hero-portfolio-word reveal">PORTFOLIO</p>
            <div className="hero-bottom reveal">
              <p>
                10年+全链路UI/UE设计经验，深耕金融与企业数字化，AI驱动体验创新，赋能复杂业务增长与团队高效落地。
              </p>
              <div className="hero-actions">
                <a className="button primary" href="#projects">
                  查看精选项目
                </a>
                <a className="button secondary" href={`mailto:${email}`}>
                  {email}
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="post-hero-stage">
          <div className="post-hero-aurora" aria-hidden="true">
            <SoftAurora
              speed={0.36}
              scale={1.58}
              brightness={0.58}
              color1="#f7f7f7"
              color2="#4461b1"
              noiseFrequency={2.1}
              noiseAmplitude={0.92}
              bandHeight={0.38}
              bandSpread={1.24}
              octaveDecay={0.18}
              layerOffset={0.42}
              colorSpeed={0.46}
              enableMouseInteraction={false}
              mouseInfluence={0.18}
            />
          </div>

          <section id="experience" className="experience-section section-pad">
            <div className="shell experience-grid">
              <div className="portrait-reveal reveal">
                <TiltedPhoto className="portrait-card" src="/images/avatar-xiaoxin.png" alt="李晓鑫头像" />
              </div>

              <div className="experience-copy">
                <span className="eyebrow reveal">About Me</span>
                <h2 className="reveal">
                  <SplitText text="你好，我叫李晓鑫" />
                </h2>
                <p className="reveal">
                  拥有 10 年 UI / UX 设计经验，长期服务于金融、政务及企业级产品，擅长复杂业务系统与中后台产品设计，具备从
                  0-1 到持续迭代的完整设计经验，并能结合 AIGC 工具辅助设计分析、方案探索与效率提升，独立推动设计方案落地。
                </p>
                <div className="profile-facts reveal">
                  {profileFacts.map((item) => (
                    <div className="profile-fact" key={item.label}>
                      <span>{item.label}</span>
                      {item.label === "邮箱地址" ? <a href={`mailto:${email}`}>{item.value}</a> : <strong>{item.value}</strong>}
                    </div>
                  ))}
                </div>
                <div className="profile-skills reveal">
                  <span>擅长技能/领域</span>
                  <div>
                    {profileSkills.map((skill) => (
                      <strong key={skill}>{skill}</strong>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="shell work-experience reveal">
              <span className="eyebrow">Work Experience</span>
              <div className="work-timeline">
                {workExperiences.map((item) => (
                  <article className="work-item" key={item.company}>
                    <span className="work-node" aria-hidden="true" />
                    <p>{item.period}</p>
                    <h3>{item.company}</h3>
                    <strong>{item.role}</strong>
                    <span>{item.description}</span>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="projects" className="projects-section section-pad">
            <div className="shell">
              <div className="section-heading reveal">
                <span className="eyebrow">Selected Projects</span>
                <h2>精选项目</h2>
                <p>聚焦金融科技、企业数字化与智慧园区等领域，精选从 0-1 设计、体验优化到设计规范搭建的代表项目。</p>
                <div className="project-tabs" role="tablist" aria-label="项目分类">
                  {projectTabs.map(([label, value]) => (
                    <button
                      aria-selected={projectFilter === value}
                      className={projectFilter === value ? "is-active" : ""}
                      key={value}
                      onClick={() => setProjectFilter(value)}
                      role="tab"
                      type="button"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="project-list">
                {visibleProjects.map((project, index) => (
                  <BorderGlow
                    animated={index === 0}
                    backgroundColor="rgba(9, 14, 16, 0.72)"
                    borderRadius={8}
                    className={`project-card reveal ${project.color} ${project.layout ? `is-${project.layout}` : ""} ${project.pdfPages ? "is-clickable" : ""}`}
                    colors={["#3f7cff", "#4461b1", "#6de7ff"]}
                    coneSpread={23}
                    edgeSensitivity={24}
                    fillOpacity={0.28}
                    glowColor="184 72 70"
                    glowIntensity={0.82}
                    glowRadius={34}
                    key={project.title}
                  >
                    <div className={`project-visual ${project.visualClass ? `is-${project.visualClass}` : ""}`} aria-hidden="true">
                      {project.image ? (
                        <img className="project-image" src={project.image} alt="" />
                      ) : (
                        <div className="mock-window">
                          <div className="mock-sidebar" />
                          <div className="mock-lines">
                            <span />
                            <span />
                            <span />
                          </div>
                          <div className="mock-chart" />
                        </div>
                      )}
                    </div>
                    <div className="project-info">
                      <div className="project-meta">
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <span>{project.year}</span>
                      </div>
                      <h3>{project.title}</h3>
                      {project.subtitle ? <span className="project-subtitle">{project.subtitle}</span> : null}
                      <p>{project.summary}</p>
                      <div className="project-foot">
                        <div className="project-foot-tags" aria-label="项目标签">
                          {project.tags
                            .filter((tag) => tag !== "OA 系统" && tag !== "AI 顾问")
                            .map((tag) => <span key={tag}>{tag}</span>)}
                        </div>
                      </div>
                    </div>
                    {project.pdfPages ? (
                      <a
                        className="project-hit-area"
                        href={`#case/${project.slug}`}
                        aria-label={`查看${project.title}作品集`}
                        onClick={() => trackProjectClick(project)}
                      />
                    ) : null}
                  </BorderGlow>
                ))}
              </div>
            </div>
          </section>

          <section id="strengths" className="strength-section section-pad">
            <div className="shell">
              <div className="section-heading reveal">
                <span className="eyebrow">Capabilities</span>
                <h2>个人优势</h2>
                <p>不是单点技能陈列，而是围绕复杂产品落地所需要的判断、表达、系统化和协作能力。</p>
              </div>

              <div className="strength-grid">
                {strengths.map((item, index) => (
                  <BorderGlow
                    animated={index === 0}
                    backgroundColor="rgba(9, 14, 16, 0.72)"
                    borderRadius={8}
                    className="strength-card reveal"
                    colors={["#3f7cff", "#4461b1", "#6de7ff"]}
                    coneSpread={23}
                    edgeSensitivity={24}
                    fillOpacity={0.28}
                    glowColor="184 72 70"
                    glowIntensity={0.82}
                    glowRadius={34}
                    key={item.title}
                  >
                    <span>{item.index}</span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </BorderGlow>
                ))}
              </div>
            </div>
          </section>

          <section id="contact" className="contact-section">
            <div className="shell contact-shell reveal">
              <span className="eyebrow">Contact</span>
              <h2>持续探索设计的边界，让复杂产品变得更清晰、更好用。</h2>
              <a className="button secondary contact-mail" href={`mailto:${email}`}>
                {email}
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default App;
