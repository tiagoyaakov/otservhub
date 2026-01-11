/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta "Branco Futurista Gamer" definida no PRD
        background: '#FAFAFA', // Branco Gelo (Fundo Principal)
        surface: '#FFFFFF', // Branco Puro (Cards)
        
        // Acentos (Highlights)
        primary: {
          DEFAULT: '#007AFF', // Cyber Blue (Botões, Links)
          hover: '#0062CC',
          light: '#E5F1FF', // Bg de botões secundários
        },
        secondary: {
          DEFAULT: '#8B5CF6', // Neon Purple (Sponsors/Premium)
          hover: '#7C3AED',
        },
        
        // Status
        success: '#10B981', // Verde Online
        error: '#EF4444', // Vermelho Offline/Ocupado
        
        // Textos
        text: {
          main: '#1E293B', // Slate 800
          muted: '#64748B', // Slate 500
          light: '#94A3B8', // Slate 400
        },
        
        border: '#E2E8F0', // Slate 200
      },
      fontFamily: {
        // Recomendação: Usar 'Inter' ou 'Geist Sans' via next/font
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      boxShadow: {
        // Sombras "Soft Glass" para profundidade sem peso
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 10px 15px -3px rgba(0, 122, 255, 0.05), 0 4px 6px -2px rgba(0, 122, 255, 0.025)',
        'glow': '0 0 15px rgba(0, 122, 255, 0.3)', // Brilho neon sutil
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}