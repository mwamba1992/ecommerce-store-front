<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 flex items-center">
          <svg class="w-8 h-8 sm:w-10 sm:h-10 text-red-500 mr-3" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          My Wishlist
        </h1>
        <p class="text-gray-600">{{ wishlistStore.totalItems }} {{ wishlistStore.totalItems === 1 ? 'item' : 'items' }} saved</p>
      </div>

      <!-- Empty State -->
      <div v-if="wishlistStore.totalItems === 0" class="text-center py-16 bg-white rounded-2xl shadow-sm">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h3 class="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
        <p class="text-gray-600 mb-6">Start adding items you love!</p>
        <NuxtLink to="/products" class="inline-flex items-center px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-all duration-300">
          Browse Products
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </NuxtLink>
      </div>

      <!-- Wishlist Items -->
      <div v-else>
        <!-- Action Bar -->
        <div class="mb-6 flex justify-between items-center">
          <button
            @click="addAllToCart"
            class="px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-yellow-400 hover:text-black transition-all duration-300 flex items-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add All to Cart
          </button>
          <button
            @click="clearWishlist"
            class="px-4 py-2 text-red-600 hover:text-red-700 font-semibold transition-colors"
          >
            Clear Wishlist
          </button>
        </div>

        <!-- Products Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <div v-for="item in wishlistStore.getItems" :key="item.id" class="group relative">
            <!-- Remove Button -->
            <button
              @click="wishlistStore.removeFromWishlist(item.id)"
              class="absolute top-2 right-2 z-30 w-10 h-10 rounded-full bg-red-500 text-white shadow-lg flex items-center justify-center hover:bg-red-600 transition-all duration-300"
              title="Remove from wishlist"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <NuxtLink :to="`/products/${item.id}`" class="block">
              <div class="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent group-hover:border-yellow-400">
                <!-- Product Image -->
                <div class="relative h-48 sm:h-56 md:h-64 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden flex items-center justify-center">
                  <img
                    v-if="item.imageUrl"
                    :src="getImageUrl(item.imageUrl)"
                    :alt="item.name"
                    @error="handleImageError"
                    class="w-full h-full object-contain p-4 group-hover:scale-110 transition-all duration-500"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <svg class="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>

                  <!-- Stock Badge -->
                  <div v-if="!item.inStock" class="absolute top-3 left-3 z-20">
                    <span class="text-xs font-bold px-3 py-1 rounded-full bg-red-500 text-white shadow-lg">
                      OUT OF STOCK
                    </span>
                  </div>
                  <div v-else-if="item.condition === 'used'" class="absolute top-3 left-3 z-20">
                    <span class="text-xs font-bold px-3 py-1 rounded-full bg-orange-500 text-white shadow-lg">
                      USED
                    </span>
                  </div>
                </div>

                <!-- Product Info -->
                <div class="p-4">
                  <h3 class="text-sm font-semibold text-gray-900 mb-3 line-clamp-2 min-h-[40px]">
                    {{ item.name }}
                  </h3>
                  <div class="flex items-end justify-between">
                    <span class="text-2xl font-black text-gray-900">
                      TZS {{ formatPrice(item.price || 0) }}
                    </span>
                    <button
                      @click.prevent="addToCart(item)"
                      :disabled="!item.inStock"
                      class="flex items-center justify-center px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      :title="item.inStock ? 'Add to cart' : 'Out of stock'"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useWishlistStore } from '~/stores/wishlist'
import { useCartStore } from '~/stores/cart'

const wishlistStore = useWishlistStore()
const cartStore = useCartStore()
const { baseURL } = useApi()

// Load wishlist on mount
onMounted(() => {
  wishlistStore.loadFromLocalStorage()
})

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return ''
  if (imageUrl.startsWith('http')) {
    if (imageUrl.includes('cloudinary.com')) {
      return imageUrl.replace('/upload/', '/upload/f_auto,q_auto,w_800,h_800,c_pad,b_white/')
    }
    return imageUrl
  }
  return `${baseURL}${imageUrl}`
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
}

const formatPrice = (price) => {
  return Number(price).toLocaleString('en-US', { minimumFractionDigits: 0 })
}

const addToCart = (item) => {
  if (!item.inStock) return

  cartStore.addToCart({
    id: item.id,
    name: item.name,
    code: item.code,
    sellingPrice: item.price,
    imageUrl: item.imageUrl,
    inStock: item.inStock,
    condition: item.condition
  })
}

const addAllToCart = () => {
  const inStockItems = wishlistStore.getItems.filter(item => item.inStock)
  inStockItems.forEach(item => {
    cartStore.addToCart({
      id: item.id,
      name: item.name,
      code: item.code,
      sellingPrice: item.price,
      imageUrl: item.imageUrl,
      inStock: item.inStock,
      condition: item.condition
    })
  })

  if (inStockItems.length > 0) {
    alert(`Added ${inStockItems.length} item(s) to cart!`)
  } else {
    alert('No items in stock to add to cart')
  }
}

const clearWishlist = () => {
  if (confirm('Are you sure you want to clear your entire wishlist?')) {
    wishlistStore.clearWishlist()
  }
}

useHead({
  title: 'My Wishlist - Global Authentic TZ',
  meta: [
    { name: 'description', content: 'View and manage your saved products' }
  ]
})
</script>
