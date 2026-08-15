# Breaking Books

Live at **[breakingbooks.in](https://breakingbooks.in)**

A full-stack learning platform for CBSE IT & Computer Science students in Classes 9–12. Free courses, YouTube-integrated lessons, PDF notes, enrollment tracking, and progress persistence — built and maintained solo.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Database + Auth | Supabase (Postgres, Row Level Security, Storage) |
| Styling | Tailwind CSS v4 |
| Email | Resend |
| External APIs | YouTube Data API v3 |
| Deployment | Vercel |

---

## Features

**For students**
- Browse and watch CBSE IT/CS courses (Classes 9–12) without logging in
- YouTube-redirect lessons (preserves channel view count) + downloadable PDF notes
- Free enrollment to save courses to "My Courses"
- Per-lesson progress tracking with completion percentage on dashboard
- Google OAuth and email/password authentication
- Email verification flow (PKCE-based, token_hash exchange via `/auth/confirm`)
- Password reset via email

**For admin (role-gated)**
- Full course/lesson CRUD via `/admin` panel
- Thumbnail and PDF upload to Supabase Storage (with RLS-secured policies)
- YouTube duration auto-fetch via YouTube Data API v3
- Featured course selection (shown on homepage)
- User management with role promotion/demotion
- Site-wide stats dashboard (enrollments, users, published courses)

---

## Architecture Notes

**Auth:** Supabase Auth with PKCE flow. Middleware does a lightweight cookie-existence check only (no Supabase SDK in middleware — `@supabase/realtime-js` uses `__dirname` which breaks the Edge runtime). Real auth and role verification happen in page-level server components.

**Security:** Row Level Security policies are the actual access layer — not just UI gating. Public content (courses/lessons) is readable by all; enrollment and progress data is scoped to the owning user; admin writes require `profiles.role = 'admin'` verified server-side.

**Content model:** lessons store `youtube_url` and `order_index` independently of YouTube's own ordering — so sequence is controlled entirely from the admin panel, not from playlist order.

**Storage:** PDFs and thumbnails served from Supabase Storage public buckets with admin-only write policies.

---

## Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
#          SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY,
#          YOUTUBE_API_KEY, NEXT_PUBLIC_SITE_URL

# Run dev server
npm run dev
```

### Required Supabase setup
Run the SQL migrations in order (see `/supabase` folder or `PROJECT.md` for schema) to create:
- `profiles`, `courses`, `lessons`, `enrollments`, `lesson_progress`, `contact_messages` tables
- RLS policies for each table
- Storage buckets: `course-thumbnails`, `lesson-notes`
- Trigger: `handle_new_user` (auto-creates profile on signup)

---

## Environment Variables

| Variable | Where | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `.env.local` + Vercel | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local` + Vercel | Safe to expose (anon key) |
| `SUPABASE_SERVICE_ROLE_KEY` | `.env.local` + Vercel | Server-only, never prefix with NEXT_PUBLIC_ |
| `RESEND_API_KEY` | `.env.local` + Vercel | For contact form + auth emails |
| `YOUTUBE_API_KEY` | `.env.local` + Vercel | YouTube Data API v3, server-only |
| `NEXT_PUBLIC_SITE_URL` | `.env.local` + Vercel | e.g. `https://breakingbooks.in` |

---

## Project Structure

```
app/
├── admin/              # Admin panel (role-gated)
│   ├── courses/        # Course + lesson CRUD
│   └── users/          # User management
├── auth/
│   ├── callback/       # Google OAuth callback
│   ├── confirm/        # Email verification + password reset (PKCE)
│   └── update-password/
├── courses/
│   └── [slug]/
│       └── lessons/[lessonId]/
├── dashboard/          # Student dashboard + profile
├── contact/
├── privacy/
└── terms/

components/
├── admin/              # Admin-specific components
├── ui/                 # Shared: Button, Input, Toast, PasswordInput, SubmitButton
├── Navbar.tsx
└── Footer.tsx
```

---

## Deployment

Deployed on Vercel (Production branch: `main`). All environment variables must be set in Vercel's dashboard — `.env.local` is gitignored and never syncs to Vercel automatically.

**Note:** Do not upgrade to Next.js 16 — the Edge middleware `__dirname` issue with `@supabase/realtime-js` is unresolved on that version. See `PROJECT.md` for full architectural decisions and known gotchas.

---

## About

Breaking Books teaches CBSE IT (Code 402/802) and Artificial Intelligence (Code 417/843) for Classes 9–12. The YouTube channel has 24K+ subscribers and reaches ~30–40K students annually.

Built solo by **Pratik Kumar** — B.Tech Computer Science, KIET Ghaziabad (graduating 2028).