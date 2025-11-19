<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
    <!-- Page Header -->
    <div class="mb-10 flex justify-between items-center">
      <div>
        <h1 class="text-3xl sm:text-4xl font-black mb-2">
          My <span class="text-yellow-500">Account</span>
        </h1>
        <p class="text-gray-600 text-sm">Welcome back, {{ customer?.name }}!</p>
      </div>
      <button
        @click="handleLogout"
        class="px-6 py-2 border-2 border-red-600 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300"
      >
        Logout
      </button>
    </div>

    <!-- Order Statistics -->
    <div v-if="stats" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 class="text-sm font-medium text-gray-600 mb-1">Total Orders</h3>
        <p class="text-3xl font-black text-gray-900">{{ stats.totalOrders }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 class="text-sm font-medium text-gray-600 mb-1">Pending</h3>
        <p class="text-3xl font-black text-yellow-600">{{ stats.pendingOrders }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 class="text-sm font-medium text-gray-600 mb-1">Delivered</h3>
        <p class="text-3xl font-black text-green-600">{{ stats.deliveredOrders }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 class="text-sm font-medium text-gray-600 mb-1">Total Spent</h3>
        <p class="text-2xl font-black text-gray-900">TZS {{ formatPrice(stats.totalSpent) }}</p>
      </div>
    </div>

    <!-- My Orders Section -->
    <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 sm:p-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-gray-100">
        My Orders
      </h2>

      <!-- Loading State -->
      <div v-if="loadingOrders" class="text-center py-10">
        <svg class="w-12 h-12 animate-spin mx-auto text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <p class="text-gray-600 mt-4">Loading your orders...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="text-center py-10">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h3 class="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
        <p class="text-gray-600 mb-6">Start shopping to see your orders here</p>
        <NuxtLink to="/products" class="inline-flex items-center justify-center px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg">
          Browse Products
        </NuxtLink>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-6">
        <div
          v-for="order in orders"
          :key="order.id"
          class="border-2 border-gray-200 rounded-xl p-6 hover:border-yellow-400 transition-all duration-300"
        >
          <!-- Order Header -->
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 pb-4 border-b border-gray-200">
            <div>
              <h3 class="text-lg font-bold text-gray-900 mb-1">Order #{{ order.orderNumber }}</h3>
              <p class="text-sm text-gray-600">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div class="mt-2 sm:mt-0 flex items-center space-x-2">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-bold',
                  getStatusClass(order.status)
                ]"
              >
                {{ order.status.toUpperCase() }}
              </span>
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-bold',
                  getPaymentStatusClass(order.paymentStatus)
                ]"
              >
                {{ order.paymentStatus.toUpperCase() }}
              </span>
            </div>
          </div>

          <!-- Order Items -->
          <div class="space-y-3 mb-4">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex items-center space-x-4"
            >
              <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  v-if="item.imageUrl"
                  :src="item.imageUrl"
                  :alt="item.name"
                  class="w-full h-full object-contain p-1"
                />
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900 text-sm">{{ item.name }}</h4>
                <p class="text-xs text-gray-600">Code: {{ item.code }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold text-gray-900">{{ item.quantity }}x</p>
                <p class="text-xs text-gray-600">TZS {{ formatPrice(item.unitPrice) }}</p>
              </div>
            </div>
          </div>

          <!-- Order Footer -->
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-gray-200">
            <div class="text-sm text-gray-600 mb-2 sm:mb-0">
              <span class="font-medium">Payment:</span> {{ formatPaymentMethod(order.paymentMethod) }}
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">Total Amount</p>
              <p class="text-2xl font-black text-yellow-600">TZS {{ formatPrice(order.totalAmount) }}</p>
            </div>
          </div>

          <!-- Delivery Address -->
          <div v-if="order.deliveryAddress" class="mt-4 pt-4 border-t border-gray-200">
            <p class="text-sm font-semibold text-gray-900 mb-1">Delivery Address:</p>
            <p class="text-sm text-gray-600">{{ order.deliveryAddress }}</p>
          </div>

          <!-- Order Notes -->
          <div v-if="order.notes" class="mt-2">
            <p class="text-sm font-semibold text-gray-900 mb-1">Notes:</p>
            <p class="text-sm text-gray-600">{{ order.notes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const customer = computed(() => authStore.customer)
const orders = ref([])
const stats = ref(null)
const loadingOrders = ref(true)

// Protect route - redirect if not authenticated
onMounted(async () => {
  authStore.initAuth()

  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  // Fetch orders and stats
  await fetchData()
})

const fetchData = async () => {
  loadingOrders.value = true

  try {
    const [ordersData, statsData] = await Promise.all([
      authStore.getOrders(),
      authStore.getOrderStats()
    ])

    orders.value = ordersData.orders || []
    stats.value = statsData.stats || null
  } catch (error) {
    console.error('Failed to fetch orders:', error)
  } finally {
    loadingOrders.value = false
  }
}

const handleLogout = () => {
  if (confirm('Are you sure you want to logout?')) {
    authStore.logout()
    router.push('/')
  }
}

const formatPrice = (price) => {
  return Number(price).toLocaleString('en-US', { minimumFractionDigits: 0 })
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatPaymentMethod = (method) => {
  const methods = {
    'cash_on_delivery': 'Cash on Delivery',
    'mobile_money': 'Mobile Money'
  }
  return methods[method] || method
}

const getStatusClass = (status) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-700',
    'confirmed': 'bg-blue-100 text-blue-700',
    'delivered': 'bg-green-100 text-green-700',
    'cancelled': 'bg-red-100 text-red-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const getPaymentStatusClass = (status) => {
  const classes = {
    'pending': 'bg-orange-100 text-orange-700',
    'paid': 'bg-green-100 text-green-700',
    'failed': 'bg-red-100 text-red-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

useHead({
  title: 'My Account - Global Authentic TZ',
  meta: [
    { name: 'description', content: 'Manage your orders and account settings' }
  ]
})
</script>
