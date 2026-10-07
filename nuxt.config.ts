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
        { name: 'description', content: 'Shop authentic international products from trusted global brands. True global goods, right here in Tanzania.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        // Product images are the largest thing on every catalogue page.
        { rel: 'preconnect', href: 'https://res.cloudinary.com' }
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
    '/categories': { swr: 60 },
    '/categories/**': { swr: 60 },
    '/brands': { swr: 60 },
    '/brands/**': { swr: 60 },
    '/sitemap.xml': { swr: 300 },
    // Internal SEO report: token-gated, rendered in the browser, never indexed.
    '/admin/**': { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/api/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
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
    // Shared secret for the SEO report at /admin/seo. Set NUXT_SEO_AUDIT_TOKEN
    // in production; while it is empty the report is only reachable in dev.
    seoAuditToken: '',
    public: {
      apiBase: process.env.API_BASE_URL || 'https://business.mwendavano.com/api',
      // Origin used for canonical URLs, Open Graph, structured data and the sitemap.
      siteUrl: process.env.SITE_URL || 'https://store.mwendavano.com',
      // Search Console "HTML tag" verification code (NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION).
      googleSiteVerification: ''
    }
  }
})
