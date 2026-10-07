import type { CatalogueGroup, StorefrontProduct } from '../types/catalogue'

/**
 * Everything the storefront says about a product to a search engine is derived
 * here, from the catalogue record alone. Pages, the sitemap and the SEO audit
 * all call these functions, so a new product is SEO-ready the moment the API
 * returns it and the three can never disagree.
 *
 * Nothing in this file invents product facts. Where the catalogue has no
 * description, the fallback text restates only what the record holds: name,
 * brand, category, condition, price and stock.
 */

export const SITE = {
  name: 'Global Authentic TZ',
  // Suffix used in <title>. Kept separate from the trading name above.
  titleBrand: 'Global Authentics',
  defaultUrl: 'https://store.mwendavano.com',
  currency: 'TZS',
  phone: '+255789947608',
  email: 'info@globalauthentic.co.tz',
  street: 'Kariakoo',
  locality: 'Dar es Salaam',
  country: 'TZ',
  returnDays: 7,
  logoPath: '/logo.jpeg',
  sameAs: ['https://www.instagram.com/globalauthenticstz/'],
} as const

/** Indexable pages that are not generated from the catalogue. */
export const STATIC_PATHS = [
  '/',
  '/products',
  '/categories',
  '/brands',
  '/about',
  '/contact',
  '/help',
  '/shipping',
  '/returns',
  '/privacy',
  '/terms',
] as const

/**
 * Personal or stateful areas. One list drives robots.txt, the noindex tag and
 * the sitemap exclusion, so a page cannot be blocked in one and listed in another.
 */
export const PRIVATE_PATHS = [
  '/cart',
  '/checkout',
  '/account',
  '/wishlist',
  '/login',
  '/register',
  '/set-password',
  '/admin',
  '/api',
] as const

export const isPrivatePath = (path: string): boolean =>
  PRIVATE_PATHS.some(p => path === p || path.startsWith(`${p}/`))

// ---------------------------------------------------------------------------
// Text helpers
// ---------------------------------------------------------------------------

const squash = (value: string | null | undefined): string =>
  (value ?? '').replace(/\s+/g, ' ').trim()

const lettersOnly = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]/g, '')

export const slugify = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const titleCase = (value: string): string =>
  value.toLowerCase().replace(/(^|[\s/-])([a-z])/g, (_, lead, char) => lead + char.toUpperCase())

const joinList = (items: string[]): string => {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

/** Renders a TZS amount without decimals, e.g. 350000 -> "350,000". */
export const formatTzs = (price: number | string | null | undefined): string =>
  Number(price || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

export const absoluteUrl = (siteUrl: string, path: string): string =>
  `${siteUrl.replace(/\/+$/, '')}${path === '/' ? '/' : path.replace(/\/+$/, '')}`

/** Serialises JSON-LD for a <script> tag; a name containing "</script>" must not close it. */
export const jsonLdString = (data: unknown): string =>
  JSON.stringify(data).replace(/</g, '\\u003c')

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------

// Named presets rather than raw transform strings at each call site, so image
// sizing is a decision made once, here. The padded presets always come back at
// exactly the stated size, which is what lets <img> carry width and height.
export const IMAGE_PRESETS = {
  thumb: { transform: 'f_auto,q_auto,w_200,h_200,c_pad,b_white', width: 200, height: 200 },
  small: { transform: 'f_auto,q_auto,w_300,h_300,c_fit', width: null, height: null },
  card: { transform: 'f_auto,q_auto,w_800,h_800,c_pad,b_white', width: 800, height: 800 },
  detail: { transform: 'f_auto,q_auto,w_1200,h_1200,c_pad,b_white', width: 1200, height: 1200 },
  // Link previews and structured data: a fixed JPEG, because scrapers do not
  // negotiate formats the way browsers do.
  social: { transform: 'f_jpg,q_auto,w_1200,h_1200,c_pad,b_white', width: 1200, height: 1200 },
} as const

export type ImagePreset = keyof typeof IMAGE_PRESETS

const isCloudinary = (url: string): boolean => url.includes('res.cloudinary.com') && url.includes('/upload/')

/**
 * Resolves a product image URL, asking Cloudinary for an appropriately sized
 * copy when the image is hosted there. Relative paths are served by the API.
 */
export const resolveImage = (
  imageUrl: string | null | undefined,
  preset: ImagePreset,
  apiBase: string,
): string => {
  if (!imageUrl) return ''

  if (/^https?:\/\//i.test(imageUrl)) {
    const secure = imageUrl.replace(/^http:\/\//i, 'https://')
    return isCloudinary(secure)
      ? secure.replace('/upload/', `/upload/${IMAGE_PRESETS[preset].transform}/`)
      : secure
  }

  return `${apiBase}${imageUrl}`
}

/** Pixel size of a resolved image, or null when it cannot be known in advance. */
export const imageSize = (
  imageUrl: string | null | undefined,
  preset: ImagePreset,
): { width: number; height: number } | null => {
  const { width, height } = IMAGE_PRESETS[preset]
  if (!imageUrl || !isCloudinary(imageUrl) || !width || !height) return null
  return { width, height }
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export const productPath = (product: Pick<StorefrontProduct, 'id'>): string => `/products/${product.id}`

export const productName = (product: StorefrontProduct): string => squash(product.name)

/** The name with its brand in front when the name alone does not mention it. */
export const productFullName = (product: StorefrontProduct): string => {
  const name = productName(product)
  const brand = squash(product.brand?.name)
  if (!brand || lettersOnly(name).includes(lettersOnly(brand))) return name
  return `${brand} ${name}`
}

/** Marks a used item, unless its name already says so. */
const usedSuffix = (product: StorefrontProduct, suffix: string): string =>
  product.condition === 'used' && !/\bused\b/i.test(product.name) ? suffix : ''

export const hasPrice = (product: StorefrontProduct): boolean => Number(product.sellingPrice) > 0

/**
 * Whether `desc` is a description a shopper could use. Much of the catalogue
 * holds a stock note or the product name in this field ("sold", "x", "anker"),
 * which must not be published as if it described the product.
 */
export const hasRealDescription = (product: StorefrontProduct): boolean => {
  const desc = squash(product.desc)
  if (desc.length < 40) return false
  return lettersOnly(desc) !== lettersOnly(product.name)
}

/** The stored description as paragraphs, or an empty list when there is none worth showing. */
export const descriptionParagraphs = (product: StorefrontProduct): string[] => {
  if (!hasRealDescription(product)) return []
  return (product.desc ?? '')
    .split(/\n+/)
    .map(squash)
    .filter(Boolean)
}

/** A factual paragraph built only from catalogue fields. */
export const productSummary = (product: StorefrontProduct): string => {
  const name = productFullName(product)
  const category = product.category ? categoryLabel(product.category) : null
  const condition = product.condition === 'used' ? 'a used' : 'a new'

  const sentences = [
    `${name} is ${condition}${product.brand ? ` ${squash(product.brand.name)}` : ''} product${category ? ` in our ${category} range` : ''}, sold by ${SITE.name} in ${SITE.street}, ${SITE.locality}.`,
  ]

  if (hasPrice(product)) {
    sentences.push(
      product.inStock
        ? `It is in stock at ${SITE.currency} ${formatTzs(product.sellingPrice)}, with delivery across Tanzania.`
        : `It is priced at ${SITE.currency} ${formatTzs(product.sellingPrice)} and is currently out of stock.`,
    )
  } else {
    sentences.push(product.inStock ? 'It is in stock, with delivery across Tanzania.' : 'It is currently out of stock.')
  }

  return sentences.join(' ')
}

/** Description for search engines and structured data: the real one if it exists. */
export const productDescription = (product: StorefrontProduct): string =>
  squash(product.shortDescription) || descriptionParagraphs(product).join(' ') || productSummary(product)

export const productTitle = (product: StorefrontProduct): string => {
  const override = squash(product.seoTitle)
  if (override) return override

  const base = `${productFullName(product)}${usedSuffix(product, ' (Used)')} Price in Tanzania`
  const full = `${base} | ${SITE.titleBrand}`
  // Search results cut titles at roughly 60 characters; on a long product name
  // the store suffix is the part to give up.
  return full.length > 70 ? base : full
}

export const productMetaDescription = (product: StorefrontProduct): string => {
  const override = squash(product.metaDescription)
  if (override) return override

  const name = productFullName(product)
  const price = hasPrice(product) ? ` Price ${SITE.currency} ${formatTzs(product.sellingPrice)}.` : ''
  const lead = product.condition === 'used' ? `Buy a used ${name} in Tanzania.` : `Buy the original ${name} in Tanzania.`

  return product.inStock
    ? `${lead} Available in ${SITE.locality} with delivery across Tanzania.${price}`
    : `${lead} Sold by ${SITE.name} in ${SITE.locality}, currently out of stock.${price}`
}

export const productImageAlt = (product: StorefrontProduct): string =>
  `${productFullName(product)}${usedSuffix(product, ' (used)')}`

export const schemaAvailability = (product: StorefrontProduct): string =>
  product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'

export const productJsonLd = (product: StorefrontProduct, siteUrl: string, apiBase: string) => {
  const url = absoluteUrl(siteUrl, productPath(product))
  const image = resolveImage(product.imageUrl, 'social', apiBase)

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productFullName(product),
    description: productDescription(product),
    url,
    ...(image ? { image: [image] } : {}),
    ...(product.code ? { sku: product.code } : {}),
    ...(product.model ? { model: squash(product.model) } : {}),
    ...(product.brand ? { brand: { '@type': 'Brand', name: squash(product.brand.name) } } : {}),
    ...(product.category ? { category: categoryLabel(product.category) } : {}),
    // An offer without a price is invalid, so a product with no active price
    // is published as a plain Product until one is set.
    ...(hasPrice(product)
      ? {
          offers: {
            '@type': 'Offer',
            url,
            price: Number(product.sellingPrice),
            priceCurrency: SITE.currency,
            availability: schemaAvailability(product),
            itemCondition:
              product.condition === 'used'
                ? 'https://schema.org/UsedCondition'
                : 'https://schema.org/NewCondition',
            seller: { '@type': 'Organization', name: SITE.name },
            // The published returns policy (/returns): 7 days from delivery.
            hasMerchantReturnPolicy: {
              '@type': 'MerchantReturnPolicy',
              applicableCountry: SITE.country,
              returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
              merchantReturnDays: SITE.returnDays,
            },
          },
        }
      : {}),
  }
}

// ---------------------------------------------------------------------------
// Categories and brands
// ---------------------------------------------------------------------------

/**
 * Display name for a category. Newer categories store a machine code plus a
 * readable description ("SMART_WATCHES" / "Smart Watches"); older ones store
 * the name in the code and unrelated notes in the description.
 */
export const categoryLabel = (category: { code: string; description: string | null }): string => {
  const description = squash(category.description)
  const sameWords = description && lettersOnly(description) === lettersOnly(category.code)
  const mixedCase = description !== description.toUpperCase() && description !== description.toLowerCase()
  return sameWords && mixedCase
    ? description
    : titleCase(squash(category.code.replace(/_/g, ' ')))
}

const toGroups = (entries: Map<number, { label: string; count: number }>): CatalogueGroup[] => {
  const taken = new Set<string>()

  // Slugs are handed out in id order so that a later addition can never take
  // over the URL of an existing category or brand.
  const groups = [...entries.entries()]
    .sort(([a], [b]) => a - b)
    .map(([id, { label, count }]) => {
      const base = slugify(label) || String(id)
      const slug = taken.has(base) ? `${base}-${id}` : base
      taken.add(slug)
      return { id, slug, label, count }
    })

  return groups.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

/** Categories that have at least one product, largest first. */
export const collectCategories = (products: StorefrontProduct[]): CatalogueGroup[] => {
  const entries = new Map<number, { label: string; count: number }>()
  for (const { category } of products) {
    if (!category) continue
    const entry = entries.get(category.id) ?? { label: categoryLabel(category), count: 0 }
    entry.count++
    entries.set(category.id, entry)
  }
  return toGroups(entries)
}

/** Brands that have at least one product, largest first. */
export const collectBrands = (products: StorefrontProduct[]): CatalogueGroup[] => {
  const entries = new Map<number, { label: string; count: number }>()
  for (const { brand } of products) {
    if (!brand) continue
    const entry = entries.get(brand.id) ?? { label: squash(brand.name), count: 0 }
    entry.count++
    entries.set(brand.id, entry)
  }
  return toGroups(entries)
}

export const categoryPath = (group: Pick<CatalogueGroup, 'slug'>): string => `/categories/${group.slug}`
export const brandPath = (group: Pick<CatalogueGroup, 'slug'>): string => `/brands/${group.slug}`

const lowestPrice = (products: StorefrontProduct[]): number | null => {
  const prices = products.filter(hasPrice).map(p => Number(p.sellingPrice))
  return prices.length ? Math.min(...prices) : null
}

const priceFrom = (products: StorefrontProduct[]): string => {
  const lowest = lowestPrice(products)
  return lowest === null ? '' : `, priced from ${SITE.currency} ${formatTzs(lowest)}`
}

const countOf = (count: number): string => `${count} ${count === 1 ? 'product' : 'products'}`

export const categorySeo = (group: CatalogueGroup, products: StorefrontProduct[]) => {
  const brands = collectBrands(products).slice(0, 3).map(b => b.label)
  const from = brands.length ? ` from ${joinList(brands)}` : ''

  return {
    title: `${group.label} in Tanzania – Prices & Availability | ${SITE.titleBrand}`,
    heading: `${group.label} in Tanzania`,
    description: `Browse ${group.label} in Tanzania: ${countOf(products.length)}${from}${priceFrom(products)}. Delivery from ${SITE.locality} across Tanzania.`,
    intro: `We stock ${countOf(products.length)} in ${group.label}${from}${priceFrom(products)}. Every item is sold by ${SITE.name} from ${SITE.street}, ${SITE.locality}, with same-day or next-day delivery in the city and 2–5 business days to other regions.`,
  }
}

export const brandSeo = (group: CatalogueGroup, products: StorefrontProduct[]) => {
  const categories = collectCategories(products).slice(0, 3).map(c => c.label)
  const across = categories.length ? ` across ${joinList(categories)}` : ''

  return {
    title: `${group.label} in Tanzania – Original Products & Prices | ${SITE.titleBrand}`,
    heading: `${group.label} products in Tanzania`,
    description: `Buy original ${group.label} products in Tanzania: ${countOf(products.length)}${across}${priceFrom(products)}. Delivery from ${SITE.locality} across Tanzania.`,
    intro: `We stock ${countOf(products.length)} from ${group.label}${across}${priceFrom(products)}. Every item is sold by ${SITE.name} from ${SITE.street}, ${SITE.locality}, with same-day or next-day delivery in the city and 2–5 business days to other regions.`,
  }
}

// ---------------------------------------------------------------------------
// Site-wide structured data
// ---------------------------------------------------------------------------

export interface Crumb {
  name: string
  path: string
}

export const breadcrumbJsonLd = (crumbs: Crumb[], siteUrl: string) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: absoluteUrl(siteUrl, crumb.path),
  })),
})

export const itemListJsonLd = (products: StorefrontProduct[], siteUrl: string) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  numberOfItems: products.length,
  itemListElement: products.map((product, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: productFullName(product),
    url: absoluteUrl(siteUrl, productPath(product)),
  })),
})

export const organizationJsonLd = (siteUrl: string) => ({
  '@context': 'https://schema.org',
  // A shop with a street address as well as an online store, so it is
  // described as both: Store is what local search results draw on.
  '@type': ['Organization', 'Store'],
  '@id': `${absoluteUrl(siteUrl, '/')}#organization`,
  name: SITE.name,
  image: absoluteUrl(siteUrl, SITE.logoPath),
  currenciesAccepted: SITE.currency,
  paymentAccepted: 'Cash, Mobile Money',
  areaServed: { '@type': 'Country', name: 'Tanzania' },
  alternateName: SITE.titleBrand,
  url: absoluteUrl(siteUrl, '/'),
  logo: absoluteUrl(siteUrl, SITE.logoPath),
  email: SITE.email,
  telephone: SITE.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.street,
    addressLocality: SITE.locality,
    addressCountry: SITE.country,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    telephone: SITE.phone,
    email: SITE.email,
    areaServed: SITE.country,
  },
  sameAs: [...SITE.sameAs],
})

export const websiteJsonLd = (siteUrl: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${absoluteUrl(siteUrl, '/')}#website`,
  name: SITE.name,
  alternateName: SITE.titleBrand,
  url: absoluteUrl(siteUrl, '/'),
  inLanguage: 'en',
  publisher: { '@id': `${absoluteUrl(siteUrl, '/')}#organization` },
})

export const faqJsonLd = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
})
