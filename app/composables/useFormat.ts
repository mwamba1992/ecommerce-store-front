import { formatTzs, imageSize, resolveImage, type ImagePreset } from '#shared/utils/seo'

/**
 * Shared display helpers. These were previously copy-pasted into every page
 * that showed a price or a product image — seven and five copies respectively,
 * which is how four slightly different Cloudinary transforms ended up in use.
 * The implementations live in shared/utils/seo.ts so the server-side sitemap
 * and structured data resolve prices and images exactly as the pages do.
 */
export const useFormat = () => {
  const { baseURL } = useApi()

  /** Renders a TZS amount without decimals, e.g. 350000 -> "350,000". */
  const formatPrice = formatTzs

  /**
   * Resolves a product image URL, asking Cloudinary for an appropriately sized
   * copy when the image is hosted there. Relative paths are served by the API.
   */
  const productImage = (
    imageUrl: string | null | undefined,
    preset: ImagePreset = 'card',
  ): string => resolveImage(imageUrl, preset, baseURL)

  return {
    formatPrice,
    productImage,
    imageSize,
  }
}
