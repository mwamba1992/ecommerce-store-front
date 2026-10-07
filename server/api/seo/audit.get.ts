import type { StorefrontProduct } from '#shared/types/catalogue'
import {
  PRIVATE_PATHS,
  SITE,
  absoluteUrl,
  brandPath,
  categoryPath,
  collectBrands,
  collectCategories,
  hasPrice,
  hasRealDescription,
  isPrivatePath,
  productImageAlt,
  productName,
  productPath,
  resolveImage,
  schemaAvailability,
} from '#shared/utils/seo'

/**
 * SEO report for the whole catalogue, behind /admin/seo.
 *
 * It audits what a crawler receives, not what the code intends: every product
 * page is rendered through the real server and its HTML is checked against the
 * catalogue record, robots.txt and the sitemap. It only reads — nothing here
 * submits URLs to Google or changes a product.
 */

type Severity = 'error' | 'warning'
interface Issue { check: string; severity: Severity; message: string }

const CONCURRENCY = 6

// --- minimal HTML reading: enough for pages this app renders itself ---------

const decode = (value: string): string =>
  value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')

const text = (html: string): string => decode(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim()

const tags = (html: string, name: string): Record<string, string>[] =>
  [...html.matchAll(new RegExp(`<${name}\\b([^>]*)>`, 'gi'))].map(([, raw]) => {
    const attrs: Record<string, string> = {}
    for (const [, key, value] of (raw ?? '').matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)) {
      attrs[key!.toLowerCase()] = decode(value!)
    }
    return attrs
  })

const readPage = (html: string) => {
  const meta = tags(html, 'meta')
  const metaContent = (key: string) =>
    meta.find(m => m.name === key || m.property === key)?.content?.trim() ?? ''

  const jsonLd: any[] = []
  let jsonLdInvalid = 0
  for (const [, body] of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      jsonLd.push(JSON.parse(body!))
    } catch {
      jsonLdInvalid++
    }
  }

  return {
    title: text(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ''),
    metaContent,
    canonicals: tags(html, 'link').filter(l => l.rel === 'canonical').map(l => l.href ?? ''),
    h1s: [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(([, inner]) => text(inner!)),
    images: tags(html, 'img'),
    links: new Set(tags(html, 'a').map(a => (a.href ?? '').split(/[?#]/)[0]!).filter(Boolean)),
    jsonLd,
    jsonLdInvalid,
  }
}

// --- robots.txt -------------------------------------------------------------

/** Longest-match evaluation of the `User-agent: *` group, as Google applies it. */
const robotsAllows = (robots: string, path: string): boolean => {
  let inGroup = false
  let allow = -1
  let disallow = -1
  for (const line of robots.split('\n')) {
    const [field, ...rest] = line.split(':')
    const value = rest.join(':').trim()
    const key = field!.trim().toLowerCase()
    if (key === 'user-agent') inGroup = value === '*'
    else if (inGroup && value && path.startsWith(value)) {
      if (key === 'allow') allow = Math.max(allow, value.length)
      if (key === 'disallow') disallow = Math.max(disallow, value.length)
    }
  }
  return allow >= disallow
}

// --- helpers ----------------------------------------------------------------

const pool = async <T, R>(items: T[], worker: (item: T) => Promise<R>): Promise<R[]> => {
  const results: R[] = new Array(items.length)
  let next = 0
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
      while (next < items.length) {
        const index = next++
        results[index] = await worker(items[index]!)
      }
    }),
  )
  return results
}

const duplicates = (values: string[]): Set<string> => {
  const seen = new Set<string>()
  const repeated = new Set<string>()
  for (const value of values) {
    if (!value) continue
    if (seen.has(value)) repeated.add(value)
    seen.add(value)
  }
  return repeated
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const expected = config.seoAuditToken
  if (!expected && !import.meta.dev) {
    throw createError({ statusCode: 503, statusMessage: 'SEO audit is not configured: set NUXT_SEO_AUDIT_TOKEN' })
  }
  if (expected && getHeader(event, 'x-seo-audit-token') !== expected) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid audit token' })
  }

  const siteUrl = getSiteUrl(event)
  const apiBase = config.public.apiBase

  // Rendered in-process through the same server, route rules included.
  const get = async (path: string) => {
    const response = await $fetch.raw<string>(path, { responseType: 'text', ignoreResponseError: true })
    return { status: response.status, headers: response.headers, body: String(response._data ?? '') }
  }

  const products = await fetchCatalogue(event)
  const categories = collectCategories(products)
  const brands = collectBrands(products)

  const [robots, sitemap] = await Promise.all([get('/robots.txt'), get('/sitemap.xml')])
  const sitemapUrls = new Set([...sitemap.body.matchAll(/<loc>([^<]*)<\/loc>/g)].map(([, loc]) => decode(loc!)))

  // Pages a crawler reaches from the home page; these are where a product's
  // internal links have to come from.
  const hubPaths = ['/', '/products', '/categories', '/brands', ...categories.map(categoryPath), ...brands.map(brandPath)]
  const hubs = await pool(hubPaths, async path => ({ path, ...(await get(path)) }))
  const inbound = new Map<string, string[]>()
  for (const hub of hubs) {
    if (hub.status !== 200) continue
    for (const href of readPage(hub.body).links) {
      inbound.set(href, [...(inbound.get(href) ?? []), hub.path])
    }
  }

  // ---- site-level checks ----
  const site: Issue[] = []
  const siteIssue = (check: string, message: string, severity: Severity = 'error') => site.push({ check, severity, message })

  if (robots.status !== 200) siteIssue('robots.txt', `robots.txt answered HTTP ${robots.status}`)
  if (!robots.body.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) siteIssue('robots.txt', 'robots.txt does not reference the sitemap')
  if (sitemap.status !== 200) siteIssue('sitemap', `sitemap.xml answered HTTP ${sitemap.status}`)

  const catalogueUrls = new Set(products.map(p => absoluteUrl(siteUrl, productPath(p))))
  for (const url of sitemapUrls) {
    const path = url.replace(siteUrl, '') || '/'
    if (isPrivatePath(path)) siteIssue('sitemap', `Private URL listed in sitemap: ${path}`)
    if (path.startsWith('/products/') && !catalogueUrls.has(url)) siteIssue('sitemap', `Sitemap lists a product that is no longer in the catalogue: ${path}`)
  }
  for (const path of PRIVATE_PATHS) {
    if (robotsAllows(robots.body, path)) siteIssue('robots.txt', `Private area is not blocked: ${path}`)
  }
  for (const hub of hubs) {
    if (hub.status !== 200) {
      siteIssue('status', `${hub.path} answered HTTP ${hub.status}`)
      continue
    }
    const page = readPage(hub.body)
    if (!robotsAllows(robots.body, hub.path)) siteIssue('robots.txt', `${hub.path} is blocked by robots.txt`)
    if (/noindex/i.test(page.metaContent('robots'))) siteIssue('indexable', `${hub.path} is marked noindex`)
    if (page.canonicals.length !== 1 || page.canonicals[0] !== absoluteUrl(siteUrl, hub.path)) siteIssue('canonical', `${hub.path} has canonical ${JSON.stringify(page.canonicals)}`)
    if (page.h1s.length !== 1) siteIssue('h1', `${hub.path} has ${page.h1s.length} H1 elements`)
    if (!sitemapUrls.has(absoluteUrl(siteUrl, hub.path))) siteIssue('sitemap', `${hub.path} is missing from the sitemap`)
    if (hub.path === '/') {
      const types = page.jsonLd.flatMap(d => d?.['@type'])
      if (!types.includes('Organization')) siteIssue('structured data', 'Home page has no Organization structured data')
      if (!types.includes('WebSite')) siteIssue('structured data', 'Home page has no WebSite structured data')
    }
  }

  // ---- per-product checks ----
  const audited = await pool(products, async (product: StorefrontProduct) => {
    const path = productPath(product)
    const url = absoluteUrl(siteUrl, path)
    const issues: Issue[] = []
    const fail = (check: string, message: string) => issues.push({ check, severity: 'error', message })
    const warn = (check: string, message: string) => issues.push({ check, severity: 'warning', message })

    const response = await get(path)
    const page = readPage(response.body)
    const name = productName(product)

    if (response.status !== 200) fail('status', `Page answered HTTP ${response.status}`)

    const robotsMeta = page.metaContent('robots')
    const robotsHeader = response.headers.get('x-robots-tag') ?? ''
    if (/noindex/i.test(robotsMeta) || /noindex/i.test(robotsHeader)) fail('indexable', 'Page is marked noindex')
    if (/nofollow/i.test(robotsMeta) || /nofollow/i.test(robotsHeader)) fail('indexable', 'Page is marked nofollow')
    if (!robotsAllows(robots.body, path)) fail('indexable', 'Page is blocked by robots.txt')

    if (page.canonicals.length === 0) fail('canonical', 'No canonical URL')
    else if (page.canonicals.length > 1) fail('canonical', `${page.canonicals.length} canonical URLs`)
    else if (page.canonicals[0] !== url) fail('canonical', `Canonical is ${page.canonicals[0]}, expected ${url}`)

    if (!page.title) fail('title', 'No <title>')
    else if (page.title.length > 70) warn('title', `Title is ${page.title.length} characters and will be cut off in results`)

    const description = page.metaContent('description')
    if (!description) fail('meta description', 'No meta description')
    else if (description.length > 170) warn('meta description', `Meta description is ${description.length} characters`)

    if (page.h1s.length === 0) fail('h1', 'No H1')
    else if (page.h1s.length > 1) fail('h1', `${page.h1s.length} H1 elements`)
    else if (page.h1s[0] !== name) fail('h1', `H1 "${page.h1s[0]}" is not the product name`)

    if (page.jsonLdInvalid > 0) fail('product schema', 'A JSON-LD block is not valid JSON')
    const schema = page.jsonLd.find(d => d?.['@type'] === 'Product')
    if (!schema) {
      fail('product schema', 'No Product structured data')
    } else {
      if (!schema.name) fail('product schema', 'Product schema has no name')
      if (!schema.description) fail('description', 'Product schema has no description')
      if (schema.url !== url) fail('product schema', `Product schema url is ${schema.url}`)
      const offer = schema.offers
      if (!offer) {
        fail('offer', hasPrice(product) ? 'Product schema has no offer' : 'No offer: the product has no active selling price')
      } else {
        if (Number(offer.price) !== Number(product.sellingPrice)) fail('price', `Schema price ${offer.price} does not match catalogue price ${product.sellingPrice}`)
        if (offer.priceCurrency !== SITE.currency) fail('currency', `Schema currency is ${offer.priceCurrency}`)
        if (offer.availability !== schemaAvailability(product)) fail('availability', `Schema availability ${offer.availability} does not match stock`)
      }
    }

    if (!product.imageUrl) {
      fail('image', 'Product has no image')
    } else {
      const src = resolveImage(product.imageUrl, 'detail', apiBase)
      const image = page.images.find(img => img.src === src)
      if (!image) fail('image', 'Product image is not in the page HTML')
      else {
        if (!image.alt?.trim()) fail('image alt', 'Product image has no alt text')
        if (!image.width || !image.height) warn('image', 'Product image has no width/height')
      }
      if (!src.startsWith('https://')) fail('image', 'Product image is not served over HTTPS')
      if (schema && !schema.image) fail('product schema', 'Product schema has no image')
    }

    for (const property of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type']) {
      if (!page.metaContent(property)) fail('open graph', `Missing ${property}`)
    }
    if (page.metaContent('og:url') && page.metaContent('og:url') !== url) fail('open graph', 'og:url is not the canonical URL')

    if (!sitemapUrls.has(url)) fail('sitemap', 'Product is not in sitemap.xml')

    const sources = inbound.get(path) ?? []
    if (sources.length === 0) fail('internal links', 'No listing, category or brand page links to this product')

    // Content the catalogue itself is missing. The page still renders, but
    // these are what hold a product back and only an editor can supply them.
    if (!hasRealDescription(product)) warn('content', product.desc?.trim() ? `Description is too short to publish ("${product.desc.trim()}"); the page shows a generated summary` : 'No description; the page shows a generated summary')
    if (!product.brand) warn('brand', 'No brand set')
    else if (!name.toLowerCase().includes(product.brand.name.trim().toLowerCase())) warn('brand', `Name does not mention its brand (${product.brand.name}); check the brand is right`)
    if (!product.code) warn('sku', 'No SKU')
    if (!product.category) warn('category', 'No category set')
    if (name === name.toUpperCase() && /[A-Z]{4}/.test(name)) warn('name', 'Name is in capitals')

    return {
      id: product.id,
      name,
      path,
      title: page.title,
      metaDescription: description,
      linkedFrom: sources.length,
      issues,
    }
  })

  const repeatedTitles = duplicates(audited.map(p => p.title))
  const repeatedDescriptions = duplicates(audited.map(p => p.metaDescription))
  for (const product of audited) {
    if (repeatedTitles.has(product.title)) product.issues.push({ check: 'duplicate title', severity: 'error', message: `Another product has the same title: "${product.title}"` })
    if (repeatedDescriptions.has(product.metaDescription)) product.issues.push({ check: 'duplicate description', severity: 'error', message: 'Another product has the same meta description' })
  }

  const byCheck: Record<string, { errors: number; warnings: number }> = {}
  for (const product of audited) {
    for (const check of new Set(product.issues.map(i => `${i.severity}|${i.check}`))) {
      const [severity, name] = check.split('|') as [Severity, string]
      byCheck[name] ??= { errors: 0, warnings: 0 }
      byCheck[name][severity === 'error' ? 'errors' : 'warnings']++
    }
  }

  setHeader(event, 'Cache-Control', 'no-store')
  return {
    generatedAt: new Date().toISOString(),
    siteUrl,
    summary: {
      products: audited.length,
      passing: audited.filter(p => !p.issues.some(i => i.severity === 'error')).length,
      withErrors: audited.filter(p => p.issues.some(i => i.severity === 'error')).length,
      withWarnings: audited.filter(p => p.issues.some(i => i.severity === 'warning')).length,
      sitemapUrls: sitemapUrls.size,
      categories: categories.length,
      brands: brands.length,
      byCheck,
    },
    site,
    products: audited,
  }
})
