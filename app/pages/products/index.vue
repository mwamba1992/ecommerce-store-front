<template>
  <div class="max-w-[1184px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    <Breadcrumbs :crumbs="crumbs" class="mb-5" />

    <header class="mb-6">
      <h1 class="title text-4xl sm:text-5xl mb-2">
        {{ filters.q ? `Results for “${filters.q}”` : 'All products' }}
      </h1>
      <p class="text-gray-600">Original smart watches, fitness bands, earbuds and accessories.</p>
    </header>

    <div class="flex gap-8 items-start">
      <!-- Filters (desktop) -->
      <aside class="hidden lg:block w-64 flex-shrink-0 card p-6 sticky top-36 max-h-[calc(100vh-10rem)] overflow-y-auto" aria-label="Filters">
        <ProductFilters v-model="filters" :facets="facets" />
      </aside>

      <div class="flex-1 min-w-0">
        <!-- Result count, filter button (phones), sort -->
        <div class="flex items-center justify-between gap-3 mb-4">
          <p class="text-sm text-gray-600" aria-live="polite">
            <strong class="text-gray-900">{{ sortedProducts.length }}</strong> of {{ products.length }} products
          </p>

          <div class="flex items-center gap-2">
            <button type="button" @click="sheetOpen = true" class="lg:hidden inline-flex items-center gap-2 h-11 px-4 rounded-full bg-white border border-gray-200 text-sm font-semibold text-gray-900">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18M6 12h12M10 20h4" /></svg>
              Filters
              <span v-if="chips.length" class="min-w-[20px] h-5 px-1 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center">{{ chips.length }}</span>
            </button>

            <label class="sr-only" for="sort">Sort by</label>
            <select id="sort" v-model="sortBy" class="h-11 pl-4 pr-9 rounded-full bg-white border border-gray-200 text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-transparent">
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        <!-- Active filters: each one removable on its own -->
        <ul v-if="chips.length > 0" class="flex flex-wrap items-center gap-2 mb-6">
          <li v-for="chip in chips" :key="chip.label">
            <button type="button" @click="chip.remove" class="chip !bg-gray-900 !text-white hover:!bg-gray-800" :aria-label="`Remove filter: ${chip.label}`">
              {{ chip.label }}
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </li>
          <li><button type="button" @click="clearFilters" class="text-sm font-semibold text-gray-600 hover:text-gray-900 underline px-1">Clear all</button></li>
        </ul>

        <!-- Grid -->
        <div v-if="sortedProducts.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          <ProductCard v-for="product in sortedProducts" :key="product.id" :product="product" />
        </div>

        <!-- Nothing matches -->
        <div v-else class="card p-10 text-center">
          <h2 class="text-xl font-semibold text-gray-900 mb-2">No products match</h2>
          <p class="text-gray-600 mb-6">Try removing a filter, or ask us on WhatsApp — we may be able to source it.</p>
          <button type="button" @click="clearFilters" class="btn-dark">Clear filters</button>
        </div>
      </div>
    </div>

    <!-- Filters (phones): a sheet over the page -->
    <div v-if="sheetOpen" class="lg:hidden fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Filters">
      <div class="absolute inset-0 bg-gray-900/50" @click="sheetOpen = false"></div>
      <div class="absolute inset-x-0 bottom-0 max-h-[85vh] bg-white rounded-t-tile flex flex-col">
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900">Filters</h2>
          <button type="button" @click="sheetOpen = false" class="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100" aria-label="Close filters">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto px-5 py-5">
          <ProductFilters v-model="filters" :facets="facets" />
        </div>
        <div class="flex gap-3 px-5 py-4 border-t border-gray-100">
          <button type="button" @click="clearFilters" class="btn-secondary">Clear</button>
          <button type="button" @click="sheetOpen = false" class="btn-primary flex-1">Show {{ sortedProducts.length }} products</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { SITE, breadcrumbJsonLd, collectBrands, collectCategories, formatTzs, hasPrice } from '#shared/utils/seo'

const route = useRoute()

// Fetched on the server so the catalogue is present in the HTML that search
// engines receive — they do not reliably execute client-side JavaScript.
// Filtering and sorting below stay in the browser and work off this data.
const products = await useCatalogue('products-list', all => all)

const emptyFilters = () => ({ q: '', categories: [], brands: [], conditions: [], minPrice: '', maxPrice: '', inStockOnly: false })

// The header search lands here as /products?q=…, so a search is shareable.
const filters = ref({ ...emptyFilters(), q: String(route.query.q ?? '') })
watch(() => route.query.q, (q) => { filters.value = { ...filters.value, q: String(q ?? '') } })

const sortBy = ref('featured')
const sheetOpen = ref(false)

// Facets come from the products themselves, so every option matches something.
const categoryOptions = computed(() => collectCategories(products.value).map(c => ({ value: c.id, label: c.label, count: c.count })))
const brandOptions = computed(() => collectBrands(products.value).map(b => ({ value: b.id, label: b.label, count: b.count })))
const conditionOptions = computed(() => [
  { value: 'new', label: 'New', count: products.value.filter(p => p.condition === 'new').length },
  { value: 'used', label: 'Used', count: products.value.filter(p => p.condition === 'used').length }
].filter(option => option.count > 0))

const facets = computed(() => [
  { key: 'categories', title: 'Category', options: categoryOptions.value },
  { key: 'brands', title: 'Brand', options: brandOptions.value },
  { key: 'conditions', title: 'Condition', options: conditionOptions.value }
])

const filteredProducts = computed(() => {
  const { q, categories, brands, conditions, minPrice, maxPrice, inStockOnly } = filters.value
  const query = q.trim().toLowerCase()
  const min = Number(minPrice) || null
  const max = Number(maxPrice) || null

  return products.value.filter(product => {
    if (query && ![product.name, product.code, product.desc, product.brand?.name].some(text => text?.toLowerCase().includes(query))) return false
    if (categories.length && !categories.includes(product.category?.id)) return false
    if (brands.length && !brands.includes(product.brand?.id)) return false
    if (conditions.length && !conditions.includes(product.condition)) return false
    // A product with no price cannot satisfy a price filter.
    if ((min || max) && !hasPrice(product)) return false
    if (min && product.sellingPrice < min) return false
    if (max && product.sellingPrice > max) return false
    if (inStockOnly && !product.inStock) return false
    return true
  })
})

const sortedProducts = computed(() => {
  const list = [...filteredProducts.value]

  switch (sortBy.value) {
    case 'price-low':
      return list.sort((a, b) => (a.sellingPrice || 0) - (b.sellingPrice || 0))
    case 'price-high':
      return list.sort((a, b) => (b.sellingPrice || 0) - (a.sellingPrice || 0))
    case 'newest':
      return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    case 'name':
      return list.sort((a, b) => a.name.localeCompare(b.name))
    default:
      // Featured: what a shopper can buy and see first — in stock, then with a photo.
      return list.sort((a, b) =>
        Number(b.inStock) - Number(a.inStock) || Number(Boolean(b.imageUrl)) - Number(Boolean(a.imageUrl)))
  }
})

const patch = (changes) => { filters.value = { ...filters.value, ...changes } }

const chips = computed(() => {
  const f = filters.value
  const listChips = (key, options) => f[key].map(value => ({
    label: options.find(option => option.value === value)?.label ?? String(value),
    remove: () => patch({ [key]: f[key].filter(v => v !== value) })
  }))

  return [
    ...(f.q ? [{ label: `“${f.q}”`, remove: () => { patch({ q: '' }); if (route.query.q) navigateTo('/products', { replace: true }) } }] : []),
    ...listChips('categories', categoryOptions.value),
    ...listChips('brands', brandOptions.value),
    ...listChips('conditions', conditionOptions.value),
    ...(Number(f.minPrice) ? [{ label: `From TZS ${formatTzs(f.minPrice)}`, remove: () => patch({ minPrice: '' }) }] : []),
    ...(Number(f.maxPrice) ? [{ label: `Up to TZS ${formatTzs(f.maxPrice)}`, remove: () => patch({ maxPrice: '' }) }] : []),
    ...(f.inStockOnly ? [{ label: 'In stock', remove: () => patch({ inStockOnly: false }) }] : [])
  ]
})

const clearFilters = () => {
  filters.value = emptyFilters()
  sortBy.value = 'featured'
  if (route.query.q) navigateTo('/products', { replace: true })
}

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' }
]

// Filters and sorting are client-side state, so this page has one URL and one
// canonical no matter how it is being viewed.
useSeo({
  title: `All Products – Smart Watches, Earbuds & Accessories in Tanzania | ${SITE.titleBrand}`,
  description: 'Browse every product we stock: original smart watches, fitness bands, earbuds and accessories, with prices in TZS and delivery across Tanzania.',
  path: '/products',
  jsonLd: [breadcrumbJsonLd(crumbs, useSiteUrl())]
})
</script>
