const events = [
  { id: 1, title: "Design Systems Summit", desc: "A deep dive into scalable design systems used by top product teams.", date: "Apr 18, 2026", location: "San Francisco, CA", tag: "Design", color: "#7c3aed" },
  { id: 2, title: "React Conf 2026", desc: "The latest in React Server Components, compiler updates, and the ecosystem.", date: "May 3, 2026", location: "Las Vegas, NV", tag: "Engineering", color: "#2563eb" },
  { id: 3, title: "Startup Pitch Night", desc: "Watch 12 early-stage startups pitch to a panel of top-tier investors.", date: "May 10, 2026", location: "New York, NY", tag: "Business", color: "#d97706" },
  { id: 4, title: "AI & ML Workshop", desc: "Hands-on workshop covering LLMs, fine-tuning, and production deployment.", date: "May 22, 2026", location: "Austin, TX", tag: "AI", color: "#059669" },
  { id: 5, title: "Photography Walk", desc: "Explore the city through your lens with professional photographers.", date: "Jun 1, 2026", location: "Portland, OR", tag: "Creative", color: "#db2777" },
  { id: 6, title: "Cloud Architecture Day", desc: "Best practices for building resilient, cost-effective cloud infrastructure.", date: "Jun 14, 2026", location: "Seattle, WA", tag: "Engineering", color: "#0891b2" },
];

const stats = [
  { value: "10K+", label: "Attendees" },
  { value: "120+", label: "Events" },
  { value: "50+", label: "Cities" },
  { value: "98%", label: "Satisfaction" },
];

const container = { maxWidth: "1100px", margin: "0 auto", padding: "0 32px" } as const;

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", color: "#111", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, width: "100%", zIndex: 50, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ ...container, display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          <span style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em", color: "#111" }}>
            discover<span style={{ color: "#7c3aed" }}>.</span>
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "32px", fontSize: "14px", color: "#6b7280" }}>
            <a href="#events" style={{ color: "inherit", textDecoration: "none" }}>Events</a>
            <a href="#about" style={{ color: "inherit", textDecoration: "none" }}>About</a>
            <a href="#" style={{ background: "#111", color: "#fff", padding: "8px 20px", borderRadius: "9999px", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: "relative", paddingTop: "160px", paddingBottom: "80px", overflow: "hidden", background: "linear-gradient(to bottom, #f0ecff, #fafafa)" }}>
        <div style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", width: "600px", height: "600px", background: "rgba(124,58,237,0.08)", filter: "blur(120px)", borderRadius: "50%" }} />
        <div style={{ position: "relative", ...container, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "9999px", border: "1px solid #e5e7eb", background: "#fff", fontSize: "14px", color: "#6b7280", marginBottom: "32px" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
            120+ events live now
          </div>
          <h1 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, maxWidth: "800px", margin: "0 auto", color: "#111" }}>
            Find events that{" "}
            <span style={{ background: "linear-gradient(to right, #7c3aed, #0891b2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              inspire
            </span>{" "}
            you
          </h1>
          <p style={{ fontSize: "18px", color: "#6b7280", maxWidth: "560px", margin: "24px auto 0", lineHeight: 1.7 }}>
            Curated conferences, workshops, and meetups from the world&apos;s best communities. All in one place.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "40px" }}>
            <a href="#events" style={{ background: "#111", color: "#fff", padding: "14px 32px", borderRadius: "9999px", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>
              Browse Events
            </a>
            <a href="#about" style={{ border: "1px solid #d1d5db", color: "#374151", padding: "14px 32px", borderRadius: "9999px", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb", background: "#fff" }}>
        <div style={{ ...container, padding: "48px 32px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px", textAlign: "center" }}>
          {stats.map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: "30px", fontWeight: 700, color: "#111" }}>{s.value}</div>
              <div style={{ fontSize: "14px", color: "#9ca3af", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Events */}
      <section id="events" style={{ ...container, padding: "80px 32px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "40px" }}>
          <div>
            <h2 style={{ fontSize: "30px", fontWeight: 700, letterSpacing: "-0.02em", color: "#111" }}>Upcoming Events</h2>
            <p style={{ color: "#9ca3af", marginTop: "8px", fontSize: "16px" }}>Don&apos;t miss what&apos;s happening next.</p>
          </div>
          <a href="#" style={{ fontSize: "14px", color: "#7c3aed", textDecoration: "none", fontWeight: 500 }}>
            View all &rarr;
          </a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {events.map((e) => (
            <div
              key={e.id}
              className="event-card"
              style={{
                borderRadius: "16px",
                padding: "28px",
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderTop: `3px solid ${e.color}`,
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, padding: "4px 12px", borderRadius: "9999px", background: `${e.color}12`, color: e.color }}>
                  {e.tag}
                </span>
                <span style={{ fontSize: "12px", color: "#9ca3af" }}>{e.date}</span>
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginTop: "20px", color: "#111" }}>{e.title}</h3>
              <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "8px", lineHeight: 1.6 }}>{e.desc}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "16px", fontSize: "12px", color: "#9ca3af" }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {e.location}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="about" style={{ ...container, paddingBottom: "80px" }}>
        <div style={{ position: "relative", borderRadius: "24px", background: "linear-gradient(135deg, #7c3aed, #2563eb)", padding: "80px 40px", textAlign: "center", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: "300px", height: "300px", background: "rgba(255,255,255,0.1)", filter: "blur(80px)", borderRadius: "50%" }} />
          <div style={{ position: "relative" }}>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, letterSpacing: "-0.02em", color: "#fff" }}>Ready to discover something new?</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", maxWidth: "500px", margin: "16px auto 0", fontSize: "16px" }}>
              Join thousands of curious people who use Discover to find their next favorite event.
            </p>
            <a href="#" style={{ display: "inline-block", marginTop: "32px", background: "#fff", color: "#111", padding: "14px 32px", borderRadius: "9999px", textDecoration: "none", fontWeight: 500, fontSize: "14px" }}>
              Get Started — It&apos;s Free
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e5e7eb", padding: "40px 0", background: "#fff" }}>
        <div style={{ ...container, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>
            discover<span style={{ color: "#7c3aed" }}>.</span>
          </span>
          <div style={{ display: "flex", gap: "24px", fontSize: "14px", color: "#9ca3af" }}>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacy</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Terms</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Contact</a>
          </div>
          <span style={{ fontSize: "12px", color: "#9ca3af" }}>&copy; 2026 Discover. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
