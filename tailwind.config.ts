import type { Config } from 'tailwindcss'

/**
 * Design tokens. A light, neutral store: white surfaces on a cool grey canvas,
 * near-black text and actions. `gray` is that neutral scale and `yellow` is
 * the brand gold, kept as an accent (the crown, the active tab, highlights)
 * rather than a fill — use yellow-700 where gold text is needed, it clears AA.
 */
export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        // Page titles are set in a soft serif; everything else in the sans.
        serif: ['"Fraunces Variable"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"DM Sans Variable"', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        canvas: '#F8F9FC',
        gray: {
          50: '#F7F8FA',
          100: '#EFF0F3',
          200: '#E2E4E9',
          300: '#CBCED6',
          400: '#9498A3',
          500: '#6B6F7B',
          600: '#4F5360',
          700: '#383B46',
          800: '#2F3137',
          900: '#110F15',
          950: '#07080B',
        },
        yellow: {
          50: '#FEF9E8',
          100: '#FDF1C4',
          200: '#FAE28A',
          300: '#F6CF4A',
          400: '#F2B705',
          500: '#DDA504',
          600: '#B78300',
          700: '#8A6400',
          800: '#6E5005',
          900: '#4D3803',
        },
      },
      borderRadius: {
        card: '12px',
        tile: '12px',
      },
      boxShadow: {
        // Faint: enough to lift a white card off the canvas without competing
        // with the product photo.
        card: '0 1px 2px rgba(14, 16, 22, 0.04)',
        lift: '0 2px 4px rgba(14, 16, 22, 0.04), 0 10px 24px rgba(14, 16, 22, 0.08)',
        nav: '0 -4px 24px rgba(14, 16, 22, 0.08)',
      },
    },
  },
}
