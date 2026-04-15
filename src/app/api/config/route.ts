import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CONFIG_DIR = path.join(process.cwd(), "src/app/templates");

function getConfigPath(template: string): string | null {
  // Sanitize: only allow alphanumeric and hyphens
  const clean = template.replace(/[^a-zA-Z0-9-]/g, "");
  if (!clean) return null;
  const configPath = path.join(CONFIG_DIR, clean, "config.json");
  // Ensure it's still under CONFIG_DIR (prevent traversal)
  if (!configPath.startsWith(CONFIG_DIR)) return null;
  return configPath;
}

function getNestedValue(obj: Record<string, unknown>, keyPath: string): unknown {
  const keys = keyPath.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

function setNestedValue(
  obj: Record<string, unknown>,
  keyPath: string,
  value: unknown
): void {
  const keys = keyPath.split(".");
  let current: Record<string, unknown> = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] == null || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
}

// GET — return the full config for a template
export async function GET(request: NextRequest) {
  const template = request.nextUrl.searchParams.get("template") || "events";
  const configPath = getConfigPath(template);

  if (!configPath || !fs.existsSync(configPath)) {
    return NextResponse.json(
      { error: `No config found for template: ${template}` },
      { status: 404 }
    );
  }

  const raw = fs.readFileSync(configPath, "utf-8");
  return NextResponse.json(JSON.parse(raw));
}

// PATCH — update specific paths in the config
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const template: string = body.template || "events";
    const updates: { path: string; value: unknown }[] = body.updates;

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { success: false, error: "No updates provided" },
        { status: 400 }
      );
    }

    const configPath = getConfigPath(template);
    if (!configPath || !fs.existsSync(configPath)) {
      return NextResponse.json(
        { success: false, error: `No config found for template: ${template}` },
        { status: 404 }
      );
    }

    // Read current config
    const raw = fs.readFileSync(configPath, "utf-8");
    const config = JSON.parse(raw);

    // Apply updates
    const applied: { path: string; oldValue: unknown; newValue: unknown }[] = [];
    for (const update of updates) {
      if (!update.path || update.value === undefined) continue;
      const oldValue = getNestedValue(config, update.path);
      setNestedValue(config, update.path, update.value);
      applied.push({ path: update.path, oldValue, newValue: update.value });
    }

    if (applied.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid updates to apply" },
        { status: 400 }
      );
    }

    // Write back
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");

    return NextResponse.json({ success: true, applied });
  } catch (error) {
    console.error("Config API error:", error);
    const message = error instanceof Error ? error.message : "Failed to update config";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
