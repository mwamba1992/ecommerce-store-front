<template>
  <div class="max-w-[1184px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
    <Breadcrumbs :crumbs="crumbs" class="mb-6" />

    <header class="mb-8 max-w-3xl">
      <h1 class="title text-4xl sm:text-5xl mb-3">{{ heading }}</h1>
      <p class="text-gray-600 leading-relaxed">{{ intro }}</p>
      <p v-if="note" class="text-gray-600 leading-relaxed mt-2">{{ note }}</p>
    </header>

    <!-- Cross-links: brands within a category, or categories within a brand -->
    <nav v-if="links.length > 0" :aria-label="linksLabel" class="mb-8">
      <h2 class="kicker mb-3">{{ linksLabel }}</h2>
      <ul class="flex flex-wrap gap-2">
        <li v-for="link in visibleLinks" :key="link.path">
          <NuxtLink
            :to="link.path"
            class="chip !bg-white border border-gray-200 hover:border-gray-900"
          >
            {{ link.name }}
          </NuxtLink>
        </li>
        <li v-if="links.length > LINK_LIMIT">
          <button type="button" @click="expanded = !expanded" class="chip !bg-transparent underline" :aria-expanded="expanded">
            {{ expanded ? 'Show fewer' : `Show all ${links.length}` }}
          </button>
        </li>
      </ul>
    </nav>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>

    <section class="mt-12 border-t border-gray-200 pt-8 max-w-3xl text-sm text-gray-600 leading-relaxed">
      <h2 class="text-lg font-semibold text-gray-900 mb-2">Ordering and delivery</h2>
      <p>
        Order online or on WhatsApp and pay by cash on delivery or mobile money (M-Pesa, Tigo Pesa, Airtel Money).
        Delivery is same day or next day within Dar es Salaam and 2–5 business days to other regions.
        See <NuxtLink to="/shipping" class="text-gray-900 font-semibold underline">shipping</NuxtLink> and
        <NuxtLink to="/returns" class="text-gray-900 font-semibold underline">returns</NuxtLink> for details.
      </p>
    </section>
  </div>
</template>

<script setup>
// Shared body of the category and brand pages.
const props = defineProps({
  crumbs: { type: Array, required: true },
  heading: { type: String, required: true },
  intro: { type: String, required: true },
  note: { type: String, default: '' },
  products: { type: Array, required: true },
  links: { type: Array, default: () => [] },
  linksLabel: { type: String, default: '' }
})

// A long list of cross-links would push the products down the page, so only
// the largest few show until asked for.
const LINK_LIMIT = 6
const expanded = ref(false)
const visibleLinks = computed(() => (expanded.value ? props.links : props.links.slice(0, LINK_LIMIT)))
</script>
