# E-Commerce Store Frontend

A modern, responsive e-commerce storefront built with Nuxt 3, TailwindCSS, and Pinia.

## Features

- **Product Browsing**: Browse all products with search and filtering capabilities
- **Product Details**: Detailed product pages with images, descriptions, and pricing
- **Shopping Cart**: Add products to cart with quantity management and persistent storage
- **Categories**: Browse products organized by categories
- **WhatsApp Integration**: Quick order functionality via WhatsApp
- **Responsive Design**: Fully responsive layout optimized for mobile, tablet, and desktop

## Tech Stack

- **Nuxt 3**: Vue.js framework with SSR support
- **TailwindCSS**: Utility-first CSS framework for styling
- **Pinia**: State management for shopping cart
- **Vue 3 Composition API**: Modern Vue.js development

## Project Structure

```
ecommerce-store-front/
├── assets/
│   └── css/
│       └── main.css                 # TailwindCSS configuration
├── components/
│   └── product/
│       └── ProductCard.vue          # Reusable product card component
├── composables/
│   ├── useApi.ts                    # API wrapper utilities
│   └── useProducts.ts               # Product fetching functions
├── layouts/
│   └── default.vue                  # Main layout with header/footer
├── pages/
│   ├── index.vue                    # Homepage with featured products
│   ├── about.vue                    # About page
│   ├── categories.vue               # Categories listing page
│   ├── cart.vue                     # Shopping cart page
│   └── products/
│       ├── index.vue                # All products listing with filters
│       └── [id].vue                 # Product detail page
├── stores/
│   └── cart.ts                      # Shopping cart Pinia store
└── nuxt.config.ts                   # Nuxt configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure API endpoint:
Update the `API_BASE_URL` in `.env` file:
```env
API_BASE_URL=http://localhost:8080
```

3. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## Configuration

### API Configuration

The API base URL is configured in `nuxt.config.ts`:

```typescript
runtimeConfig: {
  public: {
    apiBase: process.env.API_BASE_URL || 'http://localhost:3000'
  }
}
```

Update the `API_BASE_URL` environment variable to point to your backend server.

### WhatsApp Integration

WhatsApp order functionality uses the phone number `+255 676 107 301`. To change this:

1. Update the phone number in:
   - `pages/products/[id].vue` (shareOnWhatsApp and copyWhatsAppLink functions)
   - `layouts/default.vue` (footer contact info)

## Key Features

### Shopping Cart

- Add/remove products
- Update quantities
- Persistent cart storage using localStorage
- Real-time cart total calculation
- Cart badge showing item count in header

### Product Management

- Product listing with search
- Filter by category and condition
- Product detail pages with:
  - Large product images
  - Detailed descriptions
  - Condition badges (New/Used)
  - WhatsApp quick order
  - Related products

### WhatsApp Orders

Users can:
- Click "Order via WhatsApp" to open WhatsApp with pre-filled order message
- Copy WhatsApp order link to share elsewhere

Format: `https://wa.me/255676107301?text=ORDER:${productId}`

## Pages

### Homepage (`/`)
- Hero banner
- Featured products (first 8 products)
- Categories section
- Features section (delivery, payment, quality)

### Products (`/products`)
- All products grid
- Search functionality
- Category filter
- Condition filter (New/Used)
- Real-time results count

### Product Detail (`/products/:id`)
- Large product image
- Product details and description
- Quantity selector
- Add to cart
- WhatsApp quick order
- Related products

### Cart (`/cart`)
- Cart items list with images
- Quantity controls
- Remove items
- Order summary
- Proceed to checkout button
- Clear cart functionality

### Categories (`/categories`)
- All categories grid
- Product count per category
- Category icons and descriptions
- Links to filtered product listings

### About (`/about`)
- Company story
- Core values
- Why choose us
- Contact call-to-action

## SEO

Every product, category and brand page is SEO-ready automatically; nothing is configured per product.

- **One source of truth:** `shared/utils/seo.ts` derives titles, meta descriptions, image alt text, canonical paths and JSON-LD from the catalogue record. Pages, the sitemap and the audit all call it.
- **Head tags:** pages call `useSeo()` (`app/composables/useSeo.ts`), which emits the title, description, canonical, robots, Open Graph and structured data together.
- **Routes:** `/products/:id`, `/categories/:slug`, `/brands/:slug`. Categories and brands are derived from the products, so a new one appears as soon as a product uses it.
- **`/sitemap.xml` and `/robots.txt`** are generated (`server/routes/`). The sitemap lists exactly what the catalogue API returns plus the static pages; cart, checkout, account and admin are excluded and disallowed.
- **Status codes:** a missing product, category or brand answers 404; a catalogue API outage answers 503 so live pages are not reported as gone.
- **SEO report:** `/admin/seo` renders every product page and checks it (status, canonical, title, description, H1, Product schema, price, availability, image, Open Graph, sitemap, internal links) and lists catalogue gaps such as missing images or descriptions.

### Environment

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Public origin used in canonicals, Open Graph and the sitemap. Default `https://store.mwendavano.com`. |
| `NUXT_SEO_AUDIT_TOKEN` | Secret required by `/admin/seo`. The report is disabled in production until this is set. |
| `NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console "HTML tag" verification code. |

### Optional catalogue fields

If `GET /items/storefront` starts returning `seoTitle`, `metaDescription`, `shortDescription`, `model` or `updatedAt`, the storefront uses them (overriding the generated title/description, and adding `lastmod` to the sitemap). Until then the generated defaults apply.

### After deploying

1. Verify the property in Google Search Console (DNS record, or set `NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION`).
2. Submit `https://store.mwendavano.com/sitemap.xml`.
3. Inspect a few product URLs and request indexing for the priority ones.
4. Watch the Pages and Product snippets reports, and re-run `/admin/seo` after catalogue changes.

## State Management

### Cart Store (Pinia)

```typescript
// Add to cart
cartStore.addToCart(product, quantity)

// Update quantity
cartStore.updateQuantity(itemId, newQuantity)

// Remove from cart
cartStore.removeFromCart(itemId)

// Clear cart
cartStore.clearCart()

// Get cart info
cartStore.totalItems  // Total item count
cartStore.totalPrice  // Total cart value
```

## API Integration

The app expects the following API endpoints:

- `GET /items/list` - Get all products
- `GET /common/type/ITEM_CATEGORY` - Get all categories

### Product Data Structure

```typescript
{
  id: number
  name: string
  code?: string
  desc?: string
  sellingPrice: number
  imageUrl?: string
  condition: 'new' | 'used'
  category?: {
    id: number
    code: string
    description: string
  }
}
```

## Styling

The app uses TailwindCSS with custom component classes defined in `assets/css/main.css`:

- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.card` - Card container
- `.input-field` - Form input styling

## Future Enhancements

- [ ] User authentication and accounts
- [ ] Checkout flow with payment integration (M-Pesa)
- [ ] Order history and tracking
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Multiple images per product
- [ ] Image zoom on product detail page
- [ ] Product comparison feature

## License

Private project for ShopStore

## Contact

For support or inquiries:
- Email: info@shopstore.com
- Phone: +255 676 107 301
- WhatsApp: +255 676 107 301
