# Breaking Books — Project Context

## Stack
- Next.js 15 (App Router, stable — do NOT upgrade to Next 16, caused unresolved Edge runtime bugs)
- Supabase (Postgres + Auth + Storage) — @supabase/ssr for session handling
- Tailwind CSS, deployed on Vercel
- Resend for transactional email

## Design system (do not deviate without explicit request)
- Dark theme: background `#0A0A0F`, surface `#15171C`, border `#DEDCD0`-equivalent dark variant
- Accent: sage green (~`#8FA377`) — NOT amber, NOT the logo's literal dark green (too low-contrast on dark bg)
- Font: Inter
- Motion: ONLY simple 150-200ms hover/focus transitions, plus a few named exceptions (progress bar fill animation, staggered lesson list fade-in, page fade via template.tsx). NO glassmorphism, NO glow, NO gradients, NO bounce/elastic easing, NO scroll-triggered reveals.
- 3-tier button hierarchy: primary (filled accent), secondary (outlined), tertiary (text/ghost)

## Core product decisions
- ALL course/lesson content (browsing, videos, PDFs) is public — no login required to view.
- Login is ONLY required for: enrolling, progress tracking ("mark complete"), contact form, profile editing.
- Every login-gated action must still be VISIBLE to logged-out users — clicking it redirects to /login, never hides the feature entirely.
- Lesson videos: NOT embedded — show YouTube thumbnail, click opens YouTube in new tab (intentional, drives channel views).
- No mobile/phone auth (SMS costs money) — email/password only.

## Database schema (source of truth — check actual Supabase schema before assuming)
- `profiles`: id (=auth.users.id), full_name, class_level, role ('student'|'admin'), created_at
- `courses`: id, title, slug, description, class_level, subject, thumbnail_url, published (bool), featured (bool), created_at
- `lessons`: id, course_id, title, order_index, youtube_url, pdf_url, duration_min, created_at
- `enrollments`: id, user_id, course_id, enrolled_at
- `lesson_progress`: id, user_id, lesson_id, completed (bool), completed_at
- `contact_messages`: id, user_id, name, email, message, created_at (login required to submit)
- RLS: courses/lessons publicly readable if published=true; enrollments/progress/contact scoped to own user_id; admin role required for course/lesson writes (checked via profiles.role = 'admin')

## Known gotchas (from painful debugging — don't repeat)
- Middleware must NOT import the full Supabase client (`createServerClient` from `@supabase/ssr`) — causes `__dirname is not defined` on Edge runtime due to `@supabase/realtime-js`. Middleware only does a lightweight cookie-existence check (`sb-*-auth-token` cookie name pattern). Real auth/role checks happen in page-level server components.
- Env vars must be added to BOTH `.env.local` (local) AND Vercel dashboard (Production, at minimum) — local env never syncs to Vercel automatically.
- `SUPABASE_SERVICE_ROLE_KEY` — server-only, NEVER prefix with NEXT_PUBLIC_, bypasses all RLS.
- If Vercel deployment shows stale/wrong behavior that doesn't match local despite correct code: try a full project delete + reimport before extensive debugging — build cache issues have occurred.

## Admin
- `/admin` — dashboard stats (course/user/enrollment counts)
- `/admin/courses` — course + lesson CRUD, including PDF/thumbnail upload
- `/admin/users` — view users, promote/demote role (server-side admin check required, confirmation dialog required, admin cannot demote self)

## Content policy
- No "edtech" as a term anywhere in copy.
- Homepage hero: "Welcome to [white]" / "Breaking Books [accent color]"
- Name is a Breaking Bad reference — homage in name only, NOT in visual theme (copyright + audience-appropriateness concerns, deliberately decided against a full reskin).