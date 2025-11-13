<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

    <!-- Empty Cart -->
    <div v-if="cartStore.items.length === 0" class="text-center py-16">
      <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
      <p class="text-gray-600 mb-6">Start shopping to add items to your cart</p>
      <NuxtLink to="/products" class="btn-primary inline-block">
        Continue Shopping
      </NuxtLink>
    </div>

    <!-- Cart Items -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items List -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="divide-y divide-gray-200">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="p-6 flex items-center space-x-4"
            >
              <!-- Product Image -->
              <div class="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  v-if="item.imageUrl"
                  :src="getImageUrl(item.imageUrl)"
                  :alt="item.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>

              <!-- Product Details -->
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-900">{{ item.name }}</h3>
                <p v-if="item.code" class="text-sm font-mono text-gray-500">{{ item.code }}</p>
                <p class="text-lg font-bold text-gray-900 mt-1">
                  TZS{{ formatPrice(item.price) }}
                </p>
              </div>

              <!-- Quantity Controls -->
              <div class="flex items-center space-x-3">
                <button
                  @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                  class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  -
                </button>
                <span class="text-lg font-semibold w-8 text-center">{{ item.quantity }}</span>
                <button
                  @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                  class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                >
                  +
                </button>
              </div>

              <!-- Subtotal -->
              <div class="text-right min-w-[100px]">
                <p class="text-lg font-bold text-gray-900">
                  TZS{{ formatPrice(item.price * item.quantity) }}
                </p>
              </div>

              <!-- Remove Button -->
              <button
                @click="cartStore.removeFromCart(item.id)"
                class="text-red-600 hover:text-red-800"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-md p-6 sticky top-20">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

          <div class="space-y-4 mb-6">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal ({{ cartStore.totalItems }} items)</span>
              <span>TZS{{ formatPrice(cartStore.totalPrice) }}</span>
            </div>

            <div class="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>FREE</span>
            </div>

            <div class="border-t pt-4 flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>TZS{{ formatPrice(cartStore.totalPrice) }}</span>
            </div>
          </div>

          <button @click="proceedToCheckout" class="w-full btn-primary mb-3">
            Proceed to Checkout
          </button>

          <NuxtLink to="/products" class="block text-center text-blue-600 hover:text-blue-700 font-medium">
            ← Continue Shopping
          </NuxtLink>

          <button
            @click="clearCart"
            class="w-full mt-4 text-center text-red-600 hover:text-red-700 font-medium text-sm"
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
  return imageUrl.startsWith('http') ? imageUrl : `${baseURL}${imageUrl}`
}

const formatPrice = (price) => {
  return Number(price).toLocaleString('en-US', { minimumFractionDigits: 0 })
}

const proceedToCheckout = () => {
  // TODO: Navigate to checkout page
  alert('Checkout functionality coming soon!')
}

const clearCart = () => {
  if (confirm('Are you sure you want to clear your cart?')) {
    cartStore.clearCart()
  }
}

useHead({
  title: 'Shopping Cart - ShopStore',
  meta: [
    { name: 'description', content: 'Review your shopping cart' }
  ]
})
</script>
