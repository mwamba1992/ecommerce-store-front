<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <div v-if="loading" class="animate-pulse">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-gray-200 h-96 rounded-lg"></div>
        <div class="space-y-4">
          <div class="h-8 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/4"></div>
          <div class="h-6 bg-gray-200 rounded w-1/2"></div>
          <div class="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Product Detail -->
    <div v-else-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Product Image -->
      <div class="sticky top-20 h-fit">
        <div class="bg-gray-100 rounded-lg overflow-hidden aspect-square">
          <img
            v-if="product.imageUrl"
            :src="getImageUrl(product.imageUrl)"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <svg class="w-32 h-32 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Product Info -->
      <div>
        <!-- Breadcrumb -->
        <nav class="text-sm mb-4">
          <ol class="flex items-center space-x-2">
            <li>
              <NuxtLink to="/" class="text-gray-500 hover:text-blue-600">Home</NuxtLink>
            </li>
            <li class="text-gray-400">/</li>
            <li>
              <NuxtLink to="/products" class="text-gray-500 hover:text-blue-600">Products</NuxtLink>
            </li>
            <li class="text-gray-400">/</li>
            <li class="text-gray-900">{{ product.name }}</li>
          </ol>
        </nav>

        <!-- Product Name -->
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {{ product.name }}
        </h1>

        <!-- Product Code -->
        <p v-if="product.code" class="text-sm font-mono text-gray-500 mb-4">
          SKU: {{ product.code }}
        </p>

        <!-- Condition Badge -->
        <div v-if="product.condition" class="mb-4">
          <span
            :class="[
              'inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold',
              product.condition === 'new'
                ? 'bg-green-100 text-green-800'
                : 'bg-orange-100 text-orange-800'
            ]"
          >
            {{ product.condition === 'new' ? '✨ New' : '♻️ Used' }}
          </span>
        </div>

        <!-- Category -->
        <div v-if="product.category" class="mb-6">
          <span class="inline-block text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded">
            {{ product.category.code }}
          </span>
        </div>

        <!-- Price -->
        <div class="mb-6">
          <span class="text-4xl font-bold text-gray-900">
            TZS{{ formatPrice(product.sellingPrice || 0) }}
          </span>
        </div>

        <!-- Description -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-3">Description</h2>
          <p class="text-gray-600 leading-relaxed">
            {{ product.desc || 'No description available for this product.' }}
          </p>
        </div>

        <!-- Quantity Selector -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
          <div class="flex items-center space-x-4">
            <button
              @click="decrementQuantity"
              class="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
              :disabled="quantity <= 1"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </button>
            <span class="text-2xl font-semibold w-12 text-center">{{ quantity }}</span>
            <button
              @click="incrementQuantity"
              class="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Add to Cart Button -->
        <div class="flex gap-4 mb-8">
          <button
            @click="addToCart"
            class="flex-1 btn-primary flex items-center justify-center space-x-2 py-4 text-lg"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Add to Cart</span>
          </button>
        </div>

        <!-- WhatsApp Order -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Quick Order</h3>
          <p class="text-sm text-gray-600 mb-4">
            Order directly via WhatsApp for faster processing
          </p>
          <div class="flex gap-3">
            <button
              @click="shareOnWhatsApp"
              class="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>Order via WhatsApp</span>
            </button>
            <button
              @click="copyWhatsAppLink"
              class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-lg transition-colors"
              title="Copy order link"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-16">
      <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Product not found</h3>
      <p class="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
      <NuxtLink to="/products" class="btn-primary inline-block">
        Browse All Products
      </NuxtLink>
    </div>

    <!-- Related Products -->
    <section v-if="relatedProducts.length > 0" class="mt-16 border-t pt-16">
      <h2 class="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard v-for="relatedProduct in relatedProducts" :key="relatedProduct.id" :product="relatedProduct" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const { getProducts } = useProducts()
const { baseURL } = useApi()
const cartStore = useCartStore()

const product = ref(null)
const relatedProducts = ref([])
const loading = ref(true)
const quantity = ref(1)

// Fetch product details
onMounted(async () => {
  try {
    const products = await getProducts()
    const productId = parseInt(route.params.id)
    product.value = products.find(p => p.id === productId)

    // Get related products (same category, exclude current product)
    if (product.value?.category) {
      relatedProducts.value = products
        .filter(p => p.category?.id === product.value.category.id && p.id !== product.value.id)
        .slice(0, 4)
    }
  } catch (error) {
    console.error('Error loading product:', error)
  } finally {
    loading.value = false
  }
})

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return ''
  return imageUrl.startsWith('http') ? imageUrl : `${baseURL}${imageUrl}`
}

const formatPrice = (price) => {
  return Number(price).toLocaleString('en-US', { minimumFractionDigits: 0 })
}

const incrementQuantity = () => {
  quantity.value++
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = () => {
  cartStore.addToCart(product.value, quantity.value)
  alert(`${quantity.value} × ${product.value.name} added to cart!`)
  quantity.value = 1
}

const shareOnWhatsApp = () => {
  const phoneNumber = '255676107301'
  const message = `ORDER:${product.value.id}`
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
}

const copyWhatsAppLink = async () => {
  const phoneNumber = '255676107301'
  const message = `ORDER:${product.value.id}`
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  try {
    await navigator.clipboard.writeText(whatsappUrl)
    alert('Order link copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy link:', err)
    alert('Failed to copy link')
  }
}

useHead({
  title: computed(() => product.value ? `${product.value.name} - ShopStore` : 'Product - ShopStore'),
  meta: [
    {
      name: 'description',
      content: computed(() => product.value?.desc || 'Shop quality products at great prices')
    }
  ]
})
</script>
