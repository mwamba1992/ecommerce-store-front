export const useProducts = () => {
  const { apiFetch } = useApi()

  const getProducts = async (params?: any) => {
    return await apiFetch('/items', { params })
  }

  const getProduct = async (id: number) => {
    return await apiFetch(`/items/${id}`)
  }

  const getProductsByCategory = async (categoryId: number) => {
    return await apiFetch(`/items?categoryId=${categoryId}`)
  }

  const getProductPrice = async (itemId: number) => {
    try {
      const prices = await apiFetch('/items/item-prices')
      return prices.find((price: any) => price.item?.id === itemId && price.isActive)
    } catch (error) {
      console.error('Error fetching product price:', error)
      return null
    }
  }

  const getProductInventory = async (itemId: number) => {
    try {
      const stocks = await apiFetch('/items/item-stocks')
      return stocks.filter((stock: any) => stock.item?.id === itemId)
    } catch (error) {
      console.error('Error fetching product inventory:', error)
      return []
    }
  }

  const getProductWithDetails = async (id: number) => {
    try {
      const [product, price, inventory] = await Promise.all([
        getProduct(id),
        getProductPrice(id),
        getProductInventory(id)
      ])

      // Calculate total available stock across all warehouses
      const totalStock = inventory.reduce((sum: number, stock: any) => sum + (stock.quantity || 0), 0)

      // Get color distributions from inventory
      const colorDistributions = inventory.flatMap((stock: any) => stock.distributions || [])

      return {
        ...product,
        pricing: price ? {
          purchaseAmount: price.purchaseAmount,
          freightAmount: price.freightAmount,
          profitMargin: price.profitMargin,
          sellingPrice: price.sellingPrice,
          isActive: price.isActive
        } : null,
        inventory: {
          totalStock,
          warehouses: inventory.map((stock: any) => ({
            warehouseId: stock.warehouse?.id,
            warehouseName: stock.warehouse?.name,
            quantity: stock.quantity,
            reorderPoint: stock.reorderPoint
          })),
          colorDistributions
        }
      }
    } catch (error) {
      console.error('Error fetching product with details:', error)
      throw error
    }
  }

  const getProductsWithPricing = async (params?: any) => {
    try {
      const [products, prices, stocks] = await Promise.all([
        apiFetch('/items', { params }),
        apiFetch('/items/item-prices'),
        apiFetch('/items/item-stocks')
      ])

      // Create maps for quick lookup
      const priceMap = new Map()
      prices.forEach((price: any) => {
        if (price.isActive && price.item?.id) {
          priceMap.set(price.item.id, price)
        }
      })

      const stockMap = new Map()
      stocks.forEach((stock: any) => {
        if (stock.item?.id) {
          const itemId = stock.item.id
          if (!stockMap.has(itemId)) {
            stockMap.set(itemId, [])
          }
          stockMap.get(itemId).push(stock)
        }
      })

      // Enrich products with pricing and inventory data
      return products.map((product: any) => {
        const price = priceMap.get(product.id)
        const inventory = stockMap.get(product.id) || []
        const totalStock = inventory.reduce((sum: number, stock: any) => sum + (stock.quantity || 0), 0)

        return {
          ...product,
          sellingPrice: price?.sellingPrice || 0,
          purchaseAmount: price?.purchaseAmount || 0,
          profitMargin: price?.profitMargin || 0,
          totalStock,
          inStock: totalStock > 0,
          warehouses: inventory.map((stock: any) => ({
            warehouseId: stock.warehouse?.id,
            warehouseName: stock.warehouse?.name,
            quantity: stock.quantity
          }))
        }
      })
    } catch (error) {
      console.error('Error fetching products with pricing:', error)
      throw error
    }
  }

  return {
    getProducts,
    getProduct,
    getProductsByCategory,
    getProductPrice,
    getProductInventory,
    getProductWithDetails,
    getProductsWithPricing
  }
}
