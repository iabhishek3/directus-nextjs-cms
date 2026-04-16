import {
  createDirectus,
  rest,
  authentication,
  createItem,
} from "@directus/sdk";

const DIRECTUS_URL = process.env.DIRECTUS_URL || "http://optical.temus.cloud";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const directus = createDirectus(DIRECTUS_URL)
  .with(authentication())
  .with(rest());

const events = [
  // ── CONFERENCES ──────────────────────────────────────────
  {
    status: "published",
    title: "Global DevOps Conference 2026",
    slug: "global-devops-conference-2026",
    description:
      "<p>Join 2,000+ DevOps professionals for two days of talks on CI/CD, infrastructure-as-code, observability, and platform engineering. Featuring keynotes from industry leaders at Google, Netflix, and Spotify.</p>",
    date: "2026-05-25T09:00:00.000Z",
    location: "Marina Bay Sands, Singapore",
    capacity: 2000,
    category: "conference",
    price: 299,
  },
  {
    status: "published",
    title: "Women in Tech Asia Summit",
    slug: "women-in-tech-asia-summit",
    description:
      "<p>Celebrating and empowering women in technology across Asia-Pacific. Panel discussions, mentorship sessions, and networking opportunities with leaders from top tech companies.</p>",
    date: "2026-06-08T09:00:00.000Z",
    location: "Suntec Convention Centre, Singapore",
    capacity: 1500,
    category: "conference",
    price: 149,
  },
  {
    status: "published",
    title: "Cybersecurity World Congress",
    slug: "cybersecurity-world-congress",
    description:
      "<p>Explore the latest in threat intelligence, zero-trust architecture, and incident response. Hands-on labs for ethical hacking and penetration testing included.</p>",
    date: "2026-07-12T08:30:00.000Z",
    location: "Raffles City Convention Centre, Singapore",
    capacity: 1200,
    category: "conference",
    price: 399,
  },
  {
    status: "published",
    title: "Data Engineering Summit SEA",
    slug: "data-engineering-summit-sea",
    description:
      "<p>Deep-dive into modern data stacks, real-time processing, lakehouse architectures, and data governance. Learn from practitioners building petabyte-scale systems.</p>",
    date: "2026-08-15T09:00:00.000Z",
    location: "One Farrer Hotel, Singapore",
    capacity: 800,
    category: "conference",
    price: 249,
  },
  {
    status: "published",
    title: "Product Management Forum 2026",
    slug: "product-management-forum-2026",
    description:
      "<p>A day of insights on product strategy, user research, growth experimentation, and cross-functional leadership. Speakers from Grab, Shopee, and Stripe share real case studies.</p>",
    date: "2026-09-05T09:00:00.000Z",
    location: "Grand Hyatt, Singapore",
    capacity: 600,
    category: "conference",
    price: 199,
  },
  {
    status: "published",
    title: "FinTech Innovation Conference",
    slug: "fintech-innovation-conference",
    description:
      "<p>The intersection of finance and technology. Topics include embedded finance, digital banking, DeFi, regulatory technology, and AI-driven risk management.</p>",
    date: "2026-10-20T09:00:00.000Z",
    location: "Shangri-La Hotel, Singapore",
    capacity: 1000,
    category: "conference",
    price: 349,
  },
  {
    status: "published",
    title: "Blockchain & Web3 Developer Conference",
    slug: "blockchain-web3-developer-conference",
    description:
      "<p>Smart contract development, DeFi protocols, NFT marketplaces, and Layer 2 scaling solutions. Ethereum, Solana, and Polygon tracks available.</p>",
    date: "2026-10-10T09:00:00.000Z",
    location: "Resorts World Convention Centre, Singapore",
    capacity: 1500,
    category: "conference",
    price: 279,
  },
  {
    status: "published",
    title: "Annual Singapore Tech Leaders Summit",
    slug: "annual-singapore-tech-leaders-summit",
    description:
      "<p>CTO and VP Engineering perspectives on scaling engineering organizations, technical strategy, and building high-performing teams. Invite-only event with open application.</p>",
    date: "2026-11-28T09:00:00.000Z",
    location: "Capella Singapore, Sentosa Island",
    capacity: 200,
    category: "conference",
    price: 499,
  },

  // ── WORKSHOPS ────────────────────────────────────────────
  {
    status: "published",
    title: "Kubernetes Masterclass: From Zero to Production",
    slug: "kubernetes-masterclass-zero-to-production",
    description:
      "<p>A full-day hands-on workshop covering Kubernetes fundamentals, Helm charts, service mesh, monitoring with Prometheus & Grafana, and production-grade deployment strategies.</p>",
    date: "2026-05-03T09:00:00.000Z",
    location: "WeWork Funan, Singapore",
    capacity: 40,
    category: "workshop",
    price: 199,
  },
  {
    status: "published",
    title: "Advanced TypeScript Patterns Workshop",
    slug: "advanced-typescript-patterns-workshop",
    description:
      "<p>Master generics, conditional types, template literal types, and advanced inference patterns. Build a type-safe API client from scratch during the session.</p>",
    date: "2026-05-17T10:00:00.000Z",
    location: "JustCo One Raffles Place, Singapore",
    capacity: 30,
    category: "workshop",
    price: 129,
  },
  {
    status: "published",
    title: "Building AI Agents with LangChain & Claude",
    slug: "building-ai-agents-langchain-claude",
    description:
      "<p>Learn to build production-ready AI agents: tool use, retrieval-augmented generation, memory, and multi-step reasoning. Hands-on coding with Python and Claude API.</p>",
    date: "2026-06-14T09:30:00.000Z",
    location: "Google Developer Space, Singapore",
    capacity: 50,
    category: "workshop",
    price: 179,
  },
  {
    status: "published",
    title: "UX Research Methods: From Interviews to Insights",
    slug: "ux-research-methods-interviews-to-insights",
    description:
      "<p>Practice moderated usability testing, contextual inquiry, diary studies, and card sorting. Leave with a research playbook tailored to your product.</p>",
    date: "2026-06-28T10:00:00.000Z",
    location: "The Working Capitol, Singapore",
    capacity: 25,
    category: "workshop",
    price: 149,
  },
  {
    status: "published",
    title: "Terraform & Infrastructure as Code Bootcamp",
    slug: "terraform-iac-bootcamp",
    description:
      "<p>Two-day intensive workshop covering Terraform modules, state management, multi-cloud provisioning (AWS + GCP), and CI/CD integration for infrastructure.</p>",
    date: "2026-07-19T09:00:00.000Z",
    location: "Amazon Web Services Office, Singapore",
    capacity: 35,
    category: "workshop",
    price: 299,
  },
  {
    status: "published",
    title: "Mobile App Development with Flutter",
    slug: "mobile-app-dev-flutter",
    description:
      "<p>Build a cross-platform app from scratch in one day. Covers Dart fundamentals, state management with Riverpod, API integration, and deploying to both app stores.</p>",
    date: "2026-08-09T09:30:00.000Z",
    location: "Microsoft Singapore, One Marina Boulevard",
    capacity: 40,
    category: "workshop",
    price: 159,
  },
  {
    status: "published",
    title: "GraphQL API Design Workshop",
    slug: "graphql-api-design-workshop",
    description:
      "<p>Design, build, and optimize a GraphQL API. Covers schema design best practices, DataLoader, subscriptions, federation, and performance optimization.</p>",
    date: "2026-09-13T10:00:00.000Z",
    location: "Grab Office, One-North, Singapore",
    capacity: 30,
    category: "workshop",
    price: 139,
  },
  {
    status: "published",
    title: "CI/CD Pipeline Optimization Workshop",
    slug: "cicd-pipeline-optimization-workshop",
    description:
      "<p>Reduce build times by 60%. Covers parallel testing, layer caching, artifact management, and monorepo strategies with GitHub Actions and GitLab CI.</p>",
    date: "2026-10-03T09:30:00.000Z",
    location: "GitHub Singapore, Capital Tower",
    capacity: 35,
    category: "workshop",
    price: 169,
  },
  {
    status: "published",
    title: "Docker & Container Security Workshop",
    slug: "docker-container-security-workshop",
    description:
      "<p>Secure your containers: image scanning, runtime security, secrets management, and network policies. Hands-on labs with Trivy, Falco, and OPA.</p>",
    date: "2026-11-08T09:00:00.000Z",
    location: "Red Hat Singapore, Mapletree Business City",
    capacity: 30,
    category: "workshop",
    price: 189,
  },

  // ── MEETUPS ──────────────────────────────────────────────
  {
    status: "published",
    title: "Singapore Rust User Group Monthly",
    slug: "singapore-rust-user-group-may",
    description:
      "<p>Monthly meetup for Rust enthusiasts. This month: async Rust patterns and building high-performance network services. Lightning talks welcome!</p>",
    date: "2026-05-08T18:30:00.000Z",
    location: "Shopee Office, Science Park Drive",
    capacity: 80,
    category: "meetup",
    price: 0,
  },
  {
    status: "published",
    title: "React Singapore: Server Components Deep Dive",
    slug: "react-singapore-server-components",
    description:
      "<p>Exploring React Server Components in production. Talks on streaming SSR, caching strategies, and migrating from client-side to server-first architecture.</p>",
    date: "2026-05-22T18:30:00.000Z",
    location: "Thoughtworks Singapore, Paya Lebar",
    capacity: 100,
    category: "meetup",
    price: 0,
  },
  {
    status: "published",
    title: "Open Source Friday: Contributing to Major Projects",
    slug: "open-source-friday-contributing",
    description:
      "<p>Bring your laptop and contribute to open-source projects together! Maintainers from Next.js, Directus, and Supabase will guide first-time contributors.</p>",
    date: "2026-06-06T17:00:00.000Z",
    location: "Hackerspace.SG, King George's Avenue",
    capacity: 60,
    category: "meetup",
    price: 0,
  },
  {
    status: "published",
    title: "Data Science & ML Practitioners Meetup",
    slug: "data-science-ml-practitioners-meetup",
    description:
      "<p>Monthly gathering for data professionals. This edition focuses on MLOps pipelines, experiment tracking, and deploying models at scale with Kubernetes.</p>",
    date: "2026-06-19T18:30:00.000Z",
    location: "GovTech Hive, Sandcrawler Building",
    capacity: 90,
    category: "meetup",
    price: 0,
  },
  {
    status: "published",
    title: "Founder Coffee Chat: Early-Stage Startups",
    slug: "founder-coffee-chat-early-stage",
    description:
      "<p>Casual morning meetup for early-stage founders to share challenges, lessons, and connections. No pitches, just honest conversations over coffee.</p>",
    date: "2026-07-05T08:00:00.000Z",
    location: "Common Man Coffee Roasters, Martin Road",
    capacity: 30,
    category: "meetup",
    price: 0,
  },
  {
    status: "published",
    title: "SG Go Language Meetup: Concurrency Patterns",
    slug: "sg-go-language-concurrency-patterns",
    description:
      "<p>Deep dive into Go concurrency: goroutines, channels, select statements, and the new structured concurrency proposals. Live-coding session included.</p>",
    date: "2026-07-24T18:30:00.000Z",
    location: "Carousell Office, Tanjong Pagar",
    capacity: 70,
    category: "meetup",
    price: 0,
  },
  {
    status: "published",
    title: "Design Systems Community Meetup",
    slug: "design-systems-community-meetup",
    description:
      "<p>For designers and developers building design systems. Talks on token management, Figma-to-code workflows, accessibility-first component libraries, and governance.</p>",
    date: "2026-08-14T18:00:00.000Z",
    location: "Stripe Singapore, CapitaGreen",
    capacity: 60,
    category: "meetup",
    price: 0,
  },
  {
    status: "published",
    title: "Platform Engineering Singapore",
    slug: "platform-engineering-singapore",
    description:
      "<p>Discussing internal developer platforms, golden paths, and developer experience. Lightning talks on Backstage, Port, and custom platform solutions.</p>",
    date: "2026-09-04T18:30:00.000Z",
    location: "Datadog Singapore, Anson Road",
    capacity: 75,
    category: "meetup",
    price: 0,
  },
  {
    status: "published",
    title: "Python Singapore: FastAPI & Modern Web Backends",
    slug: "python-singapore-fastapi-modern-backends",
    description:
      "<p>Exploring FastAPI, async Python, Pydantic V2, and type-safe backend development. Plus lightning talks on Polars and the Python 3.13 JIT compiler.</p>",
    date: "2026-09-18T18:30:00.000Z",
    location: "Zendesk Office, Paya Lebar Quarter",
    capacity: 80,
    category: "meetup",
    price: 0,
  },
  {
    status: "published",
    title: "Figma Config Watch Party & Design Jam",
    slug: "figma-config-watch-party-design-jam",
    description:
      "<p>Watch Figma Config together, then jam on the new features. Designers and developers welcome — great for exploring new Figma capabilities hands-on.</p>",
    date: "2026-06-22T16:00:00.000Z",
    location: "The Great Room, One George Street",
    capacity: 50,
    category: "meetup",
    price: 0,
  },

  // ── WEBINARS ─────────────────────────────────────────────
  {
    status: "published",
    title: "Introduction to Prompt Engineering",
    slug: "introduction-to-prompt-engineering",
    description:
      "<p>Learn the fundamentals of effective prompt engineering: system prompts, few-shot examples, chain-of-thought, and structured outputs. Live demos with Claude and GPT-4.</p>",
    date: "2026-05-06T12:00:00.000Z",
    location: "Online (Zoom)",
    capacity: 500,
    category: "webinar",
    price: 0,
  },
  {
    status: "published",
    title: "Scaling PostgreSQL: Tips from the Trenches",
    slug: "scaling-postgresql-tips-trenches",
    description:
      "<p>Production insights on partitioning, connection pooling with PgBouncer, query optimization, and read replicas. Real metrics from a 10TB+ database.</p>",
    date: "2026-05-20T14:00:00.000Z",
    location: "Online (Google Meet)",
    capacity: 300,
    category: "webinar",
    price: 0,
  },
  {
    status: "published",
    title: "Building Accessible Web Applications",
    slug: "building-accessible-web-applications",
    description:
      "<p>WCAG 2.2 compliance, screen reader testing, ARIA patterns, and keyboard navigation. Practical techniques for React and Next.js developers.</p>",
    date: "2026-06-03T11:00:00.000Z",
    location: "Online (Zoom)",
    capacity: 400,
    category: "webinar",
    price: 0,
  },
  {
    status: "published",
    title: "Microservices vs Monolith: Making the Right Choice",
    slug: "microservices-vs-monolith-right-choice",
    description:
      "<p>A pragmatic look at architecture choices. When to break apart, when to stay together, and how to evolve your architecture without rewriting everything.</p>",
    date: "2026-06-17T13:00:00.000Z",
    location: "Online (Teams)",
    capacity: 350,
    category: "webinar",
    price: 0,
  },
  {
    status: "published",
    title: "Next.js 16 Deep Dive: What's New",
    slug: "nextjs-16-deep-dive-whats-new",
    description:
      "<p>Exploring the latest Next.js features: improved server actions, enhanced caching, Turbopack stability, and the new middleware capabilities.</p>",
    date: "2026-07-01T12:00:00.000Z",
    location: "Online (YouTube Live)",
    capacity: 1000,
    category: "webinar",
    price: 0,
  },
  {
    status: "published",
    title: "Getting Started with Edge Computing",
    slug: "getting-started-edge-computing",
    description:
      "<p>Understand edge functions, CDN-based compute, and when to use them. Covers Cloudflare Workers, Vercel Edge, and Deno Deploy with practical examples.</p>",
    date: "2026-07-15T14:00:00.000Z",
    location: "Online (Zoom)",
    capacity: 400,
    category: "webinar",
    price: 0,
  },
  {
    status: "published",
    title: "API Security Best Practices for 2026",
    slug: "api-security-best-practices-2026",
    description:
      "<p>OAuth 2.1, API gateways, rate limiting, input validation, and common vulnerability patterns. With live demonstrations of attack vectors and defenses.</p>",
    date: "2026-08-05T13:00:00.000Z",
    location: "Online (Google Meet)",
    capacity: 350,
    category: "webinar",
    price: 0,
  },
  {
    status: "published",
    title: "Observability 101: Logs, Metrics, and Traces",
    slug: "observability-101-logs-metrics-traces",
    description:
      "<p>Build a complete observability stack with OpenTelemetry, Grafana, and Loki. Understand distributed tracing, SLIs/SLOs, and alerting strategies.</p>",
    date: "2026-08-26T12:00:00.000Z",
    location: "Online (Zoom)",
    capacity: 500,
    category: "webinar",
    price: 0,
  },
  {
    status: "published",
    title: "The Future of AI in Healthcare",
    slug: "future-ai-healthcare-webinar",
    description:
      "<p>Medical imaging AI, drug discovery acceleration, clinical trial optimization, and responsible AI in healthcare settings. Panelists from NUS, SGH, and A*STAR.</p>",
    date: "2026-10-15T14:00:00.000Z",
    location: "Online (Zoom)",
    capacity: 600,
    category: "webinar",
    price: 0,
  },
  {
    status: "published",
    title: "Green Software Engineering Webinar",
    slug: "green-software-engineering-webinar",
    description:
      "<p>Measure and reduce the carbon footprint of your software. Covers the Green Software Foundation's patterns, carbon-aware computing, and energy-efficient coding.</p>",
    date: "2026-11-20T12:00:00.000Z",
    location: "Online (Teams)",
    capacity: 400,
    category: "webinar",
    price: 0,
  },
];

async function seed() {
  console.log(`🔐 Logging in to Directus at ${DIRECTUS_URL}...`);
  await directus.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  console.log("✅ Logged in\n");

  let created = 0;
  let failed = 0;

  for (const event of events) {
    try {
      await directus.request(createItem("events" as never, event as never));
      created++;
      console.log(`  ✅ [${created}] ${event.title}`);
    } catch (err: any) {
      failed++;
      const msg = err?.errors?.[0]?.message || err.message || "Unknown error";
      console.log(`  ❌ ${event.title} — ${msg}`);
    }
  }

  console.log(`\n🎉 Done! Created ${created} events, ${failed} failed.`);
}

seed();
