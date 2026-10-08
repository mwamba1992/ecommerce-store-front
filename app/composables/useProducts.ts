import type { StorefrontProduct } from '#shared/types/catalogue'

// Sample ratings and previous prices for the design preview. Deterministic per
// product so a page looks the same on every load. See mockMerchandising in
// nuxt.config.ts — this never runs unless that flag is switched on.
const withSampleMerchandising = (product: StorefrontProduct): StorefrontProduct => {
  const seed = (product.id * 2654435761) >>> 0
  const price = Number(product.sellingPrice) || 0
  const onOffer = price > 0 && seed % 5 < 2
  return {
    ...product,
    sampleMerchandising: true,
    ratingAverage: 4.1 + (seed % 9) / 10,
    ratingCount: 8 + (seed % 240),
    previousPrice: onOffer ? Math.round((price * (1.06 + (seed % 8) / 100)) / 5000) * 5000 : null
  }
}

// One copy of the catalogue per process (the server) or per tab (the browser),
// refreshed at most once a minute. Without it every page render asked the API
// for the whole catalogue twice, and a single slow answer became an error page.
// The catalogue is public and identical for every visitor, so sharing is safe.
const FRESH_FOR_MS = 60_000
let cached: { at: number; products: StorefrontProduct[] } | null = null
let inFlight: Promise<StorefrontProduct[]> | null = null

export const useProducts = () => {
  const { apiFetch } = useApi()
  const { mockMerchandising } = useRuntimeConfig().public

  /**
   * The public catalogue. Prices and stock are joined server-side and the
   * response carries retail price only — the admin /items endpoints hold cost
   * and margin data and now require a token.
   *
   * If the API fails, the last good copy is served instead: prices a few
   * minutes old are better than no store, and stock is re-checked server-side
   * when an order is placed. It only throws when there has never been a copy.
   */
  const getProductsWithPricing = async (): Promise<StorefrontProduct[]> => {
    if (cached && Date.now() - cached.at < FRESH_FOR_MS) return cached.products

    // On the server, straight from the API. In the browser, from this site's
    // own /api/catalogue — the API only accepts cross-origin browser requests
    // from addresses on its allow-list.
    const load: Promise<StorefrontProduct[]> = import.meta.server
      ? apiFetch('/items/storefront')
      : $fetch('/api/catalogue')

    inFlight ??= load
      .then((products) => {
        if (!Array.isArray(products)) throw new Error('Catalogue response was not a list')
        const ready = mockMerchandising ? products.map(withSampleMerchandising) : products
        cached = { at: Date.now(), products: ready }
        return ready
      })
      .catch((error) => {
        if (cached) return cached.products
        throw error
      })
      .finally(() => { inFlight = null })

    return inFlight
  }

  return {
    getProductsWithPricing
  }
}
