---
name: otservhub-supabase
description: The definitive guide for Supabase operations in OtservHub. Use this skill for all database interactions (fetching, mutations, realtime), security (RLS), and MCP usage.
---

# OtservHub Supabase & Backend Skill

This skill governs how we interact with the Database (PostgreSQL via Supabase) to ensure performance, security, and "Vibecode" responsiveness.

## 1. Supabase MCP Usage (Priority)

**Before writing code**, use the Supabase MCP to validate your assumptions.

* **Explore Schema**: Don't guess column names. Use the MCP to inspect `public.servers`, `public.profiles`, etc.
* **Test Queries**: Run complex SQL via MCP to verify results before implementing them in TypeScript.
* **Check Policies**: Verify RLS policies if you encounter permission errors.

## 2. Technical Stack & Architecture

We use **Supabase SSR** (`@supabase/ssr`) with Next.js App Router.

### Client Types

* **Server Client**: Used in `page.tsx`, `layout.tsx`, and Server Actions.
  * *Path*: `src/lib/supabase/server.ts`
  * *Capabilities*: Full access (subject to RLS), Cookie management.
* **Browser Client**: Used in Client Components (`use client`).
  * *Path*: `src/lib/supabase/client.ts`
  * *Capabilities*: Limited by RLS, Realtime subscriptions.
* **Middleware**: **CRITICAL**. The `middleware.ts` must run `updateSession` to keep auth tokens alive.

## 3. "Vibecode" Data Patterns (UX First)

To maintain the "Futuristic/Premium" feel, data fetching must not block the UI (unless critical).

### A. Critical Data (Server Side)

Fetch in `page.tsx` using `await`. Use `<Suspense>` with skeleton loaders (`components/ui/skeleton.tsx`) to show immediate UI structure.

```tsx
// ✅ Do this
export default async function ServerPage() {
  const { data } = await supabase.from('servers').select('*');
  return <ServerList servers={data} />
}

// ❌ Avoid this (Client Side Fetching for SEO content)
useEffect(() => { fetchServers() }, [])
```

### B. Mutations (Server Actions)

Use Next.js Server Actions for all writes (`INSERT`, `UPDATE`).

1. **Validate**: Use Zod to validate input *before* calling Supabase.
2. **Optimistic UI**: If possible, use `useOptimistic` to update the UI instantly while the database processes.
3. **Revalidation**: Call `revalidatePath('/page')` to refresh data after success.

## 4. Security & RLS (Non-Negotiable)

* **Trust No Input**: Users can manipulate Client-Side requests. ALWAYS validate user permission in Server Actions, even if RLS exists.
* **RLS Policies**: Defined in `documents/schemadb_otservhub.md`.
  * *Public*: `servers` (verified), `hypes`, `ad_slots`.
  * *Private*: `profiles` (update own), `servers` (management).
* **Service Role**: **NEVER** use `SUPABASE_SERVICE_ROLE_KEY` in client code. Use it ONLY in rare Admin-only Server Actions or Cron Jobs.

## 5. System-Specific Guidelines

### A. Servers (`public.servers`)

* **Listings**: Always filter by `is_verified = true` for public lists.
* **Images**: Use `supabase.storage` CDN URLs. Do not store Base64 in DB.
* **Slugs**: Must be unique. Handle insert errors (Postgres `23505`) gracefully by asking user to change name.

### B. Hype System (`public.hypes`)

The "Hype" button is a high-interaction element.

* **Realtime**: Use Supabase Realtime (Client Component) to update the counter live if the user is on the page.
* **Limits**: The DB trigger `check_hype_limit` enforces caps (3 Going, 5 Waiting). Handle the Postgres exception in the UI with a Toast notification.

### C. Sponsorships (`public.sponsorships`)

* **Concurrency**: The `check_slot_availability` RPC function prevents double booking. Always call this BEFORE processing payment/insertion.

## 6. Maintenance & Scalability

* **Types**: Generate TypeScript definitions (`database.types.ts`) automatically. Do not manually type database responses.
* **Indexes**: If a query feels slow, check `documents/schemadb_otservhub.md` to see if an endpoint is indexed. If not, propose adding an index.

---
*Reference: See `documents/schemadb_otservhub.md` for the full SQL definition and triggers.*
