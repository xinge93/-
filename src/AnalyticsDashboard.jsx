import React, { useEffect, useMemo, useState } from "react";
import { getAnalyticsSummaryEndpoint } from "./analytics.js";

function formatNumber(value) {
  return new Intl.NumberFormat("zh-CN").format(value || 0);
}

function formatDuration(ms) {
  if (!ms) return "0秒";
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}秒`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (minutes < 60) return `${minutes}分${rest}秒`;
  const hours = Math.floor(minutes / 60);
  return `${hours}小时${minutes % 60}分`;
}

function formatTime(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function StatCard({ label, value, note }) {
  return (
    <article className="analytics-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      {note ? <small>{note}</small> : null}
    </article>
  );
}

export default function AnalyticsDashboard() {
  const [adminKey, setAdminKey] = useState(() => window.localStorage.getItem("analyticsAdminKey") || "");
  const [draftKey, setDraftKey] = useState(adminKey);
  const [summary, setSummary] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const endpoint = useMemo(() => getAnalyticsSummaryEndpoint(), []);

  useEffect(() => {
    if (!adminKey) return;

    setStatus("loading");
    setError("");
    fetch(endpoint, {
      headers: { "x-analytics-key": adminKey },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(response.status === 401 ? "管理密钥不正确" : "数据接口暂时不可用");
        return response.json();
      })
      .then((data) => {
        setSummary(data);
        setStatus("ready");
      })
      .catch((err) => {
        setStatus("error");
        setError(err.message || "加载失败");
      });
  }, [adminKey, endpoint]);

  const handleSubmit = (event) => {
    event.preventDefault();
    window.localStorage.setItem("analyticsAdminKey", draftKey);
    setAdminKey(draftKey);
  };

  return (
    <>
      <main className="analytics-page">
        <section className="analytics-shell">
          <div className="analytics-heading">
            <span className="eyebrow">Analytics</span>
            <h1>作品集访问数据</h1>
            <p>追踪访问量、访客 IP、项目点击和页面停留时间。数据来自自建统计接口。</p>
          </div>

          <form className="analytics-key-form" onSubmit={handleSubmit}>
            <label htmlFor="analytics-key">管理密钥</label>
            <input
              id="analytics-key"
              type="password"
              value={draftKey}
              onChange={(event) => setDraftKey(event.target.value)}
              placeholder="输入 ANALYTICS_ADMIN_KEY"
            />
            <button className="button primary" type="submit">
              查看数据
            </button>
          </form>

          {status === "error" ? <p className="analytics-error">{error}</p> : null}
          {status === "loading" ? <p className="analytics-loading">正在读取统计数据...</p> : null}

          {summary ? (
            <>
              <div className="analytics-grid">
                <StatCard label="访问量" value={formatNumber(summary.totals.pageViews)} note="页面浏览次数" />
                <StatCard label="访客数" value={formatNumber(summary.totals.visitors)} note="按浏览器访客 ID 统计" />
                <StatCard label="独立 IP" value={formatNumber(summary.totals.uniqueIps)} note="服务端采集" />
                <StatCard label="项目点击" value={formatNumber(summary.totals.projectClicks)} note="点击作品卡片" />
                <StatCard label="平均停留" value={formatDuration(summary.totals.averageDurationMs)} note="页面/案例停留均值" />
              </div>

              <section className="analytics-panel">
                <h2>作品点击排行</h2>
                <div className="analytics-table">
                  {summary.projectClicks.map((item) => (
                    <div className="analytics-row" key={item.slug || item.title}>
                      <span>{item.title || item.slug}</span>
                      <strong>{formatNumber(item.count)}</strong>
                    </div>
                  ))}
                  {!summary.projectClicks.length ? <p>还没有项目点击数据。</p> : null}
                </div>
              </section>

              <section className="analytics-panel">
                <h2>最近访问记录</h2>
                <div className="analytics-table is-recent">
                  {summary.recent.map((item) => (
                    <div className="analytics-row" key={item.id}>
                      <span>{formatTime(item.time)}</span>
                      <span>{item.ip}</span>
                      <span>{item.event}</span>
                      <span>{item.projectTitle || item.path}</span>
                      <strong>{item.durationMs ? formatDuration(item.durationMs) : "-"}</strong>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : null}
        </section>
      </main>
    </>
  );
}
