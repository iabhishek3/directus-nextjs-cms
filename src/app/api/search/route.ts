import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

interface Event {
  id: number;
  status: string;
  title: string;
  slug: string;
  description: string | null;
  date: string;
  location: string | null;
  capacity: number;
  category: string | null;
  price: number;
}

async function fetchAllEvents(): Promise<Event[]> {
  const res = await fetch(
    `${directusUrl}/items/events?filter[status][_eq]=published&sort=date&_t=${Date.now()}`,
    { cache: "no-store" }
  );
  const json = await res.json();
  return json.data || [];
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // 1. Retrieve — fetch all events from Directus
    const events = await fetchAllEvents();

    if (events.length === 0) {
      return NextResponse.json({
        summary: "There are no events available at the moment. Please check back later or add events in Directus CMS.",
        results: [],
        totalEvents: 0,
      });
    }

    // 2. Build context for Claude
    const eventsContext = events
      .map(
        (e, i) =>
          `[Event ${i + 1}] ID:${e.id} | Title: ${e.title} | Date: ${e.date} | Location: ${e.location || "TBD"} | Category: ${e.category || "General"} | Price: $${e.price} | Capacity: ${e.capacity} | Description: ${(e.description || "").replace(/<[^>]*>/g, "").slice(0, 200)}`
      )
      .join("\n");

    // 3. Augmented Generation — Claude answers using events data
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: `You are a helpful event search assistant. You have access to a database of events. Answer the user's query based ONLY on the events provided below.

EVENTS DATABASE:
${eventsContext}

RESPONSE FORMAT — return valid JSON only, no markdown:
{
  "summary": "A helpful 1-3 sentence natural language answer to the user's query",
  "matchedEventIds": [array of event IDs that match the query, ordered by relevance],
  "reasoning": "Brief explanation of why these events match"
}

Rules:
- If no events match, return empty matchedEventIds and explain in summary.
- Be conversational and helpful in the summary.
- Consider date, location, category, price, and description when matching.
- For vague queries like "something fun" or "this weekend", use best judgment.
- Always return valid JSON.`,
      messages: [{ role: "user", content: query }],
    });

    // 4. Parse Claude's response
    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => {
        if (b.type === "text") return b.text;
        return "";
      })
      .join("");

    let parsed: { summary: string; matchedEventIds: number[]; reasoning: string };
    try {
      parsed = JSON.parse(text);
    } catch {
      // Fallback if Claude doesn't return valid JSON
      parsed = {
        summary: text,
        matchedEventIds: events.map((e) => e.id),
        reasoning: "Showing all events as fallback",
      };
    }

    // 5. Map matched IDs to full event objects, preserving Claude's ranking
    const eventMap = new Map(events.map((e) => [e.id, e]));
    const results = parsed.matchedEventIds
      .map((id) => eventMap.get(id))
      .filter(Boolean);

    return NextResponse.json({
      summary: parsed.summary,
      reasoning: parsed.reasoning,
      results,
      totalEvents: events.length,
    });
  } catch (error) {
    console.error("Search API error:", error);
    const message = error instanceof Error ? error.message : "Search failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
