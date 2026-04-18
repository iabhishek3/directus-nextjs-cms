"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DIRECTUS_URL =
  process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

interface HighlightInfo {
  top: number;
  left: number;
  width: number;
  height: number;
  label: string;
}

function getElementLabel(el: HTMLElement): string {
  const tag = el.tagName.toLowerCase();
  const id = el.id ? `#${el.id}` : "";
  const cls = el.className && typeof el.className === "string"
    ? `.${el.className.trim().split(/\s+/).slice(0, 2).join(".")}`
    : "";
  const directus = el.dataset.directusCollection;
  if (directus) {
    const dId = el.dataset.directusId;
    return `${directus}${dId ? ` #${dId}` : ""}`;
  }
  const configPath = el.dataset.configPath;
  if (configPath) return `config: ${configPath}`;
  const textContent = el.textContent?.trim().slice(0, 30);
  const textHint = textContent ? ` "${textContent}${(el.textContent?.trim().length || 0) > 30 ? "..." : ""}"` : "";
  return `${tag}${id || cls}${textHint}`;
}

function getTemplateSlug(): string {
  const path = window.location.pathname;
  const match = path.match(/\/templates\/([^/]+)/);
  if (match) return match[1];
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 1) return segments[0];
  return "events";
}

function getDirectusLink(el: HTMLElement | null): { collection: string; id?: string; field?: string } | null {
  let current = el;
  while (current) {
    if (current.dataset.directusCollection) {
      return {
        collection: current.dataset.directusCollection,
        id: current.dataset.directusId,
        field: current.dataset.directusField,
      };
    }
    current = current.parentElement;
  }
  return null;
}

// Walk up the DOM to find a data-config-path attribute
function getConfigPath(el: HTMLElement | null): string | null {
  let current = el;
  while (current) {
    if (current.dataset.configPath) return current.dataset.configPath;
    current = current.parentElement;
  }
  return null;
}

export default function EditMode() {
  const [active, setActive] = useState(false);
  const [highlight, setHighlight] = useState<HighlightInfo | null>(null);
  const [selected, setSelected] = useState<HTMLElement | null>(null);
  const [selectedInfo, setSelectedInfo] = useState<HighlightInfo | null>(null);

  // Inline editing
  const [inlineEditing, setInlineEditing] = useState(false);
  const [inlineSaving, setInlineSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<"success" | "error" | null>(null);
  const inlineElRef = useRef<HTMLElement | null>(null);
  const originalTextRef = useRef("");
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number } | null>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!active || inlineEditing) return;
      const target = e.target as HTMLElement;
      if (target.closest("[data-edit-fab]") || target.closest("[data-edit-overlay]") || target.closest("[data-inline-bar]")) {
        setHighlight(null);
        return;
      }
      const rect = target.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;
      setHighlight({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
        label: getElementLabel(target),
      });
    },
    [active, inlineEditing]
  );

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (!active || inlineEditing) return;
      const target = e.target as HTMLElement;
      if (target.closest("[data-edit-fab]") || target.closest("[data-edit-overlay]") || target.closest("[data-inline-bar]")) return;
      e.preventDefault();
      e.stopPropagation();
      const rect = target.getBoundingClientRect();
      setSelected(target);
      setSelectedInfo({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
        label: getElementLabel(target),
      });
    },
    [active, inlineEditing]
  );

  useEffect(() => {
    if (!active) {
      setHighlight(null);
      setSelected(null);
      setSelectedInfo(null);
      cleanupInline(false);
      return;
    }
    document.addEventListener("mousemove", handleMouseMove, true);
    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove, true);
      document.removeEventListener("click", handleClick, true);
    };
  }, [active, handleMouseMove, handleClick]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (inlineEditing) cleanupInline(true);
        else if (selected) { setSelected(null); setSelectedInfo(null); }
        else if (active) setActive(false);
      }
      if (e.key === "Enter" && inlineEditing && !e.shiftKey) {
        e.preventDefault();
        acceptEdit();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, selected, inlineEditing]);

  useEffect(() => {
    if (!inlineEditing || !inlineElRef.current) return;
    const reposition = () => {
      const el = inlineElRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setToolbarPos({ top: r.top + window.scrollY - 42, left: r.left + window.scrollX });
    };
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [inlineEditing]);

  const directusLink = selected ? getDirectusLink(selected) : null;
  const canEditHere = selected ? !!(getConfigPath(selected) || (getDirectusLink(selected)?.field)) : false;

  function cleanupInline(revert: boolean) {
    const el = inlineElRef.current;
    if (el) {
      if (revert) el.textContent = originalTextRef.current;
      el.contentEditable = "false";
      el.style.outline = "";
      el.style.outlineOffset = "";
    }
    inlineElRef.current = null;
    originalTextRef.current = "";
    setInlineEditing(false);
    setInlineSaving(false);
    setToolbarPos(null);
  }

  function startInlineEdit() {
    if (!selected) return;
    const el = selected;
    const text = el.textContent || "";
    if (!text.trim()) return;

    originalTextRef.current = text;
    inlineElRef.current = el;

    const r = el.getBoundingClientRect();
    setToolbarPos({ top: r.top + window.scrollY - 42, left: r.left + window.scrollX });

    setSelected(null);
    setSelectedInfo(null);
    setHighlight(null);
    setInlineEditing(true);
    setSaveResult(null);

    el.contentEditable = "true";
    el.style.outline = "2px solid #f59e0b";
    el.style.outlineOffset = "3px";
    el.focus();
    try {
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    } catch { /* ok */ }
  }

  async function acceptEdit() {
    const el = inlineElRef.current;
    if (!el || inlineSaving) return;

    const newText = (el.textContent || "").trim();
    const oldText = originalTextRef.current.trim();
    if (newText === oldText) { cleanupInline(false); return; }

    setInlineSaving(true);
    setSaveResult(null);

    try {
      let saved = false;

      // 1. Try config path (direct, no AI needed)
      const configPath = getConfigPath(el);
      if (configPath) {
        const res = await fetch("/api/config", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            template: getTemplateSlug(),
            updates: [{ path: configPath, value: newText }],
          }),
        });
        const data = await res.json();
        saved = data.success;
      }

      // 2. Try Directus field (direct, no AI needed)
      if (!saved) {
        const dLink = getDirectusLink(el);
        if (dLink?.field && dLink.id) {
          const res = await fetch("/api/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              collection: dLink.collection,
              id: dLink.id,
              fields: { [dLink.field]: newText },
            }),
          });
          const data = await res.json();
          saved = data.success;
        }
      }

      if (saved) {
        setSaveResult("success");
        setTimeout(() => {
          cleanupInline(false);
          window.parent.postMessage({ type: "inline-edit-done" }, "*");
        }, 600);
      } else {
        setSaveResult("error");
        setTimeout(() => cleanupInline(true), 1000);
      }
    } catch {
      setSaveResult("error");
      setTimeout(() => cleanupInline(true), 1000);
    }
  }

  return (
    <>
      {/* Hover highlight */}
      {active && highlight && !selected && !inlineEditing && (
        <div data-edit-overlay style={{
          position: "absolute", top: highlight.top, left: highlight.left,
          width: highlight.width, height: highlight.height,
          border: "2px solid #7c3aed", background: "rgba(124, 58, 237, 0.06)",
          borderRadius: "4px", pointerEvents: "none", zIndex: 9998,
          transition: "all 0.05s ease",
        }}>
          <span style={{
            position: "absolute", top: "-26px", left: "0",
            background: "#7c3aed", color: "#fff",
            fontSize: "11px", fontWeight: 600, padding: "3px 8px", borderRadius: "4px",
            whiteSpace: "nowrap", fontFamily: "monospace",
            maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {highlight.label}
          </span>
        </div>
      )}

      {/* Selected panel */}
      {active && selected && selectedInfo && !inlineEditing && (
        <div data-edit-overlay style={{
          position: "absolute", top: selectedInfo.top, left: selectedInfo.left,
          width: selectedInfo.width, height: selectedInfo.height,
          border: "2px solid #2563eb", background: "rgba(37, 99, 235, 0.08)",
          borderRadius: "4px", pointerEvents: "none", zIndex: 9998,
        }}>
          <div style={{
            position: "absolute", top: "-44px", left: "0",
            display: "flex", alignItems: "center", gap: "6px",
            pointerEvents: "auto",
          }}>
            <span style={{
              background: "#2563eb", color: "#fff", fontSize: "11px", fontWeight: 600,
              padding: "3px 8px", borderRadius: "4px", whiteSpace: "nowrap", fontFamily: "monospace",
              maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {selected.tagName.toLowerCase()}
              {selected.id ? `#${selected.id}` : ""}
              {selected.className && typeof selected.className === "string"
                ? `.${selected.className.trim().split(/\s+/).slice(0, 1).join(".")}` : ""}
            </span>
            <span style={{
              background: "#f3f4f6", color: "#374151", fontSize: "11px",
              padding: "3px 8px", borderRadius: "4px", whiteSpace: "nowrap", fontFamily: "monospace",
            }}>
              {Math.round(selectedInfo.width)} x {Math.round(selectedInfo.height)}
            </span>
            {directusLink && (
              <button onClick={(e) => {
                e.stopPropagation();
                window.open(
                  directusLink.id
                    ? `${DIRECTUS_URL}/admin/content/${directusLink.collection}/${directusLink.id}`
                    : `${DIRECTUS_URL}/admin/content/${directusLink.collection}`,
                  "_blank"
                );
              }} style={btnStyle("#059669")}>Edit in Directus</button>
            )}
            {canEditHere && (
              <button onClick={(e) => { e.stopPropagation(); startInlineEdit(); }} style={btnStyle("#f59e0b")}>
                Edit Here
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const tag = selected.tagName.toLowerCase();
                const text = selected.textContent?.trim().slice(0, 80) || "";
                const elId = selected.id ? `#${selected.id}` : "";
                const cls = selected.className && typeof selected.className === "string"
                  ? `.${selected.className.trim().split(/\s+/).slice(0, 2).join(".")}` : "";
                const directus = directusLink
                  ? ` (${directusLink.collection}${directusLink.id ? ` #${directusLink.id}` : ""})` : "";
                window.parent.postMessage({
                  type: "edit-in-chat",
                  element: {
                    tag: `${tag}${elId}${cls}`, text,
                    directus: directusLink || null,
                    dimensions: `${Math.round(selectedInfo.width)}x${Math.round(selectedInfo.height)}`,
                  },
                  prompt: `Edit the ${tag}${elId}${cls}${directus} element${text ? `: "${text.slice(0, 50)}${text.length > 50 ? "..." : ""}"` : ""}`,
                }, "*");
                setSelected(null); setSelectedInfo(null); setActive(false);
              }}
              style={btnStyle("#7c3aed")}
            >Edit in Chat</button>
            <button onClick={(e) => { e.stopPropagation(); setSelected(null); setSelectedInfo(null); }}
              style={btnStyle("#6b7280")}>x</button>
          </div>
        </div>
      )}

      {/* Inline toolbar */}
      {inlineEditing && toolbarPos && (
        <div data-inline-bar style={{
          position: "absolute", top: toolbarPos.top, left: toolbarPos.left,
          zIndex: 10000, display: "flex", alignItems: "center", gap: "6px",
        }}>
          {saveResult === "success" ? (
            <span style={{ ...btnStyle("#059669"), display: "flex", alignItems: "center", gap: "4px" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><polyline points="20 6 9 17 4 12" /></svg>
              Saved!
            </span>
          ) : saveResult === "error" ? (
            <span style={{ ...btnStyle("#ef4444"), display: "flex", alignItems: "center", gap: "4px" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              Failed — reverting
            </span>
          ) : (
            <>
              <span style={{
                background: "#f59e0b", color: "#fff", fontSize: "11px", fontWeight: 600,
                padding: "4px 10px", borderRadius: "4px", fontFamily: "system-ui, sans-serif",
              }}>
                {inlineSaving ? "Saving..." : "Enter ↵ save · Esc cancel"}
              </span>
              {!inlineSaving && (
                <>
                  <button data-inline-bar onClick={(e) => { e.preventDefault(); e.stopPropagation(); acceptEdit(); }}
                    style={{ ...btnStyle("#059669"), display: "flex", alignItems: "center", gap: "4px" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><polyline points="20 6 9 17 4 12" /></svg>
                  </button>
                  <button data-inline-bar onClick={(e) => { e.preventDefault(); e.stopPropagation(); cleanupInline(true); }}
                    style={{ ...btnStyle("#ef4444"), display: "flex", alignItems: "center", gap: "4px" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  </button>
                </>
              )}
            </>
          )}
        </div>
      )}

      {active && !inlineEditing && (
        <style>{`* { cursor: crosshair !important; } [data-edit-fab] { cursor: pointer !important; } [data-edit-overlay] button { cursor: pointer !important; }`}</style>
      )}

      <button data-edit-fab onClick={() => setActive((v) => !v)}
        title={active ? "Exit edit mode (Esc)" : "Enter edit mode"}
        style={{
          position: "fixed", bottom: "28px", right: "28px", zIndex: 9999,
          width: "52px", height: "52px", borderRadius: "50%", border: "none",
          background: active ? "#7c3aed" : "#111", color: "#fff",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: active ? "0 0 0 4px rgba(124,58,237,0.3), 0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.15)",
          transition: "all 0.2s ease",
        }}>
        {active ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
        )}
      </button>
    </>
  );
}

function btnStyle(bg: string): React.CSSProperties {
  return {
    background: bg, color: "#fff", fontSize: "11px", fontWeight: 600,
    padding: "3px 10px", borderRadius: "4px", border: "none", cursor: "pointer",
    whiteSpace: "nowrap", fontFamily: "system-ui, sans-serif",
  };
}
