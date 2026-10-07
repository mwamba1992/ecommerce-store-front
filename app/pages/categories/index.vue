<template>
  <GroupIndex
    :crumbs="crumbs"
    heading="Shop by category"
    :intro="description"
    :groups="categories.map(category => ({ ...category, path: categoryPath(category) }))"
  />
</template>

<script setup>
import { SITE, breadcrumbJsonLd, categoryPath, collectCategories } from '#shared/utils/seo'

const siteUrl = useSiteUrl()

// Categories come from the products themselves, so only categories that
// actually contain something are listed and linked.
const categories = await useCatalogue('categories-index', all => collectCategories(all))

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Categories', path: '/categories' }
]

const description = computed(() =>
  `Browse ${categories.value.length} product categories at ${SITE.name}, including ${categories.value.slice(0, 3).map(c => c.label).join(', ')}. Original products, delivered across Tanzania.`)

useSeo(() => ({
  title: `Product Categories | ${SITE.titleBrand}`,
  description: description.value,
  path: '/categories',
  jsonLd: [breadcrumbJsonLd(crumbs, siteUrl)]
}))
</script>
