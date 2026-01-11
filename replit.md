# OtservHub

## Overview
OtservHub é uma plataforma moderna para listagem e descoberta de servidores de Open Tibia (OTServer). O projeto foca na experiência do usuário (UX), na veracidade dos dados e no engajamento social ("Hype").

## Current State
- **Status**: MVP em desenvolvimento
- **Data**: Janeiro 2026
- **Homepage**: Implementada com todos os componentes visuais principais

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS v4
- **Database/Auth**: Supabase (PostgreSQL) - a ser configurado
- **Ícones**: Lucide-React
- **Imagens**: Next.js Image component

## Project Architecture

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── layout/            # Layout components (Header, Footer)
│   ├── home/              # Homepage-specific components
│   │   ├── HeroBanner.tsx   # Carousel de sponsors
│   │   ├── SearchFilters.tsx # Barra de busca e filtros
│   │   ├── Sidebar.tsx      # Categorias laterais
│   │   ├── ServerTable.tsx  # Tabela de servidores
│   │   └── AdBanner.tsx     # Espaço publicitário
│   └── ui/                # Reusable UI components (shadcn/ui)
├── data/
│   └── mockServers.ts     # Mock data for development
├── lib/
│   ├── supabase/          # Supabase client configuration
│   └── utils.ts           # Utility functions
└── types/
    └── database.types.ts  # Database types
```

### Key Features (MVP)
1. **Listagem Principal (Countdown)**: Servidores ordenados por data de lançamento
2. **Filtros Rápidos**: Versão, Tipo de PvP, Mapa
3. **Sistema de Hype**: GOING (3 max), WAITING (5 max), MAYBE (ilimitado)
4. **Hero Banner**: Carousel de servidores patrocinados
5. **Dashboard de Sponsors**: Self-service para compra de slots

### Design System
- **Tema**: "Branco Futurista & Minimalista"
- **Fundo**: Branco Gelo (#FAFAFA)
- **Acentos**: Cyber Blue (#007AFF), Neon Purple
- **Tipografia**: Inter (font-sans)
- **Cards**: Sombras suaves, bordas arredondadas

## Recent Changes
- **2026-01-11**: Homepage completa implementada
  - Header com navegação e botões de autenticação
  - Hero Banner com carousel automático (5s)
  - Barra de busca com filtros (Versão, Tipo, Mapa)
  - Sidebar com categorias (Oldschool, Baiak, War)
  - Tabela de servidores com countdown
  - Footer com links e informações legais
  - Espaço publicitário lateral (160x600)

## Environment Variables
Variáveis necessárias para produção:
- `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave pública do Supabase

## Development
```bash
npm run dev    # Servidor de desenvolvimento (porta 5000)
npm run build  # Build de produção
npm run start  # Servidor de produção
```

## User Preferences
- Idioma principal: Português (BR)
- Design limpo e moderno
- Foco em UX e performance
