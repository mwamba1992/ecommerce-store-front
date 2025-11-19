<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-gradient-to-r from-gray-900 via-black to-gray-900 shadow-xl sticky top-0 z-50 border-b border-yellow-500/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16 md:h-20">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center group">
            <div class="relative inline-block">
              <!-- Crown positioned above 'g' -->
              <svg class="w-5 h-3 md:w-6 md:h-4 text-yellow-400 absolute -top-2.5 md:-top-3.5 left-0 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" fill="currentColor" viewBox="0 0 640 512">
                <path d="M528 448H112c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h416c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm64-320c-26.5 0-48 21.5-48 48 0 7.1 1.6 13.7 4.4 19.8L476 239.2c-15.4 9.2-35.3 4-44.2-11.6L350.3 85C361 76.2 368 63 368 48c0-26.5-21.5-48-48-48s-48 21.5-48 48c0 15 7 28.2 17.7 37l-81.5 142.6c-8.9 15.6-28.9 20.8-44.2 11.6l-72.3-43.4c2.7-6 4.4-12.7 4.4-19.8 0-26.5-21.5-48-48-48S0 149.5 0 176s21.5 48 48 48c2.6 0 5.2-.4 7.7-.8L128 416h384l72.3-192.8c2.5.4 5.1.8 7.7.8 26.5 0 48-21.5 48-48s-21.5-48-48-48z"/>
              </svg>
              <span class="text-2xl md:text-3xl font-black text-white tracking-tight lowercase block" style="font-family: 'Arial Black', Arial, sans-serif; letter-spacing: -0.02em;">global</span>
              <span class="text-[8px] md:text-[10px] font-bold text-yellow-400 uppercase tracking-[0.2em] md:tracking-[0.25em] block" style="font-family: Arial, sans-serif;">Authentic TZ</span>
            </div>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-1">
            <NuxtLink to="/" class="px-4 py-2 text-gray-300 hover:text-yellow-400 hover:bg-white/5 rounded-lg font-semibold transition-all duration-200">
              Home
            </NuxtLink>
            <NuxtLink to="/products" class="px-4 py-2 text-gray-300 hover:text-yellow-400 hover:bg-white/5 rounded-lg font-semibold transition-all duration-200">
              Products
            </NuxtLink>
            <NuxtLink to="/categories" class="px-4 py-2 text-gray-300 hover:text-yellow-400 hover:bg-white/5 rounded-lg font-semibold transition-all duration-200">
              Categories
            </NuxtLink>
            <NuxtLink to="/about" class="px-4 py-2 text-gray-300 hover:text-yellow-400 hover:bg-white/5 rounded-lg font-semibold transition-all duration-200">
              About
            </NuxtLink>
          </nav>

          <!-- Search Bar (Desktop) -->
          <div class="hidden lg:flex items-center flex-1 max-w-md mx-4">
            <div class="relative w-full">
              <input
                v-model="searchQuery"
                @input="handleSearch"
                @focus="showSearchResults = true"
                type="text"
                placeholder="Search products..."
                class="w-full px-4 py-2 pl-10 bg-white/10 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>

              <!-- Search Results Dropdown -->
              <div
                v-if="showSearchResults && searchQuery.length > 0"
                v-click-outside="closeSearch"
                class="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50"
              >
                <!-- Loading -->
                <div v-if="searchLoading" class="p-4 text-center text-gray-500">
                  Searching...
                </div>

                <!-- Results -->
                <div v-else-if="searchResults.length > 0" class="py-2">
                  <NuxtLink
                    v-for="product in searchResults"
                    :key="product.id"
                    :to="`/products/${product.id}`"
                    @click="closeSearch"
                    class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <img
                      v-if="product.imageUrl"
                      :src="getImageUrl(product.imageUrl)"
                      :alt="product.name"
                      class="w-12 h-12 object-contain rounded"
                    />
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-semibold text-gray-900 truncate">{{ product.name }}</p>
                      <p class="text-sm text-yellow-600 font-bold">TZS {{ formatPrice(product.sellingPrice) }}</p>
                    </div>
                  </NuxtLink>
                  <NuxtLink
                    to="/products"
                    @click="closeSearch"
                    class="block px-4 py-3 text-center text-sm text-yellow-600 hover:bg-gray-50 font-semibold border-t"
                  >
                    View all results
                  </NuxtLink>
                </div>

                <!-- No Results -->
                <div v-else class="p-4 text-center text-gray-500">
                  No products found
                </div>
              </div>
            </div>
          </div>

          <!-- Right Side: Account, Wishlist, Cart & Mobile Menu Button -->
          <div class="flex items-center space-x-2 md:space-x-4">
            <!-- Account Icon (Desktop) -->
            <NuxtLink
              v-if="authStore.isAuthenticated"
              to="/account"
              class="hidden md:block p-2 md:p-3 text-white hover:text-yellow-400 transition-colors bg-white/10 rounded-lg hover:bg-white/20"
              title="My Account"
            >
              <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </NuxtLink>
            <NuxtLink
              v-else
              to="/login"
              class="hidden md:block px-4 py-2 text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
            >
              Login
            </NuxtLink>

            <!-- Wishlist Icon -->
            <NuxtLink to="/wishlist" class="relative p-2 md:p-3 transition-colors bg-white/10 rounded-lg hover:bg-white/20 group" :class="wishlistStore.totalItems > 0 ? 'text-yellow-400' : 'text-white hover:text-yellow-400'" title="Wishlist">
              <svg class="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:scale-110" :fill="wishlistStore.totalItems > 0 ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span v-if="wishlistStore.totalItems > 0" class="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                {{ wishlistStore.totalItems }}
              </span>
            </NuxtLink>

            <!-- Cart Icon -->
            <NuxtLink to="/cart" class="relative p-2 md:p-3 text-white hover:text-yellow-400 transition-colors bg-white/10 rounded-lg hover:bg-white/20">
              <svg class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span v-if="cartStore.totalItems > 0" class="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {{ cartStore.totalItems }}
              </span>
            </NuxtLink>

            <!-- Mobile Menu Button -->
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2 text-white hover:text-yellow-400 transition-colors bg-white/10 rounded-lg hover:bg-white/20">
              <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-800">
          <nav class="flex flex-col space-y-2">
            <NuxtLink @click="mobileMenuOpen = false" to="/" class="px-4 py-3 text-gray-300 hover:text-yellow-400 hover:bg-white/5 rounded-lg font-semibold transition-all duration-200">
              Home
            </NuxtLink>
            <NuxtLink @click="mobileMenuOpen = false" to="/products" class="px-4 py-3 text-gray-300 hover:text-yellow-400 hover:bg-white/5 rounded-lg font-semibold transition-all duration-200">
              Products
            </NuxtLink>
            <NuxtLink @click="mobileMenuOpen = false" to="/categories" class="px-4 py-3 text-gray-300 hover:text-yellow-400 hover:bg-white/5 rounded-lg font-semibold transition-all duration-200">
              Categories
            </NuxtLink>
            <NuxtLink @click="mobileMenuOpen = false" to="/about" class="px-4 py-3 text-gray-300 hover:text-yellow-400 hover:bg-white/5 rounded-lg font-semibold transition-all duration-200">
              About
            </NuxtLink>
            <div class="border-t border-gray-800 my-2"></div>
            <NuxtLink
              v-if="authStore.isAuthenticated"
              @click="mobileMenuOpen = false"
              to="/account"
              class="px-4 py-3 text-yellow-400 hover:bg-white/5 rounded-lg font-semibold transition-all duration-200 flex items-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Account
            </NuxtLink>
            <NuxtLink
              v-else
              @click="mobileMenuOpen = false"
              to="/login"
              class="px-4 py-3 text-yellow-400 hover:bg-white/5 rounded-lg font-semibold transition-all duration-200"
            >
              Login / Register
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white border-t border-yellow-500/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12">
          <!-- About -->
          <div class="sm:col-span-2 md:col-span-1">
            <div class="mb-6">
              <div class="relative inline-block mb-3">
                <!-- Crown positioned above 'g' -->
                <svg class="w-6 h-4 text-yellow-400 absolute -top-3.5 left-0 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" fill="currentColor" viewBox="0 0 640 512">
                  <path d="M528 448H112c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h416c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm64-320c-26.5 0-48 21.5-48 48 0 7.1 1.6 13.7 4.4 19.8L476 239.2c-15.4 9.2-35.3 4-44.2-11.6L350.3 85C361 76.2 368 63 368 48c0-26.5-21.5-48-48-48s-48 21.5-48 48c0 15 7 28.2 17.7 37l-81.5 142.6c-8.9 15.6-28.9 20.8-44.2 11.6l-72.3-43.4c2.7-6 4.4-12.7 4.4-19.8 0-26.5-21.5-48-48-48S0 149.5 0 176s21.5 48 48 48c2.6 0 5.2-.4 7.7-.8L128 416h384l72.3-192.8c2.5.4 5.1.8 7.7.8 26.5 0 48-21.5 48-48s-21.5-48-48-48z"/>
                </svg>
                <h3 class="text-2xl sm:text-3xl font-black text-white lowercase block" style="font-family: 'Arial Black', Arial, sans-serif;">global</h3>
              </div>
              <p class="text-xs font-bold text-yellow-400 uppercase tracking-[0.2em] mb-4">Authentic TZ</p>
              <p class="text-gray-400 text-sm leading-relaxed">
                Your trusted source for authentic international products in Tanzania. Quality guaranteed.
              </p>
            </div>
            <!-- Social Media -->
            <div class="flex space-x-4">
              <a href="#" class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all duration-300" aria-label="Facebook">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://www.instagram.com/globalauthenticstz/" target="_blank" rel="noopener noreferrer" class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all duration-300" aria-label="Instagram">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/><path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://wa.me/255789947608" target="_blank" rel="noopener noreferrer" class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all duration-300" aria-label="WhatsApp">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-yellow-400">Quick Links</h3>
            <ul class="space-y-3">
              <li><NuxtLink to="/products" class="text-gray-400 hover:text-yellow-400 text-sm transition-colors flex items-center"><span class="mr-2">›</span> Products</NuxtLink></li>
              <li><NuxtLink to="/categories" class="text-gray-400 hover:text-yellow-400 text-sm transition-colors flex items-center"><span class="mr-2">›</span> Categories</NuxtLink></li>
              <li><NuxtLink to="/about" class="text-gray-400 hover:text-yellow-400 text-sm transition-colors flex items-center"><span class="mr-2">›</span> About Us</NuxtLink></li>
              <li><NuxtLink to="/contact" class="text-gray-400 hover:text-yellow-400 text-sm transition-colors flex items-center"><span class="mr-2">›</span> Contact</NuxtLink></li>
            </ul>
          </div>

          <!-- Customer Service -->
          <div>
            <h3 class="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-yellow-400">Customer Service</h3>
            <ul class="space-y-3">
              <li><NuxtLink to="/help" class="text-gray-400 hover:text-yellow-400 text-sm transition-colors flex items-center"><span class="mr-2">›</span> Help Center</NuxtLink></li>
              <li><NuxtLink to="/shipping" class="text-gray-400 hover:text-yellow-400 text-sm transition-colors flex items-center"><span class="mr-2">›</span> Shipping Info</NuxtLink></li>
              <li><NuxtLink to="/returns" class="text-gray-400 hover:text-yellow-400 text-sm transition-colors flex items-center"><span class="mr-2">›</span> Returns</NuxtLink></li>
              <li><NuxtLink to="/privacy" class="text-gray-400 hover:text-yellow-400 text-sm transition-colors flex items-center"><span class="mr-2">›</span> Privacy Policy</NuxtLink></li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div class="sm:col-span-2 md:col-span-1">
            <h3 class="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-yellow-400">Get In Touch</h3>
            <ul class="space-y-3 text-gray-400 text-sm">
              <li class="flex items-start">
                <svg class="w-5 h-5 mr-3 mt-0.5 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@globalauthentic.co.tz</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 mr-3 mt-0.5 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+255 789 947 608</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 mr-3 mt-0.5 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>WhatsApp: +255 789 947 608</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 pt-6 sm:pt-8">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <p class="text-gray-400 text-xs sm:text-sm text-center md:text-left">
              &copy; {{ new Date().getFullYear() }} Global Authentic TZ. All rights reserved.
            </p>
            <div class="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-400">
              <NuxtLink to="/privacy" class="hover:text-yellow-400 transition-colors">Privacy Policy</NuxtLink>
              <NuxtLink to="/terms" class="hover:text-yellow-400 transition-colors">Terms of Service</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'
import { useWishlistStore } from '~/stores/wishlist'

const cartStore = useCartStore()
const authStore = useAuthStore()
const wishlistStore = useWishlistStore()
const mobileMenuOpen = ref(false)

// Search functionality
const { getProductsWithPricing } = useProducts()
const { baseURL } = useApi()
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

const closeSearch = () => {
  showSearchResults.value = false
  searchQuery.value = ''
  searchResults.value = []
}

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return ''
  if (imageUrl.startsWith('http')) {
    if (imageUrl.includes('cloudinary.com')) {
      return imageUrl.replace('/upload/', '/upload/f_auto,q_auto,w_200,h_200,c_pad,b_white/')
    }
    return imageUrl
  }
  return `${baseURL}${imageUrl}`
}

const formatPrice = (price) => {
  return Number(price).toLocaleString('en-US', { minimumFractionDigits: 0 })
}

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
