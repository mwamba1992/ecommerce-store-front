<template>
  <GroupIndex
    :crumbs="crumbs"
    heading="Shop by brand"
    :intro="description"
    :groups="brands.map(brand => ({ ...brand, path: brandPath(brand) }))"
  />
</template>

<script setup>
import { SITE, brandPath, breadcrumbJsonLd, collectBrands } from '#shared/utils/seo'

const siteUrl = useSiteUrl()

const brands = await useCatalogue('brands-index', all => collectBrands(all).map(group => ({
  ...group,
  // Pictured by one of its own products.
  cover: all.find(p => p.brand?.id === group.id && p.imageUrl)?.imageUrl ?? null
})))

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Brands', path: '/brands' }
]

const description = computed(() =>
  `Shop ${brands.value.length} brands at ${SITE.name}, including ${brands.value.slice(0, 4).map(b => b.label).join(', ')}. Original products, delivered across Tanzania.`)

useSeo(() => ({
  title: `Brands We Stock in Tanzania | ${SITE.titleBrand}`,
  description: description.value,
  path: '/brands',
  jsonLd: [breadcrumbJsonLd(crumbs, siteUrl)]
}))
</script>
