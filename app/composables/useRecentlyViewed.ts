import type { StorefrontProduct } from '#shared/types/catalogue'

const KEY = 'recently-viewed'
const LIMIT = 8

/**
 * Products this visitor has opened, newest first, kept in the browser only.
 * Stored as whole catalogue records so the rail can render without a fetch;
 * prices in it may be a visit old, which is why it links back to the product.
 */
export const useRecentlyViewed = () => {
  const items = useState<StorefrontProduct[]>(KEY, () => [])

  const load = () => {
    if (!import.meta.client) return
    try {
      items.value = JSON.parse(localStorage.getItem(KEY) || '[]')
    } catch {
      items.value = []
    }
  }

  const record = (product: StorefrontProduct) => {
    if (!import.meta.client) return
    load()
    items.value = [product, ...items.value.filter(p => p.id !== product.id)].slice(0, LIMIT)
    localStorage.setItem(KEY, JSON.stringify(items.value))
  }

  return { items, load, record }
}
