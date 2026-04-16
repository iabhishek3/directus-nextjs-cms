import { NextRequest, NextResponse } from "next/server";
import { updateDirectusItem, readDirectusItemFields, COLLECTION_SCHEMAS } from "@/lib/directus";

interface UpdateRequest {
  collection: string;
  id: string;
  fields: Record<string, unknown>;
}

const NUMERIC_FIELDS = new Set(["capacity", "price", "max_mentees", "years_experience"]);

export async function POST(request: NextRequest) {
  try {
    const body: UpdateRequest = await request.json();

    if (!body.collection || !body.id || !body.fields) {
      return NextResponse.json(
        { success: false, error: "Missing collection, id, or fields" },
        { status: 400 }
      );
    }

    const schema = COLLECTION_SCHEMAS[body.collection];
    if (!schema) {
      return NextResponse.json(
        { success: false, error: `Unknown collection: ${body.collection}` },
        { status: 400 }
      );
    }

    // Filter to only allowed fields and coerce types
    const allowedFieldNames = new Set(schema.fields.map((f) => f.name));
    const sanitizedFields: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(body.fields)) {
      if (!allowedFieldNames.has(key)) continue;

      if (NUMERIC_FIELDS.has(key) && typeof value === "string") {
        sanitizedFields[key] = Number(value);
      } else {
        sanitizedFields[key] = value;
      }
    }

    if (Object.keys(sanitizedFields).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Read old values before updating (for undo support)
    let previousFields: Record<string, unknown> = {};
    try {
      previousFields = await readDirectusItemFields(
        body.collection,
        body.id,
        Object.keys(sanitizedFields)
      );
    } catch {
      // Best-effort — undo just won't be available
    }

    await updateDirectusItem(body.collection, body.id, sanitizedFields);

    // Clear Directus Redis cache so reads return fresh data
    try {
      const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
      const loginRes = await fetch(`${directusUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: process.env.DIRECTUS_ADMIN_EMAIL || "admin@example.com",
          password: process.env.DIRECTUS_ADMIN_PASSWORD || "admin123",
        }),
      });
      const loginData = await loginRes.json();
      const token = loginData.data?.access_token;
      if (token) {
        await fetch(`${directusUrl}/utils/cache/clear`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // Cache clear is best-effort — the update itself succeeded
    }

    return NextResponse.json({
      success: true,
      ...(Object.keys(previousFields).length > 0 ? { previousFields } : {}),
    });
  } catch (error) {
    console.error("Update API error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
