<template>
  <div>
    <!-- Banner: a dark panel with the pitch on the left and one product to buy on the right -->
    <section class="max-w-[1184px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <div class="relative rounded-tile overflow-hidden bg-gray-900 text-white">
        <img v-if="heroImage" :src="heroImage" alt="" class="absolute inset-0 w-full h-full object-cover" />
        <!-- Keeps the copy legible over any photograph -->
        <div v-if="heroImage" class="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent"></div>

        <div class="relative flex flex-col lg:flex-row lg:items-center gap-8 p-6 sm:p-10">
          <div class="flex-1 lg:max-w-xl">
            <p class="mb-4">Global Authentic TZ · Kariakoo, Dar es Salaam</p>
            <h1 class="font-serif font-semibold tracking-tight text-4xl sm:text-[56px] leading-[1.1] mb-6">
              Original smart watches, earbuds and gadgets in Tanzania
            </h1>
            <p class="text-lg sm:text-xl leading-relaxed max-w-lg mb-8">
              {{ data.total }} products from {{ brands.length }} global brands, with prices in TZS and delivery across the country.
            </p>
            <div class="flex flex-wrap gap-3">
              <NuxtLink to="/products" class="inline-flex items-center justify-center h-12 px-6 rounded-md border border-white text-white font-semibold hover:bg-white hover:text-gray-900 transition-colors">
                Shop all products
              </NuxtLink>
              <a href="https://wa.me/255789947608" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center h-12 px-6 rounded-md text-white underline hover:no-underline">
                Order on WhatsApp
              </a>
            </div>
          </div>

          <!-- Featured product -->
          <div v-if="featured" class="w-full sm:w-[288px] lg:ml-auto flex-shrink-0">
            <ProductCard :product="featured" />
          </div>
        </div>
      </div>
    </section>

    <!-- What buying here is like: every line is the store's stated policy -->
    <section class="max-w-[1184px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <ul class="card grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100">
        <li v-for="promise in promises" :key="promise.title" class="flex items-start gap-3 p-4 sm:p-5">
          <span class="w-10 h-10 rounded-full bg-gray-100 text-gray-900 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="promise.icon" /></svg>
          </span>
          <span>
            <span class="block text-base font-medium text-gray-900">{{ promise.title }}</span>
            <span class="block text-sm text-gray-500 leading-snug mt-0.5">{{ promise.body }}</span>
          </span>
        </li>
      </ul>
    </section>

    <!-- Category rail -->
    <section class="max-w-[1184px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      <div class="flex items-end justify-between mb-5">
        <h2 class="text-[22px] leading-8 font-semibold text-gray-900">Shop by category</h2>
        <NuxtLink to="/categories" class="text-sm font-semibold text-gray-900 underline">See all</NuxtLink>
      </div>
      <ul class="flex gap-4 sm:gap-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
        <li v-for="category in categories" :key="category.id" class="snap-start flex-shrink-0">
          <NuxtLink :to="categoryPath(category)" class="group flex flex-col items-center w-28 sm:w-32 text-center">
            <span class="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden flex items-center justify-center transition-shadow group-hover:shadow-lift" :style="{ backgroundColor: category.cover ? '#fff' : tintFor(category.id) }">
              <img v-if="category.cover" :src="productImage(category.cover, 'thumb')" alt="" width="200" height="200" loading="lazy" class="w-full h-full object-contain p-2.5" />
              <span v-else class="text-2xl font-semibold text-gray-900/30" aria-hidden="true">{{ initialOf(category.label) }}</span>
            </span>
            <span class="mt-3 text-base text-gray-900 leading-tight">{{ category.label }}</span>
            <span class="text-sm text-gray-500">{{ category.count }} {{ category.count === 1 ? 'product' : 'products' }}</span>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <!-- Product rows: newest first, then one row per main category -->
    <div class="max-w-[1184px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
      <ProductRail v-if="products.length > 0" title="New arrivals" to="/products" :products="products" />
      <ProductRail v-for="rail in data.rails" :key="rail.category.id" :title="rail.category.label" :to="categoryPath(rail.category)" :products="rail.products" />
    </div>

    <!-- Brands -->
    <section class="max-w-[1184px] mx-auto px-4 sm:px-6 lg:px-8 mt-14">
      <h2 class="text-[22px] leading-8 font-semibold text-gray-900 mb-5">Shop by brand</h2>
      <ul class="flex flex-wrap gap-2.5">
        <li v-for="brand in brands.slice(0, 10)" :key="brand.id">
          <NuxtLink :to="brandPath(brand)" class="chip !bg-white border border-gray-200 hover:border-gray-900">
            {{ brand.label }}
            <span class="text-gray-400">{{ brand.count }}</span>
          </NuxtLink>
        </li>
        <li v-if="brands.length > 10">
          <NuxtLink to="/brands" class="chip !bg-transparent underline">All {{ brands.length }} brands</NuxtLink>
        </li>
      </ul>
    </section>

    <!-- Help choosing -->
    <section class="max-w-[1184px] mx-auto px-4 sm:px-6 lg:px-8 my-14">
      <div class="rounded-tile bg-gray-900 text-white p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 class="text-2xl font-semibold mb-2">Not sure which one to pick?</h2>
          <p class="text-gray-300 max-w-xl">Tell us your budget and what you need it for. We reply on WhatsApp, usually within a few hours.</p>
        </div>
        <a href="https://wa.me/255789947608" target="_blank" rel="noopener noreferrer" class="btn-secondary flex-shrink-0">Chat on WhatsApp</a>
      </div>
    </section>
  </div>
</template>

<script setup>
import { SITE, brandPath, categoryPath, collectBrands, collectCategories, hasPrice, websiteJsonLd } from '#shared/utils/seo'

const siteUrl = useSiteUrl()

// Server-rendered: fetched on the server for fast first paint + SEO
const { productImage } = useFormat()

const data = await useCatalogue('home', all => ({
  total: all.length,
  // The catalogue arrives newest first.
  products: all.slice(0, 8),
  featured: all.find(p => p.imageUrl && p.inStock && hasPrice(p)) ?? null,
  // Each category is pictured by one of its own products.
  categories: collectCategories(all).map(category => ({
    ...category,
    cover: all.find(p => p.category?.id === category.id && p.imageUrl)?.imageUrl ?? null
  })),
  // A row for each of the three largest categories, buyable products first.
  rails: collectCategories(all).slice(0, 3).map(category => ({
    category,
    products: all
      .filter(p => p.category?.id === category.id)
      .sort((a, b) => Number(b.inStock) - Number(a.inStock) || Number(Boolean(b.imageUrl)) - Number(Boolean(a.imageUrl)))
      .slice(0, 8)
  })),
  brands: collectBrands(all)
}))

const { heroImage } = useRuntimeConfig().public

// The product on the banner: the newest one that can be bought and has a photo.
const featured = computed(() => data.value.featured)

// Stated on the shipping, help and returns pages; keep the three in step.
const promises = [
  { title: '100% authentic', body: 'Quality-checked before dispatch', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { title: 'Fast delivery', body: 'Same or next day in Dar, 2–5 days elsewhere', icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0' },
  { title: 'Pay on delivery', body: 'Cash or M-Pesa, Tigo Pesa, Airtel Money', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  { title: '7-day returns', body: 'Unused, in original packaging', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' }
]

const products = computed(() => data.value.products)
const categories = computed(() => data.value.categories)
const brands = computed(() => data.value.brands)

useSeo({
  title: `${SITE.name} | Original Smart Watches, Earbuds & Gadgets in Tanzania`,
  description: 'Shop original smart watches, fitness bands, earbuds and accessories from trusted global brands. Based in Kariakoo, Dar es Salaam, with delivery across Tanzania.',
  path: '/',
  jsonLd: [websiteJsonLd(siteUrl)]
})
</script>
