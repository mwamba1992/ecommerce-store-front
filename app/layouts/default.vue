<template>
  <div class="min-h-screen flex flex-col">
    <!-- Announcement: the store's standing promises, in one line -->
    <div class="bg-gray-900 text-white text-xs sm:text-sm text-center px-4 py-2">
      Delivery across Tanzania · Pay on delivery · 7-day returns
    </div>

    <!-- Header: white, with the search field as its centrepiece -->
    <header class="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div class="max-w-[1184px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap items-center gap-x-4 md:gap-x-8 py-3 md:py-4">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center flex-shrink-0">
            <img src="/logo-wordmark.png" alt="Global Authentic TZ" width="984" height="534" class="h-12 md:h-16 w-auto" />
          </NuxtLink>

          <!-- Search: full-width second row on phones, inline from md up -->
          <div class="order-last md:order-none w-full md:w-auto md:flex-1 mt-3 md:mt-0">
            <div class="relative w-full">
              <input
                v-model="searchQuery"
                @input="handleSearch"
                @focus="showSearchResults = true"
                @keydown.enter="submitSearch"
                type="search"
                aria-label="Search products"
                placeholder="Search for smart watches, earbuds, brands…"
                class="w-full h-12 pl-12 pr-4 bg-gray-100 border border-transparent rounded-full text-[15px] text-gray-900 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
              />
              <svg class="w-5 h-5 text-gray-900 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>

              <!-- Search results -->
              <div
                v-if="showSearchResults && searchQuery.length > 0"
                v-click-outside="closeSearch"
                class="absolute top-full left-0 right-0 mt-2 bg-white text-gray-900 rounded-card shadow-lift border border-gray-100 max-h-96 overflow-y-auto z-50"
              >
                <div v-if="searchLoading" class="p-4 text-center text-sm text-gray-500">Searching…</div>

                <div v-else-if="searchResults.length > 0" class="py-2">
                  <NuxtLink
                    v-for="product in searchResults"
                    :key="product.id"
                    :to="`/products/${product.id}`"
                    @click="closeSearch"
                    class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                  >
                    <img
                      v-if="product.imageUrl"
                      :src="getImageUrl(product.imageUrl)"
                      :alt="product.name"
                      width="48"
                      height="48"
                      class="w-12 h-12 object-contain rounded-xl bg-white border border-gray-100"
                    />
                    <span v-else class="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-gray-900/30" :style="{ backgroundColor: tintFor(product.id) }">{{ initialOf(product.name) }}</span>
                    <span class="flex-1 min-w-0">
                      <span class="block text-sm font-medium text-gray-900 truncate">{{ product.name }}</span>
                      <span class="block text-sm font-bold text-gray-900">TZS {{ formatPrice(product.sellingPrice) }}</span>
                    </span>
                  </NuxtLink>
                  <NuxtLink :to="{ path: '/products', query: { q: searchQuery } }" @click="closeSearch" class="block px-4 py-3 text-center text-sm font-semibold text-gray-900 underline hover:bg-gray-50 border-t border-gray-100">
                    See all results
                  </NuxtLink>
                </div>

                <div v-else class="p-4 text-center text-sm text-gray-500">No products found</div>
              </div>
            </div>
          </div>

          <!-- Help, account, wishlist, cart -->
          <div class="ml-auto md:ml-0 flex items-center gap-1 sm:gap-2">
            <NuxtLink to="/help" class="hidden lg:block px-3 text-gray-900 hover:underline">Need help?</NuxtLink>

            <NuxtLink :to="authStore.isAuthenticated ? '/account' : '/login'" class="hidden md:flex w-11 h-11 rounded-full items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors" :aria-label="authStore.isAuthenticated ? 'Account' : 'Sign in'">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </NuxtLink>

            <NuxtLink to="/wishlist" class="relative w-11 h-11 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors" aria-label="Wishlist">
              <svg class="w-6 h-6" :fill="wishlistStore.totalItems > 0 ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              <span v-if="wishlistStore.totalItems > 0" class="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-gray-900 text-white text-[11px] font-bold rounded-full flex items-center justify-center">{{ wishlistStore.totalItems }}</span>
            </NuxtLink>

            <NuxtLink to="/cart" class="relative w-11 h-11 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors" aria-label="Cart">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <span v-if="cartStore.totalItems > 0" class="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-gray-900 text-white text-[11px] font-bold rounded-full flex items-center justify-center">{{ cartStore.totalItems }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Category row: the catalogue's own categories, the current one underlined -->
      <nav class="hidden md:block" aria-label="Main">
        <ul class="max-w-[1184px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-7 text-sm overflow-x-auto">
          <li v-for="link in navLinks" :key="link.to" class="flex-shrink-0">
            <NuxtLink :to="link.to" class="block py-3 border-b-2 border-transparent text-gray-900 hover:border-gray-300 transition-colors" active-class="!border-gray-900">
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </header>

    <!-- Main content. Bottom padding on phones clears the tab bar. -->
    <main class="flex-1 pb-20 md:pb-0">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 text-gray-900 pb-20 md:pb-0">
      <div class="max-w-[1184px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10">
          <div class="col-span-2 md:col-span-1">
            <img src="/logo-wordmark.png" alt="Global Authentic TZ" width="984" height="534" loading="lazy" class="h-16 w-auto mb-3" />
            <p class="text-xs uppercase tracking-[0.14em] text-gray-600 mb-4">True global goods, right here in TZ</p>
            <p class="text-gray-600 text-sm leading-relaxed mb-5">Your trusted source for authentic international products in Tanzania.</p>
            <div class="flex gap-3">
              <a href="https://www.instagram.com/globalauthenticstz/" target="_blank" rel="noopener noreferrer" class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white transition-colors" aria-label="Instagram">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" /></svg>
              </a>
              <a href="https://wa.me/255789947608" target="_blank" rel="noopener noreferrer" class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white transition-colors" aria-label="WhatsApp">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h3 class="text-base font-medium text-gray-900 mb-4">Shop</h3>
            <ul class="space-y-3 text-[15px] text-gray-600">
              <li><NuxtLink to="/products" class="hover:text-gray-900 hover:underline transition-colors">All products</NuxtLink></li>
              <li><NuxtLink to="/categories" class="hover:text-gray-900 hover:underline transition-colors">Categories</NuxtLink></li>
              <li><NuxtLink to="/brands" class="hover:text-gray-900 hover:underline transition-colors">Brands</NuxtLink></li>
              <li><NuxtLink to="/about" class="hover:text-gray-900 hover:underline transition-colors">About us</NuxtLink></li>
            </ul>
          </div>

          <div>
            <h3 class="text-base font-medium text-gray-900 mb-4">Help</h3>
            <ul class="space-y-3 text-[15px] text-gray-600">
              <li><NuxtLink to="/help" class="hover:text-gray-900 hover:underline transition-colors">Help center</NuxtLink></li>
              <li><NuxtLink to="/shipping" class="hover:text-gray-900 hover:underline transition-colors">Shipping</NuxtLink></li>
              <li><NuxtLink to="/returns" class="hover:text-gray-900 hover:underline transition-colors">Returns</NuxtLink></li>
              <li><NuxtLink to="/contact" class="hover:text-gray-900 hover:underline transition-colors">Contact</NuxtLink></li>
            </ul>
          </div>

          <div class="col-span-2 md:col-span-1">
            <h3 class="text-base font-medium text-gray-900 mb-4">Get in touch</h3>
            <ul class="space-y-3 text-[15px] text-gray-600">
              <li><a href="https://wa.me/255789947608" target="_blank" rel="noopener noreferrer" class="hover:text-gray-900 hover:underline transition-colors">WhatsApp: +255 789 947 608</a></li>
              <li><a href="tel:+255789947608" class="hover:text-gray-900 hover:underline transition-colors">Call: +255 789 947 608</a></li>
              <li><a href="mailto:info@globalauthentic.co.tz" class="hover:text-gray-900 hover:underline transition-colors">info@globalauthentic.co.tz</a></li>
              <li>Kariakoo, Dar es Salaam</li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>&copy; {{ new Date().getFullYear() }} Global Authentic TZ. All rights reserved.</p>
          <div class="flex items-center gap-6">
            <NuxtLink to="/privacy" class="hover:text-gray-900 hover:underline transition-colors">Privacy Policy</NuxtLink>
            <NuxtLink to="/terms" class="hover:text-gray-900 hover:underline transition-colors">Terms of Service</NuxtLink>
          </div>
        </div>
      </div>
    </footer>

    <!-- Tab bar (phones): the app-style way around the store, one thumb away -->
    <nav class="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white shadow-nav border-t border-gray-100" aria-label="Primary">
      <ul class="grid grid-cols-5 h-[60px]">
        <li v-for="tab in tabs" :key="tab.to">
          <NuxtLink :to="tab.to" class="relative h-full flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-gray-500" :class="{ '!text-gray-900': isActive(tab.to) }">
            <span class="relative">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" :stroke-width="isActive(tab.to) ? 2.2 : 1.8" :d="tab.icon" /></svg>
              <span v-if="tab.count" class="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 bg-gray-900 text-white text-[11px] font-bold rounded-full flex items-center justify-center">{{ tab.count }}</span>
            </span>
            {{ tab.label }}
            <span v-if="isActive(tab.to)" class="absolute top-0 w-8 h-0.5 rounded-full bg-gray-900"></span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'
import { useWishlistStore } from '~/stores/wishlist'
import { categoryPath, collectCategories } from '#shared/utils/seo'

const cartStore = useCartStore()
const authStore = useAuthStore()
const wishlistStore = useWishlistStore()
const route = useRoute()

// The category row is built from the catalogue. It is decoration on pages like
// the cart, so a failed fetch leaves the fixed links rather than an error.
const { data: navCategories } = await useAsyncData(
  'nav-categories',
  async () => collectCategories(await useProducts().getProductsWithPricing()).slice(0, 6),
  { default: () => [] }
)

const navLinks = computed(() => [
  { to: '/products', label: 'All products' },
  ...navCategories.value.map(category => ({ to: categoryPath(category), label: category.label })),
  { to: '/brands', label: 'Brands' },
  { to: '/about', label: 'About us' }
])

const tabs = computed(() => [
  { to: '/', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/categories', label: 'Categories', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { to: '/wishlist', label: 'Saved', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', count: wishlistStore.totalItems },
  { to: '/cart', label: 'Cart', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z', count: cartStore.totalItems },
  { to: authStore.isAuthenticated ? '/account' : '/login', label: 'Account', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
])

const isActive = (to) => (to === '/' ? route.path === '/' : route.path.startsWith(to))

// Search functionality
const { getProductsWithPricing } = useProducts()
const { formatPrice, productImage } = useFormat()
const searchQuery = ref('')
const searchResults = ref([])
const showSearchResults = ref(false)
const searchLoading = ref(false)
let searchTimeout = null

const handleSearch = async () => {
  if (searchQuery.value.length === 0) {
    searchResults.value = []
    return
  }

  searchLoading.value = true

  // Debounce search
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    try {
      const allProducts = await getProductsWithPricing()
      const query = searchQuery.value.toLowerCase()
      searchResults.value = allProducts
        .filter(product =>
          product.name.toLowerCase().includes(query) ||
          (product.code && product.code.toLowerCase().includes(query)) ||
          (product.desc && product.desc.toLowerCase().includes(query))
        )
        .slice(0, 5) // Show only first 5 results
    } catch (error) {
      console.error('Search error:', error)
      searchResults.value = []
    } finally {
      searchLoading.value = false
    }
  }, 300)
}

const submitSearch = () => {
  const q = searchQuery.value.trim()
  if (!q) return
  navigateTo({ path: '/products', query: { q } })
  closeSearch()
}

const closeSearch = () => {
  showSearchResults.value = false
  searchQuery.value = ''
  searchResults.value = []
}

const getImageUrl = (imageUrl) => productImage(imageUrl, 'thumb')

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

// Load cart, auth, and wishlist from localStorage on mount
onMounted(() => {
  cartStore.loadFromLocalStorage()
  authStore.initAuth()
  wishlistStore.loadFromLocalStorage()
})
</script>
