import {
  createDirectus,
  rest,
  authentication,
  createItem,
} from "@directus/sdk";

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://localhost:8055";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const directus = createDirectus(DIRECTUS_URL)
  .with(authentication())
  .with(rest());

const events = [
  {
    status: "published",
    title: "Design Systems Summit 2026",
    slug: "design-systems-summit-2026",
    description:
      "<p>A deep dive into scalable design systems used by top product teams at companies like Airbnb, Stripe, and Figma. Learn how to build, maintain, and evolve design systems that actually ship.</p><p>Featuring keynotes from industry leaders, hands-on workshops, and networking sessions with 500+ designers and engineers.</p>",
    date: "2026-05-18T09:00:00Z",
    location: "Moscone Center, San Francisco, CA",
    capacity: 500,
    category: "Conference",
    price: 299.0,
  },
  {
    status: "published",
    title: "React Advanced London",
    slug: "react-advanced-london",
    description:
      "<p>The premier React conference in Europe returns with cutting-edge talks on Server Components, the React compiler, and performance patterns for large-scale applications.</p><p>Two days of single-track talks from core team members and community experts, plus a full day of workshops.</p>",
    date: "2026-06-05T10:00:00Z",
    location: "ExCeL London, United Kingdom",
    capacity: 800,
    category: "Conference",
    price: 449.0,
  },
  {
    status: "published",
    title: "Hands-On LLM Fine-Tuning Workshop",
    slug: "hands-on-llm-fine-tuning-workshop",
    description:
      "<p>A practical, code-along workshop where you'll fine-tune open-source LLMs on custom datasets using LoRA and QLoRA techniques. Bring your laptop and leave with a deployed model.</p><p>Covers data preparation, training strategies, evaluation metrics, and deploying to production with vLLM.</p>",
    date: "2026-05-24T09:30:00Z",
    location: "Capital Factory, Austin, TX",
    capacity: 60,
    category: "Workshop",
    price: 149.0,
  },
  {
    status: "published",
    title: "Startup Pitch Night — Series A Edition",
    slug: "startup-pitch-night-series-a",
    description:
      "<p>Watch 10 high-growth startups pitch to a panel of top-tier VCs from Sequoia, a16z, and Lightspeed. Each founder gets 8 minutes to present followed by live Q&A.</p><p>Network with 200+ founders, investors, and operators over drinks and appetizers after the pitches.</p>",
    date: "2026-05-10T18:00:00Z",
    location: "Spring Studios, New York, NY",
    capacity: 200,
    category: "Meetup",
    price: 0,
  },
  {
    status: "published",
    title: "Cloud Native Architecture Masterclass",
    slug: "cloud-native-architecture-masterclass",
    description:
      "<p>A full-day masterclass on designing resilient, cost-effective cloud infrastructure. Deep dive into Kubernetes patterns, service mesh, observability, and platform engineering.</p><p>Led by ex-Google and ex-AWS senior staff engineers with real-world case studies from Fortune 500 migrations.</p>",
    date: "2026-06-14T09:00:00Z",
    location: "Washington State Convention Center, Seattle, WA",
    capacity: 150,
    category: "Workshop",
    price: 199.0,
  },
  {
    status: "published",
    title: "Creative Coding with Generative AI",
    slug: "creative-coding-generative-ai",
    description:
      "<p>Explore the intersection of code and art. Learn to create stunning visual experiences using p5.js, shaders, and generative AI tools like Stable Diffusion and ComfyUI.</p><p>No art background required — just curiosity and a laptop. Walk away with a portfolio piece you can mint or print.</p>",
    date: "2026-06-21T11:00:00Z",
    location: "OMSI, Portland, OR",
    capacity: 40,
    category: "Workshop",
    price: 79.0,
  },
  {
    status: "published",
    title: "Women in Tech Leadership Summit",
    slug: "women-in-tech-leadership-summit",
    description:
      "<p>A two-day summit bringing together 300+ women in tech leadership roles. Panels on navigating executive paths, building inclusive teams, and driving product strategy at scale.</p><p>Includes 1:1 mentorship matching, resume reviews, and an exclusive hiring fair with partner companies.</p>",
    date: "2026-07-08T08:30:00Z",
    location: "Palmer Events Center, Austin, TX",
    capacity: 300,
    category: "Conference",
    price: 199.0,
  },
  {
    status: "published",
    title: "Building Production RAG Systems",
    slug: "building-production-rag-systems",
    description:
      "<p>Go beyond toy demos. This hands-on webinar covers chunking strategies, embedding model selection, hybrid search, reranking, and evaluation frameworks for production RAG pipelines.</p><p>Live coding session with real datasets. Recording available for registered attendees.</p>",
    date: "2026-05-30T12:00:00Z",
    location: "Online (Zoom)",
    capacity: 500,
    category: "Webinar",
    price: 0,
  },
  {
    status: "published",
    title: "DevOps Days Chicago 2026",
    slug: "devops-days-chicago-2026",
    description:
      "<p>The community-driven DevOps conference returns to Chicago. Open spaces, ignite talks, and deep-dive sessions on CI/CD, infrastructure as code, incident management, and SRE culture.</p><p>Two days of learning, sharing war stories, and connecting with 400+ practitioners from the Midwest and beyond.</p>",
    date: "2026-07-22T09:00:00Z",
    location: "Navy Pier, Chicago, IL",
    capacity: 400,
    category: "Conference",
    price: 249.0,
  },
  {
    status: "published",
    title: "TypeScript Meetup — Advanced Patterns",
    slug: "typescript-meetup-advanced-patterns",
    description:
      "<p>Monthly community meetup focused on advanced TypeScript patterns. This month: branded types, type-level programming, and building type-safe API clients with Zod and tRPC.</p><p>Two 30-minute talks followed by open discussion and pizza. All levels welcome.</p>",
    date: "2026-05-15T18:30:00Z",
    location: "Galvanize, Denver, CO",
    capacity: 80,
    category: "Meetup",
    price: 0,
  },
];

async function seed() {
  console.log("Seeding 10 events into Directus...\n");

  try {
    await directus.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    console.log("Logged in successfully\n");

    for (const event of events) {
      try {
        await directus.request(createItem("events" as never, event as never));
        console.log(`  Created: ${event.title}`);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.log(`  Skipped: ${event.title} (${message})`);
      }
    }

    console.log("\nDone! 10 events seeded.");
    console.log("View them at: http://localhost:8055/admin/content/events");
  } catch (error) {
    console.error("Failed to seed:", error);
    process.exit(1);
  }
}

seed();
