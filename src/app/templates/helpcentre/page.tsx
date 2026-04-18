"use client";

import { useEffect, useState } from "react";
import EditMode from "@/components/EditMode";
import defaultConfig from "./config.json";

type ThemeColors = Record<string, string>;

export default function HelpCentreTemplate() {
  const [config, setConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [txns, setTxns] = useState(defaultConfig.transactions);

  const t: ThemeColors = config.themes.light as unknown as ThemeColors;

  useEffect(() => {
    setTxns(config.transactions);
  }, [config]);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch(`/api/config?template=helpcentre&_t=${Date.now()}`);
        if (res.ok) setConfig(await res.json());
      } catch (err) {
        console.error("Failed to fetch config:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const hdr = config.header;
  const sm = config.summary;
  const tbl = config.table;
  const lc = config.loading;
  const layout = config.layout;
  const sections = config.sections;
  const isVisible = (name: string) => (sections as Record<string, { visible: boolean }>)[name]?.visible !== false;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{
            width: lc.spinnerSize, height: lc.spinnerSize, borderRadius: "50%",
            border: `${lc.spinnerBorderWidth}px solid ${lc.spinnerTrackColor}`,
            borderTopColor: lc.spinnerActiveColor, animation: "spin 0.8s linear infinite",
          }} />
          <span style={{ color: "#9ca3af", fontSize: lc.textSize }}>{lc.text}</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: t.pageBg, color: t.text, fontFamily: config.fonts.primary }}>

      {/* ── Green Header Block ── */}
      {isVisible("header") && (
      <header style={{
        background: t.headerBg, color: t.headerText,
        padding: `${hdr.paddingTop}px ${layout.horizontalPadding}px ${hdr.paddingBottom}px`,
      }}>
        <div style={{ maxWidth: layout.maxWidth, margin: "0 auto", display: "flex", justifyContent: "space-between" }}>
          {/* Left side — logo + address */}
          <div>
            <img src="/grab-logo.png" alt="Grab" style={{ height: 60, objectFit: "contain", filter: "brightness(0) invert(1)" }} />
            <div style={{
              marginTop: hdr.address.marginTop,
              fontSize: hdr.address.fontSize,
              lineHeight: hdr.address.lineHeight,
              color: t.headerTextSecondary,
            }}>
              {hdr.address.lines.map((line, i) => (
                <div key={i} data-config-path={`header.address.lines.${i}`}>{line}</div>
              ))}
            </div>
          </div>

          {/* Right side — date range + member statement */}
          <div style={{ textAlign: "right", fontSize: hdr.statement.fontSize, lineHeight: hdr.statement.lineHeight }}>
            <div data-config-path="header.statement.dateRange" style={{ color: t.headerTextSecondary }}>
              {hdr.statement.dateRange}
            </div>
            <div style={{ marginTop: 16 }}>
              <div data-config-path="header.statement.label" style={{ color: t.headerTextSecondary }}>{hdr.statement.label}</div>
              <div data-config-path="header.statement.name" style={{ color: t.headerText }}>
                {hdr.statement.name}
              </div>
              <div data-config-path="header.statement.email" style={{ color: t.headerTextSecondary }}>
                {hdr.statement.email}
              </div>
            </div>
          </div>
        </div>
      </header>
      )}

      {/* ── Summary Line ── */}
      {isVisible("summary") && (
      <div style={{
        maxWidth: layout.maxWidth, margin: "0 auto",
        padding: `${sm.padding}`,
        display: "flex", alignItems: "baseline", gap: sm.gap,
        fontSize: sm.fontSize,
      }}>
        <div>
          <span data-config-path="summary.totalLabel" style={{ fontWeight: sm.labelFontWeight, color: t.summaryLabel }}>
            {sm.totalLabel}
          </span>{" "}
          <span data-config-path="summary.totalValue" style={{ fontWeight: sm.valueFontWeight, color: t.summaryText }}>
            {sm.totalValue}
          </span>
        </div>
        <div>
          <span data-config-path="summary.amountLabel" style={{ fontWeight: sm.labelFontWeight, color: t.summaryLabel }}>
            {sm.amountLabel}
          </span>{" "}
          <span data-config-path="summary.amountValue" style={{ fontWeight: sm.valueFontWeight, color: t.summaryText }}>
            {sm.amountValue}
          </span>
        </div>
      </div>
      )}

      {/* ── Transactions Table ── */}
      {isVisible("table") && (
      <section style={{
        maxWidth: layout.maxWidth, margin: "0 auto",
        padding: "0 0 60px",
      }}>
        <table style={{
          width: "100%", borderCollapse: "collapse",
          fontSize: tbl.cellFontSize,
          border: `1px solid ${t.tableBorder}`,
        }}>
          <thead>
            <tr>
              {tbl.columns.map((col, ci) => (
                <th key={col.key} data-config-path={`table.columns.${ci}.label`} style={{
                  padding: tbl.headerPadding,
                  fontSize: tbl.headerFontSize,
                  fontWeight: tbl.headerFontWeight,
                  color: t.tableHeaderText,
                  textAlign: ((col as Record<string, unknown>).align as "left" | "right") || "left",
                  borderBottom: `1px solid ${t.tableBorder}`,
                  borderRight: `1px solid ${t.tableBorder}`,
                  whiteSpace: "nowrap",
                  background: t.tableHeaderBg,
                }}>
                  {col.label}
                </th>
              ))}
              <th className="no-print" style={{
                width: 40, padding: tbl.headerPadding,
                borderBottom: `1px solid ${t.tableBorder}`,
                background: t.tableHeaderBg,
              }} />
            </tr>
          </thead>
          <tbody>
            {txns.map((tx, idx) => (
              <tr key={idx} style={{ background: idx % 2 === 1 ? t.tableRowAltBg : t.tableRowBg }}>
                {tbl.columns.map((col) => {
                  const val = tx[col.key as keyof typeof tx] || "";
                  return (
                    <td key={col.key} data-config-path={`transactions.${idx}.${col.key}`} style={{
                      padding: tbl.cellPadding,
                      color: t.tableText,
                      borderBottom: `1px solid ${t.tableBorder}`,
                      borderRight: `1px solid ${t.tableBorder}`,
                      textAlign: ((col as Record<string, unknown>).align as "left" | "right") || "left",
                      verticalAlign: "top",
                      lineHeight: 1.5,
                    }}>
                      {val}
                    </td>
                  );
                })}
                <td className="no-print" style={{
                  padding: "0 8px", borderBottom: `1px solid ${t.tableBorder}`,
                  textAlign: "center", verticalAlign: "middle",
                }}>
                  <button
                    onClick={() => setTxns((prev) => prev.filter((_, i) => i !== idx))}
                    title="Remove row"
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "#d1d5db", fontSize: 16, lineHeight: 1,
                      padding: 4, borderRadius: 4,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#d1d5db"; }}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Action buttons */}
        <div className="no-print" style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            onClick={() => {
              const now = new Date();
              const day = String(now.getDate()).padStart(2, "0");
              const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
              const mon = months[now.getMonth()];
              const yr = now.getFullYear();
              const hr = now.getHours();
              const min = String(now.getMinutes()).padStart(2, "0");
              const ampm = hr >= 12 ? "PM" : "AM";
              const h12 = hr % 12 || 12;
              const dateStr = `${day} ${mon} ${yr}, ${String(h12).padStart(2, "0")}:${min}${ampm}`;
              const code = `A-${Math.random().toString(36).substring(2, 16).toUpperCase()}`;
              const pickups = ["Zedge", "East Coast Depot", "Funan", "Tampines Mall", "Bugis Junction"];
              const dropoffs = ["2 Changi Business Park Cres", "East Coast Integrated", "Zedge", "Orchard Gateway"];
              const services = ["Standard | Car or taxi", "GrabFood", "GrabExpress"];
              const newRow = {
                dateTime: dateStr,
                bookingCode: code,
                pickupAddress: pickups[Math.floor(Math.random() * pickups.length)],
                dropoffAddress: dropoffs[Math.floor(Math.random() * dropoffs.length)],
                serviceType: services[Math.floor(Math.random() * services.length)],
                currency: "SGD",
                amount: (5 + Math.random() * 30).toFixed(2),
              };
              setTxns((prev) => [newRow, ...prev]);
            }}
            style={{
              padding: "8px 20px", borderRadius: 6,
              background: "#00b14f", color: "#fff",
              border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600,
              fontFamily: "inherit",
            }}
          >
            + Add Transaction
          </button>
          <button
            className="no-print"
            onClick={() => window.print()}
            style={{
              padding: "8px 20px", borderRadius: 6,
              background: "#374151", color: "#fff",
              border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600,
              fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print / Save PDF
          </button>
        </div>
      </section>
      )}

      <EditMode />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media print {
          .no-print, [data-edit-fab], [data-edit-overlay], [data-inline-bar] { display: none !important; }
          header { break-inside: avoid; }
          table { font-size: 11px !important; }
          td, th { padding: 10px 8px !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}
