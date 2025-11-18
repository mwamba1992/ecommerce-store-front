<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
        Shopping <span class="text-yellow-500">Cart</span>
      </h1>
      <p class="text-gray-600">Review your items before checkout</p>
    </div>

    <!-- Empty Cart -->
    <div v-if="cartStore.items.length === 0" class="text-center py-20">
      <div class="max-w-md mx-auto">
        <svg class="w-32 h-32 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h2 class="text-2xl font-bold text-gray-900 mb-3">Your Cart is Empty</h2>
        <p class="text-gray-600 mb-8">Start shopping to add items to your cart</p>
        <NuxtLink to="/products" class="inline-flex items-center justify-center px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Continue Shopping
        </NuxtLink>
      </div>
    </div>

    <!-- Cart Items -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      <!-- Cart Items List -->
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in cartStore.items"
          :key="item.id"
          class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
        >
          <div class="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <!-- Product Image -->
            <div class="flex-shrink-0 w-full sm:w-24 h-32 sm:h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
              <img
                v-if="item.imageUrl"
                :src="getImageUrl(item.imageUrl)"
                :alt="item.name"
                class="w-full h-full object-contain p-3"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <!-- Product Details -->
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-bold text-gray-900 mb-1">{{ item.name }}</h3>
              <p v-if="item.code" class="text-xs font-mono text-gray-500 mb-2">SKU: {{ item.code }}</p>
              <p class="text-xl font-black text-gray-900">
                TZS {{ formatPrice(item.price) }}
              </p>
            </div>

            <!-- Quantity Controls & Actions -->
            <div class="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <!-- Quantity Controls -->
              <div class="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                  class="w-8 h-8 rounded-md bg-gray-900 hover:bg-yellow-400 text-white hover:text-black flex items-center justify-center transition-all duration-300 font-bold"
                >
                  −
                </button>
                <span class="text-lg font-bold w-10 text-center">{{ item.quantity }}</span>
                <button
                  @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                  class="w-8 h-8 rounded-md bg-gray-900 hover:bg-yellow-400 text-white hover:text-black flex items-center justify-center transition-all duration-300 font-bold"
                >
                  +
                </button>
              </div>

              <!-- Subtotal & Remove -->
              <div class="flex items-center gap-3">
                <div class="text-right">
                  <p class="text-xs text-gray-500">Subtotal</p>
                  <p class="text-lg font-black text-gray-900">
                    TZS {{ formatPrice(item.price * item.quantity) }}
                  </p>
                </div>

                <!-- Remove Button -->
                <button
                  @click="cartStore.removeFromCart(item.id)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove item"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-lg border-2 border-yellow-400 p-6 sticky top-20">
          <h2 class="text-2xl font-black text-gray-900 mb-6">Order Summary</h2>

          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-gray-700">
              <span class="font-medium">Subtotal ({{ cartStore.totalItems }} items)</span>
              <span class="font-bold">TZS {{ formatPrice(cartStore.totalPrice) }}</span>
            </div>

            <div class="flex justify-between text-gray-700">
              <span class="font-medium">Shipping</span>
              <span class="font-bold text-green-600">FREE</span>
            </div>

            <div class="border-t-2 border-gray-200 pt-4 flex justify-between text-xl font-black text-gray-900">
              <span>Total</span>
              <span class="text-yellow-600">TZS {{ formatPrice(cartStore.totalPrice) }}</span>
            </div>
          </div>

          <button
            @click="proceedToCheckout"
            class="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl mb-4"
          >
            Proceed to Checkout
          </button>

          <NuxtLink
            to="/products"
            class="flex items-center justify-center text-gray-700 hover:text-yellow-600 font-bold transition-colors py-2"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Continue Shopping
          </NuxtLink>

          <button
            @click="clearCart"
            class="w-full mt-4 text-center text-red-600 hover:text-red-700 hover:bg-red-50 font-medium text-sm py-2 rounded-lg transition-colors"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
const { baseURL } = useApi()

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return ''

  // Handle full URLs (like Cloudinary)
  if (imageUrl.startsWith('http')) {
    // If it's a Cloudinary URL, add optimization transformations
    if (imageUrl.includes('cloudinary.com')) {
      // Insert transformations after /upload/ (smaller size for cart thumbnails)
      return imageUrl.replace('/upload/', '/upload/f_auto,q_auto,w_300,h_300,c_fit/')
    }
    return imageUrl
  }

  // Handle relative URLs
  return `${baseURL}${imageUrl}`
}

const formatPrice = (price) => {
  return Number(price).toLocaleString('en-US', { minimumFractionDigits: 0 })
}

const proceedToCheckout = () => {
  navigateTo('/checkout')
}

const clearCart = () => {
  if (confirm('Are you sure you want to clear your cart?')) {
    cartStore.clearCart()
  }
}

useHead({
  title: 'Shopping Cart - Global Authentic TZ',
  meta: [
    { name: 'description', content: 'Review your shopping cart items' }
  ]
})
</script>
