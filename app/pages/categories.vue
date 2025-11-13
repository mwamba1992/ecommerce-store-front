<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Browse by Category</h1>
      <p class="text-gray-600">Find products organized by their categories</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="n in 8" :key="n" class="card animate-pulse">
        <div class="bg-gray-200 h-32 rounded-t-lg"></div>
        <div class="p-6 space-y-3">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>

    <!-- Categories Grid -->
    <div v-else-if="categories.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <NuxtLink
        v-for="category in categories"
        :key="category.id"
        :to="`/products?category=${category.id}`"
        class="card group hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        <!-- Icon Section -->
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors">
          <div class="text-6xl">
            {{ category.icon || '📦' }}
          </div>
        </div>

        <!-- Category Info -->
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {{ category.code }}
          </h3>
          <p class="text-sm text-gray-600 line-clamp-2">
            {{ category.description || 'Browse products in this category' }}
          </p>

          <!-- Product Count -->
          <div v-if="getCategoryProductCount(category.id) > 0" class="mt-4 text-sm text-blue-600 font-medium">
            {{ getCategoryProductCount(category.id) }} products
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
      <p class="text-gray-600">Check back soon for new categories</p>
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
  title: 'Categories - ShopStore',
  meta: [
    { name: 'description', content: 'Browse products by category' }
  ]
})
</script>
