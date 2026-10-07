<template>
  <CollectionPage
    v-if="category"
    :crumbs="crumbs"
    :heading="seo.heading"
    :intro="seo.intro"
    :products="data.products"
    :links="data.brands.map(brand => ({ name: `${brand.label} (${brand.count})`, path: brandPath(brand) }))"
    links-label="Brands in this category"
  />
  <CollectionNotFound v-else title="Category not found" to="/categories" label="Browse all categories" />
</template>

<script setup>
import { brandPath, breadcrumbJsonLd, categoryPath, categorySeo, collectBrands, collectCategories, itemListJsonLd } from '#shared/utils/seo'

const route = useRoute()
const siteUrl = useSiteUrl()

const data = await useCatalogue(`category-${route.params.slug}`, (all) => {
  const category = collectCategories(all).find(c => c.slug === route.params.slug) ?? null
  const products = category ? all.filter(p => p.category?.id === category.id) : []
  return { category, products, brands: collectBrands(products) }
})

const category = computed(() => data.value.category)
useNotFoundStatus(!category.value)

const seo = computed(() => categorySeo(category.value, data.value.products))
const crumbs = computed(() => [
  { name: 'Home', path: '/' },
  { name: 'Categories', path: '/categories' },
  { name: category.value.label, path: categoryPath(category.value) }
])

useSeo(() => category.value
  ? {
      title: seo.value.title,
      description: seo.value.description,
      path: categoryPath(category.value),
      jsonLd: [breadcrumbJsonLd(crumbs.value, siteUrl), itemListJsonLd(data.value.products, siteUrl)]
    }
  : { title: 'Category not found', description: 'This category does not exist.', path: route.path, noindex: true })
</script>
