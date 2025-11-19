<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
      <p class="text-gray-600">Browse our complete collection</p>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Filters Sidebar -->
      <aside class="lg:w-64 flex-shrink-0">
        <div class="bg-white rounded-lg shadow-md p-6 sticky top-24">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-bold text-gray-900">Filters</h2>
            <button
              @click="clearFilters"
              class="text-sm text-yellow-600 hover:text-yellow-700 font-semibold"
            >
              Clear All
            </button>
          </div>

          <!-- Search -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Search</label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>

          <!-- Category Filter -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <select
              v-model="selectedCategory"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.code }}
              </option>
            </select>
          </div>

          <!-- Brand Filter -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
            <select
              v-model="selectedBrand"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            >
              <option value="">All Brands</option>
              <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                {{ brand.name }}
              </option>
            </select>
          </div>

          <!-- Condition Filter -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="selectedCondition"
                  value=""
                  class="w-4 h-4 text-yellow-400 focus:ring-yellow-400"
                />
                <span class="ml-2 text-sm text-gray-700">All</span>
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="selectedCondition"
                  value="new"
                  class="w-4 h-4 text-yellow-400 focus:ring-yellow-400"
                />
                <span class="ml-2 text-sm text-gray-700">New</span>
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="selectedCondition"
                  value="used"
                  class="w-4 h-4 text-yellow-400 focus:ring-yellow-400"
                />
                <span class="ml-2 text-sm text-gray-700">Used</span>
              </label>
            </div>
          </div>

          <!-- Price Range Filter -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
            <div class="space-y-3">
              <div>
                <label class="text-xs text-gray-600">Min Price (TZS)</label>
                <input
                  v-model.number="minPrice"
                  type="number"
                  placeholder="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>
              <div>
                <label class="text-xs text-gray-600">Max Price (TZS)</label>
                <input
                  v-model.number="maxPrice"
                  type="number"
                  placeholder="No limit"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <!-- Stock Filter -->
          <div class="mb-6">
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="inStockOnly"
                class="w-4 h-4 text-yellow-400 focus:ring-yellow-400 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">In Stock Only</span>
            </label>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1">
        <!-- Results Bar -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div class="text-gray-600">
            Showing {{ sortedProducts.length }} of {{ products.length }} products
          </div>

          <!-- Sort Dropdown -->
          <div class="flex items-center gap-2">
            <label class="text-sm font-semibold text-gray-700">Sort by:</label>
            <select
              v-model="sortBy"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="n in 8" :key="n" class="card animate-pulse">
            <div class="bg-gray-200 h-48"></div>
            <div class="p-4 space-y-3">
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>

        <!-- Products Grid -->
        <div v-else-if="sortedProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard v-for="product in sortedProducts" :key="product.id" :product="product" />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16 bg-white rounded-lg">
          <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p class="text-gray-600">Try adjusting your filters or search query</p>
          <button @click="clearFilters" class="mt-4 px-6 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors">
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { getProductsWithPricing } = useProducts()
const { apiFetch } = useApi()

const products = ref([])
const categories = ref([])
const brands = ref([])
const loading = ref(true)

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedBrand = ref('')
const selectedCondition = ref('')
const minPrice = ref(null)
const maxPrice = ref(null)
const inStockOnly = ref(false)
const sortBy = ref('featured')

// Fetch data
onMounted(async () => {
  try {
    [products.value, categories.value, brands.value] = await Promise.all([
      getProductsWithPricing(),
      apiFetch('/common/type/ITEM_CATEGORY'),
      apiFetch('/brands')
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

    const matchesBrand = !selectedBrand.value ||
      (product.brand && product.brand.id && product.brand.id.toString() === selectedBrand.value.toString())

    const matchesCondition = !selectedCondition.value ||
      product.condition === selectedCondition.value

    const matchesPrice =
      (!minPrice.value || product.sellingPrice >= minPrice.value) &&
      (!maxPrice.value || product.sellingPrice <= maxPrice.value)

    const matchesStock = !inStockOnly.value || product.inStock

    return matchesSearch && matchesCategory && matchesBrand && matchesCondition && matchesPrice && matchesStock
  })
})

// Sorted products
const sortedProducts = computed(() => {
  const filtered = [...filteredProducts.value]

  switch (sortBy.value) {
    case 'price-low':
      return filtered.sort((a, b) => (a.sellingPrice || 0) - (b.sellingPrice || 0))
    case 'price-high':
      return filtered.sort((a, b) => (b.sellingPrice || 0) - (a.sellingPrice || 0))
    case 'newest':
      return filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    case 'name':
      return filtered.sort((a, b) => a.name.localeCompare(b.name))
    case 'featured':
    default:
      // Featured: prioritize new items, then in stock, then by price
      return filtered.sort((a, b) => {
        if (a.condition === 'new' && b.condition !== 'new') return -1
        if (a.condition !== 'new' && b.condition === 'new') return 1
        if (a.inStock && !b.inStock) return -1
        if (!a.inStock && b.inStock) return 1
        return 0
      })
  }
})

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedBrand.value = ''
  selectedCondition.value = ''
  minPrice.value = null
  maxPrice.value = null
  inStockOnly.value = false
  sortBy.value = 'featured'
}

useHead({
  title: 'Products - Global Authentic TZ | Shop International Brands',
  meta: [
    { name: 'description', content: 'Browse authentic global products from trusted international brands, right here in Tanzania' }
  ]
})
</script>
