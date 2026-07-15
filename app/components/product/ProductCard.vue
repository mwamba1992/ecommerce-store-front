<template>
  <div class="group relative flex flex-col bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
    <!-- Wishlist Heart Button -->
    <button
      @click.prevent="toggleWishlist"
      class="absolute top-2.5 right-2.5 z-30 w-9 h-9 rounded-full bg-white shadow-sm ring-1 ring-gray-200 flex items-center justify-center hover:ring-gray-300 transition-all duration-200"
      :class="isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'"
      :aria-label="isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'"
    >
      <svg class="w-5 h-5" :fill="isInWishlist ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>

    <!-- Single Priority Badge (top-left) -->
    <div class="absolute top-2.5 left-2.5 z-20">
      <span v-if="badge" class="text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm tracking-wide" :class="badge.class">
        {{ badge.label }}
      </span>
    </div>

    <!-- Product Image -->
    <NuxtLink :to="`/products/${product.id}`" class="block relative aspect-square bg-gray-50 overflow-hidden">
      <img
        v-if="product.imageUrl && !imageFailed"
        :src="productImage(product.imageUrl, 'card')"
        :alt="product.name"
        loading="lazy"
        @error="imageFailed = true"
        class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
      />
      <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
        <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <!-- Out of stock overlay -->
      <div v-if="!product.inStock" class="absolute inset-0 bg-white/60 flex items-center justify-center">
        <span class="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-md tracking-wide">SOLD OUT</span>
      </div>
    </NuxtLink>

    <!-- Product Info -->
    <div class="flex flex-col flex-1 p-4">
      <!-- Brand / category eyebrow -->
      <p v-if="product.brand?.name" class="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
        {{ product.brand.name }}
      </p>

      <!-- Product Name -->
      <NuxtLink :to="`/products/${product.id}`" class="block">
        <h3 class="text-sm font-medium text-gray-900 line-clamp-2 leading-snug min-h-[40px] hover:text-yellow-600 transition-colors">
          {{ product.name }}
        </h3>
      </NuxtLink>

      <!-- Price -->
      <div class="mt-2 mb-3">
        <span class="text-lg font-extrabold text-gray-900">
          TZS {{ formatPrice(product.sellingPrice || 0) }}
        </span>
      </div>

      <!-- Add to Cart -->
      <button
        @click.prevent="handleAddToCart"
        :disabled="!product.inStock"
        class="mt-auto w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200"
        :class="product.inStock
          ? (added ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-yellow-400 hover:text-black')
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
      >
        <template v-if="!product.inStock">Out of Stock</template>
        <template v-else-if="added">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
          Added
        </template>
        <template v-else>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Add to Cart
        </template>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useWishlistStore } from '~/stores/wishlist'
import { useCartStore } from '~/stores/cart'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const { formatPrice, productImage } = useFormat()
const wishlistStore = useWishlistStore()
const cartStore = useCartStore()

const imageFailed = ref(false)
const added = ref(false)

const isInWishlist = computed(() => wishlistStore.isInWishlist(props.product.id))

const toggleWishlist = () => {
  wishlistStore.toggleWishlist(props.product)
}

const handleAddToCart = () => {
  if (!props.product.inStock) return
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

// One badge, by priority: sold out is handled by the overlay, so here we rank
// used > new. There were also FEATURED and BEST SELLER branches keyed on
// product.featured / product.popular / product.quantitySold — the API has never
// returned any of those fields, so neither badge could ever render. Removed
// rather than left as decoration; re-add them alongside the backing fields.
const badge = computed(() => {
  if (props.product.condition === 'used') return { label: 'USED', class: 'bg-orange-500 text-white' }
  if (props.product.condition === 'new' && isNewProduct.value) return { label: 'NEW', class: 'bg-green-500 text-white' }
  return null
})
</script>
