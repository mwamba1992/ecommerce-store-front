<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { SITE, isPrivatePath, jsonLdString, organizationJsonLd } from '#shared/utils/seo'

const route = useRoute()
const siteUrl = useSiteUrl()
const { googleSiteVerification } = useRuntimeConfig().public

// Site-wide head. Indexable pages declare their own title, canonical and
// robots through useSeo(); the cart, checkout and account areas declare
// nothing, so they are marked noindex here from the same list robots.txt uses.
useHead(computed(() => ({
  htmlAttrs: { lang: 'en' },
  meta: [
    { property: 'og:site_name', content: SITE.name },
    { property: 'og:locale', content: 'en_TZ' },
    ...(googleSiteVerification ? [{ name: 'google-site-verification', content: googleSiteVerification }] : []),
    ...(isPrivatePath(route.path) ? [{ name: 'robots', content: 'noindex, follow' }] : []),
  ],
  script: [
    { key: 'ld-organization', type: 'application/ld+json', innerHTML: jsonLdString(organizationJsonLd(siteUrl)) },
  ],
})))
</script>
