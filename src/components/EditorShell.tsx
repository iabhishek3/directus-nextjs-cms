"use client";

import { useCallback, useEffect, useState } from "react";
import ChatPanel from "./ChatPanel";

export interface EditRequest {
  tag: string;
  text: string;
  directus: { collection: string; id?: string } | null;
  dimensions: string;
  prompt: string;
}

interface EditorShellProps {
  initialTemplate?: string;
}

export default function EditorShell({ initialTemplate = "/templates/events" }: EditorShellProps) {
  const [panelWidth, setPanelWidth] = useState(520);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [editRequest, setEditRequest] = useState<EditRequest | null>(null);
  const [iframePath, setIframePath] = useState(initialTemplate);

  // Listen for "Edit in Chat" messages from the preview iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "edit-in-chat") {
        setEditRequest({
          ...e.data.element,
          prompt: e.data.prompt,
        });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const clearEditRequest = useCallback(() => setEditRequest(null), []);

  const handleMouseDown = () => {
    setIsDragging(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newWidth = Math.max(400, Math.min(800, e.clientX));
    setPanelWidth(newWidth);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  const previewWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "#1a1a2e",
        position: "fixed" as const,
        top: 0,
        left: 0,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Left Chat Panel */}
      <div
        style={{
          width: panelWidth,
          minWidth: 400,
          maxWidth: 800,
          height: "100%",
          flexShrink: 0,
          background: "#fff",
          borderRight: "1px solid #e5e7eb",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ChatPanel
          editRequest={editRequest}
          onEditRequestHandled={clearEditRequest}
          currentTemplate={iframePath}
          onTemplateChange={(route) => {
            setIframePath(route);
            window.history.replaceState(null, "", `/edit?template=${encodeURIComponent(route)}`);
            const iframe = document.getElementById("preview-iframe") as HTMLIFrameElement;
            if (iframe) iframe.src = route;
          }}
        />
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          width: "4px",
          cursor: "col-resize",
          background: isDragging ? "#7c3aed" : "transparent",
          transition: isDragging ? "none" : "background 0.15s",
          flexShrink: 0,
          position: "relative",
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          if (!isDragging)
            (e.currentTarget as HTMLDivElement).style.background = "#d1d5db";
        }}
        onMouseLeave={(e) => {
          if (!isDragging)
            (e.currentTarget as HTMLDivElement).style.background = "transparent";
        }}
      />

      {/* Right Preview Panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "#111119",
        }}
      >
        {/* Preview toolbar */}
        <div
          style={{
            height: "48px",
            background: "#1a1a2e",
            borderBottom: "1px solid #2a2a3e",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            flexShrink: 0,
          }}
        >
          {/* Left: Refresh */}
          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <button
              onClick={() => {
                const iframe = document.getElementById("preview-iframe") as HTMLIFrameElement;
                if (iframe) iframe.src = iframe.src;
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#d1d5db",
                display: "flex",
                alignItems: "center",
                padding: "6px",
                borderRadius: "6px",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2v6h-6M3 12a9 9 0 0115.5-6.36L21 8M3 22v-6h6M21 12a9 9 0 01-15.5 6.36L3 16" />
              </svg>
            </button>
          </div>

          {/* Center: Device toggles */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "#111119",
              borderRadius: "8px",
              padding: "3px",
            }}
          >
            {(["desktop", "tablet", "mobile"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  background: viewMode === mode ? "#2a2a3e" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: viewMode === mode ? "#fff" : "#9ca3af",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "5px 8px",
                  borderRadius: "6px",
                  transition: "all 0.15s",
                }}
              >
                {mode === "desktop" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                )}
                {mode === "tablet" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <path d="M12 18h.01" />
                  </svg>
                )}
                {mode === "mobile" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <rect x="5" y="2" width="14" height="20" rx="2" />
                    <path d="M12 18h.01" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Right: Open in new tab */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <button
              onClick={() => window.open(iframePath, "_blank")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#d1d5db",
                display: "flex",
                alignItems: "center",
                padding: "6px",
                borderRadius: "6px",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Preview iframe container */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: viewMode === "desktop" ? "stretch" : "flex-start",
            padding: viewMode === "desktop" ? 0 : "24px",
            overflow: "auto",
            background: viewMode === "desktop" ? "#fff" : "#111119",
          }}
        >
          <div
            style={{
              width: previewWidths[viewMode],
              maxWidth: "100%",
              height: viewMode === "desktop" ? "100%" : "calc(100vh - 96px)",
              borderRadius: viewMode === "desktop" ? 0 : "12px",
              overflow: "hidden",
              boxShadow: viewMode === "desktop" ? "none" : "0 8px 40px rgba(0,0,0,0.4)",
              transition: "all 0.3s ease",
            }}
          >
            <iframe
              id="preview-iframe"
              src={initialTemplate}
              onLoad={(e) => {
                try {
                  const iframe = e.currentTarget;
                  const path = new URL(iframe.contentWindow?.location.href || "").pathname;
                  setIframePath(path);
                } catch {
                  // cross-origin or unavailable
                }
              }}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                background: "#fff",
                overflow: "auto",
              }}
              allow="fullscreen"
            />
          </div>
        </div>
      </div>

    </div>
  );
}
