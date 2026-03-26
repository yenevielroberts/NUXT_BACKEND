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
  runtimeConfig: {
    public: {
      // Origin allowed to make requests from the Quasar frontend (can be comma-separated list)
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:8080',
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
