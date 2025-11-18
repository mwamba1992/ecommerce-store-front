<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
    <!-- Page Header -->
    <div class="mb-10">
      <h1 class="text-3xl sm:text-4xl font-black mb-2">
        <span class="text-yellow-500">Checkout</span>
      </h1>
      <p class="text-gray-600 text-sm">Complete your order details</p>
    </div>

    <!-- Empty Cart Redirect -->
    <div v-if="cartStore.items.length === 0" class="text-center py-20">
      <div class="max-w-md mx-auto">
        <svg class="w-32 h-32 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h2 class="text-2xl font-bold text-gray-900 mb-3">Your Cart is Empty</h2>
        <p class="text-gray-600 mb-8">Add items to your cart before checkout</p>
        <NuxtLink to="/products" class="inline-flex items-center justify-center px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Browse Products
        </NuxtLink>
      </div>
    </div>

    <!-- Checkout Form -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <!-- Customer Details Form -->
      <div class="lg:col-span-3">
        <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 sm:p-8">
          <h2 class="text-xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-gray-100 flex items-center">
            <svg class="w-6 h-6 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Customer Information
          </h2>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <!-- Full Name -->
            <div>
              <label for="name" class="block text-sm font-semibold text-gray-900 mb-2">Full Name *</label>
              <input
                v-model="formData.name"
                type="text"
                id="name"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all text-sm"
                placeholder="Enter your full name"
              />
            </div>

            <!-- Phone Number -->
            <div>
              <label for="phone" class="block text-sm font-semibold text-gray-900 mb-2">Phone Number *</label>
              <input
                v-model="formData.phone"
                type="tel"
                id="phone"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all text-sm"
                placeholder="+255 XXX XXX XXX"
              />
            </div>

            <!-- Email (Optional) -->
            <div>
              <label for="email" class="block text-sm font-semibold text-gray-900 mb-2">Email (Optional)</label>
              <input
                v-model="formData.email"
                type="email"
                id="email"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all text-sm"
                placeholder="your.email@example.com"
              />
            </div>

            <!-- Delivery Address -->
            <div>
              <label for="address" class="block text-sm font-semibold text-gray-900 mb-2">Delivery Address *</label>
              <textarea
                v-model="formData.address"
                id="address"
                required
                rows="3"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all text-sm resize-none"
                placeholder="Enter your complete delivery address"
              ></textarea>
            </div>

            <!-- City/Region -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="city" class="block text-sm font-semibold text-gray-900 mb-2">City *</label>
                <input
                  v-model="formData.city"
                  type="text"
                  id="city"
                  required
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all text-sm"
                  placeholder="e.g., Dar es Salaam"
                />
              </div>

              <div>
                <label for="region" class="block text-sm font-semibold text-gray-900 mb-2">Region *</label>
                <input
                  v-model="formData.region"
                  type="text"
                  id="region"
                  required
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all text-sm"
                  placeholder="e.g., Kinondoni"
                />
              </div>
            </div>

            <!-- Additional Notes -->
            <div>
              <label for="notes" class="block text-sm font-semibold text-gray-900 mb-2">Order Notes (Optional)</label>
              <textarea
                v-model="formData.notes"
                id="notes"
                rows="2"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all text-sm resize-none"
                placeholder="Any special instructions for your order?"
              ></textarea>
            </div>

            <!-- Payment Method -->
            <div>
              <label class="block text-sm font-semibold text-gray-900 mb-3">Payment Method *</label>
              <div class="space-y-2.5">
                <label class="flex items-start p-3.5 border-2 rounded-lg cursor-pointer transition-all" :class="formData.paymentMethod === 'cod' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 hover:border-gray-400'">
                  <input
                    v-model="formData.paymentMethod"
                    type="radio"
                    value="cod"
                    class="w-4 h-4 mt-0.5 text-yellow-400 focus:ring-yellow-400"
                  />
                  <div class="ml-3">
                    <span class="font-semibold text-gray-900 text-sm">Cash on Delivery</span>
                    <p class="text-xs text-gray-600 mt-0.5">Pay when you receive your order</p>
                  </div>
                </label>

                <label class="flex items-start p-3.5 border-2 rounded-lg cursor-pointer transition-all" :class="formData.paymentMethod === 'mobile' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 hover:border-gray-400'">
                  <input
                    v-model="formData.paymentMethod"
                    type="radio"
                    value="mobile"
                    class="w-4 h-4 mt-0.5 text-yellow-400 focus:ring-yellow-400"
                  />
                  <div class="ml-3">
                    <span class="font-semibold text-gray-900 text-sm">Mobile Money (M-Pesa/Tigo/Airtel)</span>
                    <p class="text-xs text-gray-600 mt-0.5">Pay via mobile money transfer</p>
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Order Summary Sidebar -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow-md border-2 border-yellow-400 p-6 sticky top-20">
          <h2 class="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">Order Summary</h2>

          <!-- Items List -->
          <div class="space-y-2.5 mb-4 max-h-60 overflow-y-auto">
            <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between text-xs py-1.5">
              <span class="text-gray-700 flex-1 pr-2">
                <span class="font-bold">{{ item.quantity }}x</span> {{ item.name }}
              </span>
              <span class="font-bold text-gray-900 text-nowrap">TZS {{ formatPrice(item.price * item.quantity) }}</span>
            </div>
          </div>

          <div class="border-t pt-3 space-y-2 mb-5">
            <div class="flex justify-between text-xs text-gray-700">
              <span class="font-medium">Subtotal ({{ cartStore.totalItems }} items)</span>
              <span class="font-bold">TZS {{ formatPrice(cartStore.totalPrice) }}</span>
            </div>

            <div class="flex justify-between text-xs text-gray-700">
              <span class="font-medium">Shipping</span>
              <span class="font-bold text-green-600">FREE</span>
            </div>

            <div class="border-t pt-3 flex justify-between text-base font-black text-gray-900">
              <span>Total</span>
              <span class="text-yellow-600">TZS {{ formatPrice(cartStore.totalPrice) }}</span>
            </div>
          </div>

          <!-- Place Order Button -->
          <button
            @click="handleSubmit"
            :disabled="isProcessing"
            class="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-400 text-black font-bold py-3.5 rounded-lg transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg mb-3 flex items-center justify-center space-x-2 text-sm"
          >
            <svg v-if="!isProcessing" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{{ isProcessing ? 'Processing Order...' : 'Place Order' }}</span>
          </button>

          <NuxtLink
            to="/cart"
            class="flex items-center justify-center text-gray-700 hover:text-yellow-600 font-semibold transition-colors py-2 text-sm"
          >
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Cart
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
const router = useRouter()

const isProcessing = ref(false)

const formData = reactive({
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  region: '',
  notes: '',
  paymentMethod: 'cod'
})

const formatPrice = (price) => {
  return Number(price).toLocaleString('en-US', { minimumFractionDigits: 0 })
}

const handleSubmit = async () => {
  // Validate form
  if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.region || !formData.paymentMethod) {
    alert('Please fill in all required fields marked with *')
    return
  }

  isProcessing.value = true

  try {
    const { apiFetch } = useApi()

    // Prepare order data for the ecommerce-order endpoint
    const orderData = {
      customerName: formData.name,
      customerPhone: formData.phone,
      customerEmail: formData.email || undefined,
      customerCity: formData.city,
      customerRegion: formData.region,
      warehouseId: 1, // Default warehouse
      items: cartStore.items.map(item => ({
        itemId: item.id,
        quantity: item.quantity,
        unitPrice: item.price
      })),
      deliveryAddress: formData.address,
      notes: formData.notes || '',
      paymentMethod: formData.paymentMethod === 'cod' ? 'cash_on_delivery' : 'mobile_money'
    }

    console.log('📦 Submitting order:', orderData)

    // Submit order via the ecommerce-order endpoint (using full URL)
    const response = await $fetch('https://business.mwendavano.com/whatsapp/ecommerce-order', {
      method: 'POST',
      body: orderData,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log('✅ Order created successfully:', response)

    // Clear cart and show success
    cartStore.clearCart()
    alert(`Order placed successfully!\n\nOrder confirmation sent to our team.\n\nWe will contact you at ${formData.phone} to confirm your order.\n\nThank you for shopping with Global Authentic TZ!`)
    router.push('/products')

  } catch (error) {
    console.error('❌ Order submission error:', error)

    // Handle specific error messages
    let errorMessage = 'Failed to place order.'

    if (error.data?.message) {
      errorMessage = error.data.message
    } else if (error.message) {
      errorMessage = error.message
    }

    alert(`${errorMessage}\n\nPlease contact us directly at +255 789 947 608 for assistance.`)
  } finally {
    isProcessing.value = false
  }
}

useHead({
  title: 'Checkout - Global Authentic TZ',
  meta: [
    { name: 'description', content: 'Complete your order checkout' }
  ]
})

// Redirect if cart is empty
watchEffect(() => {
  if (cartStore.items.length === 0 && process.client) {
    // Will show empty state in template
  }
})
</script>
