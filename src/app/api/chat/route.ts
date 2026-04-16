import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { COLLECTION_SCHEMAS } from "@/lib/directus";
import fs from "fs";
import path from "path";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL_MAP: Record<string, string> = {
  sonnet: "claude-sonnet-4-20250514",
  opus: "claude-opus-4-20250514",
};

interface ChatRequest {
  message: string;
  template?: string;
  model?: string;
  elementContext: {
    tag: string;
    text: string;
    directus: { collection: string; id?: string } | null;
    dimensions: string;
  } | null;
}

const tools: Anthropic.Tool[] = [
  {
    name: "update_directus",
    description:
      "Update a Directus CMS item with new field values. Use this when the user wants to change CMS content (events, hero section data stored in Directus).",
    input_schema: {
      type: "object" as const,
      properties: {
        collection: {
          type: "string",
          description: "Directus collection name (e.g. events, hero_section)",
        },
        id: {
          type: "string",
          description: "Item ID to update",
        },
        fields: {
          type: "object",
          description: "Key-value pairs of fields to update",
          additionalProperties: true,
        },
      },
      required: ["collection", "id", "fields"],
    },
  },
  {
    name: "update_config",
    description:
      "Update the template's config.json to change UI appearance — colors, fonts, text content, spacing, icons, labels, and all visual/style properties. Use this for ANY visual change: colors, font sizes, button text, section titles, stat values, nav links, footer text, category icons, theme colors, spacing, border radius, etc. This is the PRIMARY tool for template customization.",
    input_schema: {
      type: "object" as const,
      properties: {
        updates: {
          type: "array",
          description:
            "Array of path/value pairs to update in config.json. Path uses dot notation (e.g. 'nav.brand.text', 'themes.light.pageBg', 'stats.items.0.value').",
          items: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description:
                  "Dot-notation path in config.json (e.g. 'hero.defaults.title', 'themes.dark.primaryBtnBg', 'cta.title')",
              },
              value: {
                description: "New value — string, number, boolean, or object",
              },
            },
            required: ["path", "value"],
          },
        },
      },
      required: ["updates"],
    },
  },
];

function loadTemplateConfig(template: string): Record<string, unknown> | null {
  const clean = template.replace(/[^a-zA-Z0-9-]/g, "");
  const configPath = path.join(
    process.cwd(),
    "src/app/templates",
    clean,
    "config.json"
  );
  if (!fs.existsSync(configPath)) return null;
  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

function summarizeConfigPaths(
  obj: unknown,
  prefix = ""
): string[] {
  const lines: string[] = [];
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
      const p = prefix ? `${prefix}.${key}` : key;
      if (val && typeof val === "object" && !Array.isArray(val)) {
        lines.push(...summarizeConfigPaths(val, p));
      } else if (Array.isArray(val)) {
        lines.push(`${p}: [array with ${val.length} items]`);
        // Show first item structure
        if (val.length > 0 && typeof val[0] === "object") {
          for (const k of Object.keys(val[0] as Record<string, unknown>)) {
            lines.push(`  ${p}.0.${k}: ${JSON.stringify((val[0] as Record<string, unknown>)[k])}`);
          }
        }
      } else {
        lines.push(`${p}: ${JSON.stringify(val)}`);
      }
    }
  }
  return lines;
}

function buildSystemPrompt(
  elementContext: ChatRequest["elementContext"],
  templateConfig: Record<string, unknown> | null,
  templateName: string
): string {
  let prompt = `You are a visual design assistant for the "${templateName}" template in Agentic CMS.
You can make TWO types of changes:

1. **Template config (update_config)** — Change any visual/style property: colors, fonts, text, spacing, icons, labels, stats, nav, footer, etc. This is your PRIMARY tool. The entire template UI is driven by config.json.
2. **Directus CMS (update_directus)** — Change actual CMS content: event titles/descriptions, hero section content stored in the database.

IMPORTANT: Prefer update_config for visual/UI changes. Use update_directus only for CMS data changes.
`;

  if (templateConfig) {
    const paths = summarizeConfigPaths(templateConfig);
    prompt += `\n## Current config.json for "${templateName}" template\nAll paths below can be updated via update_config tool:\n\`\`\`\n${paths.join("\n")}\n\`\`\`\n`;
  }

  prompt += `\n## Directus CMS collections\n`;
  for (const [name, schema] of Object.entries(COLLECTION_SCHEMAS)) {
    prompt += `\n**${name}**:\n`;
    for (const field of schema.fields) {
      prompt += `  - ${field.name} (${field.type}): ${field.description}\n`;
    }
  }

  if (elementContext?.directus) {
    const { collection, id } = elementContext.directus;
    prompt += `\nThe user has selected an element linked to Directus collection "${collection}"${id ? ` with ID ${id}` : ""}.`;
    if (elementContext.text) {
      prompt += `\nCurrent text: "${elementContext.text.slice(0, 200)}"`;
    }
    prompt += `\nFor CMS data changes, use update_directus with collection="${collection}"${id ? ` and id="${id}"` : ""}.`;
    prompt += `\nFor style/visual changes to this element, use update_config with the appropriate path.`;
  } else if (elementContext) {
    prompt += `\nThe user has selected a UI element: <${elementContext.tag}> "${elementContext.text?.slice(0, 100)}" (${elementContext.dimensions}).`;
    prompt += `\nThis element is styled via config.json. Use update_config to change its appearance or content.`;
  }

  prompt += `\n\nRules:
- Always use a tool when the user asks to change something. Never just describe the change.
- Only update what the user explicitly asks to change.
- For color changes, use hex colors (e.g. #7c3aed) or rgba().
- Be concise in your text responses.
- You can make multiple updates in a single update_config call by passing multiple items in the updates array.
- **Section visibility**: The config has a "sections" object with visible flags (e.g. sections.events.visible, sections.stats.visible). To show/hide a section, set its visible flag to true/false. When a user asks to "add" a section, set its visible to true. When they ask to "remove" or "hide" a section, set it to false.`;

  return prompt;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();

    if (!body.message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // Determine template
    const templateSlug = body.template || "events";
    const templateConfig = loadTemplateConfig(templateSlug);

    const systemPrompt = buildSystemPrompt(
      body.elementContext,
      templateConfig,
      templateSlug
    );

    const modelId = MODEL_MAP[body.model || "sonnet"] || MODEL_MAP.sonnet;

    const response = await anthropic.messages.create({
      model: modelId,
      max_tokens: 1024,
      system: systemPrompt,
      tools,
      messages: [{ role: "user", content: body.message }],
    });

    let textMessage = "";
    let action: {
      collection: string;
      id: string;
      fields: Record<string, unknown>;
    } | null = null;
    let configAction: {
      template: string;
      updates: { path: string; value: unknown }[];
    } | null = null;

    for (const block of response.content) {
      if (block.type === "text") {
        textMessage += block.text;
      } else if (block.type === "tool_use") {
        if (block.name === "update_directus") {
          const input = block.input as {
            collection: string;
            id: string;
            fields: Record<string, unknown>;
          };
          action = {
            collection: input.collection,
            id: input.id,
            fields: input.fields,
          };
        } else if (block.name === "update_config") {
          const input = block.input as {
            updates: { path: string; value: unknown }[];
          };
          configAction = {
            template: templateSlug,
            updates: input.updates,
          };
        }
      }
    }

    if (!textMessage) {
      if (configAction) {
        const paths = configAction.updates.map((u) => u.path).join(", ");
        textMessage = `Updating template config: ${paths}`;
      } else if (action) {
        textMessage = `Updating ${action.collection} #${action.id}...`;
      }
    }

    return NextResponse.json({ message: textMessage, action, configAction });
  } catch (error) {
    console.error("Chat API error:", error);

    let errorMessage = "Failed to process request";
    if (error instanceof Anthropic.APIError) {
      if (error.status === 400 && error.message.includes("credit balance")) {
        errorMessage =
          "Anthropic API credits exhausted. Please add credits at console.anthropic.com.";
      } else if (error.status === 401) {
        errorMessage =
          "Invalid Anthropic API key. Check ANTHROPIC_API_KEY in .env.local.";
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
