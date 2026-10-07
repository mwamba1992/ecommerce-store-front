import type { StorefrontProduct } from '#shared/types/catalogue'

export const useProducts = () => {
  const { apiFetch } = useApi()

  /**
   * The public catalogue. Prices and stock are joined server-side and the
   * response carries retail price only — the admin /items endpoints hold cost
   * and margin data and now require a token.
   */
  const getProductsWithPricing = async (): Promise<StorefrontProduct[]> => {
    return await apiFetch('/items/storefront')
  }

  return {
    getProductsWithPricing
  }
}
