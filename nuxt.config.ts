// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  srcDir: 'app/',

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },

  app: {
    head: {
      title: 'Global Authentic TZ - True Global Goods, Right Here in TZ',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Shop authentic international products from trusted global brands. True global goods, right here in Tanzania.' },
        { name: 'keywords', content: 'Tanzania shopping, authentic products, global brands, international products, online store Tanzania' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // Cache the catalogue pages at the edge/server and revalidate in the
  // background. These render the same HTML for every visitor and are the
  // pages search engines and shoppers hit first, so serving them from cache
  // avoids refetching and re-rendering all 118 products per visit.
  // 60s is short enough that a price or stock change is never far behind, and
  // stock is re-checked server-side at order time regardless.
  routeRules: {
    '/': { swr: 60 },
    '/products': { swr: 60 },
    '/products/**': { swr: 60 },
    // Personal or stateful — must never be cached and shared between visitors.
    '/cart': { swr: false },
    '/checkout': { swr: false },
    '/account': { swr: false },
    '/wishlist': { swr: false },
    '/login': { swr: false },
    '/register': { swr: false },
    '/set-password': { swr: false }
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'https://business.mwendavano.com/api'
    }
  }
})
