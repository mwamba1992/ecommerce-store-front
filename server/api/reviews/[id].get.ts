/**
 * Published reviews of one product, relayed from the API on the storefront's
 * own origin (see catalogue.get.ts for why).
 *
 * Reviews are an extra on a product page, never a reason for it to fail: if
 * the API cannot answer, the page is told there are none.
 */
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const empty = { average: null, count: 0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }, reviews: [] }
  if (!Number.isInteger(id) || id <= 0) return empty

  try {
    const { apiBase } = useRuntimeConfig(event).public
    const summary = await $fetch(`${apiBase}/reviews/item/${id}`)
    setHeader(event, 'Cache-Control', 'public, max-age=60')
    return summary
  } catch {
    return empty
  }
})
