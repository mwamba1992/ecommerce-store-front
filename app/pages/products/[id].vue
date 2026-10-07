<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
    <!-- Product Detail -->
    <div v-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <!-- Product Image -->
      <div class="sticky top-20 h-fit">
        <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden aspect-square border border-gray-200 shadow-lg">
          <img
            v-if="product.imageUrl"
            :src="productImage(product.imageUrl, 'detail')"
            :alt="productImageAlt(product)"
            :width="imageSize(product.imageUrl, 'detail')?.width"
            :height="imageSize(product.imageUrl, 'detail')?.height"
            fetchpriority="high"
            class="w-full h-full object-contain p-4 sm:p-6"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <svg class="w-32 h-32 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Product Info -->
      <div>
        <Breadcrumbs :crumbs="crumbs" class="mb-6" />

        <!-- Product Name -->
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight">
          {{ productName(product) }}
        </h1>

        <!-- Product Code & Badges -->
        <div class="flex flex-wrap items-center gap-3 mb-6">
          <p v-if="product.code" class="text-sm font-mono text-gray-500 bg-gray-100 px-3 py-1 rounded">
            SKU: {{ product.code }}
          </p>

          <!-- Condition Badge -->
          <span
            v-if="product.condition"
            :class="[
              'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold',
              product.condition === 'new'
                ? 'bg-green-100 text-green-800'
                : 'bg-orange-100 text-orange-800'
            ]"
          >
            {{ product.condition === 'new' ? '✨ New' : '♻️ Used' }}
          </span>

          <!-- Category -->
          <NuxtLink v-if="category" :to="categoryPath(category)" class="inline-block text-xs font-bold bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-3 py-1 rounded-full transition-colors">
            {{ category.label }}
          </NuxtLink>

          <!-- Brand -->
          <NuxtLink v-if="brand" :to="brandPath(brand)" class="inline-block text-xs font-bold bg-gray-100 text-gray-800 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors">
            {{ brand.label }}
          </NuxtLink>

          <!-- Stock Badge -->
          <span
            v-if="product.totalStock !== undefined"
            :class="[
              'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold',
              product.inStock && product.totalStock > 10
                ? 'bg-green-100 text-green-800'
                : product.inStock && product.totalStock > 0
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            ]"
          >
            {{ product.inStock ? `${product.totalStock} in stock` : 'Out of Stock' }}
          </span>
        </div>

        <!-- Price -->
        <div class="mb-6 p-4 bg-gray-50 rounded-xl border-2 border-yellow-400">
          <p class="text-xs text-gray-600 mb-1">Price</p>
          <span v-if="hasPrice(product)" class="text-3xl sm:text-4xl font-black text-gray-900">
            TZS {{ formatPrice(product.sellingPrice) }}
          </span>
          <span v-else class="text-xl sm:text-2xl font-black text-gray-900">
            Price on request
          </span>
        </div>

        <!-- Description -->
        <div class="mb-6 p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h2 class="text-lg font-bold text-gray-900 mb-2 flex items-center">
            <svg class="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Description
          </h2>
          <p v-for="(paragraph, index) in description" :key="index" class="text-gray-700 leading-relaxed text-sm mb-2 last:mb-0">
            {{ paragraph }}
          </p>
        </div>

        <!-- Quantity Selector -->
        <div class="mb-5">
          <label class="block text-sm font-bold text-gray-900 mb-2">Quantity</label>
          <div class="flex items-center space-x-3">
            <button
              @click="decrementQuantity"
              class="w-10 h-10 rounded-lg bg-gray-900 hover:bg-yellow-400 text-white hover:text-black flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="quantity <= 1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M20 12H4" />
              </svg>
            </button>
            <span class="text-2xl font-bold w-12 text-center text-gray-900">{{ quantity }}</span>
            <button
              @click="incrementQuantity"
              class="w-10 h-10 rounded-lg bg-gray-900 hover:bg-yellow-400 text-white hover:text-black flex items-center justify-center transition-all duration-300"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Add to Cart Button -->
        <div class="flex gap-3 mb-6">
          <button
            @click="addToCart"
            :disabled="!product.inStock"
            :class="[
              'flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg text-base font-bold transition-all duration-300 shadow-lg',
              product.inStock
                ? 'bg-yellow-400 hover:bg-yellow-500 text-black hover:scale-105 hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{{ product.inStock ? 'Add to Cart' : 'Out of Stock' }}</span>
          </button>
        </div>

        <!-- WhatsApp Order -->
        <div class="border-t border-gray-200 pt-6">
          <div class="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border border-green-200">
            <h3 class="text-lg font-bold text-gray-900 mb-2 flex items-center">
              <svg class="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Quick WhatsApp Order
            </h3>
            <p class="text-xs text-gray-700 mb-3">
              Order directly via WhatsApp for instant confirmation
            </p>
            <div class="flex gap-2">
              <button
                @click="shareOnWhatsApp"
                class="flex-1 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-bold transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg text-sm"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>Order via WhatsApp</span>
              </button>
              <button
                @click="copyWhatsAppLink"
                class="bg-gray-900 hover:bg-yellow-400 text-white hover:text-black px-4 py-2.5 rounded-lg transition-all duration-300 shadow-md"
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
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-20">
      <div class="max-w-md mx-auto">
        <svg class="w-32 h-32 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 class="text-2xl font-bold text-gray-900 mb-3">Product Not Found</h1>
        <p class="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <NuxtLink to="/products" class="inline-flex items-center justify-center px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Browse All Products
        </NuxtLink>
      </div>
    </div>

    <!-- Product details and buying information -->
    <div v-if="product" class="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <section>
        <h2 class="text-xl font-bold text-gray-900 mb-4">Product details</h2>
        <dl class="divide-y divide-gray-200 border border-gray-200 rounded-xl bg-white text-sm">
          <div v-for="row in details" :key="row.label" class="flex justify-between gap-4 px-5 py-3">
            <dt class="text-gray-500">{{ row.label }}</dt>
            <dd class="font-semibold text-gray-900 text-right">
              <NuxtLink v-if="row.to" :to="row.to" class="text-yellow-600 hover:underline">{{ row.value }}</NuxtLink>
              <template v-else>{{ row.value }}</template>
            </dd>
          </div>
        </dl>
      </section>

      <section>
        <h2 class="text-xl font-bold text-gray-900 mb-4">Delivery, payment and returns</h2>
        <ul class="space-y-3 text-sm text-gray-700 leading-relaxed">
          <li><strong class="text-gray-900">Delivery:</strong> same day or next day within Dar es Salaam, and 2–5 business days to other regions of Tanzania. <NuxtLink to="/shipping" class="text-yellow-600 font-semibold hover:underline">Shipping information</NuxtLink></li>
          <li><strong class="text-gray-900">Payment:</strong> cash on delivery or mobile money (M-Pesa, Tigo Pesa, Airtel Money).</li>
          <li><strong class="text-gray-900">Returns:</strong> within 7 days if the item is unused and in its original packaging. <NuxtLink to="/returns" class="text-yellow-600 font-semibold hover:underline">Returns policy</NuxtLink></li>
          <li><strong class="text-gray-900">Questions:</strong> message us on WhatsApp or call +255 789 947 608. <NuxtLink to="/contact" class="text-yellow-600 font-semibold hover:underline">Contact us</NuxtLink></li>
        </ul>
      </section>
    </div>

    <!-- Related Products -->
    <section v-if="relatedProducts.length > 0" class="mt-16 border-t-2 border-gray-200 pt-16">
      <div class="text-center mb-10">
        <h2 class="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
          Related <span class="text-yellow-500">Products</span>
        </h2>
        <p class="text-gray-600">You might also like these products</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard v-for="relatedProduct in relatedProducts" :key="relatedProduct.id" :product="relatedProduct" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart'
import {
  brandPath,
  breadcrumbJsonLd,
  categoryPath,
  collectBrands,
  collectCategories,
  descriptionParagraphs,
  hasPrice,
  productImageAlt,
  productJsonLd,
  productMetaDescription,
  productName,
  productPath,
  productSummary,
  productTitle
} from '#shared/utils/seo'

const route = useRoute()
const siteUrl = useSiteUrl()
const { baseURL } = useApi()
const { formatPrice, productImage, imageSize } = useFormat()
const cartStore = useCartStore()

const quantity = ref(1)

// Fetched on the server so the name, price and description reach search engines
// in the HTML itself. Only what is returned here is serialised into the page —
// the rest of the catalogue is discarded server-side.
const data = await useCatalogue(`product-${route.params.id}`, (all) => {
  // Digits only: "/products/42abc" must not resolve to product 42 under a second URL.
  const id = /^\d+$/.test(String(route.params.id)) ? Number(route.params.id) : null
  const product = all.find(p => p.id === id) ?? null
  if (!product) return { product: null, related: [], category: null, brand: null }

  // Same category, with the same brand first — these are the internal links
  // that tie a product to its neighbours.
  const related = all
    .filter(p => p.category?.id === product.category?.id && p.id !== product.id)
    .sort((a, b) => Number(b.brand?.id === product.brand?.id) - Number(a.brand?.id === product.brand?.id))
    .slice(0, 4)

  return {
    product,
    related,
    category: collectCategories(all).find(c => c.id === product.category?.id) ?? null,
    brand: collectBrands(all).find(b => b.id === product.brand?.id) ?? null
  }
})

const product = computed(() => data.value.product)
const relatedProducts = computed(() => data.value.related)
const category = computed(() => data.value.category)
const brand = computed(() => data.value.brand)

// Answer a real 404 for a product that doesn't exist. Rendering the not-found
// state with a 200 is a "soft 404": it keeps dead URLs in the search index and
// competes with the pages that should rank. The custom UI below still shows.
useNotFoundStatus(!product.value)

const crumbs = computed(() => [
  { name: 'Home', path: '/' },
  ...(category.value ? [{ name: category.value.label, path: categoryPath(category.value) }] : [{ name: 'Products', path: '/products' }]),
  { name: productName(product.value), path: productPath(product.value) }
])

// The stored description when there is a usable one, otherwise a summary of
// the catalogue record. Never placeholder text, and never invented features.
const description = computed(() => {
  const paragraphs = descriptionParagraphs(product.value)
  return paragraphs.length > 0 ? paragraphs : [productSummary(product.value)]
})

const details = computed(() => [
  brand.value && { label: 'Brand', value: brand.value.label, to: brandPath(brand.value) },
  product.value.model && { label: 'Model', value: product.value.model },
  product.value.code && { label: 'SKU', value: product.value.code },
  category.value && { label: 'Category', value: category.value.label, to: categoryPath(category.value) },
  { label: 'Condition', value: product.value.condition === 'used' ? 'Used' : 'New' },
  { label: 'Availability', value: product.value.inStock ? 'In stock' : 'Out of stock' },
  { label: 'Price', value: hasPrice(product.value) ? `TZS ${formatPrice(product.value.sellingPrice)}` : 'On request' }
].filter(Boolean))

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
  const phoneNumber = '255789947608'
  const totalPrice = (product.value.sellingPrice || 0) * quantity.value
  const message = `*QUICK ORDER - Global Authentic TZ*\n\n` +
    `*Product:* ${product.value.name}\n` +
    `*Code:* ${product.value.code}\n` +
    `*Quantity:* ${quantity.value}\n` +
    `*Unit Price:* TZS ${formatPrice(product.value.sellingPrice || 0)}\n` +
    `*Total:* TZS ${formatPrice(totalPrice)}\n\n` +
    `I would like to order this product. Please confirm availability.`
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
}

const copyWhatsAppLink = async () => {
  const phoneNumber = '255789947608'
  const totalPrice = (product.value.sellingPrice || 0) * quantity.value
  const message = `*QUICK ORDER - Global Authentic TZ*\n\n` +
    `*Product:* ${product.value.name}\n` +
    `*Code:* ${product.value.code}\n` +
    `*Quantity:* ${quantity.value}\n` +
    `*Unit Price:* TZS ${formatPrice(product.value.sellingPrice || 0)}\n` +
    `*Total:* TZS ${formatPrice(totalPrice)}\n\n` +
    `I would like to order this product. Please confirm availability.`
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  try {
    await navigator.clipboard.writeText(whatsappUrl)
    alert('Order link copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy link:', err)
    alert('Failed to copy link')
  }
}

useSeo(() => {
  if (!product.value) {
    return { title: 'Product not found', description: 'This product does not exist or has been removed.', path: route.path, noindex: true }
  }

  return {
    title: productTitle(product.value),
    description: productMetaDescription(product.value),
    path: productPath(product.value),
    type: 'product',
    image: productImage(product.value.imageUrl, 'social') || null,
    imageAlt: productImageAlt(product.value),
    jsonLd: [productJsonLd(product.value, siteUrl, baseURL), breadcrumbJsonLd(crumbs.value, siteUrl)],
    properties: {
      ...(hasPrice(product.value)
        ? { 'product:price:amount': String(Number(product.value.sellingPrice)), 'product:price:currency': 'TZS' }
        : {}),
      'product:availability': product.value.inStock ? 'in stock' : 'out of stock',
      'product:condition': product.value.condition === 'used' ? 'used' : 'new'
    }
  }
})
</script>
