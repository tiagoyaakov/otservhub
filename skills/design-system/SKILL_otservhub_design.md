---
name: otservhub-design
description: The definitive design system and aesthetic guide for OtservHub ("Vibecode"). Use this skill when creating or modifying any UI component, page, or layout to ensure compliance with the "Branco Futurista" and Glassmorphism standards.
---

# OtservHub Design System ("Vibecode")

This skill defines the visual language of OtservHub. Our goal is to create a "Premium, High-Performance" experience that feels alive.

## 1. Core Aesthetic Principles

- **"Branco Futurista" (Futuristic White)**: The primary theme is clean, white, and airy (`#FAFAFA`), accented by high-definition colors.
- **Glassmorphism**: Use translucent backgrounds (`backdrop-blur`) for floating elements (navbars, modals, hovering cards).
- **Vibecode**: The interface must trigger an emotional response ("Vibe"). It should feel smooth, fast, and premium.
- **No Flatness**: Avoid purely flat designs. Use subtle shadows and gradients to create depth.

## 2. Color Palette (Strict)

Use these Tailwind classes or hex codes. Do NOT invent new colors.

### Surfaces

- **Background**: `#FAFAFA` (Ice White) -> `bg-[#FAFAFA]`
- **Surface (Cards)**: `#FFFFFF` (Pure White) -> `bg-white`

### Brand Accents

- **Primary (Cyber Blue)**: `#007AFF` -> `text-primary`, `bg-primary`
  - *Use for*: CTAs, active states, primary links.
- **Secondary (Neon Purple)**: `#8B5CF6` -> `text-secondary`, `bg-secondary`
  - *Use for*: Premium features, gradients, "Featured" tags.

### Status

- **Success (Online)**: `#10B981` -> `text-success`
- **Error (Offline)**: `#EF4444` -> `text-error`

### Text

- **Main**: `#1E293B` (Slate 800) -> `text-slate-800`
- **Muted**: `#64748B` (Slate 500) -> `text-slate-500`

## 3. UI Components & Tokens

### Shadows (Soft Glass)

Create depth without heavy keylines.

- **Card**: `shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02),0_2px_4px_-1px_rgba(0,0,0,0.02)]`
- **Hover Glow**: `shadow-[0_0_15px_rgba(0,122,255,0.3)]` (Use specifically for `hover:` states on interactive cards).

### Border Radius

- **Standard**: `rounded-xl` or `rounded-2xl`. Avoid sharp edges (`rounded-none` or `rounded-sm`) unless absolutely necessary for data tables.

### Typography

- **Font**: Inter or Geist Sans.
- **Headings**: Bold/Semibold, tight tracking (`tracking-tight`).
- **Body**: Regular/Medium, tailored line-heights.

## 4. Animations (Framer Motion & Tailwind)

The interface must be dynamic. static pages are unacceptable.

- **Micro-interactions**: buttons should scale slightly on click (`active:scale-95`).
- **Entrances**: Page content should fade in (`opacity-0 animate-in fade-in zoom-in-95`).
- **Glow Effects**: Use `animate-pulse-slow` for status indicators (e.g., "Online" count).

## 5. Implementation Examples

### The "Glass Card"

```tsx
<div className="group relative bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-glow transition-all duration-300">
  <h3 className="text-slate-800 font-bold text-lg">Server Name</h3>
  <p className="text-slate-500 text-sm">Description text...</p>
</div>
```

### The "Cyber Button"

```tsx
<button className="bg-[#007AFF] hover:bg-[#0062CC] text-white font-medium px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/30 active:scale-95 transition-transform">
  Connect Now
</button>
```

## 6. Do's and Don'ts

| Do | Don't |
| :--- | :--- |
| Use `backdrop-blur` for overlays | Use solid opaque grays for overlays |
| Use `text-slate-500` for secondary text | Use light gray `#CCCCCC` (hard to read) |
| animate icons on hover | Leave icons static |
| Validate designs against "Vibecode" | Ship "Bootstrap-looking" or generic UIs |
