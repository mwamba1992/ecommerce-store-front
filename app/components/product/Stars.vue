<template>
  <span class="inline-flex items-center gap-1 text-xs text-gray-900" role="img" :aria-label="`Rated ${average.toFixed(1)} out of 5 from ${count} reviews`">
    <!-- Grey stars with a black copy clipped to the score on top -->
    <span class="relative inline-flex" aria-hidden="true">
      <span class="flex text-gray-300">
        <svg v-for="n in 5" :key="n" class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path :d="STAR" /></svg>
      </span>
      <span class="absolute inset-y-0 left-0 flex overflow-hidden text-gray-900" :style="{ width: `${(average / 5) * 100}%` }">
        <svg v-for="n in 5" :key="n" class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path :d="STAR" /></svg>
      </span>
    </span>
    <span aria-hidden="true"><span class="font-semibold">{{ average.toFixed(1) }}/5</span> <span>({{ count.toLocaleString('en-US') }})</span></span>
  </span>
</template>

<script setup>
defineProps({
  average: { type: Number, required: true },
  count: { type: Number, required: true }
})

const STAR = 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'
</script>
