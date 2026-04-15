"use client";

import { useEffect, useState } from "react";
import EditMode from "@/components/EditMode";

interface Event {
  id: number;
  status: string;
  title: string;
  slug: string;
  description: string | null;
  date: string;
  location: string | null;
  image: string | null;
  capacity: number;
  category: string | null;
  price: number;
}

interface HeroSection {
  title: string;
  subtitle: string | null;
  button_text: string | null;
  button_link: string | null;
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
  cardNumberBg: string;
  cardNumberBorder: string;
  cardNumberText: string;
  sectionBorder: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  secondaryBtnBg: string;
  secondaryBtnBorder: string;
  secondaryBtnText: string;
  ctaBg: string;
  ctaBorder: string;
  ctaText: string;
  ctaSubtext: string;
  ctaPrimaryBtnBg: string;
  ctaPrimaryBtnText: string;
  ctaSecondaryBtnBorder: string;
  ctaSecondaryBtnText: string;
  ctaSecondaryBtnBg: string;
  footerBg: string;
  emptyBg: string;
  emptyBorder: string;
  cardHoverShadow: string;
  cardShadow: string;
  primaryBtnBg: string;
  primaryBtnShadow: string;
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
    cardNumberBg: "rgba(255,255,255,0.05)",
    cardNumberBorder: "rgba(255,255,255,0.08)",
    cardNumberText: "rgba(255,255,255,0.2)",
    sectionBorder: "rgba(255,255,255,0.06)",
    badgeBg: "rgba(124,58,237,0.12)",
    badgeBorder: "rgba(124,58,237,0.25)",
    badgeText: "#a78bfa",
    secondaryBtnBg: "rgba(255,255,255,0.05)",
    secondaryBtnBorder: "rgba(255,255,255,0.15)",
    secondaryBtnText: "#e4e4e7",
    ctaBg: "#1e1b2e",
    ctaBorder: "rgba(124,58,237,0.25)",
    ctaText: "#ffffff",
    ctaSubtext: "#a1a1aa",
    ctaPrimaryBtnBg: "#7c3aed",
    ctaPrimaryBtnText: "#ffffff",
    ctaSecondaryBtnBorder: "rgba(255,255,255,0.2)",
    ctaSecondaryBtnText: "#e4e4e7",
    ctaSecondaryBtnBg: "rgba(255,255,255,0.06)",
    footerBg: "#0a0816",
    emptyBg: "rgba(255,255,255,0.02)",
    emptyBorder: "rgba(255,255,255,0.1)",
    cardHoverShadow: "0 20px 48px rgba(124, 58, 237, 0.2)",
    cardShadow: "none",
    primaryBtnBg: "#7c3aed",
    primaryBtnShadow: "0 4px 16px rgba(124,58,237,0.35)",
  },
  light: {
    pageBg: "#fafafa",
    text: "#18181b",
    textSecondary: "#52525b",
    textMuted: "#a1a1aa",
    textFaint: "#d4d4d8",
    navBg: "rgba(255,255,255,0.9)",
    navBorder: "#e4e4e7",
    cardBg: "#ffffff",
    cardBorder: "#e4e4e7",
    cardBorderHover: "#7c3aed",
    cardNumberBg: "#f4f4f5",
    cardNumberBorder: "#e4e4e7",
    cardNumberText: "#d4d4d8",
    sectionBorder: "#e4e4e7",
    badgeBg: "#f3f0ff",
    badgeBorder: "#ddd6fe",
    badgeText: "#7c3aed",
    secondaryBtnBg: "#ffffff",
    secondaryBtnBorder: "#d4d4d8",
    secondaryBtnText: "#3f3f46",
    ctaBg: "#7c3aed",
    ctaBorder: "transparent",
    ctaText: "#ffffff",
    ctaSubtext: "rgba(255,255,255,0.75)",
    ctaPrimaryBtnBg: "#ffffff",
    ctaPrimaryBtnText: "#7c3aed",
    ctaSecondaryBtnBorder: "rgba(255,255,255,0.3)",
    ctaSecondaryBtnText: "#ffffff",
    ctaSecondaryBtnBg: "rgba(255,255,255,0.1)",
    footerBg: "#ffffff",
    emptyBg: "#f4f4f5",
    emptyBorder: "#e4e4e7",
    cardHoverShadow: "0 16px 48px rgba(0,0,0,0.1)",
    cardShadow: "0 1px 3px rgba(0,0,0,0.04)",
    primaryBtnBg: "#7c3aed",
    primaryBtnShadow: "0 4px 16px rgba(124,58,237,0.25)",
  },
};

const categoryConfig: Record<string, { color: string; icon: string }> = {
  conference: { color: "#7c3aed", icon: "🎤" },
  workshop: { color: "#2563eb", icon: "🛠" },
  meetup: { color: "#059669", icon: "🤝" },
  webinar: { color: "#d97706", icon: "🖥" },
  design: { color: "#db2777", icon: "🎨" },
  engineering: { color: "#2563eb", icon: "⚙️" },
  business: { color: "#d97706", icon: "📊" },
  ai: { color: "#7c3aed", icon: "🤖" },
  creative: { color: "#db2777", icon: "✨" },
};

function getCategoryConfig(category: string | null) {
  if (!category) return { color: "#6366f1", icon: "📌" };
  return categoryConfig[category.toLowerCase()] || { color: "#0891b2", icon: "🎯" };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

const stats = [
  { value: "10K+", label: "Attendees", icon: "👥", color: "#7c3aed" },
  { value: "120+", label: "Events", icon: "🎪", color: "#2563eb" },
  { value: "50+", label: "Cities", icon: "🌍", color: "#059669" },
  { value: "98%", label: "Satisfaction", icon: "⭐", color: "#d97706" },
];

export default function PreviewPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [hero, setHero] = useState<HeroSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>("dark");

  const t = themes[theme];
  const isDark = theme === "dark";

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsRes, heroRes] = await Promise.all([
          fetch(`/api/events?_t=${Date.now()}`),
          fetch(`/api/hero?_t=${Date.now()}`),
        ]);
        const eventsData = await eventsRes.json();
        const heroData = await heroRes.json();
        setEvents(eventsData);
        setHero(heroData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const heroTitle = hero?.title || "Find events that inspire you";
  const heroSubtitle = hero?.subtitle || "Curated conferences, workshops, and meetups from the world's best communities. All in one place.";
  const heroButtonText = hero?.button_text || "Browse Events";
  const heroButtonLink = hero?.button_link || "#events";

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: t.pageBg }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid rgba(124,58,237,0.2)", borderTopColor: "#7c3aed", animation: "spin 0.8s linear infinite" }} />
          <span style={{ color: t.textMuted, fontSize: 14 }}>Loading experience...</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: "'Inter', system-ui, -apple-system, sans-serif", transition: "background 0.3s, color 0.3s" }}>

      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, width: "100%", zIndex: 50,
        background: t.navBg, backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${t.navBorder}`,
        transition: "background 0.3s, border-color 0.3s",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
          <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", color: "#7c3aed" }}>
            discover<span style={{ color: t.textFaint }}>.</span>
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 14 }}>
            <a href="#events" style={{ color: t.textSecondary, textDecoration: "none" }}>Events</a>
            <a href="#about" style={{ color: t.textSecondary, textDecoration: "none" }}>About</a>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              style={{
                width: 40, height: 40, borderRadius: 10, border: `1px solid ${t.cardBorder}`,
                background: t.cardBg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, transition: "all 0.3s",
              }}
              title={`Switch to ${isDark ? "light" : "dark"} mode`}
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            <a href="#" style={{
              background: t.primaryBtnBg, color: "#fff",
              padding: "10px 24px", borderRadius: 10, textDecoration: "none", fontWeight: 600, fontSize: 14,
              boxShadow: t.primaryBtnShadow,
            }}>
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        data-directus-collection="hero_section"
        data-directus-id="1"
        style={{ position: "relative", paddingTop: 160, paddingBottom: 100, overflow: "hidden" }}
      >
        {/* Subtle background glow — only dark mode */}
        {isDark && (
          <>
            <div style={{ position: "absolute", top: -100, left: "20%", width: 500, height: 500, background: "rgba(124,58,237,0.08)", filter: "blur(120px)", borderRadius: "50%" }} />
            <div style={{ position: "absolute", top: 80, right: "10%", width: 400, height: 400, background: "rgba(37,99,235,0.06)", filter: "blur(120px)", borderRadius: "50%" }} />
          </>
        )}

        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "0 32px", textAlign: "center" }}>
          {/* Live badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 20px",
            borderRadius: 9999, border: `1px solid ${t.badgeBorder}`, background: t.badgeBg,
            fontSize: 14, color: t.badgeText, marginBottom: 40,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981", display: "inline-block", animation: "pulse-dot 2s ease-in-out infinite" }} />
            {events.length > 0 ? `${events.length} events live now` : "Events coming soon"}
          </div>

          <h1 style={{
            fontSize: "clamp(44px, 6vw, 76px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.08,
            maxWidth: 900, margin: "0 auto", color: t.text,
          }}>
            {heroTitle}
          </h1>

          <p style={{ fontSize: 20, color: t.textSecondary, maxWidth: 600, margin: "28px auto 0", lineHeight: 1.7 }}>
            {heroSubtitle}
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 48 }}>
            <a href={heroButtonLink} style={{
              background: t.primaryBtnBg, color: "#fff",
              padding: "16px 36px", borderRadius: 12, textDecoration: "none", fontWeight: 600, fontSize: 16,
              boxShadow: t.primaryBtnShadow,
            }}>
              {heroButtonText}
            </a>
            <a href="#about" style={{
              border: `1px solid ${t.secondaryBtnBorder}`, color: t.secondaryBtnText,
              padding: "16px 36px", borderRadius: 12, textDecoration: "none", fontWeight: 600, fontSize: 16,
              background: t.secondaryBtnBg,
            }}>
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ borderTop: `1px solid ${t.sectionBorder}`, borderBottom: `1px solid ${t.sectionBorder}`, background: isDark ? "transparent" : "#fff", transition: "background 0.3s" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 32px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, textAlign: "center" }}>
          {stats.map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 28, marginBottom: 4 }}>{s.icon}</span>
              <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", color: s.color }}>
                {s.value}
              </div>
              <div style={{ fontSize: 14, color: t.textMuted, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Events ── */}
      <section id="events" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 32px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 8, background: t.badgeBg, border: `1px solid ${t.badgeBorder}`, fontSize: 12, fontWeight: 600, color: t.badgeText, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Upcoming
            </div>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", color: t.text }}>Featured Events</h2>
            <p style={{ color: t.textMuted, marginTop: 8, fontSize: 16 }}>Don&apos;t miss what&apos;s happening next</p>
          </div>
          <a href="#" style={{ fontSize: 14, color: t.badgeText, textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            View all
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>

        {events.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", borderRadius: 20, border: `1px dashed ${t.emptyBorder}`, background: t.emptyBg }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>🎪</p>
            <p style={{ fontSize: 20, color: t.textSecondary, fontWeight: 600 }}>No events available yet</p>
            <p style={{ fontSize: 14, marginTop: 8, color: t.textMuted }}>Check back soon or add events in Directus.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {events.map((e: Event, index: number) => {
              const cat = getCategoryConfig(e.category);
              return (
                <div
                  key={e.id}
                  className="event-card"
                  data-directus-collection="events"
                  data-directus-id={e.id}
                  style={{
                    borderRadius: 16, padding: 0,
                    background: t.cardBg, border: `1px solid ${t.cardBorder}`,
                    cursor: "pointer", overflow: "hidden",
                    transition: "transform 0.25s, box-shadow 0.25s, border-color 0.25s",
                    position: "relative",
                    boxShadow: t.cardShadow,
                  }}
                >
                  {/* Card header color bar */}
                  <div style={{ height: 4, background: cat.color }} />

                  {/* Card number badge */}
                  <div style={{
                    position: "absolute", top: 20, right: 20,
                    width: 36, height: 36, borderRadius: 10,
                    background: t.cardNumberBg, border: `1px solid ${t.cardNumberBorder}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700, color: t.cardNumberText,
                  }}>
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div style={{ padding: "28px 28px 24px" }}>
                    {/* Category */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                      <span style={{
                        fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 8,
                        background: `${cat.color}14`, color: cat.color,
                        textTransform: "uppercase", letterSpacing: "0.04em",
                      }}>
                        {cat.icon} {e.category || "General"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: t.text, lineHeight: 1.3, marginBottom: 10 }}>{e.title}</h3>

                    {/* Description */}
                    <p style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.7, marginBottom: 20 }}>
                      {e.description?.replace(/<[^>]*>/g, "").slice(0, 100) || ""}
                      {e.description && e.description.length > 100 ? "..." : ""}
                    </p>

                    {/* Meta info */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 16, borderTop: `1px solid ${t.sectionBorder}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: t.textSecondary }}>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                        {formatDate(e.date)} at {formatTime(e.date)}
                      </div>
                      {e.location && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: t.textSecondary }}>
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                          </svg>
                          {e.location}
                        </div>
                      )}
                    </div>

                    {/* Price + Capacity */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
                      <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: cat.color }}>
                        {e.price === 0 ? "Free" : `$${e.price}`}
                      </span>
                      <span style={{ fontSize: 12, color: t.textMuted, display: "flex", alignItems: "center", gap: 6 }}>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                        {e.capacity} spots
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── CTA ── */}
      <section id="about" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 80px" }}>
        <div style={{
          position: "relative", borderRadius: 24, overflow: "hidden", padding: "80px 48px", textAlign: "center",
          background: t.ctaBg, border: `1px solid ${t.ctaBorder}`,
        }}>
          <div style={{ position: "relative" }}>
            <span style={{ fontSize: 56, display: "block", marginBottom: 24 }}>🚀</span>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em", color: t.ctaText }}>
              Ready to discover something new?
            </h2>
            <p style={{ color: t.ctaSubtext, maxWidth: 520, margin: "16px auto 0", fontSize: 17, lineHeight: 1.7 }}>
              Join thousands of curious people who use Discover to find their next favorite event.
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 40 }}>
              <a href="#" style={{
                background: t.ctaPrimaryBtnBg, color: t.ctaPrimaryBtnText,
                padding: "16px 36px", borderRadius: 12, textDecoration: "none", fontWeight: 600, fontSize: 16,
              }}>
                Get Started — It&apos;s Free
              </a>
              <a href="#" style={{
                border: `1px solid ${t.ctaSecondaryBtnBorder}`, color: t.ctaSecondaryBtnText,
                padding: "16px 36px", borderRadius: 12, textDecoration: "none", fontWeight: 600, fontSize: 16,
                background: t.ctaSecondaryBtnBg,
              }}>
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${t.sectionBorder}`, padding: "48px 0", background: t.footerBg, transition: "background 0.3s" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#7c3aed" }}>
              discover<span style={{ color: t.textFaint }}>.</span>
            </span>
            <div style={{ display: "flex", gap: 24, fontSize: 14, color: t.textMuted }}>
              <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacy</a>
              <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Terms</a>
              <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Contact</a>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${t.sectionBorder}`, paddingTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: t.textFaint }}>&copy; 2026 Discover. All rights reserved.</span>
            <div style={{ display: "flex", gap: 16 }}>
              {["Twitter", "GitHub", "Discord"].map((s) => (
                <a key={s} href="#" style={{ fontSize: 13, color: t.textMuted, textDecoration: "none" }}>{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <EditMode />

      {/* Animations */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .event-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: ${t.cardHoverShadow} !important;
          border-color: ${t.cardBorderHover} !important;
        }
      `}</style>
    </div>
  );
}
