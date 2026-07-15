export interface StorefrontProduct {
  id: number
  name: string
  code: string | null
  desc: string | null
  imageUrl: string | null
  condition: 'new' | 'used'
  createdAt: string
  category: { id: number; code: string; description: string | null } | null
  brand: { id: number; name: string } | null
  sellingPrice: number | null
  inStock: boolean
  totalStock: number
}

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
