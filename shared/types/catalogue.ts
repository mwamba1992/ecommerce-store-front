/**
 * A product as served by the public catalogue endpoint (GET /items/storefront).
 *
 * The optional fields are SEO overrides and extra content. The API does not
 * return them yet; when it does, the storefront picks them up without a code
 * change, and until then every one of them has an automatic default.
 */
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

  updatedAt?: string | null
  seoTitle?: string | null
  metaDescription?: string | null
  shortDescription?: string | null
  model?: string | null
}

/** A category or brand, derived from the products that belong to it. */
export interface CatalogueGroup {
  id: number
  slug: string
  label: string
  count: number
}
