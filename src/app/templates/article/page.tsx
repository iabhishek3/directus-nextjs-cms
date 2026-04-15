"use client";

import { useState } from "react";
import EditMode from "@/components/EditMode";

type Theme = "dark" | "light";

interface ThemeColors {
  pageBg: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textFaint: string;
  navBg: string;
  navBorder: string;
  cardBg: string;
  cardBorder: string;
  sectionBorder: string;
  codeBg: string;
  quoteBorder: string;
  quoteBg: string;
  tagBg: string;
  tagText: string;
  accent: string;
  footerBg: string;
}

const themes: Record<Theme, ThemeColors> = {
  dark: {
    pageBg: "#0f0b1a",
    text: "#f4f4f5",
    textSecondary: "#a1a1aa",
    textMuted: "#71717a",
    textFaint: "#52525b",
    navBg: "rgba(15,11,26,0.85)",
    navBorder: "rgba(255,255,255,0.06)",
    cardBg: "rgba(255,255,255,0.04)",
    cardBorder: "rgba(255,255,255,0.08)",
    sectionBorder: "rgba(255,255,255,0.06)",
    codeBg: "rgba(255,255,255,0.06)",
    quoteBorder: "#7c3aed",
    quoteBg: "rgba(124,58,237,0.06)",
    tagBg: "rgba(124,58,237,0.12)",
    tagText: "#a78bfa",
    accent: "#7c3aed",
    footerBg: "#0a0816",
  },
  light: {
    pageBg: "#ffffff",
    text: "#18181b",
    textSecondary: "#52525b",
    textMuted: "#a1a1aa",
    textFaint: "#d4d4d8",
    navBg: "rgba(255,255,255,0.9)",
    navBorder: "#e4e4e7",
    cardBg: "#f9fafb",
    cardBorder: "#e4e4e7",
    sectionBorder: "#e4e4e7",
    codeBg: "#f4f4f5",
    quoteBorder: "#7c3aed",
    quoteBg: "#f5f3ff",
    tagBg: "#f3f0ff",
    tagText: "#7c3aed",
    accent: "#7c3aed",
    footerBg: "#fafafa",
  },
};

const article = {
  title: "Building Scalable AI Systems: Lessons from Production",
  subtitle: "What we learned deploying machine learning models at scale — and the mistakes that cost us months.",
  author: {
    name: "Sarah Chen",
    role: "Senior ML Engineer",
    avatar: "SC",
  },
  date: "April 12, 2026",
  readTime: "8 min read",
  category: "Engineering",
  tags: ["AI", "Machine Learning", "Production", "Architecture"],
};

const tocItems = [
  { id: "intro", label: "Introduction" },
  { id: "challenge", label: "The Challenge" },
  { id: "architecture", label: "Our Architecture" },
  { id: "mistakes", label: "Mistakes We Made" },
  { id: "results", label: "Results" },
  { id: "takeaways", label: "Key Takeaways" },
];

const relatedArticles = [
  { title: "MLOps Best Practices for Small Teams", category: "Engineering", readTime: "6 min", icon: "⚙️" },
  { title: "The Real Cost of Technical Debt in AI", category: "Business", readTime: "5 min", icon: "💰" },
  { title: "From Notebook to Production in 30 Days", category: "Tutorial", readTime: "12 min", icon: "📓" },
];

export default function ArticleTemplate() {
  const [theme, setTheme] = useState<Theme>("light");
  const t = themes[theme];
  const isDark = theme === "dark";

  const heroTitle = article.title;
  const heroSubtitle = article.subtitle;

  return (
    <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: "'Georgia', 'Times New Roman', serif", transition: "background 0.3s, color 0.3s" }}>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: t.navBg, backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${t.navBorder}`,
      }}>
        <div className="art-nav-inner" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <a href="/templates"><img src="/htx-logo.png" alt="Logo" style={{ height: 48, objectFit: "contain" }} /></a>
          <div style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: "system-ui, sans-serif" }}>
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              style={{
                width: 36, height: 36, borderRadius: 8, border: `1px solid ${t.cardBorder}`,
                background: t.cardBg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, transition: "all 0.3s",
              }}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
            <a href="/templates" style={{ fontSize: 14, color: t.textSecondary, textDecoration: "none" }}>All Templates</a>
          </div>
        </div>
      </nav>

      {/* Article header */}
      <header
        className="art-header"
        data-directus-collection="hero_section"
        data-directus-id="1"
        style={{ maxWidth: 1024, margin: "0 auto", padding: "64px 24px 0" }}
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

        <h1 className="art-title" style={{ fontSize: 44, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, color: t.text, marginBottom: 16 }}>
          {heroTitle}
        </h1>
        <p className="art-subtitle" style={{ fontSize: 22, color: t.textSecondary, lineHeight: 1.6, marginBottom: 32 }}>
          {heroSubtitle}
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
      <div className="art-content-wrapper" style={{ maxWidth: 1024, margin: "0 auto", padding: "48px 24px", display: "flex", gap: 64 }}>

        {/* Main content */}
        <article className="art-main" style={{ flex: 1, minWidth: 0, maxWidth: 720, fontSize: 18, lineHeight: 1.8, color: t.textSecondary }}>

          <section id="intro">
            <p style={{ marginBottom: 24 }}>
              When we first started building our AI platform, we thought the hard part was training the model. We were wrong. The hard part is everything that happens after you type <code style={{ background: t.codeBg, padding: "2px 8px", borderRadius: 6, fontSize: 16, fontFamily: "monospace" }}>model.fit()</code> — deployment, monitoring, scaling, and keeping the whole thing running when real users start sending real data.
            </p>
            <p style={{ marginBottom: 24 }}>
              This post shares the lessons we learned over 18 months of building and scaling our ML infrastructure. Some of these lessons cost us weeks of debugging. Others cost us months of rework. All of them changed how we think about building AI systems.
            </p>
          </section>

          <section id="challenge">
            <h2 style={{ fontSize: 28, fontWeight: 700, color: t.text, marginTop: 48, marginBottom: 16, letterSpacing: "-0.02em", fontFamily: "'Georgia', serif" }}>
              The Challenge
            </h2>
            <p style={{ marginBottom: 24 }}>
              Our platform processes over 2 million requests per day. Each request needs to be classified, routed to the appropriate model, and responded to within 200ms. The models themselves are updated weekly, and we need zero-downtime deployments.
            </p>

            {/* Stats callout */}
            <div className="art-stats-grid" style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, margin: "32px 0",
              fontFamily: "system-ui, sans-serif",
            }}>
              {[
                { value: "2M+", label: "Daily Requests" },
                { value: "<200ms", label: "P99 Latency" },
                { value: "99.97%", label: "Uptime" },
              ].map((stat) => (
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
            <h2 style={{ fontSize: 28, fontWeight: 700, color: t.text, marginTop: 48, marginBottom: 16, letterSpacing: "-0.02em", fontFamily: "'Georgia', serif" }}>
              Our Architecture
            </h2>
            <p style={{ marginBottom: 24 }}>
              We settled on a microservices architecture with a dedicated model serving layer. Each model runs in its own container with autoscaling based on request volume and latency metrics.
            </p>

            {/* Code block */}
            <div style={{
              background: t.codeBg, borderRadius: 12, padding: "20px 24px", marginBottom: 24,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 14, lineHeight: 1.8,
              border: `1px solid ${t.cardBorder}`, overflow: "auto",
            }}>
              <div style={{ color: t.textMuted }}>{'# Model serving configuration'}</div>
              <div><span style={{ color: t.accent }}>service</span>: ml-inference</div>
              <div><span style={{ color: t.accent }}>replicas</span>: {'{ min: 3, max: 20 }'}</div>
              <div><span style={{ color: t.accent }}>scaling</span>:</div>
              <div>{'  '}<span style={{ color: "#059669" }}>metric</span>: request_latency_p99</div>
              <div>{'  '}<span style={{ color: "#059669" }}>target</span>: 150ms</div>
              <div><span style={{ color: t.accent }}>health_check</span>: /v1/models/status</div>
            </div>

            <p style={{ marginBottom: 24 }}>
              The key insight was separating the model serving layer from the business logic layer. This let us update models independently and roll back without affecting the rest of the system.
            </p>
          </section>

          <section id="mistakes">
            <h2 style={{ fontSize: 28, fontWeight: 700, color: t.text, marginTop: 48, marginBottom: 16, letterSpacing: "-0.02em", fontFamily: "'Georgia', serif" }}>
              Mistakes We Made
            </h2>

            <p style={{ marginBottom: 24 }}>
              We made plenty of mistakes along the way. Here are the three that hurt the most:
            </p>

            {/* Blockquote */}
            <blockquote style={{
              borderLeft: `4px solid ${t.quoteBorder}`, background: t.quoteBg,
              padding: "20px 24px", borderRadius: "0 12px 12px 0", margin: "32px 0",
              fontStyle: "italic", fontSize: 20, lineHeight: 1.7, color: t.text,
            }}>
              &ldquo;We spent three months optimizing model accuracy by 0.3%, only to discover that our data pipeline was silently dropping 5% of incoming requests.&rdquo;
            </blockquote>

            <p style={{ marginBottom: 16 }}>
              <strong style={{ color: t.text }}>1. Ignoring data quality.</strong> We focused on model architecture when the real problem was data quality. Garbage in, garbage out applies more than ever at scale.
            </p>
            <p style={{ marginBottom: 16 }}>
              <strong style={{ color: t.text }}>2. No feature store.</strong> Without a centralized feature store, different teams computed the same features differently. This caused subtle bugs that were nearly impossible to track down.
            </p>
            <p style={{ marginBottom: 24 }}>
              <strong style={{ color: t.text }}>3. Testing in production.</strong> We didn&apos;t invest in a proper staging environment early enough. By the time we did, we had already shipped several bugs to users.
            </p>
          </section>

          <section id="results">
            <h2 style={{ fontSize: 28, fontWeight: 700, color: t.text, marginTop: 48, marginBottom: 16, letterSpacing: "-0.02em", fontFamily: "'Georgia', serif" }}>
              Results
            </h2>
            <p style={{ marginBottom: 24 }}>
              After implementing these changes, we saw dramatic improvements across the board. Model deployment time dropped from 4 hours to 15 minutes. Incident response time fell by 60%. And most importantly, model accuracy improved by 12% — not from better algorithms, but from better data.
            </p>
          </section>

          <section id="takeaways">
            <h2 style={{ fontSize: 28, fontWeight: 700, color: t.text, marginTop: 48, marginBottom: 16, letterSpacing: "-0.02em", fontFamily: "'Georgia', serif" }}>
              Key Takeaways
            </h2>

            {/* Takeaway list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32, fontFamily: "system-ui, sans-serif" }}>
              {[
                "Invest in data quality before model complexity",
                "Build observability from day one — you can't fix what you can't see",
                "Separate model serving from business logic",
                "Automate your deployment pipeline early",
                "Test with real data in a staging environment",
              ].map((item, i) => (
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
        <aside className="art-sidebar" style={{ width: 240, flexShrink: 0, fontFamily: "system-ui, sans-serif", position: "sticky", top: 96, alignSelf: "flex-start" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
            On this page
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {tocItems.map((item) => (
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
          <span style={{ fontSize: 13, color: t.textFaint }}>&copy; 2026 Article. All rights reserved.</span>
          <a href="/templates" style={{ fontSize: 13, color: t.accent, textDecoration: "none", fontWeight: 600 }}>Back to Templates</a>
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
