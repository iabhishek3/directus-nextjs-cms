"use client";

import { useState, useEffect } from "react";
import EditMode from "@/components/EditMode";
import defaultConfig from "./config.json";

type Theme = "dark" | "light";
type ThemeColors = Record<string, string>;

export default function ArticleTemplate() {
  const [config, setConfig] = useState(defaultConfig);
  const [theme, setTheme] = useState<Theme>(defaultConfig.themes.default as Theme);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch(`/api/config?template=article&_t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          setConfig(data);
        }
      } catch {
        // Use default config
      }
    }
    fetchConfig();
  }, []);

  const t = (config.themes as unknown as Record<string, ThemeColors>)[theme] || config.themes.light;
  const isDark = theme === "dark";
  const { article, content, toc, relatedArticles, typography, layout, nav, footer } = config;

  return (
    <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: typography.body.fontFamily, transition: "background 0.3s, color 0.3s" }}>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: t.navBg, backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${t.navBorder}`,
      }}>
        <div className="art-nav-inner" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: nav.height }}>
          <a href="/templates"><img src={nav.logo} alt="Logo" style={{ height: nav.logoHeight, objectFit: "contain" }} /></a>
          <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: "system-ui, sans-serif" }}>
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              style={{
                width: nav.themeToggle.size, height: nav.themeToggle.size, borderRadius: nav.themeToggle.borderRadius,
                border: `1px solid ${t.cardBorder}`,
                background: t.cardBg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, transition: "all 0.3s",
              }}
            >
              {isDark ? nav.themeToggle.darkIcon : nav.themeToggle.lightIcon}
            </button>
            <a href={nav.backLink.href} style={{ fontSize: 14, color: t.textSecondary, textDecoration: "none" }}>{nav.backLink.text}</a>
          </div>
        </div>
      </nav>

      {/* Article header */}
      <header
        className="art-header"
        style={{ maxWidth: layout.maxWidth, margin: "0 auto", padding: "64px 24px 0" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, fontFamily: "system-ui, sans-serif" }}>
          <span style={{
            fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 8,
            background: t.tagBg, color: t.tagText, textTransform: "uppercase", letterSpacing: "0.05em",
          }}>
            {article.category}
          </span>
          <span style={{ fontSize: 13, color: t.textMuted }}>{article.date}</span>
          <span style={{ fontSize: 13, color: t.textMuted }}>{article.readTime}</span>
        </div>

        <h1 className="art-title" style={{ fontSize: typography.title.fontSize, fontWeight: typography.title.fontWeight, letterSpacing: typography.title.letterSpacing, lineHeight: typography.title.lineHeight, color: t.text, marginBottom: 16 }}>
          {article.title}
        </h1>
        <p className="art-subtitle" style={{ fontSize: typography.subtitle.fontSize, color: t.textSecondary, lineHeight: typography.subtitle.lineHeight, marginBottom: 32 }}>
          {article.subtitle}
        </p>

        {/* Author */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: 32, borderBottom: `1px solid ${t.sectionBorder}`, fontFamily: "system-ui, sans-serif" }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%", background: t.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 16, fontFamily: "system-ui, sans-serif",
          }}>
            {article.author.avatar}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{article.author.name}</div>
            <div style={{ fontSize: 13, color: t.textMuted }}>{article.author.role}</div>
          </div>
        </div>
      </header>

      {/* Content area with TOC sidebar */}
      <div className="art-content-wrapper" style={{ maxWidth: layout.maxWidth, margin: "0 auto", padding: "48px 24px", display: "flex", gap: layout.contentGap }}>

        {/* Main content */}
        <article className="art-main" style={{ flex: 1, minWidth: 0, maxWidth: layout.contentMaxWidth, fontSize: typography.body.fontSize, lineHeight: typography.body.lineHeight, color: t.textSecondary }}>

          <section id="intro">
            {content.intro.paragraphs.map((p, i) => (
              <p key={i} style={{ marginBottom: 24 }}>
                {i === 0 ? (
                  <>
                    {p.split("model.fit()")[0]}
                    <code style={{ background: t.codeBg, padding: "2px 8px", borderRadius: 6, fontSize: 16, fontFamily: "monospace" }}>model.fit()</code>
                    {p.split("model.fit()")[1]}
                  </>
                ) : p}
              </p>
            ))}
          </section>

          <section id="challenge">
            <h2 style={{ fontSize: typography.heading.fontSize, fontWeight: typography.heading.fontWeight, color: t.text, marginTop: 48, marginBottom: 16, letterSpacing: typography.heading.letterSpacing, fontFamily: typography.heading.fontFamily }}>
              {content.challenge.heading}
            </h2>
            {content.challenge.paragraphs.map((p, i) => (
              <p key={i} style={{ marginBottom: 24 }}>{p}</p>
            ))}

            {/* Stats callout */}
            <div className="art-stats-grid" style={{
              display: "grid", gridTemplateColumns: `repeat(${content.challenge.stats.length}, 1fr)`, gap: 16, margin: "32px 0",
              fontFamily: "system-ui, sans-serif",
            }}>
              {content.challenge.stats.map((stat) => (
                <div key={stat.label} style={{
                  padding: "20px", borderRadius: 12, background: t.cardBg, border: `1px solid ${t.cardBorder}`,
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: t.accent, letterSpacing: "-0.02em" }}>{stat.value}</div>
                  <div style={{ fontSize: 13, color: t.textMuted, marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          <section id="architecture">
            <h2 style={{ fontSize: typography.heading.fontSize, fontWeight: typography.heading.fontWeight, color: t.text, marginTop: 48, marginBottom: 16, letterSpacing: typography.heading.letterSpacing, fontFamily: typography.heading.fontFamily }}>
              {content.architecture.heading}
            </h2>
            <p style={{ marginBottom: 24 }}>{content.architecture.paragraphs[0]}</p>

            {/* Code block */}
            <div style={{
              background: t.codeBg, borderRadius: 12, padding: "20px 24px", marginBottom: 24,
              fontFamily: typography.code.fontFamily, fontSize: typography.code.fontSize, lineHeight: typography.code.lineHeight,
              border: `1px solid ${t.cardBorder}`, overflow: "auto",
            }}>
              {content.architecture.codeBlock.map((line, i) => {
                if (line.startsWith("#")) {
                  return <div key={i} style={{ color: t.textMuted }}>{line}</div>;
                }
                const colonIdx = line.indexOf(":");
                if (colonIdx > 0 && !line.startsWith(" ")) {
                  return (
                    <div key={i}>
                      <span style={{ color: t.accent }}>{line.slice(0, colonIdx)}</span>
                      {line.slice(colonIdx)}
                    </div>
                  );
                }
                if (line.startsWith("  ")) {
                  const innerColonIdx = line.trimStart().indexOf(":");
                  const trimmed = line.trimStart();
                  if (innerColonIdx > 0) {
                    return (
                      <div key={i}>
                        {"  "}<span style={{ color: "#059669" }}>{trimmed.slice(0, innerColonIdx)}</span>{trimmed.slice(innerColonIdx)}
                      </div>
                    );
                  }
                }
                return <div key={i}>{line}</div>;
              })}
            </div>

            {content.architecture.paragraphs.slice(1).map((p, i) => (
              <p key={i} style={{ marginBottom: 24 }}>{p}</p>
            ))}
          </section>

          <section id="mistakes">
            <h2 style={{ fontSize: typography.heading.fontSize, fontWeight: typography.heading.fontWeight, color: t.text, marginTop: 48, marginBottom: 16, letterSpacing: typography.heading.letterSpacing, fontFamily: typography.heading.fontFamily }}>
              {content.mistakes.heading}
            </h2>

            <p style={{ marginBottom: 24 }}>{content.mistakes.intro}</p>

            {/* Blockquote */}
            <blockquote style={{
              borderLeft: `4px solid ${t.quoteBorder}`, background: t.quoteBg,
              padding: "20px 24px", borderRadius: "0 12px 12px 0", margin: "32px 0",
              fontStyle: "italic", fontSize: 20, lineHeight: 1.7, color: t.text,
            }}>
              &ldquo;{content.mistakes.quote}&rdquo;
            </blockquote>

            {content.mistakes.items.map((item, i) => (
              <p key={i} style={{ marginBottom: i < content.mistakes.items.length - 1 ? 16 : 24 }}>
                <strong style={{ color: t.text }}>{i + 1}. {item.label}</strong> {item.text}
              </p>
            ))}
          </section>

          <section id="results">
            <h2 style={{ fontSize: typography.heading.fontSize, fontWeight: typography.heading.fontWeight, color: t.text, marginTop: 48, marginBottom: 16, letterSpacing: typography.heading.letterSpacing, fontFamily: typography.heading.fontFamily }}>
              {content.results.heading}
            </h2>
            {content.results.paragraphs.map((p, i) => (
              <p key={i} style={{ marginBottom: 24 }}>{p}</p>
            ))}
          </section>

          <section id="takeaways">
            <h2 style={{ fontSize: typography.heading.fontSize, fontWeight: typography.heading.fontWeight, color: t.text, marginTop: 48, marginBottom: 16, letterSpacing: typography.heading.letterSpacing, fontFamily: typography.heading.fontFamily }}>
              {content.takeaways.heading}
            </h2>

            {/* Takeaway list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32, fontFamily: "system-ui, sans-serif" }}>
              {content.takeaways.items.map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "16px 20px", borderRadius: 12,
                  background: t.cardBg, border: `1px solid ${t.cardBorder}`,
                }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: t.tagBg, color: t.accent,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700,
                  }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: 15, color: t.text, lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Tags */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 32, borderTop: `1px solid ${t.sectionBorder}`, fontFamily: "system-ui, sans-serif" }}>
            {article.tags.map((tag) => (
              <span key={tag} style={{
                fontSize: 13, fontWeight: 500, padding: "6px 14px", borderRadius: 8,
                background: t.tagBg, color: t.tagText,
              }}>
                {tag}
              </span>
            ))}
          </div>
        </article>

        {/* Sidebar TOC */}
        <aside className="art-sidebar" style={{ width: layout.sidebarWidth, flexShrink: 0, fontFamily: "system-ui, sans-serif", position: "sticky", top: 96, alignSelf: "flex-start" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
            On this page
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                style={{
                  fontSize: 14, color: t.textMuted, textDecoration: "none",
                  padding: "6px 12px", borderRadius: 6, borderLeft: `2px solid transparent`,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = t.accent;
                  e.currentTarget.style.borderLeftColor = t.accent;
                  e.currentTarget.style.background = t.tagBg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = t.textMuted;
                  e.currentTarget.style.borderLeftColor = "transparent";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Related articles */}
          <div style={{ marginTop: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
              Related
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {relatedArticles.map((rel) => (
                <a key={rel.title} href="#" style={{
                  padding: "14px 16px", borderRadius: 12,
                  background: t.cardBg, border: `1px solid ${t.cardBorder}`,
                  textDecoration: "none", transition: "border-color 0.2s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.cardBorder; }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text, lineHeight: 1.4, marginBottom: 6 }}>{rel.title}</div>
                  <div style={{ fontSize: 11, color: t.textMuted }}>{rel.category} &middot; {rel.readTime}</div>
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${t.sectionBorder}`, padding: "32px 0", background: t.footerBg, fontFamily: "system-ui, sans-serif" }}>
        <div className="art-footer-inner" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: t.textFaint }}>{footer.copyright}</span>
          <a href={footer.backLink.href} style={{ fontSize: 13, color: t.accent, textDecoration: "none", fontWeight: 600 }}>{footer.backLink.text}</a>
        </div>
      </footer>

      <EditMode />

      <style>{`
        /* ── Tablet (<=820px) ── */
        @media (max-width: 820px) {
          .art-nav-inner { padding: 0 20px !important; }
          .art-header { padding: 48px 20px 0 !important; }
          .art-title { font-size: 36px !important; }
          .art-subtitle { font-size: 19px !important; }

          .art-content-wrapper { padding: 36px 20px !important; gap: 0 !important; }
          .art-sidebar { display: none !important; }
          .art-main { flex: 1 1 100% !important; max-width: 100% !important; }

          .art-footer-inner { padding: 0 20px !important; }
        }

        /* ── Mobile (<=640px) ── */
        @media (max-width: 640px) {
          .art-nav-inner { padding: 0 16px !important; }
          .art-header { padding: 32px 16px 0 !important; }
          .art-title { font-size: 28px !important; }
          .art-subtitle { font-size: 17px !important; }

          .art-content-wrapper { padding: 28px 16px !important; }
          .art-main { font-size: 16px !important; }

          .art-stats-grid { grid-template-columns: 1fr !important; }

          .art-footer-inner {
            flex-direction: column !important;
            gap: 12px;
            text-align: center;
            padding: 0 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
