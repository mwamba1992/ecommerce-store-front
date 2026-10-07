<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
    <Breadcrumbs :crumbs="crumbs" class="mb-6" />

    <header class="mb-10 max-w-3xl">
      <h1 class="text-3xl sm:text-4xl font-black text-gray-900 mb-3">{{ heading }}</h1>
      <p class="text-gray-600 leading-relaxed">{{ intro }}</p>
    </header>

    <ul v-if="groups.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      <li v-for="group in groups" :key="group.path">
        <NuxtLink
          :to="group.path"
          class="block h-full bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:border-yellow-400 transition-all duration-300 p-5"
        >
          <h2 class="text-base font-bold text-gray-900 mb-1">{{ group.label }}</h2>
          <p class="text-sm text-yellow-600 font-bold">{{ group.count }} product{{ group.count === 1 ? '' : 's' }}</p>
        </NuxtLink>
      </li>
    </ul>

    <div v-else class="text-center py-20">
      <p class="text-gray-600 mb-8">Nothing to show here yet.</p>
      <NuxtLink to="/products" class="inline-flex items-center justify-center px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl transition-all duration-300 shadow-lg">
        Browse All Products
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
// Shared body of /categories and /brands.
defineProps({
  crumbs: { type: Array, required: true },
  heading: { type: String, required: true },
  intro: { type: String, required: true },
  groups: { type: Array, required: true }
})
</script>
