<template>
  <div class="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
    <div class="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-black text-gray-900 mb-2">
          Welcome <span class="text-yellow-500">Back</span>
        </h1>
        <p class="text-gray-600 text-sm">Login to track your orders and manage your account</p>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-700 text-sm">{{ errorMessage }}</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Phone Number -->
        <div>
          <label for="phone" class="block text-sm font-semibold text-gray-900 mb-2">
            Phone Number *
          </label>
          <input
            v-model="formData.phone"
            type="tel"
            id="phone"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all"
            placeholder="+255 XXX XXX XXX"
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-semibold text-gray-900 mb-2">
            Password *
          </label>
          <input
            v-model="formData.password"
            type="password"
            id="password"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all"
            placeholder="Enter your password"
          />
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-400 text-black font-bold py-3.5 rounded-lg transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
        >
          <svg v-if="isLoading" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{{ isLoading ? 'Logging in...' : 'Login' }}</span>
        </button>
      </form>

      <!-- Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-4 bg-white text-gray-500">Don't have an account?</span>
        </div>
      </div>

      <!-- Register Link -->
      <NuxtLink
        to="/register"
        class="block w-full text-center py-3 border-2 border-gray-900 text-gray-900 font-bold rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-300"
      >
        Create Account
      </NuxtLink>

      <!-- Set Password Link -->
      <div class="mt-4 text-center">
        <NuxtLink to="/set-password" class="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
          Placed an order? Set your password here
        </NuxtLink>
      </div>

      <!-- Back to Home -->
      <div class="mt-6 text-center">
        <NuxtLink to="/" class="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const formData = reactive({
  phone: '',
  password: ''
})

const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    await authStore.login(formData.phone, formData.password)

    // Redirect to account page on success
    router.push('/account')
  } catch (error) {
    console.error('Login failed:', error)

    if (error.data?.message) {
      errorMessage.value = error.data.message
    } else if (error.message) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = 'Login failed. Please check your credentials and try again.'
    }
  } finally {
    isLoading.value = false
  }
}

// Redirect if already logged in
onMounted(() => {
  authStore.initAuth()
  if (authStore.isAuthenticated) {
    router.push('/account')
  }
})

useHead({
  title: 'Login - Global Authentic TZ',
  meta: [
    { name: 'description', content: 'Login to your account to track orders and manage your profile' }
  ]
})
</script>
