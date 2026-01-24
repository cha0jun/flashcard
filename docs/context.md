# Project Context: AI-Powered Flashcard PoC

## 1. Vision & Strategy
Build a rapid Proof-Of-Concept (PoC) for a cross-platform flashcard app. 
**Core Goal:** Validate AI-generated study material and SRS (Spaced Repetition System) mechanics with minimal friction.
**Approach:** Mobile-first web (PWA) to ensure availability on Web, iOS, and Android with a single codebase.

## 2. Tech Stack
- **Frontend:** React + Vite (or Next.js/TanStack Router) + Tailwind CSS.
- **Animations:** Framer Motion (for gesture-based swiping/flipping).
- **Backend-as-a-Service:** Supabase.
- **Data Fetching:** TanStack Query (React Query) or TanStack Router Loaders.
- **Deployment:** Vercel or Netlify (Static SPA).

## 3. Implementation Workflow
| Phase | Component | Action |
| :--- | :--- | :--- |
| **Auth** | Supabase Auth | Google/Email Auth via Supabase Client SDK. |
| **Input** | React Component | User provides topic string or PDF upload (Supabase Storage). |
| **Process** | Edge Function | Calls OpenAI (JSON mode), parses cards, inserts into `cards` table. |
| **Sync** | Supabase Realtime | Frontend listens for `INSERT` events on `cards` to show live progress. |
| **SRS** | Postgres RPC | User swipes; call `review_card` function to update interval/ease. |

## 4. Key Engineering Decisions (Justifications)
1. **Framer Motion for Gestures:** Essential for "native-feel" study UX (drag/swipe/flip) on mobile browsers.
2. **Postgres Functions (RPC) for SRS:** Logic stays in the DB to ensure consistency across future platforms (Web/iOS/Android).
3. **Realtime Subscription:** Mitigates AI latency by showing cards one-by-one as the Edge Function generates them.
4. **SPA/PWA over Native:** Using React + Vite + TanStack Router allows for 100% type-safe routing and instant deployment without App Store overhead.

## 5. Database Schema (High-Level)
- `decks`: id, user_id, title, created_at.
- `cards`: id, deck_id, question, answer, metadata (AI-generated).
- `user_card_stats`: card_id, user_id, interval, ease_factor, next_review (SRS data).

## 6. Critical UI Patterns
- **Study Mode:** A stack of cards using `AnimatePresence`. Swipe right = Easy (Update SRS), Swipe left = Hard (Reset Interval).
- **Creation Mode:** A multi-step form (Topic -> AI Processing -> Preview Deck).
- **Dashboard:** Simple list of decks with "cards due today" counters.

## 7. Development Guidelines
- Use **Mobile-First** Tailwind classes (e.g., `w-full md:max-w-md`).
- Implement **Skeleton States** during AI generation to improve perceived performance.
- Prioritize **Type Safety** between Supabase generated types and Frontend components.
- Keep components small and modular in `/src/components`.