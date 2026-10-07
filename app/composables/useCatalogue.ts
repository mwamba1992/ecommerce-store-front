import type { StorefrontProduct } from '#shared/types/catalogue'

/**
 * Loads the catalogue for a server-rendered page and reduces it to what the
 * page needs — only the reduced value is serialised into the HTML.
 *
 * A failed fetch is raised as a 503 rather than rendered as "not found": an
 * API outage must not tell search engines that every product page has gone.
 */
export const useCatalogue = async <T>(key: string, pick: (products: StorefrontProduct[]) => T) => {
  const { getProductsWithPricing } = useProducts()

  const { data, error } = await useAsyncData(key, async () => pick(await getProductsWithPricing()))

  if (error.value) {
    throw createError({ statusCode: 503, statusMessage: 'Catalogue temporarily unavailable', fatal: true })
  }

  return data as Ref<T>
}

/** Answers 404 for a catalogue URL that matches nothing, keeping the page's own not-found UI. */
export const useNotFoundStatus = (missing: boolean) => {
  if (!missing) return
  const event = useRequestEvent()
  if (event) setResponseStatus(event, 404)
}
