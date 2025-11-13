<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
      <p class="text-gray-600">Browse our complete collection</p>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 mb-8">
      <!-- Search -->
      <div class="flex-1 min-w-[250px]">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="input-field"
        />
      </div>

      <!-- Category Filter -->
      <select v-model="selectedCategory" class="input-field max-w-xs">
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.code }} - {{ category.description }}
        </option>
      </select>

      <!-- Condition Filter -->
      <select v-model="selectedCondition" class="input-field max-w-xs">
        <option value="">All Conditions</option>
        <option value="new">New</option>
        <option value="used">Used</option>
      </select>
    </div>

    <!-- Results Count -->
    <div class="mb-4 text-gray-600">
      Showing {{ filteredProducts.length }} of {{ products.length }} products
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="n in 8" :key="n" class="card animate-pulse">
        <div class="bg-gray-200 h-48"></div>
        <div class="p-4 space-y-3">
          <div class="h-4 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div v-else-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
      <p class="text-gray-600">Try adjusting your filters or search query</p>
      <button @click="clearFilters" class="mt-4 btn-primary">
        Clear Filters
      </button>
    </div>
  </div>
</template>

<script setup>
const { getProductsWithPricing } = useProducts()
const { apiFetch } = useApi()

const products = ref([])
const categories = ref([])
const loading = ref(true)

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedCondition = ref('')

// Fetch data
onMounted(async () => {
  try {
    [products.value, categories.value] = await Promise.all([
      getProductsWithPricing(),
      apiFetch('/common/type/ITEM_CATEGORY')
    ])
  } catch (error) {
    console.error('Error loading products:', error)
  } finally {
    loading.value = false
  }
})

// Filtered products
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = !searchQuery.value ||
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (product.code && product.code.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (product.desc && product.desc.toLowerCase().includes(searchQuery.value.toLowerCase()))

    const matchesCategory = !selectedCategory.value ||
      (product.category && product.category.id.toString() === selectedCategory.value.toString())

    const matchesCondition = !selectedCondition.value ||
      product.condition === selectedCondition.value

    return matchesSearch && matchesCategory && matchesCondition
  })
})

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedCondition.value = ''
}

useHead({
  title: 'Products - Global Authentic TZ | Shop International Brands',
  meta: [
    { name: 'description', content: 'Browse authentic global products from trusted international brands, right here in Tanzania' }
  ]
})
</script>
