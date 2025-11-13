<template>
  <div class="card group">
    <NuxtLink :to="`/products/${product.id}`" class="block">
      <!-- Product Image -->
      <div class="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex items-center justify-center border-b border-gray-200">
        <img
          v-if="product.imageUrl"
          :src="getImageUrl(product.imageUrl)"
          :alt="product.name"
          @error="handleImageError"
          class="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-300"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <svg class="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <!-- Condition Badge -->
        <div v-if="product.condition" class="absolute top-2 left-2">
          <span
            :class="[
              'text-xs font-semibold px-2 py-1 rounded-full',
              product.condition === 'new'
                ? 'bg-green-100 text-green-800'
                : 'bg-orange-100 text-orange-800'
            ]"
          >
            {{ product.condition === 'new' ? '✨ New' : '♻️ Used' }}
          </span>
        </div>

        <!-- Stock Badge -->
        <div class="absolute top-2 right-2">
          <span
            v-if="product.totalStock !== undefined"
            :class="[
              'text-xs font-semibold px-2 py-1 rounded-full',
              product.inStock && product.totalStock > 10
                ? 'bg-green-100 text-green-800'
                : product.inStock && product.totalStock > 0
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            ]"
          >
            {{ product.inStock ? `${product.totalStock} in stock` : 'Out of Stock' }}
          </span>
        </div>
      </div>

      <!-- Product Info -->
      <div class="p-4">
        <h3 class="font-semibold text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
          {{ product.name }}
        </h3>

        <p v-if="product.code" class="text-xs font-mono text-gray-500 mb-2">
          {{ product.code }}
        </p>

        <p class="text-sm text-gray-600 mb-3 line-clamp-2">
          {{ product.desc || 'No description available' }}
        </p>

        <!-- Category -->
        <div v-if="product.category" class="mb-3">
          <span class="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {{ product.category.code }}
          </span>
        </div>

        <!-- Price -->
        <div class="flex items-center justify-between">
          <div>
            <span class="text-2xl font-bold text-gray-900">
              TZS{{ formatPrice(product.sellingPrice || 0) }}
            </span>
          </div>
        </div>
      </div>
    </NuxtLink>

    <!-- Add to Cart Button -->
    <div class="px-4 pb-4">
      <button
        @click="addToCart"
        :disabled="!product.inStock"
        :class="[
          'w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors duration-200',
          product.inStock
            ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        ]"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span>{{ product.inStock ? 'Add to Cart' : 'Out of Stock' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()
const { baseURL } = useApi()

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return ''
  return imageUrl.startsWith('http') ? imageUrl : `${baseURL}${imageUrl}`
}

const handleImageError = (event) => {
  // Hide the broken image and show placeholder instead
  event.target.style.display = 'none'
}

const formatPrice = (price) => {
  return Number(price).toLocaleString('en-US', { minimumFractionDigits: 0 })
}

const addToCart = () => {
  if (!props.product.inStock) {
    alert(`Sorry, ${props.product.name} is currently out of stock!`)
    return
  }
  cartStore.addToCart(props.product, 1)
  // Optional: Show toast notification
  alert(`${props.product.name} added to cart!`)
}
</script>
