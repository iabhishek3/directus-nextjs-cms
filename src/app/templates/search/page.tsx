"use client";

import { useEffect, useState, useRef } from "react";
import EditMode from "@/components/EditMode";
import defaultConfig from "./config.json";

type Theme = "dark" | "light";
type ThemeColors = Record<string, string>;

interface EventResult {
  id: number;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  category: string | null;
  price: number;
  capacity: number;
}

interface SearchResponse {
  summary: string;
  reasoning?: string;
  results: EventResult[];
  totalEvents: number;
  error?: string;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit",
  });
}

export default function SearchTemplate() {
  const [config, setConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>(defaultConfig.themes.default as Theme);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResponse | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const t: ThemeColors = config.themes[theme] as unknown as ThemeColors;
  const isDark = theme === "dark";

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch(`/api/config?template=search&_t=${Date.now()}`);
        if (res.ok) setConfig(await res.json());
      } catch (err) {
        console.error("Failed to fetch config:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const handleSearch = async (q?: string) => {
    const searchQuery = q || query;
    if (!searchQuery.trim() || searching) return;

    setQuery(searchQuery);
    setSearching(true);
    setHasSearched(true);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");
      setSearchResult(data);
    } catch (err) {
      setSearchResult({
        summary: `Error: ${err instanceof Error ? err.message : "Search failed"}`,
        results: [],
        totalEvents: 0,
      });
    } finally {
      setSearching(false);
    }
  };

  const nc = config.nav;
  const hc = config.hero;
  const sc = config.search;
  const sg = config.suggestions;
  const rc = config.results;
  const sm = config.summary;
  const emp = config.empty;
  const nr = config.noResults;
  const fc = config.footer;
  const lc = config.loading;
  const layout = config.layout;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: t.pageBg }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{
            width: lc.spinnerSize, height: lc.spinnerSize, borderRadius: "50%",
            border: `${lc.spinnerBorderWidth}px solid ${lc.spinnerTrackColor}`,
            borderTopColor: lc.spinnerActiveColor, animation: "spin 0.8s linear infinite",
          }} />
          <span style={{ color: t.textMuted, fontSize: lc.textSize }}>{lc.text}</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: config.fonts.primary, transition: "background 0.3s, color 0.3s" }}>

      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, width: "100%", zIndex: 50,
        background: t.navBg, backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${t.navBorder}`, transition: "background 0.3s",
      }}>
        <div style={{ maxWidth: layout.maxWidth, margin: "0 auto", padding: `0 ${layout.horizontalPadding}px`, display: "flex", alignItems: "center", justifyContent: "space-between", height: nc.height }}>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <a href="/templates"><img src="/htx-logo.png" alt="Logo" style={{ height: 48, objectFit: "contain" }} /></a>
            <div style={{ display: "flex", gap: 20, fontSize: 14 }}>
              {nc.links.map((link) => (
                <a key={link.label} href={link.href} style={{ color: t.textSecondary, textDecoration: "none", fontWeight: 500 }}>{link.label}</a>
              ))}
            </div>
          </div>
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            style={{
              width: nc.themeToggle.width, height: nc.themeToggle.height, borderRadius: nc.themeToggle.borderRadius,
              border: `1px solid ${t.cardBorder}`, background: t.cardBg, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: nc.themeToggle.fontSize, transition: "all 0.3s",
            }}
          >
            {isDark ? nc.themeToggle.darkIcon : nc.themeToggle.lightIcon}
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ paddingTop: hc.paddingTop, paddingBottom: hc.paddingBottom, textAlign: "center" }}>
        <div style={{ maxWidth: hc.maxWidth, margin: "0 auto", padding: `0 ${layout.horizontalPadding}px` }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: hc.badge.padding,
            borderRadius: hc.badge.borderRadius, border: `1px solid ${t.accentBorder}`,
            background: t.accentLight, fontSize: hc.badge.fontSize, color: t.accentText, marginBottom: 32,
          }}>
            <span>{hc.badge.icon}</span>
            {hc.badge.text}
          </div>

          <h1 style={{
            fontSize: hc.title.fontSize, fontWeight: hc.title.fontWeight,
            letterSpacing: hc.title.letterSpacing, lineHeight: hc.title.lineHeight,
            color: t.text, margin: "0 auto",
          }}>
            {hc.title.text}
          </h1>

          <p style={{
            fontSize: hc.subtitle.fontSize, marginTop: hc.subtitle.marginTop,
            lineHeight: hc.subtitle.lineHeight, color: t.textSecondary,
          }}>
            {hc.subtitle.text}
          </p>
        </div>
      </section>

      {/* ── Search Box ── */}
      <section id="search" style={{ maxWidth: sc.maxWidth, margin: "0 auto", padding: `0 ${layout.horizontalPadding}px` }}>
        <div style={{ position: "relative" }}>
          {/* Search icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.textMuted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
            placeholder={sc.inputPlaceholder}
            style={{
              width: "100%", padding: sc.inputPadding, fontSize: sc.inputFontSize,
              borderRadius: sc.inputBorderRadius, border: `1px solid ${t.searchBorder}`,
              background: t.searchBg, color: t.text, outline: "none", fontFamily: "inherit",
              transition: "border-color 0.2s, box-shadow 0.2s",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = t.searchBorderFocus;
              e.currentTarget.style.boxShadow = `0 0 0 3px ${t.accentLight}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = t.searchBorder;
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          <button
            onClick={() => handleSearch()}
            disabled={!query.trim() || searching}
            style={{
              position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
              padding: sc.buttonPadding, borderRadius: sc.buttonBorderRadius,
              background: query.trim() && !searching ? t.primaryBtnBg : t.textFaint,
              color: query.trim() && !searching ? t.primaryBtnText : t.textMuted,
              border: "none", fontSize: sc.buttonFontSize, fontWeight: sc.buttonFontWeight,
              cursor: query.trim() && !searching ? "pointer" : "default",
              transition: "all 0.2s",
            }}
          >
            {searching ? "..." : sc.buttonText}
          </button>
        </div>

        {/* ── Suggestions ── */}
        {!hasSearched && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: sg.titleSize, fontWeight: sg.titleWeight, color: t.textMuted, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {sg.title}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {sg.items.map((item) => (
                <button
                  key={item}
                  onClick={() => { setQuery(item); handleSearch(item); }}
                  className="suggestion-chip"
                  style={{
                    padding: sg.chipPadding, borderRadius: sg.chipBorderRadius,
                    background: t.suggestionBg, border: `1px solid ${t.suggestionBorder}`,
                    color: t.textSecondary, fontSize: sg.chipFontSize, cursor: "pointer",
                    fontFamily: "inherit", transition: "all 0.15s",
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Results Area ── */}
      <section style={{ maxWidth: rc.maxWidth, margin: "0 auto", padding: rc.padding, marginTop: 40 }}>

        {/* Searching state */}
        {searching && (
          <div style={{
            textAlign: "center", padding: "64px 24px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
          }}>
            <div style={{
              width: lc.spinnerSize, height: lc.spinnerSize, borderRadius: "50%",
              border: `${lc.spinnerBorderWidth}px solid ${lc.spinnerTrackColor}`,
              borderTopColor: lc.spinnerActiveColor, animation: "spin 0.8s linear infinite",
            }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{lc.searchingText}</div>
              <div style={{ fontSize: 13, color: t.textMuted, marginTop: 4 }}>{lc.searchingSubtext}</div>
            </div>
          </div>
        )}

        {/* Results */}
        {!searching && hasSearched && searchResult && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* AI Summary */}
            <div style={{
              borderRadius: sm.borderRadius, padding: sm.padding,
              background: t.summaryBg, border: `1px solid ${t.summaryBorder}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <svg width={sm.iconSize} height={sm.iconSize} viewBox="0 0 24 24" fill="none" stroke={t.summaryIcon} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
                </svg>
                <span style={{ fontSize: sm.labelSize, fontWeight: sm.labelWeight, color: t.accentText, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {sm.label}
                </span>
                <span style={{ fontSize: 12, color: t.textMuted, marginLeft: "auto" }}>
                  {searchResult.results.length} of {searchResult.totalEvents} events matched
                </span>
              </div>
              <p style={{ fontSize: sm.textSize, color: t.text, lineHeight: sm.textLineHeight, margin: 0 }}>
                {searchResult.summary}
              </p>
            </div>

            {/* Event cards */}
            {searchResult.results.length > 0 ? (
              searchResult.results.map((event, idx) => {
                const card = rc.card;
                return (
                  <div
                    key={event.id}
                    className="result-card"
                    style={{
                      borderRadius: card.borderRadius, padding: card.padding,
                      background: t.cardBg, border: `1px solid ${t.cardBorder}`,
                      boxShadow: t.cardShadow, transition: "all 0.25s",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        {/* Rank + Category */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                          <span style={{
                            width: 24, height: 24, borderRadius: 6,
                            background: t.accentLight, color: t.accentText,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 12, fontWeight: 700,
                          }}>
                            {idx + 1}
                          </span>
                          {event.category && (
                            <span style={{
                              padding: card.categoryPadding, borderRadius: card.categoryBorderRadius,
                              background: t.tagBg, color: t.tagText,
                              fontSize: card.categoryFontSize, fontWeight: card.categoryWeight,
                              textTransform: "uppercase", letterSpacing: "0.04em",
                            }}>
                              {event.category}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 style={{ fontSize: card.titleSize, fontWeight: card.titleWeight, color: t.text, lineHeight: 1.3, marginBottom: 8 }}>
                          {event.title}
                        </h3>

                        {/* Description */}
                        {event.description && (
                          <p style={{ fontSize: card.descriptionSize, color: t.textMuted, lineHeight: card.descriptionLineHeight, marginBottom: 12 }}>
                            {event.description.replace(/<[^>]*>/g, "").slice(0, card.descriptionMaxLength)}
                            {event.description.length > card.descriptionMaxLength ? "..." : ""}
                          </p>
                        )}

                        {/* Meta */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: card.metaFontSize, color: t.textSecondary }}>
                            <svg width={card.metaIconSize} height={card.metaIconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                            </svg>
                            {formatDate(event.date)} at {formatTime(event.date)}
                          </div>
                          {event.location && (
                            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: card.metaFontSize, color: t.textSecondary }}>
                              <svg width={card.metaIconSize} height={card.metaIconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                              </svg>
                              {event.location}
                            </div>
                          )}
                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: card.metaFontSize, color: t.textSecondary }}>
                            <svg width={card.metaIconSize} height={card.metaIconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>
                            {event.capacity} spots
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: card.priceSize, fontWeight: card.priceWeight, color: t.accent }}>
                          {event.price === 0 ? "Free" : `$${event.price}`}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{
                textAlign: "center", padding: emp.padding, borderRadius: emp.borderRadius,
                background: t.emptyBg, border: `1px solid ${t.emptyBorder}`,
              }}>
                <p style={{ fontSize: emp.iconSize, marginBottom: 12 }}>{nr.icon}</p>
                <p style={{ fontSize: emp.titleSize, fontWeight: emp.titleWeight, color: t.textSecondary }}>{nr.title}</p>
                <p style={{ fontSize: emp.subtitleSize, color: t.textMuted, marginTop: 6 }}>{nr.subtitle}</p>
              </div>
            )}
          </div>
        )}

        {/* Empty initial state */}
        {!searching && !hasSearched && (
          <div style={{
            textAlign: "center", padding: emp.padding, borderRadius: emp.borderRadius,
            border: `1px dashed ${t.emptyBorder}`, background: t.emptyBg,
          }}>
            <p style={{ fontSize: emp.iconSize, marginBottom: 12 }}>{emp.icon}</p>
            <p style={{ fontSize: emp.titleSize, fontWeight: emp.titleWeight, color: t.textSecondary }}>{emp.title}</p>
            <p style={{ fontSize: emp.subtitleSize, color: t.textMuted, marginTop: 6 }}>{emp.subtitle}</p>
          </div>
        )}
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${t.sectionBorder}`, padding: fc.padding, background: t.footerBg, transition: "background 0.3s", marginTop: "auto" }}>
        <div style={{ maxWidth: fc.maxWidth, margin: "0 auto", padding: `0 ${layout.horizontalPadding}px`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: fc.brand.fontSize, fontWeight: fc.brand.fontWeight, color: t.text }}>
            {fc.brand.text}<span style={{ color: fc.brand.accentColor }}>.</span>
          </span>
          <span style={{ fontSize: fc.copyrightFontSize, color: t.textFaint }}>{fc.copyright}</span>
        </div>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .result-card:hover {
          transform: translateY(-2px) !important;
          box-shadow: ${t.cardHoverShadow} !important;
          border-color: ${t.cardBorderHover} !important;
        }
        .suggestion-chip:hover {
          background: ${t.suggestionHoverBg} !important;
          border-color: ${t.accentBorder} !important;
          color: ${t.accentText} !important;
        }
      `}</style>
      <EditMode />
    </div>
  );
}
