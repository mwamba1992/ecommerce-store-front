<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <!-- Animated Background Elements -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(234,179,8,0.1),transparent_50%)]"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(234,179,8,0.05),transparent_50%)]"></div>
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative">
        <div class="text-center">
          <!-- Premium Logo Display -->
          <div class="mb-8 animate-fade-in">
            <div class="relative inline-block">
              <h1 class="text-6xl md:text-8xl font-black text-white lowercase mb-3" style="font-family: 'Arial Black', Arial, sans-serif; letter-spacing: -0.03em; text-shadow: 0 4px 20px rgba(234, 179, 8, 0.3);">
                global
              </h1>
              <svg class="w-10 h-10 md:w-14 md:h-14 text-yellow-400 absolute -top-3 -right-8 md:-right-12 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h2 class="text-3xl md:text-5xl font-black text-yellow-400 uppercase tracking-[0.4em] mb-6" style="font-family: Arial, sans-serif; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">
              Authentic TZ
            </h2>
            <div class="w-24 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-6"></div>
          </div>

          <!-- Tagline -->
          <p class="text-xl md:text-3xl mb-10 text-gray-200 font-light tracking-wide max-w-3xl mx-auto">
            TRUE GLOBAL GOODS, RIGHT HERE IN TZ
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <NuxtLink to="/products" class="group relative inline-flex items-center justify-center px-10 py-4 bg-yellow-400 text-black font-bold rounded-lg overflow-hidden transition-all duration-300 hover:bg-yellow-500 hover:scale-105 shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:shadow-[0_0_40px_rgba(234,179,8,0.5)]">
              <span class="relative z-10 flex items-center">
                Shop Now
                <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </NuxtLink>
            <NuxtLink to="/about" class="inline-flex items-center px-10 py-4 border-2 border-yellow-400 text-yellow-400 font-bold rounded-lg hover:bg-yellow-400 hover:text-black transition-all duration-300">
              Learn More
            </NuxtLink>
          </div>

          <!-- Trust Badges -->
          <div class="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span class="font-semibold">100% Authentic</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              <span class="font-semibold">Fast Delivery</span>
            </div>
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span class="font-semibold">Verified Seller</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Featured <span class="text-yellow-500">Products</span>
        </h2>
        <p class="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
          Discover our carefully curated selection of authentic international products
        </p>
        <div class="w-24 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto"></div>
      </div>

      <div class="flex justify-end mb-6">
        <NuxtLink to="/products" class="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-yellow-500 hover:text-black transition-all duration-300 shadow-lg">
          View All Products
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </NuxtLink>
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
      <div v-else-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No products available</h3>
        <p class="text-gray-600">Check back soon for amazing deals!</p>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="bg-gray-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Shop by Category</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <NuxtLink
            v-for="category in categories"
            :key="category.id"
            :to="`/products?category=${category.id}`"
            class="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
          >
            <div class="text-4xl mb-3">{{ category.icon || '📦' }}</div>
            <h3 class="font-semibold text-gray-900">{{ category.code }}</h3>
            <p class="text-sm text-gray-600">{{ category.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">Fast Delivery</h3>
          <p class="text-gray-600">Quick and reliable shipping to your doorstep</p>
        </div>

        <div class="text-center">
          <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">Secure Payment</h3>
          <p class="text-gray-600">Safe and secure payment processing</p>
        </div>

        <div class="text-center">
          <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold mb-2">Quality Products</h3>
          <p class="text-gray-600">Carefully curated selection of top-quality items</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { getProductsWithPricing } = useProducts()
const { apiFetch } = useApi()

const products = ref([])
const categories = ref([])
const loading = ref(true)

onMounted(async () => {
  console.log('🚀 [Homepage] Starting to fetch data...')
  try {
    // Fetch featured products with pricing and inventory (limit to 8)
    console.log('📦 [Homepage] Fetching products with pricing and inventory...')
    const allProducts = await getProductsWithPricing()
    console.log('✅ [Homepage] Products fetched:', allProducts.length, 'items')
    console.log('📊 [Homepage] Products data:', allProducts)
    products.value = allProducts.slice(0, 8)

    // Fetch categories
    console.log('🏷️ [Homepage] Fetching categories...')
    categories.value = await apiFetch('/common/type/ITEM_CATEGORY')
    console.log('✅ [Homepage] Categories fetched:', categories.value.length, 'categories')
    console.log('📊 [Homepage] Categories data:', categories.value)
  } catch (error) {
    console.error('❌ [Homepage] Error loading data:', error)
  } finally {
    loading.value = false
    console.log('🏁 [Homepage] Loading complete. Products:', products.value.length, 'Categories:', categories.value.length)
  }
})

useHead({
  title: 'Home - Global Authentic TZ | True Global Goods',
  meta: [
    { name: 'description', content: 'True global goods, right here in TZ. Shop authentic international products with confidence.' }
  ]
})
</script>
