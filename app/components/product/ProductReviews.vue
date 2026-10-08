<template>
  <section class="mt-14" aria-labelledby="reviews-heading">
    <h2 id="reviews-heading" class="text-[22px] leading-8 font-semibold text-gray-900 mb-5">Customer reviews</h2>

    <div v-if="summary && summary.count > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
      <!-- Score and breakdown -->
      <div class="card p-6 h-fit">
        <p class="flex items-baseline gap-2">
          <span class="text-5xl font-semibold tracking-tight text-gray-900">{{ summary.average.toFixed(1) }}</span>
          <span class="text-gray-600">out of 5</span>
        </p>
        <ProductStars :average="summary.average" :count="summary.count" class="mt-2" />

        <ul class="mt-5 space-y-2">
          <li v-for="stars in [5, 4, 3, 2, 1]" :key="stars" class="flex items-center gap-3 text-sm text-gray-700">
            <span class="w-12 flex-shrink-0">{{ stars }} star</span>
            <span class="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden" aria-hidden="true">
              <span class="block h-full rounded-full bg-gray-900" :style="{ width: `${(summary.breakdown[stars] / summary.count) * 100}%` }"></span>
            </span>
            <span class="w-8 text-right text-gray-600">{{ summary.breakdown[stars] }}</span>
          </li>
        </ul>

        <p class="mt-5 pt-5 border-t border-gray-100 text-sm text-gray-600">
          Only customers who received this product can rate it.
        </p>
      </div>

      <!-- Reviews -->
      <ul class="lg:col-span-2 card divide-y divide-gray-100">
        <li v-for="review in visible" :key="review.id" class="p-5 sm:p-6">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="relative inline-flex" role="img" :aria-label="`${review.rating} out of 5`">
              <span class="flex text-gray-300">
                <svg v-for="n in 5" :key="n" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path :d="STAR" /></svg>
              </span>
              <span class="absolute inset-y-0 left-0 flex overflow-hidden text-gray-900" :style="{ width: `${review.rating * 20}%` }">
                <svg v-for="n in 5" :key="n" class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path :d="STAR" /></svg>
              </span>
            </span>
            <time class="text-sm text-gray-500" :datetime="review.createdAt">{{ formatDate(review.createdAt) }}</time>
          </div>
          <p v-if="review.comment" class="mt-2.5 text-gray-800 leading-relaxed">{{ review.comment }}</p>
          <p class="mt-2 text-sm text-gray-600">
            {{ review.name }}
            <span class="inline-flex items-center gap-1 ml-2 text-[#006B40]">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
              Verified purchase
            </span>
          </p>
        </li>
        <li v-if="summary.reviews.length > visible.length" class="p-4 text-center">
          <button type="button" @click="showAll = true" class="text-sm font-semibold text-gray-900 underline">
            Show all {{ summary.reviews.length }} reviews
          </button>
        </li>
      </ul>
    </div>

    <!-- None yet -->
    <div v-else-if="summary" class="card p-6 sm:p-8">
      <p class="font-semibold text-gray-900 mb-1">No reviews yet</p>
      <p class="text-gray-600">
        Bought this from us? Once your order is delivered you can rate it from
        <NuxtLink to="/account" class="text-gray-900 font-semibold underline">your account</NuxtLink>.
      </p>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  product: { type: Object, required: true }
})

const { forProduct } = useReviews()

const STAR = 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'
const FIRST_PAGE = 5

// Loaded in the browser after the page: reviews change more often than the
// cached product page around them, and the page must not wait on them.
const summary = ref(null)
const showAll = ref(false)
const visible = computed(() => (showAll.value ? summary.value.reviews : summary.value.reviews.slice(0, FIRST_PAGE)))

const load = async () => {
  showAll.value = false
  try {
    summary.value = await forProduct(props.product)
  } catch {
    summary.value = null
  }
}

onMounted(load)
watch(() => props.product.id, load)

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
</script>
