"use client";

import { useEffect, useState } from "react";
import EditMode from "@/components/EditMode";
import { GradualSpacing } from "@/components/animations/GradualSpacing";
import defaultConfig from "./config.json";

/* ── Types ── */

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
  background_image: string | null;
}

type Theme = "dark" | "light";
type ThemeColors = Record<string, string>;

/* ── Helpers ── */

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

function getAssetUrl(id: string | null | undefined): string | null {
  if (!id) return null;
  return `${directusUrl}/assets/${id}`;
}

function getCategoryConfig(category: string | null, categories: Record<string, { color: string; icon: string }>) {
  if (!category) return categories.none;
  return categories[category.toLowerCase()] || categories.default;
}

function formatDate(dateString: string, dateFormat: typeof defaultConfig.dateFormat): string {
  const date = new Date(dateString);
  const opts = dateFormat.dateOptions as Intl.DateTimeFormatOptions;
  return date.toLocaleDateString(dateFormat.locale, opts);
}

function formatTime(dateString: string, dateFormat: typeof defaultConfig.dateFormat): string {
  const date = new Date(dateString);
  const opts = dateFormat.timeOptions as Intl.DateTimeFormatOptions;
  return date.toLocaleTimeString(dateFormat.locale, opts);
}

/* ── Component ── */

export default function PreviewPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [hero, setHero] = useState<HeroSection | null>(null);
  const [config, setConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>(defaultConfig.themes.default as Theme);

  const t: ThemeColors = config.themes[theme] as unknown as ThemeColors;
  const isDark = theme === "dark";

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsRes, heroRes, configRes] = await Promise.all([
          fetch(`/api/events?_t=${Date.now()}`),
          fetch(`/api/hero?_t=${Date.now()}`),
          fetch(`/api/config?template=events&_t=${Date.now()}`),
        ]);
        const eventsData = await eventsRes.json();
        const heroData = await heroRes.json();
        setEvents(eventsData);
        setHero(heroData);
        if (configRes.ok) {
          const configData = await configRes.json();
          setConfig(configData);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const heroTitle = hero?.title || config.hero.defaults.title;
  const heroSubtitle = hero?.subtitle || config.hero.defaults.subtitle;
  const heroButtonText = hero?.button_text || config.hero.defaults.buttonText;
  const heroButtonLink = hero?.button_link || config.hero.defaults.buttonLink;
  const heroBgImage = getAssetUrl(hero?.background_image);

  const nc = config.nav;
  const hc = config.hero;
  const sc = config.stats;
  const ec = config.eventsSection;
  const cc = config.cta;
  const fc = config.footer;
  const lc = config.loading;
  const layout = config.layout;
  const sections = (config as Record<string, unknown>).sections as Record<string, { visible: boolean }> | undefined;
  const isVisible = (name: string) => !sections || sections[name]?.visible !== false;

  /* ── Loading ── */
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: t.pageBg }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{
            width: lc.spinnerSize, height: lc.spinnerSize, borderRadius: "50%",
            border: `${lc.spinnerBorderWidth}px solid ${lc.spinnerTrackColor}`,
            borderTopColor: lc.spinnerActiveColor,
            animation: "spin 0.8s linear infinite",
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
        borderBottom: `1px solid ${t.navBorder}`,
        transition: "background 0.3s, border-color 0.3s",
      }}>
        <div style={{ maxWidth: layout.maxWidth, margin: "0 auto", padding: `0 ${layout.horizontalPadding}px`, display: "flex", alignItems: "center", justifyContent: "space-between", height: nc.height }}>
          <a href="/templates"><img src="/htx-logo.png" alt="Logo" style={{ height: 48, objectFit: "contain" }} /></a>
          <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 14 }}>
            {nc.links.map((link) => (
              <a key={link.label} href={link.href} style={{ color: t.textSecondary, textDecoration: "none" }}>{link.label}</a>
            ))}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              style={{
                width: nc.themeToggle.width, height: nc.themeToggle.height, borderRadius: nc.themeToggle.borderRadius,
                border: `1px solid ${t.cardBorder}`, background: t.cardBg, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: nc.themeToggle.fontSize, transition: "all 0.3s",
              }}
              title={`Switch to ${isDark ? "light" : "dark"} mode`}
            >
              {isDark ? nc.themeToggle.darkIcon : nc.themeToggle.lightIcon}
            </button>
            <a href={nc.ctaButton.href} style={{
              background: t.primaryBtnBg, color: nc.ctaButton.color,
              padding: nc.ctaButton.padding, borderRadius: nc.ctaButton.borderRadius,
              textDecoration: "none", fontWeight: nc.ctaButton.fontWeight, fontSize: nc.ctaButton.fontSize,
              boxShadow: t.primaryBtnShadow,
            }}>
              <span data-config-path="nav.ctaButton.text">{nc.ctaButton.text}</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      {isVisible("hero") && (
      <section
        data-directus-collection="hero_section"
        data-directus-id="1"
        style={{
          position: "relative", paddingTop: hc.paddingTop, paddingBottom: hc.paddingBottom, overflow: "hidden",
          ...(heroBgImage ? { backgroundImage: `url(${heroBgImage})`, backgroundSize: "cover", backgroundPosition: "center" } : {}),
        }}
      >
        {isDark && !heroBgImage && hc.darkModeGlow.map((glow, i) => (
          <div key={i} style={{
            position: "absolute",
            top: glow.top, left: (glow as Record<string, unknown>).left as string | undefined, right: (glow as Record<string, unknown>).right as string | undefined,
            width: glow.width, height: glow.height,
            background: glow.color, filter: `blur(${glow.blur}px)`, borderRadius: "50%",
          }} />
        ))}

        <div style={{ position: "relative", maxWidth: hc.maxWidth, margin: "0 auto", padding: `0 ${layout.horizontalPadding}px`, textAlign: "center" }}>
          {/* Live badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10, padding: hc.liveBadge.padding,
            borderRadius: hc.liveBadge.borderRadius,
            border: `1px solid ${heroBgImage ? hc.backgroundImage.badgeBorderColor : t.badgeBorder}`,
            background: heroBgImage ? hc.backgroundImage.badgeBg : t.badgeBg,
            fontSize: hc.liveBadge.fontSize,
            color: heroBgImage ? hc.backgroundImage.textColor : t.badgeText,
            marginBottom: hc.liveBadge.marginBottom,
            backdropFilter: heroBgImage ? "blur(8px)" : "none",
          }}>
            <span style={{
              width: hc.liveBadge.dotSize, height: hc.liveBadge.dotSize, borderRadius: "50%",
              background: hc.liveBadge.dotColor, boxShadow: hc.liveBadge.dotShadow,
              display: "inline-block", animation: "pulse-dot 2s ease-in-out infinite",
            }} />
            {events.length > 0
              ? hc.liveBadge.textWithEvents.replace("{count}", String(events.length))
              : hc.liveBadge.textNoEvents}
          </div>

          <h1 data-directus-field="title" style={{
            fontSize: hc.title.fontSize, fontWeight: hc.title.fontWeight,
            letterSpacing: hc.title.letterSpacing, lineHeight: hc.title.lineHeight,
            maxWidth: hc.title.maxWidth, margin: "0 auto",
            color: heroBgImage ? hc.backgroundImage.textColor : t.text,
            textShadow: heroBgImage ? hc.backgroundImage.textShadow : "none",
          }}>
            {hc.title.animationEnabled
              ? <GradualSpacing text={heroTitle} repeatInterval={hc.title.animationRepeatInterval} />
              : heroTitle}
          </h1>

          <p data-directus-field="subtitle" style={{
            fontSize: hc.subtitle.fontSize, maxWidth: hc.subtitle.maxWidth,
            margin: `${hc.subtitle.marginTop}px auto 0`, lineHeight: hc.subtitle.lineHeight,
            color: heroBgImage ? hc.backgroundImage.subtitleColor : t.textSecondary,
            textShadow: heroBgImage ? hc.backgroundImage.subtitleTextShadow : "none",
          }}>
            {heroSubtitle}
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: hc.buttons.gap, marginTop: hc.buttons.marginTop }}>
            <a href={heroButtonLink} style={{
              background: heroBgImage ? hc.backgroundImage.primaryBtnBg : t.primaryBtnBg,
              color: heroBgImage ? hc.backgroundImage.primaryBtnColor : "#fff",
              padding: hc.buttons.primary.padding, borderRadius: hc.buttons.primary.borderRadius,
              textDecoration: "none", fontWeight: hc.buttons.primary.fontWeight, fontSize: hc.buttons.primary.fontSize,
              boxShadow: heroBgImage ? hc.backgroundImage.primaryBtnShadow : t.primaryBtnShadow,
            }}>
              {heroButtonText}
            </a>
            <a href={hc.buttons.secondary.href} style={{
              border: `1px solid ${heroBgImage ? hc.backgroundImage.secondaryBtnBorder : t.secondaryBtnBorder}`,
              color: heroBgImage ? hc.backgroundImage.secondaryBtnColor : t.secondaryBtnText,
              padding: hc.buttons.secondary.padding, borderRadius: hc.buttons.secondary.borderRadius,
              textDecoration: "none", fontWeight: hc.buttons.secondary.fontWeight, fontSize: hc.buttons.secondary.fontSize,
              background: heroBgImage ? hc.backgroundImage.secondaryBtnBg : t.secondaryBtnBg,
              backdropFilter: heroBgImage ? "blur(8px)" : "none",
            }}>
              {hc.buttons.secondary.text}
            </a>
          </div>
        </div>
      </section>
      )}

      {/* ── Stats ── */}
      {isVisible("stats") && (
      <section style={{ borderTop: `1px solid ${t.sectionBorder}`, borderBottom: `1px solid ${t.sectionBorder}`, background: t.statsBg, transition: "background 0.3s" }}>
        <div style={{ maxWidth: layout.maxWidth, margin: "0 auto", padding: sc.padding, display: "grid", gridTemplateColumns: `repeat(${sc.items.length}, 1fr)`, gap: 32, textAlign: "center" }}>
          {sc.items.map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: sc.iconSize, marginBottom: 4 }}>{s.icon}</span>
              <div style={{ fontSize: sc.valueSize, fontWeight: sc.valueFontWeight, letterSpacing: sc.valueLetterSpacing, color: s.color }}>
                {s.value}
              </div>
              <div style={{ fontSize: sc.labelSize, color: t.textMuted, fontWeight: sc.labelFontWeight }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* ── Events ── */}
      {isVisible("events") && (
      <section id="events" style={{ maxWidth: layout.maxWidth, margin: "0 auto", padding: ec.padding }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48 }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 8,
              background: t.badgeBg, border: `1px solid ${t.badgeBorder}`,
              fontSize: 12, fontWeight: 600, color: t.badgeText, marginBottom: 16,
              textTransform: "uppercase", letterSpacing: "0.05em",
            }}>
              <span data-config-path="eventsSection.header.badgeText">{ec.header.badgeText}</span>
            </div>
            <h2 data-config-path="eventsSection.header.title" style={{ fontSize: ec.header.titleSize, fontWeight: ec.header.titleWeight, letterSpacing: ec.header.titleLetterSpacing, color: t.text }}>
              {ec.header.title}
            </h2>
            <p data-config-path="eventsSection.header.subtitle" style={{ color: t.textMuted, marginTop: 8, fontSize: ec.header.subtitleSize }}>{ec.header.subtitle}</p>
          </div>
          <a href={ec.header.viewAllHref} style={{ fontSize: 14, color: t.badgeText, textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            {ec.header.viewAllText}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
        </div>

        {events.length === 0 ? (
          <div style={{
            textAlign: "center", padding: ec.empty.padding, borderRadius: ec.empty.borderRadius,
            border: `1px dashed ${t.emptyBorder}`, background: t.emptyBg,
          }}>
            <p style={{ fontSize: ec.empty.iconSize, marginBottom: 16 }}>{ec.empty.icon}</p>
            <p style={{ fontSize: ec.empty.titleSize, color: t.textSecondary, fontWeight: ec.empty.titleWeight }}>{ec.empty.title}</p>
            <p style={{ fontSize: ec.empty.subtitleSize, marginTop: 8, color: t.textMuted }}>{ec.empty.subtitle}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${ec.grid.columns}, 1fr)`, gap: ec.grid.gap }}>
            {events.map((e: Event, index: number) => {
              const cat = getCategoryConfig(e.category, config.categories as Record<string, { color: string; icon: string }>);
              const card = ec.card;
              return (
                <div
                  key={e.id}
                  className="event-card"
                  data-directus-collection="events"
                  data-directus-id={e.id}
                  style={{
                    borderRadius: card.borderRadius, padding: 0,
                    background: t.cardBg, border: `1px solid ${t.cardBorder}`,
                    cursor: "pointer", overflow: "hidden",
                    transition: "transform 0.25s, box-shadow 0.25s, border-color 0.25s",
                    position: "relative", boxShadow: t.cardShadow,
                  }}
                >
                  <div style={{ height: card.colorBarHeight, background: cat.color }} />

                  <div style={{
                    position: "absolute", top: card.numberBadge.top, right: card.numberBadge.right,
                    width: card.numberBadge.size, height: card.numberBadge.size, borderRadius: card.numberBadge.borderRadius,
                    background: t.cardNumberBg, border: `1px solid ${t.cardNumberBorder}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: card.numberBadge.fontSize, fontWeight: card.numberBadge.fontWeight, color: t.cardNumberText,
                  }}>
                    {String(index + 1).padStart(card.numberBadge.padStart, card.numberBadge.padChar)}
                  </div>

                  <div style={{ padding: card.padding }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                      <span style={{
                        fontSize: card.category.fontSize, fontWeight: card.category.fontWeight,
                        padding: card.category.padding, borderRadius: card.category.borderRadius,
                        background: `${cat.color}14`, color: cat.color,
                        textTransform: card.category.textTransform as "uppercase", letterSpacing: card.category.letterSpacing,
                      }}>
                        {cat.icon} {e.category || "General"}
                      </span>
                    </div>

                    <h3 style={{ fontSize: card.title.fontSize, fontWeight: card.title.fontWeight, color: t.text, lineHeight: card.title.lineHeight, marginBottom: card.title.marginBottom }}>
                      {e.title}
                    </h3>

                    <p style={{ fontSize: card.description.fontSize, color: t.textMuted, lineHeight: card.description.lineHeight, marginBottom: card.description.marginBottom }}>
                      {e.description?.replace(/<[^>]*>/g, "").slice(0, card.description.maxLength) || ""}
                      {e.description && e.description.length > card.description.maxLength ? "..." : ""}
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: card.meta.gap, paddingTop: 16, borderTop: `1px solid ${t.sectionBorder}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: card.meta.fontSize, color: t.textSecondary }}>
                        <svg width={card.meta.iconSize} height={card.meta.iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                        {formatDate(e.date, config.dateFormat)} at {formatTime(e.date, config.dateFormat)}
                      </div>
                      {e.location && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: card.meta.fontSize, color: t.textSecondary }}>
                          <svg width={card.meta.iconSize} height={card.meta.iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                          </svg>
                          {e.location}
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
                      <span style={{ fontSize: card.price.fontSize, fontWeight: card.price.fontWeight, letterSpacing: card.price.letterSpacing, color: cat.color }}>
                        {e.price === 0 ? card.price.freeLabel : `${card.price.currencyPrefix}${e.price}`}
                      </span>
                      <span style={{ fontSize: card.capacity.fontSize, color: t.textMuted, display: "flex", alignItems: "center", gap: 6 }}>
                        <svg width={card.capacity.iconSize} height={card.capacity.iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                        {e.capacity} {card.capacity.suffix}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      )}

      {/* ── CTA ── */}
      {isVisible("cta") && (
      <section id="about" style={{ maxWidth: layout.maxWidth, margin: "0 auto", padding: cc.padding }}>
        <div style={{
          position: "relative", borderRadius: cc.box.borderRadius, overflow: "hidden",
          padding: cc.box.padding, textAlign: "center",
          background: t.ctaBg, border: `1px solid ${t.ctaBorder}`,
        }}>
          <div style={{ position: "relative" }}>
            <span style={{ fontSize: cc.iconSize, display: "block", marginBottom: cc.iconMarginBottom }}>{cc.icon}</span>
            <h2 data-config-path="cta.title" style={{ fontSize: cc.titleSize, fontWeight: cc.titleWeight, letterSpacing: cc.titleLetterSpacing, color: t.ctaText }}>
              {cc.title}
            </h2>
            <p data-config-path="cta.subtitle" style={{ color: t.ctaSubtext, maxWidth: cc.subtitleMaxWidth, margin: "16px auto 0", fontSize: cc.subtitleSize, lineHeight: cc.subtitleLineHeight }}>
              {cc.subtitle}
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: cc.buttonsGap, marginTop: cc.buttonsMarginTop }}>
              <a href={cc.primaryButton.href} style={{
                background: t.ctaPrimaryBtnBg, color: t.ctaPrimaryBtnText,
                padding: cc.primaryButton.padding, borderRadius: cc.primaryButton.borderRadius,
                textDecoration: "none", fontWeight: cc.primaryButton.fontWeight, fontSize: cc.primaryButton.fontSize,
              }}>
                <span data-config-path="cta.primaryButton.text">{cc.primaryButton.text}</span>
              </a>
              <a href={cc.secondaryButton.href} style={{
                border: `1px solid ${t.ctaSecondaryBtnBorder}`, color: t.ctaSecondaryBtnText,
                padding: cc.secondaryButton.padding, borderRadius: cc.secondaryButton.borderRadius,
                textDecoration: "none", fontWeight: cc.secondaryButton.fontWeight, fontSize: cc.secondaryButton.fontSize,
                background: t.ctaSecondaryBtnBg,
              }}>
                {cc.secondaryButton.text}
              </a>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ── Footer ── */}
      <footer style={{ borderTop: `1px solid ${t.sectionBorder}`, padding: fc.padding, background: t.footerBg, transition: "background 0.3s" }}>
        <div style={{ maxWidth: layout.maxWidth, margin: "0 auto", padding: `0 ${layout.horizontalPadding}px` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <span style={{ fontSize: fc.brand.fontSize, fontWeight: fc.brand.fontWeight, color: t.text }}>
              {fc.brand.text}<span style={{ color: fc.brand.accentColor }}>.</span>
            </span>
            <div style={{ display: "flex", gap: 24, fontSize: fc.linksFontSize, color: t.textMuted }}>
              {fc.links.map((link) => (
                <a key={link.label} href={link.href} style={{ color: "inherit", textDecoration: "none" }}>{link.label}</a>
              ))}
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${t.sectionBorder}`, paddingTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span data-config-path="footer.copyright" style={{ fontSize: fc.copyrightFontSize, color: t.textFaint }}>{fc.copyright}</span>
            <div style={{ display: "flex", gap: 16 }}>
              {fc.socialLinks.map((s) => (
                <a key={s.label} href={s.href} style={{ fontSize: fc.socialFontSize, color: t.textMuted, textDecoration: "none" }}>{s.label}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <EditMode />

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
