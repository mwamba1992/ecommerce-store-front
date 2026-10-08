<template>
  <div>
    <div class="relative rounded-tile bg-white overflow-hidden">
      <!-- One photo per snap point: swipe on touch, arrows and thumbnails elsewhere.
           Every photo is in the server-rendered HTML; only the first loads eagerly. -->
      <ul
        v-if="images.length > 0"
        ref="track"
        class="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        @scroll.passive="onScroll"
      >
        <li v-for="(image, index) in images" :key="image" class="snap-center flex-shrink-0 w-full aspect-square">
          <img
            :src="productImage(image, 'detail')"
            :alt="images.length > 1 ? `${alt} – photo ${index + 1} of ${images.length}` : alt"
            :width="imageSize(image, 'detail')?.width"
            :height="imageSize(image, 'detail')?.height"
            :loading="index === 0 ? 'eager' : 'lazy'"
            :fetchpriority="index === 0 ? 'high' : undefined"
            class="w-full h-full object-contain p-4 sm:p-8"
            :class="{ 'opacity-50': dimmed }"
          />
        </li>
      </ul>

      <!-- No photograph yet -->
      <div v-else class="aspect-square flex items-center justify-center" :style="{ backgroundColor: tint }">
        <span class="text-8xl font-semibold text-gray-900/20" aria-hidden="true">{{ initial }}</span>
      </div>

      <template v-if="images.length > 1">
        <button type="button" @click="go(active - 1)" :disabled="active === 0" class="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-card items-center justify-center text-gray-700 hover:text-gray-900 disabled:opacity-0 transition-opacity" aria-label="Previous photo">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button type="button" @click="go(active + 1)" :disabled="active === images.length - 1" class="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-card items-center justify-center text-gray-700 hover:text-gray-900 disabled:opacity-0 transition-opacity" aria-label="Next photo">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
        <span class="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-gray-900/80 text-white text-xs font-medium">
          {{ active + 1 }} / {{ images.length }}
        </span>
      </template>

      <slot />
    </div>

    <!-- Thumbnails drive the gallery; the active one is ringed in gold -->
    <ul v-if="images.length > 1" class="flex gap-3 mt-4 overflow-x-auto pb-1">
      <li v-for="(image, index) in images" :key="image" class="flex-shrink-0">
        <button
          type="button"
          @click="go(index)"
          class="block w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white overflow-hidden border-2 transition-colors"
          :class="index === active ? 'border-gray-900' : 'border-transparent hover:border-gray-200'"
          :aria-label="`Show photo ${index + 1}`"
          :aria-current="index === active"
        >
          <img :src="productImage(image, 'thumb')" alt="" width="200" height="200" loading="lazy" class="w-full h-full object-contain p-1.5" />
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  images: { type: Array, required: true },
  alt: { type: String, required: true },
  tint: { type: String, default: '#F2ECE7' },
  initial: { type: String, default: '' },
  dimmed: { type: Boolean, default: false }
})

const { productImage, imageSize } = useFormat()

const track = ref(null)
const active = ref(0)

const go = (index) => {
  const target = Math.max(0, Math.min(props.images.length - 1, index))
  // Updated here as well as from the scroll position, so the counter and the
  // highlighted thumbnail respond even when the slide itself is not animated.
  active.value = target

  // Slide only when it will actually be seen and is wanted: browsers do not
  // run animated scrolling on a hidden page, and some people turn motion off.
  const animate = document.visibilityState === 'visible' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  track.value?.scrollTo({ left: target * track.value.clientWidth, behavior: animate ? 'smooth' : 'instant' })
}

// The scroll position is the source of truth, so swiping and the buttons agree.
const onScroll = () => {
  if (!track.value) return
  active.value = Math.round(track.value.scrollLeft / track.value.clientWidth)
}
</script>
