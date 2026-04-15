import { NextResponse } from "next/server";
import { getEvents } from "@/lib/directus";

export const dynamic = "force-dynamic";

export async function GET() {
  const events = await getEvents({ limit: 6 });
  return NextResponse.json(events, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
