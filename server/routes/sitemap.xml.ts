import {
  STATIC_PATHS,
  absoluteUrl,
  brandPath,
  categoryPath,
  collectBrands,
  collectCategories,
  productImageAlt,
  productPath,
  resolveImage,
} from '#shared/utils/seo'

const xml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

/**
 * Built from the live catalogue on request (and cached briefly by the route
 * rule), so a product appears here as soon as it is created and disappears as
 * soon as the API stops returning it. Cart, checkout, account and admin URLs
 * are never listed because only catalogue and STATIC_PATHS entries are emitted.
 */
export default defineEventHandler(async (event) => {
  const siteUrl = getSiteUrl(event)
  const { apiBase } = useRuntimeConfig(event).public

  let products
  try {
    products = await fetchCatalogue(event)
  } catch {
    // Not an empty sitemap: that would read as "every product was removed".
    setHeader(event, 'Retry-After', 300)
    throw createError({ statusCode: 503, statusMessage: 'Catalogue temporarily unavailable' })
  }

  const entries: string[] = []
  const add = (path: string, extra = '') =>
    entries.push(`  <url>\n    <loc>${xml(absoluteUrl(siteUrl, path))}</loc>${extra}\n  </url>`)

  for (const path of STATIC_PATHS) add(path)
  for (const category of collectCategories(products)) add(categoryPath(category))
  for (const brand of collectBrands(products)) add(brandPath(brand))

  for (const product of products) {
    let extra = ''
    // Only a real modification date is worth stating; a creation date repeated
    // forever teaches crawlers to ignore the field.
    if (product.updatedAt) extra += `\n    <lastmod>${xml(new Date(product.updatedAt).toISOString())}</lastmod>`

    const image = resolveImage(product.imageUrl, 'social', apiBase)
    if (image) {
      extra += `\n    <image:image>\n      <image:loc>${xml(image)}</image:loc>\n      <image:title>${xml(productImageAlt(product))}</image:title>\n    </image:image>`
    }
    add(productPath(product), extra)
  }

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n')
})
