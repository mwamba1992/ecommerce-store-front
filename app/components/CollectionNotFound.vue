<template>
  <div class="text-center py-20 px-4">
    <h1 class="text-2xl font-semibold text-gray-900 mb-3">{{ title }}</h1>
    <p class="text-gray-600 mb-8">The page you're looking for doesn't exist or has been removed.</p>
    <NuxtLink :to="to" class="btn-primary">
      {{ label }}
    </NuxtLink>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  to: { type: String, required: true },
  label: { type: String, required: true }
})
</script>
