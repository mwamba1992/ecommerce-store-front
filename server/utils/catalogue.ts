import type { H3Event } from 'h3'
import type { StorefrontProduct } from '#shared/types/catalogue'
import { SITE } from '#shared/utils/seo'

export const getSiteUrl = (event: H3Event): string =>
  String(useRuntimeConfig(event).public.siteUrl || SITE.defaultUrl).replace(/\/+$/, '')

/**
 * The public catalogue, as the pages see it. Deliberately uncached and allowed
 * to throw: a sitemap or audit built from a failed fetch would report an empty
 * store, which is worse than reporting an error.
 */
export const fetchCatalogue = async (event: H3Event): Promise<StorefrontProduct[]> => {
  const { apiBase } = useRuntimeConfig(event).public
  const products = await $fetch<StorefrontProduct[]>(`${apiBase}/items/storefront`)
  if (!Array.isArray(products)) throw new Error('Catalogue response was not a list')
  return products
}
