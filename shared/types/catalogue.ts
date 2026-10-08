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
  /** Extra photographs, in display order. `imageUrl` is always the first. */
  images?: string[] | null
  seoTitle?: string | null
  metaDescription?: string | null
  shortDescription?: string | null
  model?: string | null

  /** Customer reviews. Shown only when there is at least one. */
  ratingAverage?: number | null
  ratingCount?: number | null
  /** The price this product was sold at before the current one, if it was higher. */
  previousPrice?: number | null
  /** Set on design-preview data so sample ratings are never published as real ones. */
  sampleMerchandising?: boolean
}

/** A category or brand, derived from the products that belong to it. */
export interface CatalogueGroup {
  id: number
  slug: string
  label: string
  count: number
}
