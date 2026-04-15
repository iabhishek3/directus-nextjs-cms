"use client";

import { useCallback, useEffect, useState } from "react";

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
  // Show text preview for text-heavy elements
  const textContent = el.textContent?.trim().slice(0, 30);
  const textHint = textContent ? ` "${textContent}${(el.textContent?.trim().length || 0) > 30 ? "..." : ""}"` : "";
  return `${tag}${id || cls}${textHint}`;
}

export default function EditMode() {
  const [active, setActive] = useState(false);
  const [highlight, setHighlight] = useState<HighlightInfo | null>(null);
  const [selected, setSelected] = useState<HTMLElement | null>(null);
  const [selectedInfo, setSelectedInfo] = useState<HighlightInfo | null>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!active) return;
      const target = e.target as HTMLElement;

      // Ignore the FAB and overlay elements
      if (target.closest("[data-edit-fab]") || target.closest("[data-edit-overlay]")) {
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
    [active]
  );

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (!active) return;
      const target = e.target as HTMLElement;

      if (target.closest("[data-edit-fab]") || target.closest("[data-edit-overlay]")) return;

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
    [active]
  );

  useEffect(() => {
    if (!active) {
      setHighlight(null);
      setSelected(null);
      setSelectedInfo(null);
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selected) {
          setSelected(null);
          setSelectedInfo(null);
        } else if (active) {
          setActive(false);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active, selected]);

  // Find nearest directus-linked ancestor
  const getDirectusLink = (el: HTMLElement | null): { collection: string; id?: string } | null => {
    let current = el;
    while (current) {
      if (current.dataset.directusCollection) {
        return {
          collection: current.dataset.directusCollection,
          id: current.dataset.directusId,
        };
      }
      current = current.parentElement;
    }
    return null;
  };

  const directusLink = selected ? getDirectusLink(selected) : null;

  return (
    <>
      {/* Hover highlight */}
      {active && highlight && !selected && (
        <div
          data-edit-overlay
          style={{
            position: "absolute",
            top: highlight.top,
            left: highlight.left,
            width: highlight.width,
            height: highlight.height,
            border: "2px solid #7c3aed",
            background: "rgba(124, 58, 237, 0.06)",
            borderRadius: "4px",
            pointerEvents: "none",
            zIndex: 9998,
            transition: "all 0.05s ease",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "-26px",
              left: "0",
              background: "#7c3aed",
              color: "#fff",
              fontSize: "11px",
              fontWeight: 600,
              padding: "3px 8px",
              borderRadius: "4px",
              whiteSpace: "nowrap",
              fontFamily: "monospace",
              maxWidth: "300px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {highlight.label}
          </span>
        </div>
      )}

      {/* Selected element highlight */}
      {active && selected && selectedInfo && (
        <div
          data-edit-overlay
          style={{
            position: "absolute",
            top: selectedInfo.top,
            left: selectedInfo.left,
            width: selectedInfo.width,
            height: selectedInfo.height,
            border: "2px solid #2563eb",
            background: "rgba(37, 99, 235, 0.08)",
            borderRadius: "4px",
            pointerEvents: "none",
            zIndex: 9998,
          }}
        >
          {/* Info panel */}
          <div
            style={{
              position: "absolute",
              top: "-44px",
              left: "0",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              pointerEvents: "auto",
            }}
          >
            <span
              style={{
                background: "#2563eb",
                color: "#fff",
                fontSize: "11px",
                fontWeight: 600,
                padding: "3px 8px",
                borderRadius: "4px",
                whiteSpace: "nowrap",
                fontFamily: "monospace",
                maxWidth: "250px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {selected.tagName.toLowerCase()}
              {selected.id ? `#${selected.id}` : ""}
              {selected.className && typeof selected.className === "string"
                ? `.${selected.className.trim().split(/\s+/).slice(0, 1).join(".")}`
                : ""}
            </span>
            <span
              style={{
                background: "#f3f4f6",
                color: "#374151",
                fontSize: "11px",
                padding: "3px 8px",
                borderRadius: "4px",
                whiteSpace: "nowrap",
                fontFamily: "monospace",
              }}
            >
              {Math.round(selectedInfo.width)} x {Math.round(selectedInfo.height)}
            </span>
            {directusLink && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const url = directusLink.id
                    ? `${DIRECTUS_URL}/admin/content/${directusLink.collection}/${directusLink.id}`
                    : `${DIRECTUS_URL}/admin/content/${directusLink.collection}`;
                  window.open(url, "_blank");
                }}
                style={{
                  background: "#059669",
                  color: "#fff",
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                Edit in Directus
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const tag = selected.tagName.toLowerCase();
                const text = selected.textContent?.trim().slice(0, 80) || "";
                const elId = selected.id ? `#${selected.id}` : "";
                const cls = selected.className && typeof selected.className === "string"
                  ? `.${selected.className.trim().split(/\s+/).slice(0, 2).join(".")}`
                  : "";
                const directus = directusLink
                  ? ` (${directusLink.collection}${directusLink.id ? ` #${directusLink.id}` : ""})`
                  : "";
                window.parent.postMessage(
                  {
                    type: "edit-in-chat",
                    element: {
                      tag: `${tag}${elId}${cls}`,
                      text,
                      directus: directusLink || null,
                      dimensions: `${Math.round(selectedInfo.width)}x${Math.round(selectedInfo.height)}`,
                    },
                    prompt: `Edit the ${tag}${elId}${cls}${directus} element${text ? `: "${text.slice(0, 50)}${text.length > 50 ? "..." : ""}"` : ""}`,
                  },
                  "*"
                );
                setSelected(null);
                setSelectedInfo(null);
                setActive(false);
              }}
              style={{
                background: "#7c3aed",
                color: "#fff",
                fontSize: "11px",
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Edit in Chat
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelected(null);
                setSelectedInfo(null);
              }}
              style={{
                background: "#6b7280",
                color: "#fff",
                fontSize: "11px",
                fontWeight: 600,
                padding: "3px 8px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              x
            </button>
          </div>
        </div>
      )}

      {/* Cursor override */}
      {active && (
        <style>{`* { cursor: crosshair !important; } [data-edit-fab] { cursor: pointer !important; } [data-edit-overlay] button { cursor: pointer !important; }`}</style>
      )}

      {/* FAB */}
      <button
        data-edit-fab
        onClick={() => setActive((v) => !v)}
        title={active ? "Exit edit mode (Esc)" : "Enter edit mode"}
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          zIndex: 9999,
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          border: "none",
          background: active ? "#7c3aed" : "#111",
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: active
            ? "0 0 0 4px rgba(124,58,237,0.3), 0 4px 20px rgba(0,0,0,0.2)"
            : "0 4px 20px rgba(0,0,0,0.15)",
          transition: "all 0.2s ease",
        }}
      >
        {active ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
        )}
      </button>
    </>
  );
}
