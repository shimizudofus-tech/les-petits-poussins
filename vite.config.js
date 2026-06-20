import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
// base : '/' pour Netlify/Vercel (racine). Pour GitHub Pages (servi sous
// /nom-du-repo/), définir VITE_BASE=/nom-du-repo/ au build.
const base = process.env.VITE_BASE || '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'pwa-icon.svg',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'apple-touch-icon.png',
      ],
      manifest: {
        id: base,
        name: 'Les Petits Poussins',
        short_name: 'Poussins',
        description: 'Jeu éducatif pour enfants : ferme et animaux, coloriage, lecture, dictée et maths.',
        lang: 'fr',
        categories: ['education', 'games', 'kids'],
        theme_color: '#87CEEB',
        background_color: '#3a2a1a',
        display: 'fullscreen',
        orientation: 'portrait',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Ne pas renvoyer l'app (index.html) pour la page de test des voix.
        navigateFallbackDenylist: [/voix\.html/],
      },
    }),
  ],
})
