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

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'https://business.mwendavano.com/api'
    }
  }
})
