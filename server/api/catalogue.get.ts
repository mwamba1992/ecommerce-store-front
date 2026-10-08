/**
 * The catalogue for the browser, served from the storefront's own origin.
 *
 * Pages are rendered on the server, but moving between them happens in the
 * browser, which then needs the catalogue too. Asking the API directly would
 * depend on its cross-origin allow-list naming whatever address the store is
 * being served from; going through this route does not, and it shares one
 * cached copy between all visitors.
 */
export default defineEventHandler(async (event) => {
  try {
    const products = await getCatalogueCached(event)
    setHeader(event, 'Cache-Control', 'public, max-age=30')
    return products
  } catch {
    throw createError({ statusCode: 503, statusMessage: 'Catalogue temporarily unavailable' })
  }
})
