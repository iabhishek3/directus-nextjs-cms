"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import EditMode from "@/components/EditMode";
import defaultConfig from "./config.json";

/* ── Types ── */

type Theme = "dark" | "light";
type ThemeColors = Record<string, string>;

/* ── Animated Counter Hook ── */

function useCounter(target: number, duration: number, inView: boolean): number {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    let start = 0;
    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      setCount(current);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return count;
}

/* ── Scroll Reveal Wrapper ── */

function Reveal({
  children,
  delay = 0,
  y = 40,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Stat Card with Counter ── */

function StatValue({
  value,
  label,
  color,
  duration,
}: {
  value: string;
  label: string;
  color: string;
  duration: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
  const suffix = value.replace(/[0-9]/g, "");
  const animated = useCounter(numericValue, duration, isInView);

  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color,
        }}
      >
        {animated}
        {suffix}
      </div>
      <div
        style={{
          fontSize: 12,
          color: "inherit",
          opacity: 0.5,
          marginTop: 4,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ── Mini Chart Component ── */

function MiniChart({ color }: { color: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const points = [20, 35, 28, 45, 38, 55, 48, 62, 55, 72, 65, 80];

  return (
    <div ref={ref} style={{ height: 80, display: "flex", alignItems: "end", gap: 3, marginTop: 16 }}>
      {points.map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={isInView ? { height: `${h}%` } : { height: 0 }}
          transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
          style={{
            flex: 1,
            background: i >= points.length - 3 ? color : `${color}40`,
            borderRadius: 3,
            minWidth: 4,
          }}
        />
      ))}
    </div>
  );
}

/* ── SVG Icons ── */

function Icon({ name, size = 20, color = "currentColor" }: { name: string; size?: number; color?: string }) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (name) {
    case "activity":
      return <svg {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>;
    case "command":
      return <svg {...props}><path d="M18 3a3 3 0 00-3 3v12a3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3H6a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3V6a3 3 0 00-3-3 3 3 0 00-3 3 3 3 0 003 3h12a3 3 0 003-3 3 3 0 00-3-3z" /></svg>;
    case "bar-chart":
      return <svg {...props}><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg>;
    case "zap":
      return <svg {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
    case "shield":
      return <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
    case "check":
      return <svg {...props}><polyline points="20 6 9 17 4 12" /></svg>;
    case "arrow-right":
      return <svg {...props}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
    case "sun":
      return <svg {...props}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>;
    case "moon":
      return <svg {...props}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="10" /></svg>;
  }
}

/* ── Main Component ── */

export default function LandingPage() {
  const [config, setConfig] = useState(defaultConfig);
  const [theme, setTheme] = useState<Theme>(defaultConfig.themes.default as Theme);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t: ThemeColors = config.themes[theme] as unknown as ThemeColors;
  const isDark = theme === "dark";

  const nc = config.nav;
  const hc = config.hero;
  const lb = config.logoBar;
  const fc = config.features;
  const pc = config.pricing;
  const ctc = config.cta;
  const ft = config.footer;
  const layout = config.layout;
  const anim = config.animations;

  useEffect(() => {
    setMounted(true);
    fetch(`/api/config?template=landing-page&_t=${Date.now()}`)
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data) setConfig(data);
      })
      .catch(() => {});
  }, []);

  if (!mounted) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: t.pageBg }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            border: "3px solid rgba(124,58,237,0.2)",
            borderTopColor: "#7c3aed",
            animation: "spin 0.8s linear infinite",
          }} />
          <span style={{ color: t.textMuted, fontSize: 14 }}>Loading...</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: config.fonts.primary, transition: "background 0.4s, color 0.4s" }}>

      {/* ── Nav ── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "fixed", top: 0, width: "100%", zIndex: 50,
          background: t.navBg, backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${t.navBorder}`,
          transition: "background 0.4s, border-color 0.4s",
        }}
      >
        <div className="lp-nav-inner" style={{ maxWidth: layout.maxWidth, margin: "0 auto", padding: `0 ${layout.horizontalPadding}px`, display: "flex", alignItems: "center", justifyContent: "space-between", height: nc.height }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {nc.brand.showLogo && (
              <img src={nc.brand.logoSrc} alt={nc.brand.text || "Logo"} style={{ height: nc.brand.logoSize, objectFit: "contain" }} />
            )}
            <span style={{ fontSize: nc.brand.fontSize, fontWeight: nc.brand.fontWeight, letterSpacing: nc.brand.letterSpacing, color: t.text }}>
              {nc.brand.text}
            </span>
          </div>

          <div className="lp-nav-links" style={{ display: "flex", alignItems: "center", gap: 32, fontSize: 14 }}>
            {nc.links.map((link) => (
              <a key={link.label} href={link.href} style={{ color: t.textSecondary, textDecoration: "none", fontWeight: 500, transition: "color 0.2s" }}>{link.label}</a>
            ))}
          </div>

          <div className="lp-nav-actions" style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a className="lp-nav-signin" href={nc.signIn.href} style={{ color: t.textSecondary, textDecoration: "none", fontSize: 14, fontWeight: 500 }}>{nc.signIn.text}</a>
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              style={{
                width: nc.themeToggle.width, height: nc.themeToggle.height, borderRadius: nc.themeToggle.borderRadius,
                border: `1px solid ${t.navBorder}`, background: "transparent", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: t.textMuted, transition: "all 0.3s",
              }}
            >
              <Icon name={isDark ? nc.themeToggle.darkIcon : nc.themeToggle.lightIcon} size={16} />
            </button>
            <a className="lp-nav-cta" href={nc.ctaButton.href} style={{
              background: t.primaryBtnBg, color: t.primaryBtnText,
              padding: nc.ctaButton.padding, borderRadius: nc.ctaButton.borderRadius,
              textDecoration: "none", fontWeight: nc.ctaButton.fontWeight, fontSize: nc.ctaButton.fontSize,
              transition: "all 0.2s",
            }}>
              {nc.ctaButton.text}
            </a>
            {/* Mobile hamburger */}
            <button
              className="lp-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: "none", width: 36, height: 36, borderRadius: 8,
                border: `1px solid ${t.navBorder}`, background: "transparent", cursor: "pointer",
                alignItems: "center", justifyContent: "center", color: t.text,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                {mobileMenuOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                  : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="lp-mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                overflow: "hidden", background: t.navBg,
                borderTop: `1px solid ${t.navBorder}`,
              }}
            >
              <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
                {nc.links.map((link) => (
                  <a key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)} style={{ color: t.textSecondary, textDecoration: "none", fontWeight: 500, fontSize: 16 }}>{link.label}</a>
                ))}
                <a href={nc.signIn.href} style={{ color: t.textSecondary, textDecoration: "none", fontWeight: 500, fontSize: 16 }}>{nc.signIn.text}</a>
                <a href={nc.ctaButton.href} style={{
                  background: t.primaryBtnBg, color: t.primaryBtnText,
                  padding: "12px 24px", borderRadius: 10, textAlign: "center",
                  textDecoration: "none", fontWeight: 600, fontSize: 15,
                }}>
                  {nc.ctaButton.text}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ── Hero ── */}
      <section style={{
        paddingTop: hc.paddingTop, paddingBottom: hc.paddingBottom,
        background: `linear-gradient(to bottom, ${t.heroGradientFrom}, ${t.heroGradientTo})`,
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ maxWidth: layout.maxWidth, margin: "0 auto", padding: `0 ${layout.horizontalPadding}px`, position: "relative" }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 }}
          >
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: hc.badge.padding, borderRadius: hc.badge.borderRadius,
              border: `1px solid ${t.badgeBorder}`, background: t.badgeBg,
              fontSize: hc.badge.fontSize, color: t.badgeText,
            }}>
              <span style={{
                width: hc.badge.dotSize, height: hc.badge.dotSize, borderRadius: "50%",
                background: t.badgeDotColor, boxShadow: `0 0 8px ${t.badgeDotColor}`,
                display: "inline-block", animation: "pulse-dot 2s ease-in-out infinite",
              }} />
              {hc.badge.text}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{
              fontSize: hc.title.fontSize, fontWeight: hc.title.fontWeight,
              letterSpacing: hc.title.letterSpacing, lineHeight: hc.title.lineHeight,
              marginTop: 32, color: t.text,
            }}
          >
            {hc.title.line1}
            <br />
            <span style={{
              ...(hc.title.gradientEnabled
                ? {
                    background: `linear-gradient(to right, ${isDark ? hc.title.gradientFrom : t.textMuted}, ${isDark ? hc.title.gradientTo : t.textFaint})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }
                : { color: t.textMuted }),
            }}>
              {hc.title.line2}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              fontSize: hc.subtitle.fontSize, maxWidth: hc.subtitle.maxWidth,
              margin: `${hc.subtitle.marginTop}px auto 0`, lineHeight: hc.subtitle.lineHeight,
              color: t.textSecondary,
            }}
          >
            {hc.subtitle.text}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="lp-hero-buttons"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: hc.buttons.gap, marginTop: hc.buttons.marginTop }}
          >
            <a href={hc.buttons.primary.href} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: t.primaryBtnBg, color: t.primaryBtnText,
              padding: hc.buttons.primary.padding, borderRadius: hc.buttons.primary.borderRadius,
              textDecoration: "none", fontWeight: hc.buttons.primary.fontWeight, fontSize: hc.buttons.primary.fontSize,
              boxShadow: t.primaryBtnShadow, transition: "transform 0.2s, box-shadow 0.2s",
            }}>
              {hc.buttons.primary.text}
              {hc.buttons.primary.showArrow && <Icon name="arrow-right" size={18} color={t.primaryBtnText} />}
            </a>
            <a href={hc.buttons.secondary.href} style={{
              background: t.secondaryBtnBg, color: t.secondaryBtnText,
              padding: hc.buttons.secondary.padding, borderRadius: hc.buttons.secondary.borderRadius,
              textDecoration: "none", fontWeight: hc.buttons.secondary.fontWeight, fontSize: hc.buttons.secondary.fontSize,
              border: `1px solid ${t.secondaryBtnBorder}`, transition: "all 0.2s",
            }}>
              {hc.buttons.secondary.text}
            </a>
          </motion.div>

          {/* Avatars + Trust */}
          {hc.avatars.show && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              style={{ marginTop: hc.avatars.marginTop, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                {hc.avatars.colors.map((color: string, i: number) => (
                  <div key={i} style={{
                    width: hc.avatars.size, height: hc.avatars.size, borderRadius: "50%",
                    background: color, border: `2px solid ${t.pageBg}`,
                    marginLeft: i > 0 ? hc.avatars.overlap : 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 600, color: "#fff",
                  }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span style={{ fontSize: hc.trust.fontSize, color: t.trustText }}>
                {hc.trust.text} <strong style={{ color: t.trustBoldText }}>{hc.trust.boldText}</strong> {hc.trust.suffix}
              </span>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Logo Bar ── */}
      <section style={{ borderTop: `1px solid ${t.sectionBorder}`, borderBottom: `1px solid ${t.sectionBorder}`, overflow: "hidden" }}>
        <div style={{ maxWidth: layout.maxWidth, margin: "0 auto", padding: lb.padding, textAlign: "center" }}>
          <Reveal>
            <div style={{
              fontSize: lb.labelFontSize, fontWeight: lb.labelFontWeight,
              letterSpacing: lb.labelLetterSpacing, color: t.textFaint,
              textTransform: "uppercase", marginBottom: 40,
            }}>
              {lb.label}
            </div>
          </Reveal>

          <div className="lp-logo-grid" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: lb.gap, flexWrap: "wrap" }}>
            {lb.logos.map((logo, i) => (
              <Reveal key={logo.name} delay={i * 0.08}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  color: t.logoText, fontSize: lb.logoFontSize, fontWeight: lb.logoFontWeight,
                }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: 6,
                    background: t.logoBg, border: `1px solid ${t.logoBorder}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, color: t.logoLabelText,
                  }}>
                    {logo.initial}
                  </span>
                  {logo.name}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ maxWidth: layout.maxWidth, margin: "0 auto", padding: fc.padding, textAlign: "center" }}>
        <Reveal>
          <h2 style={{ fontSize: fc.titleSize, fontWeight: fc.titleWeight, letterSpacing: fc.titleLetterSpacing, color: t.text }}>
            {fc.title}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p style={{ fontSize: fc.subtitleSize, color: t.textSecondary, maxWidth: fc.subtitleMaxWidth, margin: "16px auto 0", lineHeight: 1.7 }}>
            {fc.subtitle}
          </p>
        </Reveal>

        {/* Feature grid: top row 2 cols, bottom row 3 cols */}
        <div style={{ marginTop: 64 }}>
          {/* Top row */}
          <div className="lp-features-top" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginBottom: 20 }}>
            {fc.cards.slice(0, 2).map((card, i) => (
              <Reveal key={card.id} delay={0.1 + i * 0.1}>
                <div style={{
                  background: t.featureBg, border: `1px solid ${t.featureBorder}`,
                  borderRadius: fc.cardBorderRadius, padding: fc.cardPadding,
                  textAlign: "left", transition: "border-color 0.3s, transform 0.3s",
                  cursor: "default", height: "100%",
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: t.featureIconBg, display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 20, color: t.featureIconColor,
                  }}>
                    <Icon name={card.icon} size={20} />
                  </div>

                  {card.indicators && (
                    <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                      {["#22c55e", "#22c55e", "#22c55e", "#22c55e", "#3f3f46"].map((c, j) => (
                        <motion.div
                          key={j}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + j * 0.1 }}
                          style={{ width: 8, height: 8, borderRadius: "50%", background: c }}
                        />
                      ))}
                    </div>
                  )}

                  <h3 style={{ fontSize: 20, fontWeight: 700, color: t.text, marginBottom: 8 }}>{card.title}</h3>
                  <p style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.7 }}>{card.description}</p>

                  {/* Stats for monitoring card */}
                  {card.stats && (
                    <div style={{ display: "grid", gridTemplateColumns: `repeat(${card.stats.length}, 1fr)`, gap: 12, marginTop: 24, color: t.featureStatLabelColor }}>
                      {card.stats.map((stat) => (
                        <StatValue
                          key={stat.label}
                          value={stat.value}
                          label={stat.label}
                          color={t.featureStatColor}
                          duration={anim.counterDuration}
                        />
                      ))}
                    </div>
                  )}

                  {/* Keyboard shortcut */}
                  {card.shortcut && (
                    <div style={{ display: "flex", gap: 6, marginTop: 24 }}>
                      {card.shortcut.map((key) => (
                        <span key={key} style={{
                          padding: "6px 12px", borderRadius: 8,
                          background: t.featureBadgeBg, color: t.featureBadgeText,
                          fontSize: 13, fontWeight: 600, fontFamily: "monospace",
                        }}>
                          {key === "Cmd" ? "\u2318" : key}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Chart */}
                  {card.showChart && (
                    <MiniChart color={t.featureHighlightColor} />
                  )}

                  {/* Speed highlight */}
                  {card.highlight && (
                    <div style={{ marginTop: 24 }}>
                      <span style={{ fontSize: 28, fontWeight: 800, color: t.featureHighlightColor }}>{card.highlight}</span>
                      <span style={{ fontSize: 14, color: t.textMuted, marginLeft: 8 }}>{card.highlightLabel}</span>
                    </div>
                  )}

                  {/* Compliance badges */}
                  {card.badges && (
                    <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
                      {card.badges.map((badge) => (
                        <span key={badge} style={{
                          padding: "6px 14px", borderRadius: 8,
                          background: t.featureBadgeBg, color: t.featureBadgeText,
                          fontSize: 12, fontWeight: 600,
                        }}>
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          {/* Bottom row */}
          <div className="lp-features-bottom" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {fc.cards.slice(2).map((card, i) => (
              <Reveal key={card.id} delay={0.2 + i * 0.1}>
                <div style={{
                  background: t.featureBg, border: `1px solid ${t.featureBorder}`,
                  borderRadius: fc.cardBorderRadius, padding: fc.cardPadding,
                  textAlign: "left", transition: "border-color 0.3s, transform 0.3s",
                  cursor: "default", height: "100%",
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: t.featureIconBg, display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 20, color: t.featureIconColor,
                  }}>
                    <Icon name={card.icon} size={20} />
                  </div>

                  <h3 style={{ fontSize: 20, fontWeight: 700, color: t.text, marginBottom: 8 }}>{card.title}</h3>
                  <p style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.7 }}>{card.description}</p>

                  {card.showChart && (
                    <MiniChart color={t.featureHighlightColor} />
                  )}

                  {card.highlight && (
                    <div style={{ marginTop: 24 }}>
                      <span style={{ fontSize: 28, fontWeight: 800, color: t.featureHighlightColor }}>{card.highlight}</span>
                      <span style={{ fontSize: 14, color: t.textMuted, marginLeft: 8 }}>{card.highlightLabel}</span>
                    </div>
                  )}

                  {card.badges && (
                    <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
                      {card.badges.map((badge) => (
                        <span key={badge} style={{
                          padding: "6px 14px", borderRadius: 8,
                          background: t.featureBadgeBg, color: t.featureBadgeText,
                          fontSize: 12, fontWeight: 600,
                        }}>
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ borderTop: `1px solid ${t.sectionBorder}`, background: t.pricingBg, transition: "background 0.4s" }}>
        <div style={{ maxWidth: layout.maxWidth, margin: "0 auto", padding: pc.padding, textAlign: "center" }}>
          <Reveal>
            <h2 style={{ fontSize: pc.titleSize, fontWeight: pc.titleWeight, letterSpacing: pc.titleLetterSpacing, color: t.text }}>
              {pc.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontSize: pc.subtitleSize, color: t.textSecondary, marginTop: 12 }}>{pc.subtitle}</p>
          </Reveal>

          {/* Toggle */}
          <Reveal delay={0.15}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 0, marginTop: 40,
              background: t.pricingToggleBg, borderRadius: 10, padding: 4,
            }}>
              {(["monthly", "yearly"] as const).map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  style={{
                    padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer",
                    fontSize: 14, fontWeight: 600, transition: "all 0.2s",
                    background: billingCycle === cycle ? t.pricingToggleActiveBg : "transparent",
                    color: billingCycle === cycle ? t.pricingToggleActiveText : t.pricingToggleText,
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  {pc.toggle[cycle === "monthly" ? "monthly" : "yearly"]}
                  {cycle === "yearly" && (
                    <span style={{
                      background: "#22c55e", color: "#fff",
                      fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 9999,
                    }}>
                      {pc.toggle.yearlyDiscount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Pricing cards */}
          <div className="lp-pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 48 }}>
            {pc.tiers.map((tier, i) => (
              <Reveal key={tier.name} delay={0.2 + i * 0.1}>
                <div style={{
                  background: t.pricingCardBg,
                  border: `1px solid ${tier.popular ? t.pricingPopularBorder : t.pricingCardBorder}`,
                  borderRadius: pc.cardBorderRadius, padding: pc.cardPadding,
                  textAlign: "left", position: "relative", height: "100%",
                  display: "flex", flexDirection: "column",
                  transition: "border-color 0.3s",
                }}>
                  {tier.popular && (
                    <div style={{
                      position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                      background: t.pricingPopularBadgeBg, color: t.pricingPopularBadgeText,
                      fontSize: 12, fontWeight: 700, padding: "4px 16px", borderRadius: 9999,
                    }}>
                      Most Popular
                    </div>
                  )}

                  <div style={{ marginBottom: 24 }}>
                    <h3 style={{ fontSize: 22, fontWeight: 700, color: t.text }}>{tier.name}</h3>
                    <p style={{ fontSize: 14, color: t.textMuted, marginTop: 4 }}>{tier.description}</p>
                  </div>

                  <div style={{ marginBottom: 32 }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={billingCycle}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        style={{ display: "flex", alignItems: "baseline", gap: 4 }}
                      >
                        <span style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.03em", color: t.text }}>
                          ${billingCycle === "monthly" ? tier.monthlyPrice : tier.yearlyPrice}
                        </span>
                        <span style={{ fontSize: 16, color: t.textMuted }}>/month</span>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                    {tier.features.map((feature) => (
                      <div key={feature} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Icon name="check" size={16} color={t.pricingCheckColor} />
                        <span style={{ fontSize: 14, color: t.textSecondary }}>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button style={{
                    width: "100%", marginTop: 32, padding: "14px 24px", borderRadius: 10,
                    border: tier.popular ? "none" : `1px solid ${t.pricingBtnBorder}`,
                    background: tier.popular ? t.pricingPopularBtnBg : t.pricingBtnBg,
                    color: tier.popular ? t.pricingPopularBtnText : t.pricingBtnText,
                    fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                  }}>
                    {tier.cta}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ borderTop: `1px solid ${t.sectionBorder}`, textAlign: "center" }}>
        <div style={{ maxWidth: layout.maxWidth, margin: "0 auto", padding: ctc.padding }}>
          <Reveal>
            <h2 style={{
              fontSize: ctc.titleSize, fontWeight: ctc.titleWeight,
              letterSpacing: ctc.titleLetterSpacing, color: t.ctaText,
            }}>
              {ctc.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontSize: ctc.subtitleSize, color: t.ctaSubtext, maxWidth: ctc.subtitleMaxWidth, margin: "20px auto 0", lineHeight: 1.7 }}>
              {ctc.subtitle}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="lp-cta-buttons" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: ctc.buttons.gap, marginTop: ctc.buttons.marginTop }}>
              <a href={ctc.buttons.primary.href} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: t.primaryBtnBg, color: t.primaryBtnText,
                padding: ctc.buttons.primary.padding, borderRadius: ctc.buttons.primary.borderRadius,
                textDecoration: "none", fontWeight: ctc.buttons.primary.fontWeight, fontSize: ctc.buttons.primary.fontSize,
                boxShadow: t.primaryBtnShadow,
              }}>
                {ctc.buttons.primary.text}
                {ctc.buttons.primary.showArrow && <Icon name="arrow-right" size={18} color={t.primaryBtnText} />}
              </a>
              <a href={ctc.buttons.secondary.href} style={{
                background: t.secondaryBtnBg, color: t.secondaryBtnText,
                padding: ctc.buttons.secondary.padding, borderRadius: ctc.buttons.secondary.borderRadius,
                textDecoration: "none", fontWeight: ctc.buttons.secondary.fontWeight, fontSize: ctc.buttons.secondary.fontSize,
                border: `1px solid ${t.secondaryBtnBorder}`,
              }}>
                {ctc.buttons.secondary.text}
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <p style={{ fontSize: 14, color: t.ctaNoteText, marginTop: 24 }}>{ctc.note}</p>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: t.footerBg, borderTop: `1px solid ${t.footerBorder}`,
        color: t.footerText, transition: "background 0.4s",
      }}>
        <div style={{ maxWidth: layout.maxWidth, margin: "0 auto", padding: `${ft.padding}`, paddingLeft: layout.horizontalPadding, paddingRight: layout.horizontalPadding }}>
          <div className="lp-footer-grid" style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(4, 1fr)", gap: 48, marginBottom: 48 }}>
            {/* Brand column */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                {ft.brand.showLogo && (
                  <img src={ft.brand.logoSrc} alt={ft.brand.text || "Logo"} style={{ height: ft.brand.logoSize, objectFit: "contain" }} />
                )}
                <span style={{ fontSize: ft.brand.fontSize, fontWeight: ft.brand.fontWeight, color: t.footerBrandText }}>
                  {ft.brand.text}
                </span>
              </div>
              <p style={{ fontSize: 14, color: t.footerText, lineHeight: 1.7, marginBottom: 20 }}>
                {ft.brand.tagline}
              </p>
              {ft.status.show && (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "6px 14px", borderRadius: 9999,
                  border: `1px solid ${t.footerBorder}`,
                  fontSize: 13,
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.footerStatusDot }} />
                  <span style={{ color: t.footerStatusText }}>{ft.status.text}</span>
                </div>
              )}
            </div>

            {/* Link columns */}
            {ft.columns.map((col) => (
              <div key={col.title}>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: t.footerBrandText, marginBottom: 20 }}>{col.title}</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {col.links.map((link) => (
                    <a key={link.label} href={link.href} style={{ color: t.footerLinkText, textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}>
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="lp-footer-bottom" style={{
            borderTop: `1px solid ${t.footerBorder}`, paddingTop: 24,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: 13, color: t.footerText }}>{ft.copyright}</span>
            <div style={{ display: "flex", gap: 24 }}>
              {ft.socialLinks.map((s) => (
                <a key={s.label} href={s.href} style={{ fontSize: 13, color: t.footerLinkText, textDecoration: "none" }}>{s.label}</a>
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

        /* ── Tablet (<=820px) ── */
        @media (max-width: 820px) {
          .lp-nav-inner { padding: 0 20px !important; }
          .lp-nav-links { display: none !important; }
          .lp-nav-signin { display: none !important; }
          .lp-nav-cta { display: none !important; }
          .lp-hamburger { display: flex !important; }

          .lp-features-top { grid-template-columns: 1fr !important; }
          .lp-features-bottom { grid-template-columns: 1fr 1fr !important; }

          .lp-pricing-grid { grid-template-columns: 1fr !important; max-width: 440px; margin-left: auto; margin-right: auto; }

          .lp-footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
          .lp-footer-grid > div:first-child { grid-column: 1 / -1; }

          .lp-logo-grid { gap: 32px !important; }
        }

        /* ── Mobile (<=640px) ── */
        @media (max-width: 640px) {
          .lp-nav-inner { padding: 0 16px !important; }

          .lp-hero-buttons { flex-direction: column !important; width: 100%; }
          .lp-hero-buttons a { width: 100%; text-align: center; justify-content: center; box-sizing: border-box; }

          .lp-features-top { grid-template-columns: 1fr !important; }
          .lp-features-bottom { grid-template-columns: 1fr !important; }

          .lp-pricing-grid { max-width: 100%; }

          .lp-cta-buttons { flex-direction: column !important; width: 100%; }
          .lp-cta-buttons a { width: 100%; text-align: center; justify-content: center; box-sizing: border-box; }

          .lp-footer-grid { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }

          .lp-footer-bottom { flex-direction: column !important; gap: 16px; text-align: center; }

          .lp-logo-grid { gap: 20px !important; }
        }
      `}</style>
    </div>
  );
}
