# OtservHub - Regras de Stack Tecnológica e Desenvolvimento

Este documento define padrões rígidos para evitar alucinações técnicas e garantir qualidade de código. Todas as implementações devem seguir estas diretrizes.

## 1. Core Stack (Imutável)
- **Framework:** Next.js 14+ (App Router Obrigatório).
- **Linguagem:** TypeScript (Strict Mode).
- **Estilização:** Tailwind CSS v3.4+.
- **Database/Auth:** Supabase (PostgreSQL).
- **Ícones:** Lucide-React (Padrão moderno e leve).
- **Imagens:** Next.js `<Image/>` Component (Supabase Storage Domain).

## 2. Regras do Next.js (App Router)
- **Routing:** Use a pasta `app/`. Não use `pages/`.
- **Server Components:** Por padrão, tudo é Server Component. Use `'use client'` apenas quando necessário (interatividade, hooks, eventos de browser).
- **Data Fetching:** Prefira fazer fetch de dados diretamente no Server Component (async/await) em vez de `useEffect`.
- **Links:** Use o componente `<Link href="...">` do `next/link`. Nunca use tag `<a>` para navegação interna.
- **Redirects:** Use `redirect()` do `next/navigation` em Server Components e `router.push()` em Client Components.

## 3. Regras de Interface (UI/UX Premium)
- **Design System:** Baseado em "Glassmorphism Leve" e "Branco Minimalista" (conforme PRD).
- **Sombras:** Use sombras difusas (`shadow-lg`, `shadow-xl`) com opacidade reduzida para evitar visual "sujo".
- **Bordas:** Arredondadas (`rounded-xl` ou `rounded-2xl`) para cards e modais.
- **Responsividade:** Mobile-First. Sempre comece definindo classes bases (mobile) e depois `md:`, `lg:`.
- **Feedback:** Todo botão de ação deve ter estado `:hover` e feedback visual de loading (`disabled` + `spinner`).

## 4. Integração Supabase
- **Cliente:** Use métodos do pacote `@supabase/ssr` (Server-Side) para cookies seguros.
- **Tipagem:** Sempre gere e utilize os tipos do Database (`Database.ts`) para queries fortemente tipadas.
- **Auth:** Proteja rotas via Middleware (`middleware.ts`) e não apenas no frontend.

## 5. Regras de Negócio (Implementadas como Código)
- **Images:** Nunca faça hotlinking de URLs externas de servidores. Upload obrigatório.
- **Slugs:** Nunca assuma unicidade de nome. Trate erros de colisão de slug.
- **Hype:** Respeite os limites (3 Going, 5 Waiting). Use as triggers do banco, mas valide visualmente no front para UX.
- **Verificação:** Apenas Meta-tag. Não tente sockets TCP no front.

## 6. Prevenção de Erros Comuns
- **Hydration Errors:** Evite renderizar datas (`new Date()`) diretamente no server/client sem formatação consistente.
- **Zod:** Use `zod` para validar TODOS os inputs de formulário e rotas de API. "Trust no input".
- **Environment:** Nunca commitar chaves `.env`. Use variáveis prefixadas com `NEXT_PUBLIC_` apenas se seguro para exposição.
