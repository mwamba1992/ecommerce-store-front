<template>
  <section>
    <div class="flex items-center justify-between gap-4 mb-5">
      <h2 class="text-[22px] leading-8 font-semibold text-gray-900">{{ title }}</h2>
      <div class="flex items-center gap-2">
        <NuxtLink v-if="to" :to="to" class="text-sm font-semibold text-gray-900 underline mr-2">See all</NuxtLink>
        <button type="button" @click="page(-1)" :disabled="atStart" class="hidden sm:flex w-10 h-10 rounded-full items-center justify-center bg-gray-900 text-white disabled:bg-gray-200 disabled:text-gray-400 transition-colors" aria-label="Previous products">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button type="button" @click="page(1)" :disabled="atEnd" class="hidden sm:flex w-10 h-10 rounded-full items-center justify-center bg-gray-900 text-white disabled:bg-gray-200 disabled:text-gray-400 transition-colors" aria-label="Next products">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>

    <!-- A scrolling row: swipe on touch, arrows elsewhere. Every card is a real
         link in the server-rendered HTML, whether or not it is on screen. -->
    <ul ref="track" @scroll.passive="measure" class="flex gap-4 overflow-x-auto snap-x pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <li v-for="product in products" :key="product.id" class="snap-start flex-shrink-0 w-[232px] sm:w-[256px]">
        <ProductCard :product="product" />
      </li>
    </ul>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  to: { type: String, default: '' },
  products: { type: Array, required: true }
})

const track = ref(null)
const atStart = ref(true)
const atEnd = ref(false)

const measure = () => {
  const el = track.value
  if (!el) return
  atStart.value = el.scrollLeft <= 4
  atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
}

const page = (direction) => {
  // One card short of a full page, so the shopper keeps their place.
  const animate = document.visibilityState === 'visible' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  track.value?.scrollBy({
    left: direction * Math.max(272, track.value.clientWidth - 272),
    behavior: animate ? 'smooth' : 'instant'
  })
}

onMounted(measure)
</script>
