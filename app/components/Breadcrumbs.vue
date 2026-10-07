<template>
  <nav aria-label="Breadcrumb" class="text-sm">
    <ol class="flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-600">
      <template v-for="(crumb, index) in crumbs" :key="crumb.path">
        <li v-if="index > 0" class="text-gray-400" aria-hidden="true">›</li>
        <li v-if="index < crumbs.length - 1">
          <NuxtLink :to="crumb.path" class="hover:text-yellow-500 transition-colors">{{ crumb.name }}</NuxtLink>
        </li>
        <li v-else class="text-gray-900 font-medium" aria-current="page">{{ crumb.name }}</li>
      </template>
    </ol>
  </nav>
</template>

<script setup>
// The same list feeds the BreadcrumbList structured data on each page, so the
// visible trail and the one search engines read cannot drift apart.
defineProps({
  crumbs: { type: Array, required: true }
})
</script>
