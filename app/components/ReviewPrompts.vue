<template>
  <section v-if="pending.length > 0" class="card p-6 mb-8" aria-labelledby="rate-heading">
    <h2 id="rate-heading" class="text-xl font-semibold text-gray-900 mb-1">Rate your purchases</h2>
    <p class="text-gray-600 mb-5">Your rating helps other shoppers. A comment is optional.</p>

    <ul class="divide-y divide-gray-100">
      <li v-for="entry in pending" :key="`${entry.orderId}:${entry.itemId}`" class="py-5 first:pt-0 last:pb-0">
        <div class="flex gap-4">
          <span class="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 border border-gray-100" :style="{ backgroundColor: entry.imageUrl ? '#fff' : tintFor(entry.itemId) }">
            <img v-if="entry.imageUrl" :src="productImage(entry.imageUrl, 'thumb')" alt="" width="200" height="200" class="w-full h-full object-contain" />
            <span v-else class="text-xl font-medium text-gray-400" aria-hidden="true">{{ initialOf(entry.name) }}</span>
          </span>

          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-900">{{ entry.name }}</p>
            <p class="text-sm text-gray-500 mb-3">Order {{ entry.orderNumber }}</p>

            <!-- Stars: a radio group, so it works from the keyboard -->
            <fieldset>
              <legend class="sr-only">Your rating for {{ entry.name }}</legend>
              <div class="flex gap-1" @mouseleave="hover[key(entry)] = 0">
                <label v-for="n in 5" :key="n" class="cursor-pointer" @mouseenter="hover[key(entry)] = n">
                  <input v-model="drafts[key(entry)].rating" type="radio" :name="`rating-${key(entry)}`" :value="n" class="sr-only peer" />
                  <svg class="w-8 h-8 rounded peer-focus-visible:ring-2 peer-focus-visible:ring-gray-900" :class="n <= (hover[key(entry)] || drafts[key(entry)].rating) ? 'text-gray-900' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path :d="STAR" /></svg>
                  <span class="sr-only">{{ n }} star{{ n === 1 ? '' : 's' }}</span>
                </label>
              </div>
            </fieldset>

            <template v-if="drafts[key(entry)].rating > 0">
              <label :for="`comment-${key(entry)}`" class="sr-only">Comment (optional)</label>
              <textarea :id="`comment-${key(entry)}`" v-model="drafts[key(entry)].comment" rows="2" maxlength="1000" placeholder="What did you think of it? (optional)" class="input-field text-sm mt-3 resize-none"></textarea>
              <p v-if="drafts[key(entry)].error" class="text-sm text-red-700 mt-2" role="alert">{{ drafts[key(entry)].error }}</p>
              <button type="button" @click="send(entry)" :disabled="drafts[key(entry)].sending" class="btn-primary !min-h-[44px] mt-3">
                {{ drafts[key(entry)].sending ? 'Sending…' : 'Submit rating' }}
              </button>
            </template>
          </div>
        </div>
      </li>
    </ul>
  </section>

  <p v-else-if="thanked" class="card p-5 mb-8 text-[#006B40] font-semibold" role="status">Thank you — your rating has been published.</p>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

// Shown on the account page: one row per delivered product not yet rated.
const authStore = useAuthStore()
const reviews = useReviews()
const { productImage } = useFormat()

const STAR = 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'

const pending = ref([])
const drafts = reactive({})
const hover = reactive({})
const thanked = ref(false)

const key = (entry) => `${entry.orderId}-${entry.itemId}`

onMounted(async () => {
  // A child mounts before its page does, so the saved session may not have been
  // read from storage yet.
  authStore.initAuth()
  if (!authStore.token) return
  try {
    const list = await reviews.pending(authStore.token)
    for (const entry of list) drafts[key(entry)] = { rating: 0, comment: '', sending: false, error: '' }
    pending.value = list
  } catch {
    // An account page without the rating prompts is still a working account page.
    pending.value = []
  }
})

const send = async (entry) => {
  const draft = drafts[key(entry)]
  draft.sending = true
  draft.error = ''
  try {
    await reviews.submit(authStore.token, {
      orderId: entry.orderId,
      itemId: entry.itemId,
      rating: draft.rating,
      comment: draft.comment.trim() || undefined
    })
    pending.value = pending.value.filter(other => key(other) !== key(entry))
    thanked.value = true
  } catch (error) {
    draft.error = error?.data?.message || 'Your rating could not be saved. Please try again.'
  } finally {
    draft.sending = false
  }
}
</script>
