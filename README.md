# HIPAA Compliance Tracker

SaaS for small medical offices to track HIPAA Security Rule compliance: a
plain-English 50-task checklist mapped to 45 CFR §164.308–316, an evidence
vault, and one-click audit-ready PDF reports.

## Stack

- **Next.js 15** (App Router, React Server Components, Server Actions)
- **TypeScript** + **Tailwind CSS** + **shadcn/ui**
- **Prisma** ORM on **Neon Postgres**
- **Supabase** Auth (email/password + Google) and Storage (private evidence/report buckets)
- **@react-pdf/renderer** for PDF report generation
- Deployed on **Vercel**

## Features

| Route | What it does |
|---|---|
| `/` | Marketing landing page with pricing ($79/mo per office) |
| `/login`, `/signup` | Supabase auth (email/password + Google OAuth) |
| `/onboarding` | Names the org and instantiates all 50 checklist tasks |
| `/dashboard` | Compliance score ring, per-category bars, overdue tasks, status counts |
| `/tasks` | Filterable checklist (category / status / assignee) with inline status updates |
| `/tasks/[id]` | Citation + description, notes, due date, assignee, evidence upload |
| `/reports` | Generate + download PDF compliance reports; export audit trail |
| `/settings` | Org name, team invites, member management (admin-only) |

**Compliance score** = `COMPLETE / (total − NOT_APPLICABLE) × 100`.

## Security posture

This is a compliance app, so it practices what it preaches:

- Every Prisma query is scoped by `organizationId` taken from the **server-side
  session** — org IDs are never accepted from the client.
- Supabase Storage buckets (`evidence`, `reports`) are **private**; files are
  served only through signed URLs with a 60-second expiry.
- Admin-only actions (deleting evidence, managing the team) are enforced
  **server-side** via `requireAdmin()`.
- No PHI is stored. Evidence files are policies, BAAs, and training records —
  but the vault is treated as sensitive anyway.
- Encryption in transit (TLS) and at rest via Vercel + Neon + Supabase defaults.

## Local development

1. **Clone and install**

   ```bash
   npm install
   ```

2. **Configure environment** — copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL` / `DIRECT_URL` — Neon Postgres (pooled + direct)
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase project
   - `SUPABASE_SERVICE_ROLE_KEY` — for storage signing and team invites (server-only)
   - `NEXT_PUBLIC_APP_URL` — `http://localhost:3000` locally

3. **Set up Supabase**
   - Enable email/password and Google providers under Authentication.
   - Create two **private** storage buckets: `evidence` and `reports`.

4. **Push schema and seed the 50 task templates**

   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Run**

   ```bash
   npm run dev
   ```

## Deferred to v2

Stripe billing, email reminders for due dates, multi-framework support,
MSP white-label multi-tenancy, automated evidence collection.

---

*Not legal advice. Consult a qualified professional for compliance guidance
specific to your practice.*
