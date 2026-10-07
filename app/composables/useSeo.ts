import type { MaybeRefOrGetter } from 'vue'
import { SITE, absoluteUrl, jsonLdString } from '#shared/utils/seo'

export interface SeoInput {
  title: string
  description: string
  /** Canonical path, without query string. */
  path: string
  /** Absolute image URL for link previews. Falls back to the store logo. */
  image?: string | null
  imageAlt?: string
  type?: 'website' | 'product'
  noindex?: boolean
  jsonLd?: object[]
  /** Extra <meta property> pairs, e.g. product:price:amount. */
  properties?: Record<string, string>
}

export const useSiteUrl = (): string => {
  const { siteUrl } = useRuntimeConfig().public
  return String(siteUrl || SITE.defaultUrl).replace(/\/+$/, '')
}

/**
 * The single place a page declares how it appears to search engines and link
 * previews: title, description, canonical, robots, Open Graph and JSON-LD.
 * Going through one function is what guarantees exactly one canonical per page
 * and Open Graph tags that agree with the title and description.
 */
export const useSeo = (input: MaybeRefOrGetter<SeoInput>) => {
  const siteUrl = useSiteUrl()

  useHead(computed(() => {
    const seo = toValue(input)
    const url = absoluteUrl(siteUrl, seo.path)
    const image = seo.image || absoluteUrl(siteUrl, SITE.logoPath)

    return {
      title: seo.title,
      // A noindex page (a missing product, say) has no canonical to offer.
      link: seo.noindex ? [] : [{ rel: 'canonical', href: url }],
      meta: [
        { name: 'description', content: seo.description },
        { name: 'robots', content: seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large' },
        { property: 'og:type', content: seo.type ?? 'website' },
        { property: 'og:title', content: seo.title },
        { property: 'og:description', content: seo.description },
        { property: 'og:url', content: url },
        { property: 'og:image', content: image },
        { property: 'og:image:alt', content: seo.imageAlt ?? seo.title },
        { name: 'twitter:card', content: seo.image ? 'summary_large_image' : 'summary' },
        { name: 'twitter:title', content: seo.title },
        { name: 'twitter:description', content: seo.description },
        { name: 'twitter:image', content: image },
        ...Object.entries(seo.properties ?? {}).map(([property, content]) => ({ property, content })),
      ],
      script: (seo.jsonLd ?? []).map((data, index) => ({
        key: `ld-${index}`,
        type: 'application/ld+json',
        innerHTML: jsonLdString(data),
      })),
    }
  }))
}
