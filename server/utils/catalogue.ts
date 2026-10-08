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

// The copy handed to browsers: refreshed at most once a minute, and the last
// good one is kept serving if the API fails.
const FRESH_FOR_MS = 60_000
let cached: { at: number; products: StorefrontProduct[] } | null = null
let inFlight: Promise<StorefrontProduct[]> | null = null

export const getCatalogueCached = (event: H3Event): Promise<StorefrontProduct[]> => {
  if (cached && Date.now() - cached.at < FRESH_FOR_MS) return Promise.resolve(cached.products)

  inFlight ??= fetchCatalogue(event)
    .then((products) => {
      cached = { at: Date.now(), products }
      return products
    })
    .catch((error) => {
      if (cached) return cached.products
      throw error
    })
    .finally(() => { inFlight = null })

  return inFlight
}
