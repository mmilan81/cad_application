// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Aggiorna l'app automaticamente in background se pubblichi modifiche
      devOptions: {
        enabled: true // Ci permette di testare la PWA anche in modalità sviluppo
      },
      manifest: {
        name: 'CAD Didattico Elettrico',
        short_name: 'CAD Elettrico',
        description: 'Simulatore per cablaggi di impianti elettrici didattici',
        theme_color: '#2c3e50',
        background_color: '#ffffff',
        display: 'standalone', // Nasconde la barra degli indirizzi, facendola sembrare un vero programma
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Questi sono i file che verranno salvati per l'uso offline
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
})