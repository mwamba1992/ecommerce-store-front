<template>
  <div>
    <!-- Header band -->
    <div class="bg-gradient-to-br from-gray-900 via-black to-gray-900 border-b border-yellow-500/20">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
        <h1 class="text-3xl sm:text-4xl font-black text-white">{{ title }}</h1>
        <p v-if="subtitle" class="text-gray-300 mt-3 max-w-2xl mx-auto">{{ subtitle }}</p>
        <div class="w-20 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mt-5"></div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <article class="prose prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-yellow-600 prose-strong:text-gray-900">
        <slot />
      </article>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' }
})
</script>
