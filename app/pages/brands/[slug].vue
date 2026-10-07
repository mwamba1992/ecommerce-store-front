<template>
  <CollectionPage
    v-if="brand"
    :crumbs="crumbs"
    :heading="seo.heading"
    :intro="seo.intro"
    :products="data.products"
    :links="data.categories.map(category => ({ name: `${category.label} (${category.count})`, path: categoryPath(category) }))"
    links-label="Categories for this brand"
  />
  <CollectionNotFound v-else title="Brand not found" to="/brands" label="Browse all brands" />
</template>

<script setup>
import { brandPath, brandSeo, breadcrumbJsonLd, categoryPath, collectBrands, collectCategories, itemListJsonLd } from '#shared/utils/seo'

const route = useRoute()
const siteUrl = useSiteUrl()

const data = await useCatalogue(`brand-${route.params.slug}`, (all) => {
  const brand = collectBrands(all).find(b => b.slug === route.params.slug) ?? null
  const products = brand ? all.filter(p => p.brand?.id === brand.id) : []
  return { brand, products, categories: collectCategories(products) }
})

const brand = computed(() => data.value.brand)
useNotFoundStatus(!brand.value)

const seo = computed(() => brandSeo(brand.value, data.value.products))
const crumbs = computed(() => [
  { name: 'Home', path: '/' },
  { name: 'Brands', path: '/brands' },
  { name: brand.value.label, path: brandPath(brand.value) }
])

useSeo(() => brand.value
  ? {
      title: seo.value.title,
      description: seo.value.description,
      path: brandPath(brand.value),
      jsonLd: [breadcrumbJsonLd(crumbs.value, siteUrl), itemListJsonLd(data.value.products, siteUrl)]
    }
  : { title: 'Brand not found', description: 'This brand does not exist.', path: route.path, noindex: true })
</script>
