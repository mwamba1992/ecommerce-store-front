<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    <h1 class="title text-4xl sm:text-5xl mb-6">
      Your cart <span v-if="cartStore.totalItems" class="text-gray-400 font-medium text-2xl">({{ cartStore.totalItems }})</span>
    </h1>

    <!-- Empty -->
    <div v-if="cartStore.items.length === 0" class="card p-10 sm:p-14 text-center">
      <h2 class="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
      <p class="text-gray-600 mb-6">Find something you like and it will show up here.</p>
      <NuxtLink to="/products" class="btn-primary">Browse products</NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
      <!-- Items -->
      <ul class="lg:col-span-2 card divide-y divide-gray-100">
        <li v-for="item in cartStore.items" :key="item.id" class="p-4 sm:p-5 flex gap-4">
          <NuxtLink :to="`/products/${item.id}`" class="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100" :style="{ backgroundColor: item.imageUrl ? '#fff' : tintFor(item.id) }">
            <img v-if="item.imageUrl" :src="getImageUrl(item.imageUrl)" :alt="item.name" class="w-full h-full object-contain p-1.5" />
            <span v-else class="text-2xl font-semibold text-gray-900/25" aria-hidden="true">{{ initialOf(item.name) }}</span>
          </NuxtLink>

          <div class="flex-1 min-w-0 flex flex-col">
            <div class="flex justify-between gap-3">
              <NuxtLink :to="`/products/${item.id}`" class="font-medium text-gray-900 leading-snug hover:underline line-clamp-2">{{ item.name }}</NuxtLink>
              <p class="font-semibold text-gray-900 whitespace-nowrap">TZS {{ formatPrice(item.price * item.quantity) }}</p>
            </div>
            <p v-if="item.quantity > 1" class="text-xs text-gray-500 mt-0.5">TZS {{ formatPrice(item.price) }} each</p>

            <div class="mt-auto pt-3 flex items-center justify-between">
              <div class="inline-flex items-center rounded-full border border-gray-200" role="group" :aria-label="`Quantity of ${item.name}`">
                <button type="button" @click="cartStore.updateQuantity(item.id, item.quantity - 1)" class="w-10 h-10 flex items-center justify-center text-gray-700" aria-label="Decrease quantity">−</button>
                <span class="w-7 text-center text-sm font-semibold">{{ item.quantity }}</span>
                <button type="button" @click="cartStore.updateQuantity(item.id, item.quantity + 1)" class="w-10 h-10 flex items-center justify-center text-gray-700" aria-label="Increase quantity">+</button>
              </div>
              <button type="button" @click="cartStore.removeFromCart(item.id)" class="text-sm font-semibold text-gray-500 hover:text-red-600 underline">Remove</button>
            </div>
          </div>
        </li>
      </ul>

      <!-- Summary -->
      <aside class="card p-6 lg:sticky lg:top-36">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Order summary</h2>

        <dl class="space-y-3 text-sm">
          <div class="flex justify-between text-gray-700">
            <dt>Subtotal ({{ cartStore.totalItems }} {{ cartStore.totalItems === 1 ? 'item' : 'items' }})</dt>
            <dd class="font-semibold text-gray-900">TZS {{ formatPrice(cartStore.totalPrice) }}</dd>
          </div>
          <div class="flex justify-between gap-4 text-gray-700">
            <dt>Delivery</dt>
            <dd class="text-right text-gray-500">Confirmed before dispatch</dd>
          </div>
          <div class="flex justify-between border-t border-gray-100 pt-4 text-base font-semibold text-gray-900">
            <dt>Total</dt>
            <dd>TZS {{ formatPrice(cartStore.totalPrice) }}</dd>
          </div>
        </dl>

        <button type="button" @click="proceedToCheckout" class="btn-primary w-full mt-6">Checkout</button>
        <NuxtLink to="/products" class="block text-center text-sm font-semibold text-gray-600 hover:text-gray-900 underline mt-4">Continue shopping</NuxtLink>

        <ul class="mt-6 pt-5 border-t border-gray-100 space-y-2.5 text-sm text-gray-600">
          <li v-for="line in reassurance" :key="line" class="flex gap-2.5">
            <svg class="w-4 h-4 mt-0.5 text-green-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
            {{ line }}
          </li>
        </ul>

        <button type="button" @click="clearCart" class="block mx-auto mt-5 text-xs text-gray-400 hover:text-red-600 underline">Clear cart</button>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
const { formatPrice, productImage } = useFormat()

const getImageUrl = (imageUrl) => productImage(imageUrl, 'small')

// Stated on the help, shipping and returns pages.
const reassurance = [
  'Pay on delivery, or by mobile money',
  'Same or next day delivery in Dar es Salaam',
  '7-day returns on unused items'
]

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
