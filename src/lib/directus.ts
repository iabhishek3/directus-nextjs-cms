import {
  createDirectus,
  rest,
  staticToken,
  authentication,
  readItems,
  readSingleton,
  createItem,
  updateItem,
} from "@directus/sdk";

export interface Event {
  id: number;
  status: string;
  title: string;
  slug: string;
  description: string | null;
  date: string;
  location: string | null;
  image: string | null;
  capacity: number;
  category: string | null;
  price: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Registration {
  id: number;
  event: number;
  name: string;
  email: string;
}

export interface HeroSection {
  title: string;
  subtitle: string | null;
  button_text: string | null;
  button_link: string | null;
  background_image: string | null;
}

export interface DirectusSchema {
  events: Event[];
  categories: Category[];
  registrations: Registration[];
  hero_section: HeroSection;
}

const directusUrl =
  process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

export const directus = createDirectus<DirectusSchema>(directusUrl).with(
  rest({ onRequest: (options) => ({ ...options, cache: "no-store" }) })
);

export function getAuthenticatedClient() {
  const token = process.env.DIRECTUS_API_TOKEN;
  if (!token) throw new Error("DIRECTUS_API_TOKEN is not set");
  return createDirectus<DirectusSchema>(directusUrl)
    .with(staticToken(token))
    .with(rest({ onRequest: (options) => ({ ...options, cache: "no-store" }) }));
}

export async function getAdminClient() {
  const email = process.env.DIRECTUS_ADMIN_EMAIL || "admin@example.com";
  const password = process.env.DIRECTUS_ADMIN_PASSWORD || "admin123";
  const client = createDirectus<DirectusSchema>(directusUrl)
    .with(authentication())
    .with(
      rest({
        onRequest: (options) => ({
          ...options,
          cache: "no-store",
        }),
      })
    );
  await client.login({ email, password });
  return client;
}

async function directusFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${directusUrl}${path}${path.includes("?") ? "&" : "?"}_t=${Date.now()}`, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Pragma": "no-cache",
    },
  });
  const json = await res.json();
  return json.data;
}

export async function getEvents(options?: {
  limit?: number;
  category?: string;
}) {
  try {
    const params = new URLSearchParams();
    params.set("filter[status][_eq]", "published");
    if (options?.category) params.set("filter[category][_eq]", options.category);
    params.set("sort", "date");
    if (options?.limit) params.set("limit", String(options.limit));
    return await directusFetch<Event[]>(`/items/events?${params}`);
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function getCategories() {
  try {
    return await directusFetch<Category[]>("/items/categories?sort=name");
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getHeroSection() {
  try {
    return await directusFetch<HeroSection>("/items/hero_section");
  } catch (error) {
    console.error("Error fetching hero section:", error);
    return null;
  }
}

export async function createRegistration(data: {
  eventId: number;
  name: string;
  email: string;
}) {
  try {
    const client = getAuthenticatedClient();
    await client.request(
      createItem("registrations", {
        event: data.eventId,
        name: data.name,
        email: data.email,
      })
    );
    return { success: true };
  } catch (error) {
    console.error("Error creating registration:", error);
    return { success: false, error: "Failed to create registration" };
  }
}

export function getAssetUrl(assetId: string | null | undefined): string | null {
  if (!assetId) return null;
  return `${directusUrl}/assets/${assetId}`;
}

const SINGLETON_COLLECTIONS = new Set(["hero_section"]);

export async function readDirectusItemFields(
  collection: string,
  id: string | number,
  fieldNames: string[]
): Promise<Record<string, unknown>> {
  const client = await getAdminClient();
  const token = await client.getToken();
  const fieldsParam = fieldNames.join(",");
  const url = SINGLETON_COLLECTIONS.has(collection)
    ? `${directusUrl}/items/${collection}?fields=${fieldsParam}`
    : `${directusUrl}/items/${collection}/${id}?fields=${fieldsParam}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to read item");
  const json = await res.json();
  return json.data as Record<string, unknown>;
}

export async function updateDirectusItem(
  collection: string,
  id: string | number,
  data: Record<string, unknown>
) {
  if (SINGLETON_COLLECTIONS.has(collection)) {
    // Singletons don't use an ID in the URL
    const client = await getAdminClient();
    const token = await client.getToken();
    const res = await fetch(`${directusUrl}/items/${collection}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.errors?.[0]?.message || "Failed to update singleton");
    }
    return await res.json();
  }

  const client = await getAdminClient();
  return await client.request(
    updateItem(collection as keyof DirectusSchema, id, data as never)
  );
}

export const COLLECTION_SCHEMAS: Record<
  string,
  { fields: { name: string; type: string; description: string }[] }
> = {
  events: {
    fields: [
      { name: "title", type: "string", description: "Event title" },
      { name: "description", type: "string", description: "Event description (HTML)" },
      { name: "date", type: "string", description: "ISO 8601 date string" },
      { name: "location", type: "string", description: "Event location" },
      { name: "capacity", type: "number", description: "Max attendees" },
      { name: "category", type: "string", description: "Category name" },
      { name: "price", type: "number", description: "Ticket price in dollars" },
      { name: "status", type: "string", description: "published, draft, or archived" },
    ],
  },
  categories: {
    fields: [
      { name: "name", type: "string", description: "Category name" },
      { name: "slug", type: "string", description: "URL-friendly identifier" },
    ],
  },
  hero_section: {
    fields: [
      { name: "title", type: "string", description: "Hero headline" },
      { name: "subtitle", type: "string", description: "Hero subtitle text" },
      { name: "button_text", type: "string", description: "CTA button label" },
      { name: "button_link", type: "string", description: "CTA button URL" },
    ],
  },
};
