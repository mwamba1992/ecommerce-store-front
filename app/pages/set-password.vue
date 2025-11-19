<template>
  <div class="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
    <div class="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-black text-gray-900 mb-2">
          Set Your <span class="text-yellow-500">Password</span>
        </h1>
        <p class="text-gray-600 text-sm">Create a password to access your order history</p>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p class="text-green-700 text-sm font-medium">{{ successMessage }}</p>
        <NuxtLink to="/login" class="text-green-700 underline text-sm mt-2 inline-block">
          Click here to login →
        </NuxtLink>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-700 text-sm">{{ errorMessage }}</p>
      </div>

      <!-- Set Password Form -->
      <form v-if="!successMessage" @submit.prevent="handleSetPassword" class="space-y-5">
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
          <p class="text-xs text-gray-500 mt-1">Use the phone number from your order</p>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-semibold text-gray-900 mb-2">
            New Password * <span class="text-xs text-gray-500">(min 6 characters)</span>
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

        <!-- Set Password Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-400 text-black font-bold py-3.5 rounded-lg transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
        >
          <svg v-if="isLoading" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{{ isLoading ? 'Setting Password...' : 'Set Password' }}</span>
        </button>
      </form>

      <!-- Back Links -->
      <div class="mt-6 space-y-2">
        <div class="text-center">
          <NuxtLink to="/login" class="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
            Already have a password? Login here
          </NuxtLink>
        </div>
        <div class="text-center">
          <NuxtLink to="/" class="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const route = useRoute()

const formData = reactive({
  phone: '',
  password: ''
})

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Pre-fill phone number from query parameter
onMounted(() => {
  if (route.query.phone) {
    formData.phone = route.query.phone
  }
})

const handleSetPassword = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    await authStore.setPassword(formData.phone, formData.password)

    successMessage.value = 'Password set successfully! You can now login to your account.'
    formData.phone = ''
    formData.password = ''
  } catch (error) {
    console.error('Set password failed:', error)

    if (error.data?.message) {
      errorMessage.value = error.data.message
    } else if (error.message) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = 'Failed to set password. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

useHead({
  title: 'Set Password - Global Authentic TZ',
  meta: [
    { name: 'description', content: 'Set your password to access your order history' }
  ]
})
</script>
