import React, { useEffect, useState } from "react";
import BorderGlow from "./BorderGlow.jsx";
import SoftAurora from "./SoftAurora.jsx";
import SplitText from "./SplitText.jsx";
import TiltedPhoto from "./TiltedPhoto.jsx";

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

const projects = [
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
    pdf: "/pdfs/ai-wealth-advisor.pdf",
    pdfPages: Array.from({ length: 7 }, (_, index) => `/cases/ai-wealth-advisor/page-${index + 1}.png`),
  },
  {
    title: "插画&LOGO视觉设计",
    subtitle: "Illustration & LOGO visual design",
    type: "品牌视觉 / 插画 / LOGO",
    year: "2024",
    summary:
      "负责宣传插画、Logo及品牌包装、卡通形象等视觉设计，搭建统一的品牌视觉规范，并结合 AI 工作流提升设计效率与创意产出。",
    tags: ["插画设计", "卡通形象", "LOGO设计"],
    stat: "成功交付",
    color: "green",
    image: "/images/project-illustration-logo-cover.png",
    layout: "wide",
    visualClass: "illustration",
    slug: "illustration-logo",
    pdfPages: Array.from({ length: 17 }, (_, index) => `/cases/illustration-logo/page-${String(index + 1).padStart(2, "0")}.png`),
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

function useRevealOnScroll(enabled) {
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
  }, [enabled]);
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

function useActiveCase() {
  const getActiveCase = () => {
    const slug = window.location.hash.replace("#case/", "");
    return projects.find((project) => project.slug === slug && project.pdfPages) || null;
  };

  const [activeCase, setActiveCase] = useState(getActiveCase);

  useEffect(() => {
    const handleHashChange = () => setActiveCase(getActiveCase());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (activeCase) window.scrollTo(0, 0);
  }, [activeCase]);

  return activeCase;
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
    if (!window.location.hash.startsWith("#case/")) return;

    event.preventDefault();
    window.location.hash = href;
    scrollToHomeSection(href);
  };

  return (
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
  );
}

function CasePdfPage({ project }) {
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

function App() {
  const activeCase = useActiveCase();
  const isHomePage = !activeCase;

  useRevealOnScroll(isHomePage);
  useHeroVideoPlayback(isHomePage);

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
              </div>

              <div className="project-list">
                {projects.map((project, index) => (
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
                        <div className="project-foot-tags" aria-label={`${project.title}标签`}>
                          {project.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                        <strong>{project.stat}</strong>
                      </div>
                    </div>
                    {project.pdfPages ? (
                      <a className="project-hit-area" href={`#case/${project.slug}`} aria-label={`查看${project.title}作品集`} />
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
