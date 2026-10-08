<template>
  <div class="max-w-[1184px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
    <Breadcrumbs :crumbs="crumbs" class="mb-6" />

    <header class="mb-10 max-w-3xl">
      <h1 class="title text-4xl sm:text-5xl mb-3">{{ heading }}</h1>
      <p class="text-gray-600 leading-relaxed">{{ intro }}</p>
    </header>

    <ul v-if="groups.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      <li v-for="group in groups" :key="group.path">
        <NuxtLink
          :to="group.path"
          class="group flex items-center gap-4 h-full card p-4 transition-shadow duration-300 hover:shadow-lift"
        >
          <span class="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0" :style="{ backgroundColor: group.cover ? '#fff' : tintFor(group.id) }">
            <img v-if="group.cover" :src="productImage(group.cover, 'thumb')" alt="" width="200" height="200" loading="lazy" class="w-full h-full object-contain p-1" />
            <span v-else class="text-xl font-semibold text-gray-900/30" aria-hidden="true">{{ initialOf(group.label) }}</span>
          </span>
          <span class="min-w-0">
            <h2 class="text-base font-semibold text-gray-900 leading-tight">{{ group.label }}</h2>
            <span class="text-sm text-gray-500">{{ group.count }} product{{ group.count === 1 ? '' : 's' }}</span>
          </span>
        </NuxtLink>
      </li>
    </ul>

    <div v-else class="text-center py-20">
      <p class="text-gray-600 mb-8">Nothing to show here yet.</p>
      <NuxtLink to="/products" class="btn-primary">
        Browse All Products
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
// Shared body of /categories and /brands.
const { productImage } = useFormat()

defineProps({
  crumbs: { type: Array, required: true },
  heading: { type: String, required: true },
  intro: { type: String, required: true },
  groups: { type: Array, required: true }
})
</script>
