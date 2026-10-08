import type { StorefrontProduct } from '#shared/types/catalogue'

export interface ReviewSummary {
  average: number | null
  count: number
  breakdown: Record<number, number>
  reviews: { id: number; rating: number; comment: string | null; name: string; createdAt: string }[]
}

export interface PendingReview {
  orderId: number
  orderNumber: string
  deliveredAt: string | null
  itemId: number
  name: string
  imageUrl: string | null
}

// Design-preview stand-ins, shown only under the mockMerchandising flag.
const SAMPLE_COMMENTS = [
  'Arrived the next day in Dar and works perfectly. Battery lasts as described.',
  'Original product, still sealed. Good communication on WhatsApp.',
  'Happy with it. Strap is comfortable and the screen is bright outdoors.',
  null,
  'Good value for the price. Delivery to Arusha took three days.',
  null,
]
const SAMPLE_NAMES = ['Asha M.', 'Juma K.', 'Neema S.', 'Baraka', 'Grace L.', 'Daudi N.']

const sampleSummary = (product: StorefrontProduct): ReviewSummary => {
  const average = Number(product.ratingAverage) || 4.5
  const count = Number(product.ratingCount) || 12
  // Split the count across 5/4/3 stars so the bars roughly match the average.
  const fives = Math.round(count * Math.min(0.9, Math.max(0.3, average - 3.9)))
  const threes = Math.round((count - fives) * 0.2)
  const breakdown = { 5: fives, 4: count - fives - threes, 3: threes, 2: 0, 1: 0 }
  return {
    average,
    count,
    breakdown,
    reviews: SAMPLE_COMMENTS.map((comment, index) => ({
      id: index + 1,
      rating: index % 3 === 2 ? 4 : 5,
      comment,
      name: SAMPLE_NAMES[index]!,
      createdAt: new Date(Date.UTC(2026, 8, 28 - index * 6)).toISOString(),
    })),
  }
}

export const useReviews = () => {
  const { apiFetch } = useApi()
  const { mockMerchandising } = useRuntimeConfig().public

  const forProduct = async (product: StorefrontProduct): Promise<ReviewSummary> => {
    if (mockMerchandising) return sampleSummary(product)
    return await $fetch(`/api/reviews/${product.id}`)
  }

  const withToken = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } })

  /** Delivered products the signed-in customer has not rated yet. */
  const pending = (token: string): Promise<PendingReview[]> => apiFetch('/reviews/pending', withToken(token))

  const submit = (token: string, review: { orderId: number; itemId: number; rating: number; comment?: string }) =>
    apiFetch('/reviews', { method: 'POST', body: review, ...withToken(token) })

  return { forProduct, pending, submit }
}
