<template>
  <div class="max-w-[1184px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
    <template v-if="product">
      <Breadcrumbs :crumbs="crumbs" class="mb-5" />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        <!-- Gallery -->
        <div class="lg:sticky lg:top-36 h-fit">
          <ProductGallery
            :images="images"
            :alt="productImageAlt(product)"
            :tint="tintFor(product.id)"
            :initial="initialOf(productName(product))"
            :dimmed="!product.inStock"
          >
            <!-- Condition, on the photo itself: the first thing a shopper should know -->
            <span
              class="absolute top-4 left-4 px-3 py-1 rounded-md text-sm font-semibold"
              :class="product.condition === 'used' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 border border-gray-300'"
            >
              {{ product.condition === 'used' ? 'Used' : 'New' }}
            </span>

            <button
              type="button"
              @click="wishlistStore.toggleWishlist(product)"
              class="absolute top-3 right-3 w-11 h-11 rounded-full shadow-card flex items-center justify-center transition-colors"
              :class="saved ? 'bg-red-50 text-red-500' : 'bg-white text-gray-500 hover:text-red-500'"
              :aria-label="saved ? 'Remove from wishlist' : 'Add to wishlist'"
              :aria-pressed="saved"
            >
              <svg class="w-5 h-5" :fill="saved ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </button>
          </ProductGallery>
        </div>

        <!-- Buying column: title, price, availability, trust, then the actions -->
        <div>
          <p class="flex items-center gap-3">
            <span class="px-2.5 py-0.5 rounded text-sm font-semibold" :class="product.condition === 'used' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 border border-gray-300'">
              {{ product.condition === 'used' ? 'Used' : 'New' }}
            </span>
            <NuxtLink v-if="brand" :to="brandPath(brand)" class="kicker hover:text-gray-900 transition-colors">{{ brand.label }}</NuxtLink>
          </p>

          <h1 class="title text-3xl sm:text-4xl leading-tight mt-2 mb-4">
            {{ productName(product) }}
          </h1>

          <ProductStars v-if="rating" :average="rating.average" :count="rating.count" class="mb-4 !text-base" />

          <div class="flex flex-wrap items-center gap-x-4 gap-y-2" :class="saving ? 'mb-2' : 'mb-5'">
            <p v-if="hasPrice(product)" class="font-semibold tracking-tight" :class="saving ? 'text-[#006B40]' : 'text-gray-900'"><span class="text-sm font-medium align-top relative top-1 mr-1">TZS</span><span class="text-4xl leading-none">{{ formatPrice(product.sellingPrice) }}</span></p>
            <p v-else class="text-2xl font-semibold text-gray-900">Price on request</p>

            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border" :class="availability.class">
              <span class="w-1.5 h-1.5 rounded-full" :class="availability.dot"></span>
              {{ availability.label }}
            </span>
          </div>
          <p v-if="saving" class="mb-5 text-[15px]">
            <span class="font-semibold text-[#006B40]">Save TZS {{ formatPrice(saving.amount) }}</span>
            <span class="text-gray-600"> · Previous price: TZS {{ formatPrice(saving.previous) }}</span>
          </p>

          <!-- Why it is safe to buy here, said as benefits, where the decision is made -->
          <ul class="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
            <li v-for="tile in trust" :key="tile.title" class="rounded-card bg-white p-3 sm:p-4">
              <svg class="w-5 h-5 text-gray-900 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tile.icon" /></svg>
              <p class="text-sm sm:text-base font-medium text-gray-900 leading-tight">{{ tile.title }}</p>
              <p class="text-xs sm:text-sm text-gray-500 leading-snug mt-0.5">{{ tile.body }}</p>
            </li>
          </ul>

          <!-- Quantity and add to cart -->
          <div class="flex items-stretch gap-3 mb-3">
            <div class="flex items-center rounded-lg bg-white border border-gray-300" role="group" aria-label="Quantity">
              <button type="button" @click="decrementQuantity" :disabled="quantity <= 1" class="w-12 h-[52px] flex items-center justify-center text-gray-700 disabled:text-gray-300" aria-label="Decrease quantity">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4" /></svg>
              </button>
              <span class="w-8 text-center font-semibold text-gray-900" aria-live="polite">{{ quantity }}</span>
              <button type="button" @click="incrementQuantity" :disabled="quantity >= maxQuantity" class="w-12 h-[52px] flex items-center justify-center text-gray-700 disabled:text-gray-300" aria-label="Increase quantity">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>

            <button type="button" @click="addToCart" :disabled="!canBuy" class="btn-primary flex-1">
              <svg v-if="added" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
              {{ buyLabel }}
            </button>
          </div>

          <div class="flex gap-3 mb-8">
            <button type="button" @click="shareOnWhatsApp" class="btn-secondary flex-1 !text-green-700">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              Order on WhatsApp
            </button>
            <button type="button" @click="copyWhatsAppLink" class="btn-secondary !px-4" :aria-label="copied ? 'Order link copied' : 'Copy order link'">
              <svg v-if="copied" class="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </button>
          </div>

          <!-- Description -->
          <section class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-3">About this product</h2>
            <p v-for="(paragraph, index) in description" :key="index" class="text-gray-700 leading-relaxed mb-2 last:mb-0">
              {{ paragraph }}
            </p>
          </section>

          <!-- Details -->
          <section class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-3">Product details</h2>
            <dl class="card divide-y divide-gray-100 text-[15px]">
              <div v-for="row in details" :key="row.label" class="flex justify-between gap-4 px-5 py-3">
                <dt class="text-gray-500">{{ row.label }}</dt>
                <dd class="font-semibold text-gray-900 text-right">
                  <NuxtLink v-if="row.to" :to="row.to" class="text-gray-900 underline">{{ row.value }}</NuxtLink>
                  <template v-else>{{ row.value }}</template>
                </dd>
              </div>
            </dl>
          </section>

          <!-- Delivery, payment, returns -->
          <section>
            <h2 class="text-lg font-semibold text-gray-900 mb-3">Delivery, payment and returns</h2>
            <ul class="space-y-3 text-[15px] text-gray-700 leading-relaxed">
              <li><strong class="text-gray-900">Delivery:</strong> same day or next day within Dar es Salaam, and 2–5 business days to other regions of Tanzania. <NuxtLink to="/shipping" class="text-gray-900 font-semibold underline">Shipping information</NuxtLink></li>
              <li><strong class="text-gray-900">Payment:</strong> cash on delivery or mobile money (M-Pesa, Tigo Pesa, Airtel Money).</li>
              <li><strong class="text-gray-900">Returns:</strong> within 7 days if the item is unused and in its original packaging. <NuxtLink to="/returns" class="text-gray-900 font-semibold underline">Returns policy</NuxtLink></li>
              <li><strong class="text-gray-900">Questions:</strong> message us on WhatsApp or call +255 789 947 608. <NuxtLink to="/contact" class="text-gray-900 font-semibold underline">Contact us</NuxtLink></li>
            </ul>
          </section>
        </div>
      </div>

      <!-- Buy bar (phones): price and the action stay in reach while reading -->
      <div class="md:hidden fixed bottom-[60px] inset-x-0 z-30 bg-white border-t border-gray-100 shadow-nav px-4 py-2.5 flex items-center gap-3">
        <div class="min-w-0">
          <p class="text-[11px] text-gray-500 leading-none mb-0.5">{{ availability.label }}</p>
          <p class="font-semibold text-gray-900 truncate">{{ hasPrice(product) ? `TZS ${formatPrice(product.sellingPrice)}` : 'Price on request' }}</p>
        </div>
        <button type="button" @click="addToCart" :disabled="!canBuy" class="btn-primary flex-1 !min-h-[46px] !shadow-none">{{ buyLabel }}</button>
      </div>
    </template>

    <!-- Not found -->
    <div v-else class="text-center py-20">
      <h1 class="text-2xl font-semibold text-gray-900 mb-3">Product Not Found</h1>
      <p class="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
      <NuxtLink to="/products" class="btn-primary">Browse all products</NuxtLink>
    </div>

    <!-- Reviews -->
    <ProductReviews v-if="product" :product="product" />

    <!-- Similar products -->
    <section v-if="relatedProducts.length > 0" class="mt-14">
      <h2 class="text-[22px] leading-8 font-semibold text-gray-900 mb-5">Similar products</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        <ProductCard v-for="relatedProduct in relatedProducts" :key="relatedProduct.id" :product="relatedProduct" />
      </div>
    </section>

    <!-- Recently viewed: this browser only, so it renders after hydration -->
    <ClientOnly>
      <section v-if="recentlyViewed.length > 0" class="mt-14">
        <h2 class="text-[22px] leading-8 font-semibold text-gray-900 mb-5">Recently viewed</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          <ProductCard v-for="viewed in recentlyViewed" :key="viewed.id" :product="viewed" />
        </div>
      </section>
    </ClientOnly>

    <!-- Room for the phone buy bar -->
    <div v-if="product" class="h-16 md:hidden"></div>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart'
import { useWishlistStore } from '~/stores/wishlist'
import {
  brandPath,
  breadcrumbJsonLd,
  categoryPath,
  collectBrands,
  collectCategories,
  descriptionParagraphs,
  hasPrice,
  productImageAlt,
  productImages,
  productJsonLd,
  productMetaDescription,
  productName,
  productPath,
  productRating,
  productSaving,
  productSummary,
  productTitle
} from '#shared/utils/seo'

const route = useRoute()
const siteUrl = useSiteUrl()
const { baseURL } = useApi()
const { formatPrice, productImage } = useFormat()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

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
  category.value && { label: 'Category', value: category.value.label, to: categoryPath(category.value) },
  { label: 'Condition', value: product.value.condition === 'used' ? 'Used' : 'New' },
  { label: 'Availability', value: product.value.inStock ? 'In stock' : 'Out of stock' },
  { label: 'Price', value: hasPrice(product.value) ? `TZS ${formatPrice(product.value.sellingPrice)}` : 'On request' }
].filter(Boolean))

const images = computed(() => productImages(product.value))
const rating = computed(() => productRating(product.value))
const saving = computed(() => productSaving(product.value))
const saved = computed(() => wishlistStore.isInWishlist(product.value.id))

// At or below this many units, say how many are left.
const LOW_STOCK_AT = 3

// Each state is carried by its wording, not only its colour.
const availability = computed(() => {
  const { inStock, totalStock } = product.value
  if (!inStock) return { label: 'Out of stock', class: 'bg-white text-gray-500 border-gray-200', dot: 'bg-gray-400' }
  if (totalStock <= LOW_STOCK_AT) return { label: `Only ${totalStock} left`, class: 'bg-yellow-50 text-yellow-800 border-yellow-200', dot: 'bg-yellow-500' }
  return { label: 'In stock', class: 'bg-green-50 text-[#006B40] border-green-200', dot: 'bg-green-600' }
})

// Stated on the shipping, help and returns pages.
const trust = [
  { title: 'Fast delivery', body: 'Same or next day in Dar', icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0' },
  { title: 'Pay on delivery', body: 'Cash or mobile money', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  { title: '7-day returns', body: 'Unused, original packaging', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' }
]

// A product with no price cannot be ordered through the cart, only asked about.
const canBuy = computed(() => product.value.inStock && hasPrice(product.value))
const maxQuantity = computed(() => Math.max(1, product.value.totalStock))

const added = ref(false)
const copied = ref(false)
const buyLabel = computed(() => {
  if (!product.value.inStock) return 'Out of stock'
  if (!hasPrice(product.value)) return 'Price on request'
  return added.value ? 'Added to cart' : 'Add to cart'
})

const { items: recentItems, load: loadRecent, record: recordViewed } = useRecentlyViewed()
const recentlyViewed = computed(() => recentItems.value.filter(p => p.id !== product.value?.id).slice(0, 4))

onMounted(() => {
  if (product.value) recordViewed(product.value)
  else loadRecent()
})

const incrementQuantity = () => {
  if (quantity.value < maxQuantity.value) quantity.value++
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = () => {
  cartStore.addToCart(product.value, quantity.value)
  added.value = true
  setTimeout(() => { added.value = false }, 1800)
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
    copied.value = true
    setTimeout(() => { copied.value = false }, 1800)
  } catch (err) {
    console.error('Failed to copy link:', err)
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
