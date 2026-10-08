<template>
  <article class="group relative flex flex-col h-full bg-white rounded-card p-4 transition-shadow duration-300 hover:shadow-lift">
    <!-- Photo -->
    <NuxtLink
      :to="`/products/${product.id}`"
      class="relative block aspect-square rounded-lg overflow-hidden"
      :style="showImage ? null : { backgroundColor: tintFor(product.id) }"
    >
      <img
        v-if="showImage"
        :src="productImage(product.imageUrl, 'card')"
        :alt="productImageAlt(product)"
        :width="imageSize(product.imageUrl, 'card')?.width"
        :height="imageSize(product.imageUrl, 'card')?.height"
        loading="lazy"
        @error="imageFailed = true"
        class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        :class="{ 'opacity-45': !product.inStock }"
      />
      <!-- No photograph: the product's initial on its tint -->
      <span v-else class="absolute inset-0 flex items-center justify-center text-4xl font-medium text-gray-400" aria-hidden="true">
        {{ initialOf(productName(product)) }}
      </span>
    </NuxtLink>

    <!-- Condition: always shown, since new and used versions of one model sit side by side -->
    <span
      class="absolute top-3 left-3 px-2 py-0.5 rounded text-xs font-semibold leading-5"
      :class="product.condition === 'used' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 border border-gray-300'"
    >
      {{ product.condition === 'used' ? 'Used' : 'New' }}
    </span>

    <!-- Wishlist -->
    <button
      type="button"
      @click="toggleWishlist"
      class="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
      :class="isInWishlist ? 'bg-white text-red-500' : 'bg-white/80 text-gray-500 hover:text-gray-900'"
      :aria-label="isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'"
      :aria-pressed="isInWishlist"
    >
      <svg class="w-[18px] h-[18px]" :fill="isInWishlist ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>

    <!-- Tag: one state, in words. The row keeps its height so names line up. -->
    <p class="mt-3 h-6">
      <span v-if="badge" class="inline-flex items-center px-1.5 rounded text-sm font-semibold leading-5" :class="badge.class">{{ badge.label }}</span>
    </p>

    <NuxtLink :to="`/products/${product.id}`" class="block mt-1.5">
      <h3 class="text-base font-semibold text-gray-800 leading-6 line-clamp-2 group-hover:underline">
        {{ productName(product) }}
      </h3>
    </NuxtLink>

    <!-- Spec line: what the catalogue knows about it -->
    <p class="text-sm text-gray-600 leading-5 line-clamp-2">{{ specs }}</p>

    <ProductStars v-if="rating" :average="rating.average" :count="rating.count" class="mt-1.5" />

    <div class="mt-3 mb-5">
      <p class="font-semibold tracking-tight" :class="!product.inStock ? 'text-gray-400' : saving ? 'text-[#006B40]' : 'text-gray-900'">
        <template v-if="hasPrice(product)">
          <span class="text-xs font-semibold align-top relative top-0.5 mr-0.5">TZS</span><span class="text-2xl leading-none">{{ formatPrice(product.sellingPrice) }}</span>
        </template>
        <span v-else class="text-lg">Price on request</span>
      </p>
      <template v-if="saving">
        <p class="mt-1.5 text-sm font-semibold leading-4 text-[#006B40]">Save TZS {{ formatPrice(saving.amount) }}</p>
        <p class="mt-1 text-sm leading-5 text-gray-600">Previous price: TZS {{ formatPrice(saving.previous) }}</p>
      </template>
    </div>

    <button
      type="button"
      @click="handleAddToCart"
      :disabled="!canBuy"
      class="mt-auto w-full inline-flex items-center justify-center gap-2 h-12 rounded-md border text-base font-semibold transition-colors"
      :class="!canBuy
        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
        : added
          ? 'border-green-700 bg-green-700 text-white'
          : 'border-gray-800 text-gray-900 hover:bg-gray-900 hover:text-white'"
    >
      <template v-if="!product.inStock">Sold out</template>
      <template v-else-if="!hasPrice(product)">Price on request</template>
      <template v-else-if="added">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
        Added
      </template>
      <template v-else>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m7-7H5" /></svg>
        Add to cart
      </template>
    </button>
  </article>
</template>

<script setup>
import { useWishlistStore } from '~/stores/wishlist'
import { useCartStore } from '~/stores/cart'
import { categoryLabel, hasPrice, productImageAlt, productName, productRating, productSaving } from '#shared/utils/seo'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

// At or below this many units, say so: scarcity a shopper can act on.
const LOW_STOCK_AT = 3

const { formatPrice, productImage, imageSize } = useFormat()
const wishlistStore = useWishlistStore()
const cartStore = useCartStore()

const imageFailed = ref(false)
const added = ref(false)

const showImage = computed(() => props.product.imageUrl && !imageFailed.value)
const isInWishlist = computed(() => wishlistStore.isInWishlist(props.product.id))

const toggleWishlist = () => {
  wishlistStore.toggleWishlist(props.product)
}

const rating = computed(() => productRating(props.product))
const saving = computed(() => productSaving(props.product))

const canBuy = computed(() => props.product.inStock && hasPrice(props.product))

// Brand and category; condition has its own tag on the photo.
const specs = computed(() => [
  props.product.brand?.name,
  props.product.category && categoryLabel(props.product.category)
].filter(Boolean).join(' · '))

const handleAddToCart = () => {
  if (!canBuy.value) return
  cartStore.addToCart(props.product, 1)
  added.value = true
  setTimeout(() => { added.value = false }, 1500)
}

const isNewProduct = computed(() => {
  if (!props.product.createdAt) return false
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  return new Date(props.product.createdAt) > sevenDaysAgo
})

// One tag, by priority. Each state is carried by words as well as colour.
const badge = computed(() => {
  const { inStock, totalStock } = props.product
  if (!inStock) return { label: 'Sold out', class: 'bg-gray-100 text-gray-600' }
  if (totalStock <= LOW_STOCK_AT) return { label: `Only ${totalStock} left`, class: 'bg-yellow-100 text-yellow-900' }
  if (saving.value) return { label: 'Price drop', class: 'bg-green-100 text-[#006B40]' }
  if (isNewProduct.value) return { label: 'Just in', class: 'bg-gray-100 text-gray-800' }
  return null
})
</script>
