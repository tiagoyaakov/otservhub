# AGENTS.md - OtservHub Agent Protocol

> **CRITICAL**: This document is the SINGLE SOURCE OF TRUTH for all AI Agents working on OtservHub. You must adhere to these rules strictly. Failure to do so results in code rejection.

## 1. Identity & Purpose

You are working on **OtservHub**, a premium, high-performance Open Tibia Server List and Community Platform.

- **Mission**: Create the most visually stunning and technically advanced OTServer list in the world.
- **Aesthetic**: "Branco Futurista" (Futuristic White), Glassmorphism, and Minimalist application design.
- **Standard**: "Vibecode" is mandatory. Code must not only work but look incredible.

## 2. Tech Stack (Strict Enforcement)

You are operating in a **Next.js 16+** environment. Do not deviate.

- **Framework**: Next.js 16 (App Router). Use `src/app`.
- **Language**: TypeScript (Strict Mode). No `any`.
- **Styling**: Tailwind CSS v4.
  - **Colors**: Use the specific palette in `documents/tailwindsuggest_otservhub.md` (Background: `#FAFAFA`, Primary: Cyber Blue `#007AFF`).
  - **Animations**: Use `tailwindcss-animate` and `framer-motion` for meaningful micro-interactions.
- **Database & Auth**: Supabase.
  - Use `@supabase/ssr` for auth helpers.
  - Strictly follow schema in `documents/schemadb_otservhub.md`.
- **UI Components**: Shadcn UI (Radix Primitives + Lucide Icons).

## 3. "Vibecode" Design Standards

Your code must output aesthetically superior interfaces.

1. **Polished UI**: Use soft shadows (`shadow-lg`, `shadow-indigo-500/10`), rounded corners (`rounded-2xl`), and subtle gradients.
2. **Interactivity**: Every interactive element needs a defined hover/active state. The app must feel "alive".
3. **Responsive**: Mobile-first architecture is non-negotiable.
4. **No Placeholders**: Never use generic "Lorem Ipsum". Use context-relevant text ("Global 8.6", "War Server", etc.) or generate placeholders that match the theme.

## 4. Project Structure

- **`src/app/`**: Routes and Pages (Server Components by default).
- **`src/components/`**: Reusable UI. Keep components small and focused.
- **`src/lib/`**: Utilities, Supabase clients, Zod schemas.
- **`documents/`**: **READ THESE FIRST**. Your source of truth for Business Logic and Database Schema.
  - `tech_stack_rules.md`: Technical constraints.
  - `SKILL_otservhub_design.md`: Design tokens.

## 5. Agent Workflow

1. **Read Context**:
    - **Check `documents/`**: Read PRD, Tech Rules, and Schema.
    - **Check Skills**: Look for relevant guides in the `@skills` folder (files starting with `SKILL_`).
    - **Check MCPs**: Prioritize using available Model Context Protocols (MCPs) for supported tasks.
    - **Context7 MCP**: **CRITICAL**. You MUST use the `Context7` MCP whenever you need to fetch, verify, or update your knowledge about external libraries or documentation. Never assume legacy knowledge is current.
2. **Plan**: Think about the component hierarchy, data flow, and **Security**.
3. **Implement**: Write production-ready code.
    - Validate inputs with Zod.
    - Handle loading and error states explicitly.
4. **Verify**: Ensure no linting errors and that types are strict.
5. **Sync Documentation**: **CRITICAL**. If your changes affect *any* logic defined in `documents/`, you MUST update the corresponding document immediately. Keep the docs in sync with the code at all times.

## 6. Security Standards (Security First)

- **Host**: Vercel. Leverage Edge Config and Vercel's built-in DDoS protections. Do not expose sensitive env vars to the client (`NEXT_PUBLIC_` only when absolutely necessary).
- **Database**: Supabase.
  - **RLS**: Row-Level Security is MANDATORY for all tables. Never bypass RLS in client-side queries.
  - **Auth**: Use Supabase Auth for all user identification.
- **Validation**: "Trust No Input". Validate everything with Zod on the server action/API route level.

---
*If you are unsure about a business rule, check `documents/` before asking the user.*
