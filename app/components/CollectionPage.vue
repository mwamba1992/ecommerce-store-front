<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
    <Breadcrumbs :crumbs="crumbs" class="mb-6" />

    <header class="mb-8 max-w-3xl">
      <h1 class="text-3xl sm:text-4xl font-black text-gray-900 mb-3">{{ heading }}</h1>
      <p class="text-gray-600 leading-relaxed">{{ intro }}</p>
      <p v-if="note" class="text-gray-600 leading-relaxed mt-2">{{ note }}</p>
    </header>

    <!-- Cross-links: brands within a category, or categories within a brand -->
    <nav v-if="links.length > 0" :aria-label="linksLabel" class="mb-8">
      <h2 class="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">{{ linksLabel }}</h2>
      <ul class="flex flex-wrap gap-2">
        <li v-for="link in links" :key="link.path">
          <NuxtLink
            :to="link.path"
            class="inline-flex items-center px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:border-yellow-400 hover:text-yellow-600 transition-colors"
          >
            {{ link.name }}
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>

    <section class="mt-12 border-t border-gray-200 pt-8 max-w-3xl text-sm text-gray-600 leading-relaxed">
      <h2 class="text-lg font-bold text-gray-900 mb-2">Ordering and delivery</h2>
      <p>
        Order online or on WhatsApp and pay by cash on delivery or mobile money (M-Pesa, Tigo Pesa, Airtel Money).
        Delivery is same day or next day within Dar es Salaam and 2–5 business days to other regions.
        See <NuxtLink to="/shipping" class="text-yellow-600 font-semibold hover:underline">shipping</NuxtLink> and
        <NuxtLink to="/returns" class="text-yellow-600 font-semibold hover:underline">returns</NuxtLink> for details.
      </p>
    </section>
  </div>
</template>

<script setup>
// Shared body of the category and brand pages.
defineProps({
  crumbs: { type: Array, required: true },
  heading: { type: String, required: true },
  intro: { type: String, required: true },
  note: { type: String, default: '' },
  products: { type: Array, required: true },
  links: { type: Array, default: () => [] },
  linksLabel: { type: String, default: '' }
})
</script>
