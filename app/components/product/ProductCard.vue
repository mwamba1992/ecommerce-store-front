<template>
  <div class="group relative">
    <!-- Wishlist Heart Button -->
    <button
      @click.prevent="toggleWishlist"
      class="absolute top-2 right-2 z-30 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300"
      :class="isInWishlist ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'"
      title="Add to wishlist"
    >
      <svg class="w-6 h-6" :fill="isInWishlist ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>

    <NuxtLink :to="`/products/${product.id}`" class="block">
      <!-- Decorative corner accent -->
      <div class="absolute -top-1 -right-1 w-8 h-8 bg-yellow-400 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

      <div class="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent group-hover:border-yellow-400 relative">
        <!-- Product Image -->
        <div class="relative h-48 sm:h-56 md:h-64 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden flex items-center justify-center">
          <!-- Subtle pattern overlay -->
          <div class="absolute inset-0 opacity-[0.02]" style="background-image: radial-gradient(circle, #000 1px, transparent 1px); background-size: 20px 20px;"></div>

          <img
            v-if="product.imageUrl"
            :src="getImageUrl(product.imageUrl)"
            :alt="product.name"
            @error="handleImageError"
            class="w-full h-full object-contain p-4 group-hover:scale-110 transition-all duration-500 relative z-10"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <svg class="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <!-- Badges Container -->
          <div class="absolute top-3 left-3 z-20 flex flex-col gap-2">
            <!-- Out of Stock Badge (Highest Priority) -->
            <span
              v-if="!product.inStock"
              class="text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg backdrop-blur-sm bg-red-500 text-white"
            >
              OUT OF STOCK
            </span>

            <!-- Condition Badge -->
            <span
              v-else-if="product.condition === 'used'"
              class="text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg backdrop-blur-sm bg-orange-500 text-white"
            >
              USED
            </span>

            <!-- New Badge -->
            <span
              v-else-if="product.condition === 'new' && isNewProduct"
              class="text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg backdrop-blur-sm bg-green-500 text-white"
            >
              NEW
            </span>
          </div>

          <!-- Top Right Badges (Featured, Best Seller) -->
          <div class="absolute top-3 right-14 z-20 flex flex-col gap-2 items-end">
            <!-- Featured Badge -->
            <span
              v-if="product.featured"
              class="text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg backdrop-blur-sm bg-purple-500 text-white"
            >
              FEATURED
            </span>

            <!-- Best Seller Badge (based on some criteria, e.g., quantity sold) -->
            <span
              v-if="isBestSeller"
              class="text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg backdrop-blur-sm bg-yellow-500 text-black"
            >
              BEST SELLER
            </span>
          </div>

          <!-- Hover effect overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <!-- Product Info -->
        <div class="p-4 relative">
          <!-- Yellow accent bar -->
          <div class="absolute top-0 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <!-- Product Name -->
          <h3 class="text-sm font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors leading-snug min-h-[40px] pt-2">
            {{ product.name }}
          </h3>

          <!-- Price Section -->
          <div class="flex items-end justify-between">
            <div>
              <span class="text-2xl font-black text-gray-900 group-hover:text-yellow-600 transition-colors">
                TZS {{ formatPrice(product.sellingPrice || 0) }}
              </span>
            </div>

            <!-- View arrow -->
            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 group-hover:bg-yellow-400 transition-all duration-300 transform group-hover:scale-110">
              <svg class="w-4 h-4 text-white group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
import { useWishlistStore } from '~/stores/wishlist'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const { baseURL } = useApi()
const wishlistStore = useWishlistStore()

// Check if product is in wishlist
const isInWishlist = computed(() => wishlistStore.isInWishlist(props.product.id))

// Toggle wishlist
const toggleWishlist = () => {
  wishlistStore.toggleWishlist(props.product)
}

// Check if product is new (created within last 30 days)
const isNewProduct = computed(() => {
  if (!props.product.createdAt) return false
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  return new Date(props.product.createdAt) > thirtyDaysAgo
})

// Check if product is a best seller (you can adjust the criteria)
// For now, let's use a simple heuristic: if it has high sales or is marked as popular
const isBestSeller = computed(() => {
  // You can add your own logic here, e.g.:
  // - Check if product.quantitySold > threshold
  // - Check if product.popular === true
  // - Check if product.rating > 4.5
  return props.product.popular || (props.product.quantitySold && props.product.quantitySold > 50)
})

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return ''

  // Handle full URLs (like Cloudinary)
  if (imageUrl.startsWith('http')) {
    // If it's a Cloudinary URL, add optimization transformations
    if (imageUrl.includes('cloudinary.com')) {
      // Insert transformations after /upload/ - using pad with white background for consistency
      return imageUrl.replace('/upload/', '/upload/f_auto,q_auto,w_800,h_800,c_pad,b_white/')
    }
    return imageUrl
  }

  // Handle relative URLs
  return `${baseURL}${imageUrl}`
}

const handleImageError = (event) => {
  // Hide the broken image and show placeholder instead
  event.target.style.display = 'none'
}

const formatPrice = (price) => {
  return Number(price).toLocaleString('en-US', { minimumFractionDigits: 0 })
}
</script>
