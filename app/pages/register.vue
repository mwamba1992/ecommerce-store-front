<template>
  <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
    <div class="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-black text-gray-900 mb-2">
          Create <span class="text-yellow-500">Account</span>
        </h1>
        <p class="text-gray-600 text-sm">Join us to track your orders and enjoy faster checkout</p>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-700 text-sm">{{ errorMessage }}</p>
      </div>

      <!-- Register Form -->
      <form @submit.prevent="handleRegister" class="space-y-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Full Name -->
          <div class="sm:col-span-2">
            <label for="name" class="block text-sm font-semibold text-gray-900 mb-2">
              Full Name *
            </label>
            <input
              v-model="formData.name"
              type="text"
              id="name"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all"
              placeholder="Enter your full name"
            />
          </div>

          <!-- Phone Number -->
          <div class="sm:col-span-2">
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
          <div class="sm:col-span-2">
            <label for="password" class="block text-sm font-semibold text-gray-900 mb-2">
              Password * <span class="text-xs text-gray-500">(min 6 characters)</span>
            </label>
            <input
              v-model="formData.password"
              type="password"
              id="password"
              required
              minlength="6"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all"
              placeholder="Create a password"
            />
          </div>

          <!-- Email -->
          <div class="sm:col-span-2">
            <label for="email" class="block text-sm font-semibold text-gray-900 mb-2">
              Email (Optional)
            </label>
            <input
              v-model="formData.email"
              type="email"
              id="email"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all"
              placeholder="your.email@example.com"
            />
          </div>

          <!-- City -->
          <div>
            <label for="city" class="block text-sm font-semibold text-gray-900 mb-2">
              City (Optional)
            </label>
            <input
              v-model="formData.city"
              type="text"
              id="city"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all"
              placeholder="e.g., Dar es Salaam"
            />
          </div>

          <!-- Region -->
          <div>
            <label for="region" class="block text-sm font-semibold text-gray-900 mb-2">
              Region (Optional)
            </label>
            <input
              v-model="formData.region"
              type="text"
              id="region"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all"
              placeholder="e.g., Kinondoni"
            />
          </div>
        </div>

        <!-- Register Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-400 text-black font-bold py-3.5 rounded-lg transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 mt-6"
        >
          <svg v-if="isLoading" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{{ isLoading ? 'Creating Account...' : 'Create Account' }}</span>
        </button>
      </form>

      <!-- Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-4 bg-white text-gray-500">Already have an account?</span>
        </div>
      </div>

      <!-- Login Link -->
      <NuxtLink
        to="/login"
        class="block w-full text-center py-3 border-2 border-gray-900 text-gray-900 font-bold rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-300"
      >
        Login
      </NuxtLink>

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
  name: '',
  phone: '',
  password: '',
  email: '',
  city: '',
  region: ''
})

const isLoading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''
  isLoading.value = true

  try {
    // Prepare registration data (remove empty optional fields)
    const registerData = {
      name: formData.name,
      phone: formData.phone,
      password: formData.password
    }

    if (formData.email) registerData.email = formData.email
    if (formData.city) registerData.city = formData.city
    if (formData.region) registerData.region = formData.region

    await authStore.register(registerData)

    // Redirect to account page on success
    router.push('/account')
  } catch (error) {
    console.error('Registration failed:', error)

    if (error.data?.message) {
      errorMessage.value = error.data.message
    } else if (error.message) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = 'Registration failed. Please try again.'
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
  title: 'Register - Global Authentic TZ',
  meta: [
    { name: 'description', content: 'Create an account to track your orders and enjoy faster checkout' }
  ]
})
</script>
