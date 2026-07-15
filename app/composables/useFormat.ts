/**
 * Shared display helpers. These were previously copy-pasted into every page
 * that showed a price or a product image — seven and five copies respectively,
 * which is how four slightly different Cloudinary transforms ended up in use.
 */

// Named presets rather than raw transform strings at each call site, so image
// sizing is a decision made once, here.
const IMAGE_PRESETS = {
  thumb: 'f_auto,q_auto,w_200,h_200,c_pad,b_white',
  small: 'f_auto,q_auto,w_300,h_300,c_fit',
  card: 'f_auto,q_auto,w_800,h_800,c_pad,b_white',
  detail: 'f_auto,q_auto,w_1200,h_1200,c_fit',
} as const

export type ImagePreset = keyof typeof IMAGE_PRESETS

export const useFormat = () => {
  const { baseURL } = useApi()

  /** Renders a TZS amount without decimals, e.g. 350000 -> "350,000". */
  const formatPrice = (price: number | string | null | undefined): string => {
    return Number(price || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })
  }

  /**
   * Resolves a product image URL, asking Cloudinary for an appropriately sized
   * copy when the image is hosted there. Relative paths are served by the API.
   */
  const productImage = (
    imageUrl: string | null | undefined,
    preset: ImagePreset = 'card',
  ): string => {
    if (!imageUrl) return ''

    if (imageUrl.startsWith('http')) {
      if (imageUrl.includes('cloudinary.com')) {
        return imageUrl.replace('/upload/', `/upload/${IMAGE_PRESETS[preset]}/`)
      }
      return imageUrl
    }

    return `${baseURL}${imageUrl}`
  }

  return {
    formatPrice,
    productImage,
  }
}
