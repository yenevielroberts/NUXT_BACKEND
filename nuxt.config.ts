// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  // css: ["tailwindcss", "@nuxt/ui"],
  modules: ["@nuxt/eslint", "@nuxt/ui", "nuxt-auth-utils"],
  nitro: {
    routeRules: {
      '/api/**': {
        // CORS will be handled by server/middleware/cors.ts instead of Nitro's automatic handler
      },
    },
  },
  devServer: {
    host: '0.0.0.0', // Permite conexiones externas (como las del emulador)
    port: 3000       // El puerto que quieres usar
  },
  runtimeConfig: {
    public: {
      // Origin allowed to make requests from the Quasar frontend (can be comma-separated list)
      corsOrigin: process.env.CORS_ORIGIN || 'https://localhost:8080',
      // Base URL pública que deben usar frontends (Quasar/Nuxt) y apps móviles
      apiBase: process.env.API_BASE || process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000',
    },
    oauth: {
      // provider in lowercase (github, google, etc.)
      github: {
        clientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID || '',
        clientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET || '',
      },
    },
  },
})
