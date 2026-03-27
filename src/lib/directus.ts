import {
  createDirectus,
  rest,
  staticToken,
  readItems,
  readItem,
  createItem,
  aggregate,
  readSingleton,
} from "@directus/sdk";

// Types for Directus collections
export interface Event {
  id: number;
  status: "draft" | "published" | "archived";
  title: string;
  slug: string;
  description: string | null;
  date: string;
  location: string | null;
  image: string | null;
  capacity: number;
  category: string | null;
  price: number;
  date_created: string;
  date_updated: string;
}

export interface Registration {
  id: number;
  event: number | Event;
  name: string;
  email: string;
  date_created: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface HeroSection {
  id: number;
  title: string;
  subtitle: string | null;
  button_text: string | null;
  button_link: string | null;
  background_image: string | null;
}

export interface Mentor {
  id: number;
  status: "draft" | "published" | "archived";
  name: string;
  slug: string;
  title: string | null;
  bio: string | null;
  expertise: string[] | null;
  image: string | null;
  linkedin: string | null;
  twitter: string | null;
  availability: "available" | "limited" | "unavailable";
  max_mentees: number;
  years_experience: number | null;
  date_created: string;
  date_updated: string;
}

export interface MentorRegistration {
  id: number;
  mentor: number | Mentor;
  name: string;
  email: string;
  message: string | null;
  status: "pending" | "accepted" | "declined";
  date_created: string;
}

export interface DirectusSchema {
  events: Event[];
  registrations: Registration[];
  categories: Category[];
  hero_section: HeroSection;
  mentors: Mentor[];
  mentor_registrations: MentorRegistration[];
}

const directusUrl =
  process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

// Public client - for reading published events (no auth needed)
export const directus = createDirectus<DirectusSchema>(directusUrl).with(
  rest()
);

// Authenticated client - for creating registrations (server-side only)
// This should only be used in API routes, not in client components
export function getAuthenticatedClient() {
  const token = process.env.DIRECTUS_API_TOKEN;
  if (!token) {
    throw new Error("DIRECTUS_API_TOKEN is not set");
  }
  return createDirectus<DirectusSchema>(directusUrl)
    .with(staticToken(token))
    .with(rest());
}

// ============ Event Functions ============

export async function getEvents(options?: {
  limit?: number;
  category?: string;
}) {
  try {
    const filter: Record<string, unknown> = {
      status: { _eq: "published" },
    };

    if (options?.category) {
      filter.category = { _eq: options.category };
    }

    const events = await directus.request(
      readItems("events", {
        filter,
        sort: ["date"],
        limit: options?.limit || -1,
      })
    );
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function getUpcomingEvents(limit: number = 6) {
  try {
    const now = new Date().toISOString();
    const events = await directus.request(
      readItems("events", {
        filter: {
          status: { _eq: "published" },
          date: { _gte: now },
        } as Record<string, unknown>,
        sort: ["date"],
        limit,
      })
    );
    return events;
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
}

export async function getEventBySlug(slug: string) {
  try {
    console.log("Fetching event with slug:", slug);
    const events = await directus.request(
      readItems("events", {
        filter: {
          slug: { _eq: slug },
          status: { _eq: "published" },
        },
        limit: 1,
      })
    );
    console.log("Events found:", events);
    return events[0] || null;
  } catch (error) {
    console.error("Error fetching event by slug:", error);
    return null;
  }
}

export async function getEventById(id: number) {
  try {
    const event = await directus.request(readItem("events", id));
    return event;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

// ============ Category Functions ============

export async function getCategories() {
  try {
    const categories = await directus.request(readItems("categories"));
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// ============ Hero Section Functions ============

export async function getHeroSection(): Promise<HeroSection | null> {
  try {
    const hero = await directus.request(readSingleton("hero_section"));
    return hero;
  } catch (error) {
    console.error("Error fetching hero section:", error);
    return null;
  }
}

// ============ Registration Functions ============

export async function getRegistrationCount(eventId: number): Promise<number> {
  try {
    // Use authenticated client to count registrations
    const client = getAuthenticatedClient();
    const result = await client.request(
      aggregate("registrations", {
        aggregate: { count: "*" },
        query: {
          filter: {
            event: { _eq: eventId },
          },
        },
      })
    );
    return Number(result[0]?.count) || 0;
  } catch (error) {
    console.error("Error counting registrations:", error);
    return 0;
  }
}

export async function checkExistingRegistration(
  eventId: number,
  email: string
): Promise<boolean> {
  try {
    const client = getAuthenticatedClient();
    const registrations = await client.request(
      readItems("registrations", {
        filter: {
          event: { _eq: eventId },
          email: { _eq: email },
        },
        limit: 1,
      })
    );
    return registrations.length > 0;
  } catch (error) {
    console.error("Error checking registration:", error);
    return false;
  }
}

export async function createRegistration(data: {
  eventId: number;
  name: string;
  email: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const client = getAuthenticatedClient();

    // Check if already registered
    const alreadyRegistered = await checkExistingRegistration(
      data.eventId,
      data.email
    );
    if (alreadyRegistered) {
      return {
        success: false,
        error: "You are already registered for this event",
      };
    }

    // Check capacity
    const event = await getEventById(data.eventId);
    if (!event) {
      return { success: false, error: "Event not found" };
    }

    if (event.capacity > 0) {
      const currentCount = await getRegistrationCount(data.eventId);
      if (currentCount >= event.capacity) {
        return { success: false, error: "Event is at full capacity" };
      }
    }

    // Create registration
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
    return { success: false, error: "Failed to register. Please try again." };
  }
}

// ============ Asset Helper ============

export function getAssetUrl(assetId: string | null | undefined): string | null {
  if (!assetId) return null;
  return `${directusUrl}/assets/${assetId}`;
}

// ============ Date Formatting ============

export function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ============ Mentor Functions ============

export async function getMentors(options?: {
  limit?: number;
  availability?: "available" | "limited" | "unavailable";
}) {
  try {
    const filter: Record<string, unknown> = {
      status: { _eq: "published" },
    };

    if (options?.availability) {
      filter.availability = { _eq: options.availability };
    }

    const mentors = await directus.request(
      readItems("mentors", {
        filter,
        sort: ["name"],
        limit: options?.limit || -1,
      })
    );
    return mentors;
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return [];
  }
}

export async function getMentorBySlug(slug: string) {
  try {
    const mentors = await directus.request(
      readItems("mentors", {
        filter: {
          slug: { _eq: slug },
          status: { _eq: "published" },
        },
        limit: 1,
      })
    );
    return mentors[0] || null;
  } catch (error) {
    console.error("Error fetching mentor by slug:", error);
    return null;
  }
}

export async function getMentorById(id: number) {
  try {
    const mentor = await directus.request(readItem("mentors", id));
    return mentor;
  } catch (error) {
    console.error("Error fetching mentor:", error);
    return null;
  }
}

// ============ Mentor Registration Functions ============

export async function getMentorRegistrationCount(
  mentorId: number
): Promise<number> {
  try {
    const client = getAuthenticatedClient();
    const result = await client.request(
      aggregate("mentor_registrations", {
        aggregate: { count: "*" },
        query: {
          filter: {
            mentor: { _eq: mentorId },
            status: { _in: ["pending", "accepted"] },
          },
        },
      })
    );
    return Number(result[0]?.count) || 0;
  } catch (error) {
    console.error("Error counting mentor registrations:", error);
    return 0;
  }
}

export async function checkExistingMentorRegistration(
  mentorId: number,
  email: string
): Promise<boolean> {
  try {
    const client = getAuthenticatedClient();
    const registrations = await client.request(
      readItems("mentor_registrations", {
        filter: {
          mentor: { _eq: mentorId },
          email: { _eq: email },
        },
        limit: 1,
      })
    );
    return registrations.length > 0;
  } catch (error) {
    console.error("Error checking mentor registration:", error);
    return false;
  }
}

export async function createMentorRegistration(data: {
  mentorId: number;
  name: string;
  email: string;
  message?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const client = getAuthenticatedClient();

    // Check if already registered
    const alreadyRegistered = await checkExistingMentorRegistration(
      data.mentorId,
      data.email
    );
    if (alreadyRegistered) {
      return {
        success: false,
        error: "You already have a pending or active registration with this mentor",
      };
    }

    // Check mentor availability and capacity
    const mentor = await getMentorById(data.mentorId);
    if (!mentor) {
      return { success: false, error: "Mentor not found" };
    }

    if (mentor.availability === "unavailable") {
      return { success: false, error: "This mentor is not currently available" };
    }

    if (mentor.max_mentees > 0) {
      const currentCount = await getMentorRegistrationCount(data.mentorId);
      if (currentCount >= mentor.max_mentees) {
        return {
          success: false,
          error: "This mentor has reached their maximum capacity",
        };
      }
    }

    // Create mentor registration
    await client.request(
      createItem("mentor_registrations", {
        mentor: data.mentorId,
        name: data.name,
        email: data.email,
        message: data.message || null,
      })
    );

    return { success: true };
  } catch (error) {
    console.error("Error creating mentor registration:", error);
    return {
      success: false,
      error: "Failed to register with mentor. Please try again.",
    };
  }
}
