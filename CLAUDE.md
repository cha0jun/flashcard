# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server
npm run build      # Type-check + bundle for production (tsc -b && vite build)
npm run lint       # Run ESLint
npm run preview    # Preview production build locally
```

No test runner is configured.

## Architecture Overview

**Axonote** is a spaced repetition flashcard app built with React 19 + TypeScript + Vite.

### Key Libraries
- **TanStack Router** — file-based routing with automatic route tree generation (`src/routeTree.gen.ts` is auto-generated, never edit manually)
- **TanStack React Query** — all server state; no Redux/Zustand/Context for business logic
- **Supabase** — auth + PostgreSQL database via REST client
- **Framer Motion** — card flip, drag-to-swipe, page transitions
- **Tailwind CSS v4** — with custom brand colors and `flip-in`/`flip-out` keyframe animations in `tailwind.config.ts`

### Source Layout

```
src/
├── routes/          # File-based pages (TanStack Router)
├── components/      # Reusable UI (Flashcard, CardStack, GenerationForm, Sidebar)
├── hooks/           # useAuth.ts — Supabase auth state
├── lib/
│   ├── supabase.ts  # Supabase client (reads VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
│   ├── db.ts        # All database operations
│   └── srs.ts       # SM-2 spaced repetition algorithm
└── types/index.ts   # All shared TypeScript types
```

### Routing

File naming conventions in `src/routes/`:
- `__root.tsx` — root layout; handles auth redirect (unauthenticated → `/login`) and sidebar display
- `index.tsx` — `/` dashboard
- `decks.$deckId.study.tsx` — `/decks/:deckId/study` (dot = `/`, `$` = dynamic param)

After adding/removing route files, the Vite plugin regenerates `src/routeTree.gen.ts` automatically on the next `dev`/`build` run.

### Data Flow

All DB calls live in `lib/db.ts` and are consumed via React Query in route components. Pattern:

```ts
const { data } = useQuery({
  queryKey: ['decks', userId],
  queryFn: () => fetchDecks(userId!),
  enabled: !!userId,
})
```

Auth state comes from the `useAuth()` hook, which wraps Supabase's `onAuthStateChange` listener.

### SRS Algorithm

`lib/srs.ts` implements a simplified SM-2: ratings 1–4 map to SM-2 quality 0–5, adjusting ease factor, interval, and repetition count. Rating 1 ("Again") re-queues the card; ratings 2–4 advance the schedule.

### Environment Variables

Required in `.env.local`:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```
