<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-gradient-to-r from-gray-900 via-black to-gray-900 shadow-xl sticky top-0 z-50 border-b border-yellow-500/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center group">
            <div class="relative">
              <div class="flex items-baseline">
                <span class="text-3xl font-black text-white tracking-tight lowercase" style="font-family: 'Arial Black', Arial, sans-serif; letter-spacing: -0.02em;">global</span>
                <svg class="w-5 h-5 text-yellow-400 absolute -top-2 -right-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span class="text-[10px] font-bold text-yellow-400 uppercase tracking-[0.25em]" style="font-family: Arial, sans-serif;">Authentic TZ</span>
            </div>
          </NuxtLink>

          <!-- Navigation -->
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

          <!-- Cart Icon -->
          <div class="flex items-center space-x-4">
            <NuxtLink to="/cart" class="relative p-3 text-white hover:text-yellow-400 transition-colors bg-white/10 rounded-lg hover:bg-white/20">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span v-if="cartStore.totalItems > 0" class="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {{ cartStore.totalItems }}
              </span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white border-t border-yellow-500/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <!-- About -->
          <div class="md:col-span-1">
            <div class="mb-6">
              <div class="relative inline-block mb-3">
                <h3 class="text-3xl font-black text-white lowercase" style="font-family: 'Arial Black', Arial, sans-serif;">global</h3>
                <svg class="w-5 h-5 text-yellow-400 absolute -top-1 -right-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <p class="text-xs font-bold text-yellow-400 uppercase tracking-[0.2em] mb-4">Authentic TZ</p>
              <p class="text-gray-400 text-sm leading-relaxed">
                Your trusted source for authentic international products in Tanzania. Quality guaranteed.
              </p>
            </div>
            <!-- Social Media -->
            <div class="flex space-x-4">
              <a href="#" class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all duration-300">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all duration-300">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/><path d="M12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-all duration-300">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-bold mb-4 text-yellow-400">Quick Links</h3>
            <ul class="space-y-3">
              <li><NuxtLink to="/products" class="text-gray-400 hover:text-yellow-400 text-sm transition-colors flex items-center"><span class="mr-2">›</span> Products</NuxtLink></li>
              <li><NuxtLink to="/categories" class="text-gray-400 hover:text-yellow-400 text-sm transition-colors flex items-center"><span class="mr-2">›</span> Categories</NuxtLink></li>
              <li><NuxtLink to="/about" class="text-gray-400 hover:text-yellow-400 text-sm transition-colors flex items-center"><span class="mr-2">›</span> About Us</NuxtLink></li>
              <li><NuxtLink to="/contact" class="text-gray-400 hover:text-yellow-400 text-sm transition-colors flex items-center"><span class="mr-2">›</span> Contact</NuxtLink></li>
            </ul>
          </div>

          <!-- Customer Service -->
          <div>
            <h3 class="text-lg font-bold mb-4 text-yellow-400">Customer Service</h3>
            <ul class="space-y-3">
              <li><NuxtLink to="/help" class="text-gray-400 hover:text-yellow-400 text-sm transition-colors flex items-center"><span class="mr-2">›</span> Help Center</NuxtLink></li>
              <li><NuxtLink to="/shipping" class="text-gray-400 hover:text-yellow-400 text-sm transition-colors flex items-center"><span class="mr-2">›</span> Shipping Info</NuxtLink></li>
              <li><NuxtLink to="/returns" class="text-gray-400 hover:text-yellow-400 text-sm transition-colors flex items-center"><span class="mr-2">›</span> Returns</NuxtLink></li>
              <li><NuxtLink to="/privacy" class="text-gray-400 hover:text-yellow-400 text-sm transition-colors flex items-center"><span class="mr-2">›</span> Privacy Policy</NuxtLink></li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div>
            <h3 class="text-lg font-bold mb-4 text-yellow-400">Get In Touch</h3>
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
                <span>+255 676 107 301</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 mr-3 mt-0.5 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>WhatsApp: +255 676 107 301</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 pt-8">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {{ new Date().getFullYear() }} Global Authentic TZ. All rights reserved.
            </p>
            <div class="flex items-center space-x-6 text-sm text-gray-400">
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

const cartStore = useCartStore()

// Load cart from localStorage on mount
onMounted(() => {
  cartStore.loadFromLocalStorage()
})
</script>
