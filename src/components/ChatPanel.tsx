"use client";

import { useState, useRef, useEffect } from "react";
import type { EditRequest } from "./EditorShell";

interface UndoInfo {
  directus?: {
    collection: string;
    id: string;
    previousFields: Record<string, unknown>;
  };
  config?: {
    template: string;
    updates: { path: string; value: unknown }[];
  };
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  reasoning?: string;
  timestamp: Date;
  undoInfo?: UndoInfo;
}

const TEMPLATE_MESSAGES: Record<string, Message[]> = {
  events: [
    {
      id: "1",
      role: "user",
      content: "Create an event management platform with a modern UI that fetches data from Directus CMS.",
      timestamp: new Date(Date.now() - 60000 * 5),
    },
    {
      id: "2",
      role: "assistant",
      content:
        "I've set up the Events Platform with:\n\n1. **Hero section** with animated title and CTA buttons\n2. **Stats bar** showing key metrics\n3. **CTA section** with call-to-action\n4. **Dark/light theme** toggle\n\nThe event listings section is ready but hidden. Ask me to **add the events list** when you're ready, or tell me to add/remove any section.\n\nYou can also customize colors, fonts, text, and styles — just ask!",
      reasoning:
        "Created a Next.js app with Directus SDK integration. The entire UI is driven by config.json with section visibility flags, so the agent can show/hide sections and update styles without touching code.",
      timestamp: new Date(Date.now() - 60000 * 4),
    },
  ],
  article: [
    {
      id: "1",
      role: "user",
      content: "Create a clean article template with rich typography and a table of contents sidebar.",
      timestamp: new Date(Date.now() - 60000 * 5),
    },
    {
      id: "2",
      role: "assistant",
      content:
        "I've built the Article template with:\n\n1. **Rich typography** — Georgia serif font with comfortable reading width\n2. **Sticky TOC sidebar** — jump to any section\n3. **Author card** — avatar, name, and role\n4. **Code blocks & blockquotes** — styled for technical content\n5. **Related articles** — sidebar recommendations",
      reasoning:
        "Designed a long-form reading experience with a 720px content column, sticky sidebar navigation, and dark/light theme support.",
      timestamp: new Date(Date.now() - 60000 * 4),
    },
  ],
  search: [
    {
      id: "1",
      role: "user",
      content: "Build a RAG-powered natural language search over the events collection.",
      timestamp: new Date(Date.now() - 60000 * 5),
    },
    {
      id: "2",
      role: "assistant",
      content:
        "I've built the AI Event Search with:\n\n1. **RAG search** — fetches all events from Directus, sends to Claude as context\n2. **Natural language queries** — ask things like \"free events this weekend\" or \"tech workshops\"\n3. **AI summary** — Claude explains why events matched your query\n4. **Ranked results** — events ordered by relevance with category tags\n5. **Suggestion chips** — quick search ideas to get started",
      reasoning:
        "Implemented retrieval-augmented generation: fetch events from Directus → build context → Claude ranks and summarizes matches. Current date is injected so time-based queries work correctly.",
      timestamp: new Date(Date.now() - 60000 * 4),
    },
  ],
};

function getInitialMessages(templateId: string): Message[] {
  return TEMPLATE_MESSAGES[templateId] || TEMPLATE_MESSAGES.events;
}

export interface TemplateOption {
  id: string;
  name: string;
  route: string;
}

export const TEMPLATES: TemplateOption[] = [
  { id: "events", name: "Events Platform", route: "/templates/events" },
  { id: "article", name: "Article", route: "/templates/article" },
  { id: "search", name: "AI Event Search", route: "/templates/search" },
];

interface ChatPanelProps {
  editRequest: EditRequest | null;
  onEditRequestHandled: () => void;
  currentTemplate: string;
  onTemplateChange: (route: string) => void;
}

export default function ChatPanel({ editRequest, onEditRequestHandled, currentTemplate, onTemplateChange }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(getInitialMessages(TEMPLATES.find((t) => t.route === currentTemplate)?.id || "events"));
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [expandedReasoning, setExpandedReasoning] = useState<Set<string>>(new Set());
  const [elementContext, setElementContext] = useState<EditRequest | null>(null);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [undoneMessages, setUndoneMessages] = useState<Set<string>>(new Set());
  const [undoingMessage, setUndoingMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeTemplate = TEMPLATES.find((t) => t.route === currentTemplate) || TEMPLATES[0];

  // Reset messages when template changes
  useEffect(() => {
    setMessages(getInitialMessages(activeTemplate.id));
    setElementContext(null);
  }, [activeTemplate.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle incoming edit request from preview iframe
  useEffect(() => {
    if (editRequest) {
      setElementContext(editRequest);
      setInput(`Edit this ${editRequest.tag}: `);
      onEditRequestHandled();
      // Focus the textarea
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [editRequest, onEditRequestHandled]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const toggleReasoning = (id: string) => {
    setExpandedReasoning((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleUndo = async (msgId: string, undoInfo: UndoInfo) => {
    setUndoingMessage(msgId);
    try {
      let success = true;

      // Revert Directus CMS change
      if (undoInfo.directus) {
        const res = await fetch("/api/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            collection: undoInfo.directus.collection,
            id: undoInfo.directus.id,
            fields: undoInfo.directus.previousFields,
          }),
        });
        const data = await res.json();
        if (!data.success) success = false;
      }

      // Revert config change
      if (undoInfo.config) {
        const res = await fetch("/api/config", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            template: undoInfo.config.template,
            updates: undoInfo.config.updates,
          }),
        });
        const data = await res.json();
        if (!data.success) success = false;
      }

      if (success) {
        setUndoneMessages((prev) => new Set(prev).add(msgId));
        // Refresh preview
        setTimeout(() => {
          const iframe = document.getElementById("preview-iframe") as HTMLIFrameElement;
          if (iframe) {
            const url = new URL(currentTemplate, window.location.origin);
            url.searchParams.set("_t", Date.now().toString());
            iframe.src = url.toString();
          }
        }, 500);
      } else {
        // Show failure as a new assistant message
        const errMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "**Undo failed.** The previous state could not be restored. Please try the change again manually.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errMsg]);
      }
    } catch {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "**Undo failed.** Something went wrong while reverting the change.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setUndoingMessage(null);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    // Capture context before clearing
    const ctx = elementContext;

    const contextPrefix = ctx
      ? `[Selected: ${ctx.tag} (${ctx.dimensions})${ctx.text ? ` — "${ctx.text.slice(0, 40)}"` : ""}]\n`
      : "";

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: contextPrefix + input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const userInput = input.trim();
    setInput("");
    setElementContext(null);
    setIsThinking(true);

    try {
      // Derive template slug from currentTemplate route (e.g. "/templates/events" → "events")
      const templateSlug = currentTemplate.replace(/^\/templates\//, "").replace(/\/$/, "") || "events";

      // 1. Call Claude API
      const chatRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userInput,
          template: templateSlug,
          elementContext: ctx
            ? {
                tag: ctx.tag,
                text: ctx.text,
                directus: ctx.directus,
                dimensions: ctx.dimensions,
              }
            : null,
        }),
      });
      const chatData = await chatRes.json();

      if (!chatRes.ok) {
        throw new Error(chatData.error || "Failed to get AI response");
      }

      // 2. Execute actions
      let directusSuccess = false;
      let configSuccess = false;
      const undoInfo: UndoInfo = {};

      // 2a. Directus CMS update
      if (chatData.action) {
        const updateRes = await fetch("/api/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(chatData.action),
        });
        const updateData = await updateRes.json();
        directusSuccess = updateData.success;
        if (directusSuccess && updateData.previousFields) {
          undoInfo.directus = {
            collection: chatData.action.collection,
            id: chatData.action.id,
            previousFields: updateData.previousFields,
          };
        }
      }

      // 2b. Config JSON update
      if (chatData.configAction) {
        const configRes = await fetch("/api/config", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(chatData.configAction),
        });
        const configData = await configRes.json();
        configSuccess = configData.success;
        if (configSuccess && configData.applied) {
          undoInfo.config = {
            template: chatData.configAction.template || "events",
            updates: configData.applied.map((a: { path: string; oldValue: unknown }) => ({
              path: a.path,
              value: a.oldValue,
            })),
          };
        }
      }

      // 3. Build assistant message
      let content = chatData.message || "";
      if (chatData.action) {
        content += directusSuccess
          ? "\n\n**CMS updated successfully.** The preview will refresh."
          : "\n\n**CMS update failed.** Please check your Directus API token and try again.";
      }
      if (chatData.configAction) {
        content += configSuccess
          ? "\n\n**Template config updated.** The preview will refresh."
          : "\n\n**Config update failed.** Check the server logs for details.";
      }

      // Build reasoning from whichever action was taken
      let reasoning: string | undefined;
      if (chatData.configAction) {
        reasoning = `Config updates:\n${chatData.configAction.updates
          .map((u: { path: string; value: unknown }) => `  ${u.path} → ${JSON.stringify(u.value)}`)
          .join("\n")}`;
      } else if (chatData.action) {
        reasoning = `Updating ${chatData.action.collection} #${chatData.action.id}: ${JSON.stringify(chatData.action.fields, null, 2)}`;
      }

      const hasUndo = undoInfo.directus || undoInfo.config;
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content,
        reasoning,
        timestamp: new Date(),
        ...(hasUndo ? { undoInfo } : {}),
      };
      setMessages((prev) => [...prev, aiMsg]);

      // 4. Refresh preview iframe if any update succeeded
      if (directusSuccess || configSuccess) {
        setTimeout(() => {
          const iframe = document.getElementById(
            "preview-iframe"
          ) as HTMLIFrameElement;
          if (iframe) {
            const url = new URL(currentTemplate, window.location.origin);
            url.searchParams.set("_t", Date.now().toString());
            iframe.src = url.toString();
          }
        }, 500);
      }
    } catch (err) {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Sorry, something went wrong: ${err instanceof Error ? err.message : "Unknown error"}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#fff",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        {/* App name */}
        <a href="/templates"><img src="/logo.jpg" alt="Temus" style={{ height: 40, objectFit: "contain", cursor: "pointer" }} /></a>

        {/* Template switcher */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 500,
              color: "#374151",
              transition: "all 0.15s",
            }}
          >
            {activeTemplate.name}
            <svg
              width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth={2.5}
              style={{ transform: showTemplateDropdown ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          {showTemplateDropdown && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
                minWidth: 200,
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                zIndex: 100,
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "8px 12px", fontSize: "11px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Templates
              </div>
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    onTemplateChange(tmpl.route);
                    setShowTemplateDropdown(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "10px 12px",
                    border: "none",
                    background: tmpl.route === currentTemplate ? "#f3f0ff" : "transparent",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: tmpl.route === currentTemplate ? 600 : 400,
                    color: tmpl.route === currentTemplate ? "#7c3aed" : "#374151",
                    textAlign: "left",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (tmpl.route !== currentTemplate) e.currentTarget.style.background = "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    if (tmpl.route !== currentTemplate) e.currentTarget.style.background = "transparent";
                  }}
                >
                  {tmpl.name}
                  {tmpl.route === currentTemplate && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </button>
              ))}
              <div style={{ borderTop: "1px solid #e5e7eb", padding: "8px 12px" }}>
                <a
                  href="/templates"
                  target="_blank"
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    fontSize: "12px", color: "#7c3aed", textDecoration: "none", fontWeight: 500,
                  }}
                >
                  Browse all templates
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === "user" ? (
              /* User message */
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div
                  style={{
                    maxWidth: "85%",
                    background: "#f3f4f6",
                    borderRadius: "16px 16px 4px 16px",
                    padding: "12px 16px",
                    fontSize: "13px",
                    lineHeight: 1.6,
                    color: "#111",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ) : (
              /* Assistant message */
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {/* Reasoning toggle */}
                {msg.reasoning && (
                  <div>
                    <button
                      onClick={() => toggleReasoning(msg.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#374151",
                        padding: 0,
                      }}
                    >
                      Reasoning
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        style={{
                          transform: expandedReasoning.has(msg.id) ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                        }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {expandedReasoning.has(msg.id) && (
                      <div
                        style={{
                          marginTop: "8px",
                          paddingLeft: "14px",
                          borderLeft: "2px solid #e5e7eb",
                          fontSize: "13px",
                          lineHeight: 1.7,
                          color: "#6b7280",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {msg.reasoning}
                      </div>
                    )}
                  </div>
                )}

                {/* Content */}
                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: 1.7,
                    color: "#374151",
                    whiteSpace: "pre-wrap",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: msg.content
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\n/g, "<br/>"),
                  }}
                />

                {/* Undo button */}
                {msg.undoInfo && !undoneMessages.has(msg.id) && (
                  <button
                    onClick={() => handleUndo(msg.id, msg.undoInfo!)}
                    disabled={undoingMessage === msg.id}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      alignSelf: "flex-start",
                      marginTop: "4px",
                      padding: "5px 12px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      background: "#fff",
                      cursor: undoingMessage === msg.id ? "default" : "pointer",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#6b7280",
                      transition: "all 0.15s",
                      opacity: undoingMessage === msg.id ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (undoingMessage !== msg.id) {
                        e.currentTarget.style.background = "#f9fafb";
                        e.currentTarget.style.borderColor = "#d1d5db";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.borderColor = "#e5e7eb";
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7v6h6" />
                      <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6.69 3L3 13" />
                    </svg>
                    {undoingMessage === msg.id ? "Undoing..." : "Undo"}
                  </button>
                )}
                {msg.undoInfo && undoneMessages.has(msg.id) && (
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    marginTop: "4px",
                    fontSize: "12px",
                    color: "#9ca3af",
                    fontStyle: "italic",
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Change reverted
                  </span>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Thinking indicator */}
        {isThinking && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ display: "flex", gap: "4px" }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#9ca3af",
                    animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>Thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid #e5e7eb",
          flexShrink: 0,
        }}
      >
        {/* Element context badge */}
        {elementContext && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
              padding: "8px 12px",
              background: "#f3f0ff",
              border: "1px solid #e0d4ff",
              borderRadius: "10px",
              fontSize: "12px",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span style={{ color: "#7c3aed", fontWeight: 600 }}>{elementContext.tag}</span>
            <span style={{ color: "#6b7280" }}>{elementContext.dimensions}</span>
            {elementContext.text && (
              <span style={{ color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "150px" }}>
                &ldquo;{elementContext.text.slice(0, 30)}{elementContext.text.length > 30 ? "..." : ""}&rdquo;
              </span>
            )}
            <button
              onClick={() => setElementContext(null)}
              style={{
                marginLeft: "auto",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9ca3af",
                display: "flex",
                padding: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "8px",
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "10px 12px 10px 16px",
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe changes to your app..."
            rows={3}
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              outline: "none",
              resize: "none",
              fontSize: "14px",
              lineHeight: 1.6,
              color: "#111",
              fontFamily: "inherit",
              minHeight: "72px",
              maxHeight: "200px",
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "none",
              background: input.trim() && !isThinking ? "#7c3aed" : "#e5e7eb",
              color: input.trim() && !isThinking ? "#fff" : "#9ca3af",
              cursor: input.trim() && !isThinking ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.15s",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "10px",
            padding: "0 4px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Attach */}
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", padding: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
            {/* Image */}
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", padding: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </button>
            {/* Sparkle */}
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", padding: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
              </svg>
            </button>
          </div>
          <div style={{ fontSize: "11px", color: "#b0b0b0", display: "flex", alignItems: "center", gap: "4px" }}>
            Claude Sonnet
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
