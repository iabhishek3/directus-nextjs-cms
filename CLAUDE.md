# DISCOVER - Event Management Platform

## Project Overview

This is a Next.js 16 application powered by Directus CMS for managing and displaying events. Users can browse events, filter by category, and register for events.

## Quick Reference

- **Skill Guide**: See `.claude/skills/directus-nextjs.md` for comprehensive development patterns
- **Directus Admin**: http://localhost:8055
- **Frontend**: http://localhost:3000

## Key Files

| File | Purpose |
|------|---------|
| `src/lib/directus.ts` | Directus client, types, and API functions |
| `src/lib/colors.ts` | Color palette (orange/cream theme) |
| `src/lib/typography.tsx` | Typography and UI components |
| `scripts/setup-directus.ts` | Collection setup script |

## Collections

| Collection | Type | Purpose |
|------------|------|---------|
| `events` | Regular | Event listings |
| `categories` | Regular | Event categories |
| `registrations` | Regular | User registrations |
| `hero_section` | Singleton | Homepage hero content |

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run setup    # Setup Directus collections
```

## Environment

Required in `.env.local`:
```
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
DIRECTUS_API_TOKEN=your-token
```

## Development Guidelines

1. **Always read the skill doc** before implementing new features
2. **Use typed API functions** from `src/lib/directus.ts`
3. **Use transient props** ($prefix) in styled-components
4. **Add `dynamic = "force-dynamic"`** for pages fetching CMS content
5. **Server components** fetch data, **client components** render UI

@AGENTS.md
