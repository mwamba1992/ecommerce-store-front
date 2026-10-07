import { PRIVATE_PATHS } from '#shared/utils/seo'

// Generated rather than a static file so the private-area list and the sitemap
// URL come from the same source as the pages. Nothing under /products,
// /categories or /brands is ever disallowed; the Allow lines make that explicit.
// /_nuxt/ holds the CSS and JavaScript Google needs to render a page.
export default defineEventHandler((event) => {
  const lines = [
    'User-agent: *',
    'Allow: /',
    'Allow: /products/',
    'Allow: /categories/',
    'Allow: /brands/',
    'Allow: /_nuxt/',
    ...PRIVATE_PATHS.map(path => `Disallow: ${path}`),
    '',
    `Sitemap: ${getSiteUrl(event)}/sitemap.xml`,
    '',
  ]

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return lines.join('\n')
})
