import { NextResponse } from "next/server";
import { getHeroSection } from "@/lib/directus";

export const dynamic = "force-dynamic";

export async function GET() {
  const hero = await getHeroSection();
  return NextResponse.json(hero, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
