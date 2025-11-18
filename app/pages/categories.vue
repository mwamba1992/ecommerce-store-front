<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
    <!-- Page Header -->
    <div class="mb-10">
      <h1 class="text-3xl sm:text-4xl font-black mb-2">
        Browse by <span class="text-yellow-500">Category</span>
      </h1>
      <p class="text-gray-600 text-sm">Find products organized by their categories</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      <div v-for="n in 8" :key="n" class="bg-white rounded-xl shadow-md border border-gray-200 animate-pulse overflow-hidden">
        <div class="bg-gray-200 h-32 sm:h-40"></div>
        <div class="p-4 sm:p-5 space-y-3">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>

    <!-- Categories Grid -->
    <div v-else-if="categories.length > 0" class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      <NuxtLink
        v-for="category in categories"
        :key="category.id"
        :to="`/products?category=${category.id}`"
        class="bg-white rounded-xl shadow-md border border-gray-200 group hover:shadow-xl hover:border-yellow-400 transition-all duration-300 overflow-hidden"
      >
        <!-- Icon Section -->
        <div class="bg-gradient-to-br from-yellow-50 to-gray-50 p-6 sm:p-8 flex items-center justify-center group-hover:from-yellow-100 group-hover:to-yellow-50 transition-colors border-b border-gray-100">
          <div class="text-4xl sm:text-5xl md:text-6xl">
            {{ category.icon || '📦' }}
          </div>
        </div>

        <!-- Category Info -->
        <div class="p-4 sm:p-5">
          <h3 class="text-sm sm:text-base font-bold text-gray-900 mb-1.5 sm:mb-2 group-hover:text-yellow-600 transition-colors line-clamp-1">
            {{ category.code }}
          </h3>
          <p class="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3">
            {{ category.description || 'Browse products in this category' }}
          </p>

          <!-- Product Count -->
          <div v-if="getCategoryProductCount(category.id) > 0" class="text-xs sm:text-sm text-yellow-600 font-bold">
            {{ getCategoryProductCount(category.id) }} product{{ getCategoryProductCount(category.id) === 1 ? '' : 's' }}
          </div>
          <div v-else class="text-xs text-gray-400">
            No products yet
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-20">
      <div class="max-w-md mx-auto">
        <svg class="w-32 h-32 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <h2 class="text-2xl font-bold text-gray-900 mb-3">No Categories Found</h2>
        <p class="text-gray-600 mb-8">Check back soon for new categories</p>
        <NuxtLink to="/products" class="inline-flex items-center justify-center px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg">
          Browse All Products
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const { apiFetch } = useApi()
const { getProducts } = useProducts()

const categories = ref([])
const products = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    [categories.value, products.value] = await Promise.all([
      apiFetch('/common/type/ITEM_CATEGORY'),
      getProducts()
    ])
  } catch (error) {
    console.error('Error loading categories:', error)
  } finally {
    loading.value = false
  }
})

const getCategoryProductCount = (categoryId) => {
  return products.value.filter(p => p.category?.id === categoryId).length
}

useHead({
  title: 'Categories - Global Authentic TZ',
  meta: [
    { name: 'description', content: 'Browse products by category' }
  ]
})
</script>
