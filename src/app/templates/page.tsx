"use client";

import { useState } from "react";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  route: string;
  status: "live" | "coming-soon";
  tags: string[];
  author: string;
  uses: string;
  likes: number;
  price: string;
}

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
  cardBorderHover: string;
  cardHoverShadow: string;
  cardShadow: string;
  filterBg: string;
  filterBorder: string;
  filterText: string;
  filterActiveBg: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  sectionBorder: string;
  footerBg: string;
  accent: string;
  searchBg: string;
  searchBorder: string;
  searchText: string;
  searchPlaceholder: string;
}

const themes: Record<Theme, ThemeColors> = {
  dark: {
    pageBg: "#0f0b1a",
    text: "#ffffff",
    textSecondary: "#a1a1aa",
    textMuted: "#71717a",
    textFaint: "#52525b",
    navBg: "rgba(15, 11, 26, 0.85)",
    navBorder: "rgba(255,255,255,0.06)",
    cardBg: "rgba(255,255,255,0.04)",
    cardBorder: "rgba(255,255,255,0.08)",
    cardBorderHover: "#7c3aed",
    cardHoverShadow: "0 16px 48px rgba(124,58,237,0.15)",
    cardShadow: "none",
    filterBg: "transparent",
    filterBorder: "rgba(255,255,255,0.08)",
    filterText: "#a1a1aa",
    filterActiveBg: "#7c3aed",
    badgeBg: "rgba(124,58,237,0.12)",
    badgeBorder: "rgba(124,58,237,0.25)",
    badgeText: "#a78bfa",
    sectionBorder: "rgba(255,255,255,0.06)",
    footerBg: "#0a0816",
    accent: "#7c3aed",
    searchBg: "rgba(255,255,255,0.05)",
    searchBorder: "rgba(255,255,255,0.1)",
    searchText: "#ffffff",
    searchPlaceholder: "#71717a",
  },
  light: {
    pageBg: "#f4f4f5",
    text: "#18181b",
    textSecondary: "#52525b",
    textMuted: "#a1a1aa",
    textFaint: "#d4d4d8",
    navBg: "rgba(255,255,255,0.92)",
    navBorder: "#e4e4e7",
    cardBg: "#ffffff",
    cardBorder: "#e4e4e7",
    cardBorderHover: "#7c3aed",
    cardHoverShadow: "0 16px 48px rgba(0,0,0,0.1)",
    cardShadow: "0 1px 3px rgba(0,0,0,0.04)",
    filterBg: "transparent",
    filterBorder: "#e4e4e7",
    filterText: "#71717a",
    filterActiveBg: "#7c3aed",
    badgeBg: "#f3f0ff",
    badgeBorder: "#ddd6fe",
    badgeText: "#7c3aed",
    sectionBorder: "#e4e4e7",
    footerBg: "#ffffff",
    accent: "#7c3aed",
    searchBg: "#ffffff",
    searchBorder: "#e4e4e7",
    searchText: "#18181b",
    searchPlaceholder: "#a1a1aa",
  },
};

const templates: Template[] = [
  {
    id: "events",
    name: "Events Platform",
    description: "Event management with listings & registration",
    category: "Marketing",
    route: "/templates/events",
    status: "live",
    tags: ["Events", "CMS"],
    author: "DirectusAI",
    uses: "2.4K",
    likes: 312,
    price: "Free",
  },
  {
    id: "article",
    name: "Article",
    description: "Clean article template with rich typography",
    category: "Content",
    route: "/templates/article",
    status: "live",
    tags: ["Blog", "Typography"],
    author: "DirectusAI",
    uses: "1.8K",
    likes: 247,
    price: "Free",
  },
  {
    id: "landing-page",
    name: "Landing Page",
    description: "SaaS landing page with pricing & features",
    category: "Marketing",
    route: "/templates/landing-page",
    status: "live",
    tags: ["Landing Page", "SaaS"],
    author: "DirectusAI",
    uses: "3.1K",
    likes: 489,
    price: "Free",
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Creative portfolio with project showcases",
    category: "Personal",
    route: "#",
    status: "coming-soon",
    tags: ["Portfolio", "Creative"],
    author: "DirectusAI",
    uses: "1.2K",
    likes: 198,
    price: "Free",
  },
  {
    id: "blog",
    name: "Blog & Magazine",
    description: "Content blog with categories & authors",
    category: "Content",
    route: "#",
    status: "coming-soon",
    tags: ["Blog", "Articles"],
    author: "DirectusAI",
    uses: "956",
    likes: 134,
    price: "Free",
  },
  {
    id: "ecommerce",
    name: "E-Commerce Store",
    description: "Product catalog with cart & checkout",
    category: "Commerce",
    route: "#",
    status: "coming-soon",
    tags: ["Store", "Products"],
    author: "DirectusAI",
    uses: "4.2K",
    likes: 567,
    price: "1 Credit",
  },
  {
    id: "dashboard",
    name: "Admin Dashboard",
    description: "Analytics dashboard with charts & tables",
    category: "App",
    route: "#",
    status: "coming-soon",
    tags: ["Dashboard", "Analytics"],
    author: "DirectusAI",
    uses: "5.8K",
    likes: 721,
    price: "1 Credit",
  },
  {
    id: "crm",
    name: "CRM Platform",
    description: "Customer management with pipelines & contacts",
    category: "App",
    route: "#",
    status: "coming-soon",
    tags: ["CRM", "Business"],
    author: "DirectusAI",
    uses: "2.1K",
    likes: 345,
    price: "Free",
  },
  {
    id: "docs",
    name: "Documentation Site",
    description: "Technical docs with search & versioning",
    category: "Content",
    route: "#",
    status: "coming-soon",
    tags: ["Docs", "Technical"],
    author: "DirectusAI",
    uses: "3.6K",
    likes: 412,
    price: "Free",
  },
];

const categories = ["All", ...Array.from(new Set(templates.map((t) => t.category)))];

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hovered, setHovered] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>("light");
  const [search, setSearch] = useState("");

  const t = themes[theme];
  const isDark = theme === "dark";

  const filtered = templates.filter((tmpl) => {
    const matchCategory = activeCategory === "All" || tmpl.category === activeCategory;
    const matchSearch = !search || tmpl.name.toLowerCase().includes(search.toLowerCase()) || tmpl.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", transition: "background 0.3s, color 0.3s" }}>

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: t.navBg, backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${t.navBorder}`,
        transition: "background 0.3s",
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em" }}>
              <span style={{ color: t.accent }}>DirectusAI</span><span style={{ color: t.textMuted, fontWeight: 500 }}> Studio</span>
            </span>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.textMuted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: 280, padding: "8px 14px 8px 38px", borderRadius: 10,
                  border: `1px solid ${t.searchBorder}`, background: t.searchBg,
                  color: t.searchText, fontSize: 14, outline: "none",
                  fontFamily: "inherit", transition: "border-color 0.2s",
                }}
              />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 14 }}>
            <a href="/edit" style={{ color: t.textSecondary, textDecoration: "none", fontWeight: 500 }}>Editor</a>
            <span style={{ color: t.accent, fontWeight: 600 }}>Templates</span>
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
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "48px 32px 0", textAlign: "center" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", color: t.text }}>
          <span style={{ color: t.accent }}>DirectusAI</span> Studio
        </h1>
        <p style={{ fontSize: 16, color: t.textSecondary, marginTop: 8, maxWidth: 480, margin: "8px auto 0", lineHeight: 1.6 }}>
          Beautiful, AI-editable templates powered by Directus CMS. Pick a template, customize with chat, ship in minutes.
        </p>
      </div>

      {/* Category filters */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 32px 0", display: "flex", alignItems: "center", gap: 8 }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: "7px 18px", borderRadius: 8, border: "1px solid",
              borderColor: activeCategory === cat ? t.accent : t.filterBorder,
              background: activeCategory === cat ? t.filterActiveBg : t.filterBg,
              color: activeCategory === cat ? "#fff" : t.filterText,
              fontSize: 13, fontWeight: 500, cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {cat}
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 13, color: t.textMuted }}>
          {filtered.length} template{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Template grid */}
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 32px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {filtered.map((tmpl) => {
            const isLive = tmpl.status === "live";
            const isHovered = hovered === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onMouseEnter={() => setHovered(tmpl.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  borderRadius: 12, overflow: "hidden",
                  background: t.cardBg,
                  border: `1px solid ${isHovered && isLive ? t.cardBorderHover : t.cardBorder}`,
                  cursor: isLive ? "pointer" : "default",
                  transition: "all 0.25s",
                  transform: isHovered && isLive ? "translateY(-3px)" : "none",
                  boxShadow: isHovered && isLive ? t.cardHoverShadow : t.cardShadow,
                  opacity: isLive ? 1 : 0.55,
                }}
                onClick={() => {
                  if (isLive) window.location.href = `/edit?template=${encodeURIComponent(tmpl.route)}`;
                }}
              >
                {/* Live preview */}
                <div style={{
                  height: 220, overflow: "hidden", position: "relative",
                  borderBottom: `1px solid ${t.cardBorder}`,
                  background: isDark ? "#1a1a2e" : "#f8f8fa",
                }}>
                  {isLive ? (
                    <iframe
                      src={tmpl.route}
                      style={{
                        width: 1440,
                        height: 900,
                        border: "none",
                        transform: "scale(0.305)",
                        transformOrigin: "top left",
                        pointerEvents: "none",
                      }}
                      tabIndex={-1}
                      loading="lazy"
                    />
                  ) : (
                    <div style={{
                      width: "100%", height: "100%",
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      gap: 8,
                    }}>
                      <div style={{ fontSize: 32, opacity: 0.4 }}>
                        {tmpl.id === "saas-landing" ? "🚀" : tmpl.id === "portfolio" ? "🎨" : tmpl.id === "blog" ? "📝" : tmpl.id === "ecommerce" ? "🛍" : tmpl.id === "dashboard" ? "📊" : tmpl.id === "crm" ? "👥" : "📄"}
                      </div>
                      <span style={{ fontSize: 11, color: t.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Coming Soon</span>
                    </div>
                  )}

                  {/* Hover overlay for live templates */}
                  {isLive && isHovered && (
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "rgba(124,58,237,0.08)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "opacity 0.2s",
                    }}>
                      <div style={{
                        padding: "10px 24px", borderRadius: 10,
                        background: t.accent, color: "#fff",
                        fontSize: 14, fontWeight: 600,
                        boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
                      }}>
                        Use Template
                      </div>
                    </div>
                  )}
                </div>

                {/* Card footer */}
                <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                  {/* Author avatar */}
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    background: t.accent, display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: 12, fontWeight: 700,
                  }}>
                    D
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {tmpl.name}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: t.textMuted, marginTop: 2 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
                        </svg>
                        {tmpl.uses}
                      </span>
                      <span>&middot;</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                        </svg>
                        {tmpl.likes}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <span style={{
                    fontSize: 12, fontWeight: 600, color: tmpl.price === "Free" ? t.textSecondary : t.accent,
                    flexShrink: 0,
                  }}>
                    {tmpl.price}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${t.sectionBorder}`, padding: "24px 0", background: t.footerBg, transition: "background 0.3s" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: t.textFaint }}>&copy; 2026 DirectusAI Studio. All rights reserved.</span>
          <span style={{ fontSize: 13, color: t.textFaint }}>Built with Next.js + Directus</span>
        </div>
      </footer>
    </div>
  );
}
