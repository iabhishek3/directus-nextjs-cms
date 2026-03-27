# Directus + Next.js Development Skill

This skill provides guidance for developing features in a Next.js application powered by Directus CMS.

---

## Project Architecture

### Technology Stack
- **Frontend**: Next.js 16+ (App Router)
- **CMS**: Directus (Headless CMS)
- **Styling**: styled-components with SSR support
- **Database**: PostgreSQL (via Directus)
- **Caching**: Redis (via Directus)

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page (server component)
│   ├── HomeClient.tsx      # Home page client component
│   ├── api/                # API routes
│   │   └── [endpoint]/route.ts
│   └── [resource]/         # Dynamic routes
│       ├── page.tsx        # List page
│       └── [slug]/page.tsx # Detail page
├── components/             # Reusable UI components
├── lib/                    # Utilities and configurations
│   ├── directus.ts         # Directus client and API functions
│   ├── colors.ts           # Color palette
│   ├── typography.tsx      # Typography components
│   ├── providers.tsx       # Theme and context providers
│   └── registry.tsx        # styled-components SSR registry
└── scripts/                # Setup and utility scripts
    └── setup-directus.ts   # Collection creation script
```

---

## Directus Configuration

### Environment Variables
```env
# .env.local
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
DIRECTUS_API_TOKEN=your-static-token
```

### Client Setup Pattern
```typescript
// src/lib/directus.ts
import {
  createDirectus,
  rest,
  staticToken,
  readItems,
  readItem,
  readSingleton,
  createItem,
  aggregate,
} from "@directus/sdk";

// Type definitions for collections
export interface YourCollection {
  id: number;
  field1: string;
  field2: string | null;
  // ... other fields
}

export interface DirectusSchema {
  your_collection: YourCollection[];
  singleton_collection: SingletonType;
}

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

// Public client (no auth) - for reading public data
export const directus = createDirectus<DirectusSchema>(directusUrl).with(rest());

// Authenticated client - for protected operations (server-side only)
export function getAuthenticatedClient() {
  const token = process.env.DIRECTUS_API_TOKEN;
  if (!token) throw new Error("DIRECTUS_API_TOKEN is not set");
  return createDirectus<DirectusSchema>(directusUrl)
    .with(staticToken(token))
    .with(rest());
}
```

### Creating Collections Programmatically
```typescript
// scripts/setup-directus.ts
import { createCollection, createField, createItem } from "@directus/sdk";

// Regular collection
await directus.request(
  createCollection({
    collection: "collection_name",
    meta: {
      icon: "icon_name",
      note: "Description",
      singleton: false,
    },
    schema: {},
  })
);

// Singleton collection (single item, e.g., site settings)
await directus.request(
  createCollection({
    collection: "settings",
    meta: {
      icon: "settings",
      singleton: true,
    },
    schema: {},
  })
);

// Add fields
await directus.request(
  createField("collection_name", {
    field: "field_name",
    type: "string", // string, text, integer, decimal, timestamp, uuid, boolean
    meta: {
      interface: "input", // input, input-multiline, input-rich-text-html, select-dropdown, datetime, file-image
      required: true,
      width: "half", // half, full
    },
    schema: {
      is_nullable: false,
      default_value: "default",
    },
  })
);
```

### Common Field Types
| Type | Interface | Use Case |
|------|-----------|----------|
| `string` | `input` | Short text, titles |
| `text` | `input-multiline` | Long text, descriptions |
| `text` | `input-rich-text-html` | Rich text content |
| `timestamp` | `datetime` | Dates and times |
| `uuid` | `file-image` | Image uploads |
| `integer` | `input` | Numbers, IDs |
| `decimal` | `input` | Prices, decimals |
| `string` | `select-dropdown` | Enum/status fields |

---

## API Patterns

### Fetching Collections
```typescript
// Get all items with filters
export async function getItems(options?: { limit?: number; category?: string }) {
  try {
    const filter: Record<string, unknown> = { status: { _eq: "published" } };
    if (options?.category) filter.category = { _eq: options.category };

    return await directus.request(
      readItems("collection_name", {
        filter,
        sort: ["date"], // or ["-date"] for descending
        limit: options?.limit || -1,
      })
    );
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
}

// Get single item by slug
export async function getItemBySlug(slug: string) {
  try {
    const items = await directus.request(
      readItems("collection_name", {
        filter: { slug: { _eq: slug }, status: { _eq: "published" } },
        limit: 1,
      })
    );
    return items[0] || null;
  } catch (error) {
    console.error("Error fetching item:", error);
    return null;
  }
}

// Get singleton
export async function getSiteSettings() {
  try {
    return await directus.request(readSingleton("site_settings"));
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}
```

### Creating Items (Server-side only)
```typescript
export async function createRegistration(data: { eventId: number; name: string; email: string }) {
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
    return { success: false, error: "Failed to create" };
  }
}
```

### Aggregations
```typescript
export async function getCount(collectionId: number): Promise<number> {
  try {
    const client = getAuthenticatedClient();
    const result = await client.request(
      aggregate("collection_name", {
        aggregate: { count: "*" },
        query: { filter: { parent_id: { _eq: collectionId } } },
      })
    );
    return Number(result[0]?.count) || 0;
  } catch (error) {
    return 0;
  }
}
```

### Asset URLs
```typescript
export function getAssetUrl(assetId: string | null | undefined): string | null {
  if (!assetId) return null;
  return `${directusUrl}/assets/${assetId}`;
}
```

---

## Next.js Patterns

### Page Components (Server Components)
```typescript
// app/[resource]/page.tsx
import { getItems, getCategories } from "@/lib/directus";
import ClientComponent from "./ClientComponent";

// Force dynamic rendering for CMS content
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: { category?: string } }) {
  const [items, categories] = await Promise.all([
    getItems({ category: searchParams.category }),
    getCategories(),
  ]);

  return <ClientComponent items={items} categories={categories} />;
}
```

### API Routes
```typescript
// app/api/[endpoint]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createItem } from "@/lib/directus";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    if (!body.field1 || !body.field2) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await createItem(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

---

## Styling Patterns

### Color System
```typescript
// src/lib/colors.ts
export const Color = {
  Primary: "#E86A33",
  PrimaryDark: "#D45A23",
  PrimaryLight: "#FFF3ED",

  Accent: {
    Yellow: "#FFB800",
    Orange: "#F97316",
  },

  Background: {
    Cream: "#FDF6EE",
    White: "#FFFFFF",
  },

  Neutral: {
    1: "#1F2933", // Headings
    2: "#3E4C59", // Body text
    3: "#7B8794", // Secondary text
    4: "#9AA5B1", // Placeholders
    5: "#CBD2D9", // Borders
    6: "#E4E7EB", // Light backgrounds
    7: "#F5F7FA", // Lightest
  },
};
```

### styled-components Patterns
```typescript
"use client";

import styled from "styled-components";
import { Color } from "@/lib/colors";

// Use transient props ($prefix) to avoid DOM warnings
const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  background: ${(props) => props.$variant === "secondary" ? "white" : Color.Primary};
  color: ${(props) => props.$variant === "secondary" ? Color.Primary : "white"};
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

// Conditional styling
const Card = styled.div<{ $active?: boolean }>`
  ${(props) => props.$active && `
    border-color: ${Color.Primary};
    background: ${Color.PrimaryLight};
  `}
`;
```

### SSR Registry (Required)
```typescript
// src/lib/registry.tsx
"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  const [sheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = sheet.getStyleElement();
    sheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== "undefined") return <>{children}</>;

  return <StyleSheetManager sheet={sheet.instance}>{children}</StyleSheetManager>;
}
```

### next.config.ts
```typescript
const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true, // Required for consistent class names
  },
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8055", pathname: "/assets/**" },
    ],
  },
};
```

---

## Common Tasks

### Adding a New Collection
1. Add type interface in `src/lib/directus.ts`
2. Add to `DirectusSchema` interface
3. Create API functions (get, create, etc.)
4. Add to setup script if needed
5. Set permissions in Directus Admin

### Adding a New Page
1. Create `app/[route]/page.tsx` (server component)
2. Create `app/[route]/ClientComponent.tsx` (client component)
3. Add `export const dynamic = "force-dynamic"` for CMS content
4. Fetch data in server component, pass to client

### Adding a Singleton (Settings/Hero/etc.)
1. Create collection with `singleton: true`
2. Use `readSingleton("collection_name")` to fetch
3. Add to DirectusSchema as single object (not array)

### Permissions Setup
In Directus Admin > Settings > Access Control > Public:
- **Read**: For public-facing collections (events, categories, hero_section)
- **Create**: Only via authenticated API token (registrations)

---

## Debugging

### Common Issues

**403 Forbidden on API calls**
- Check collection permissions in Directus Admin
- Verify API token is correct in `.env.local`
- Ensure token user has required permissions

**Hydration mismatch warnings**
- Add `suppressHydrationWarning` for dynamic values like dates
- Browser extensions (Grammarly) can cause false positives
- Ensure `compiler: { styledComponents: true }` in next.config.ts

**Data not updating**
- Add `export const dynamic = "force-dynamic"` to page
- Or use `export const revalidate = 60` for ISR

**styled-components class mismatch**
- Restart dev server after config changes
- Clear `.next` directory: `rm -rf .next`

---

## Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run setup            # Run Directus setup script

# Directus
docker compose up -d     # Start Directus
docker compose down      # Stop Directus
docker compose logs -f   # View logs

# Debugging
curl http://localhost:8055/items/collection_name  # Test API
```

---

## File Templates

### New Collection Type
```typescript
export interface NewCollection {
  id: number;
  status: "draft" | "published" | "archived";
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
  date_created: string;
  date_updated: string;
}
```

### New API Function
```typescript
export async function getNewItems(options?: { limit?: number }) {
  try {
    return await directus.request(
      readItems("new_collection", {
        filter: { status: { _eq: "published" } },
        sort: ["-date_created"],
        limit: options?.limit || -1,
      })
    );
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
```

### New Page Component
```typescript
// app/new-route/page.tsx
import { getNewItems } from "@/lib/directus";
import NewClient from "./NewClient";

export const dynamic = "force-dynamic";

export default async function NewPage() {
  const items = await getNewItems();
  return <NewClient items={items} />;
}
```
