import { defineStore } from 'pinia'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: []
  }),

  getters: {
    isInWishlist: (state) => (productId) => {
      return state.items.some(item => item.id === productId)
    },

    totalItems: (state) => state.items.length,

    getItems: (state) => state.items
  },

  actions: {
    // Add product to wishlist
    addToWishlist(product) {
      // Check if already in wishlist
      if (!this.isInWishlist(product.id)) {
        this.items.push({
          id: product.id,
          name: product.name,
          code: product.code,
          price: product.sellingPrice,
          imageUrl: product.imageUrl,
          inStock: product.inStock,
          condition: product.condition,
          addedAt: new Date().toISOString()
        })

        this.saveToLocalStorage()
      }
    },

    // Remove product from wishlist
    removeFromWishlist(productId) {
      this.items = this.items.filter(item => item.id !== productId)
      this.saveToLocalStorage()
    },

    // Toggle wishlist (add if not exists, remove if exists)
    toggleWishlist(product) {
      if (this.isInWishlist(product.id)) {
        this.removeFromWishlist(product.id)
      } else {
        this.addToWishlist(product)
      }
    },

    // Clear entire wishlist
    clearWishlist() {
      this.items = []
      this.saveToLocalStorage()
    },

    // Save to localStorage
    saveToLocalStorage() {
      if (process.client) {
        localStorage.setItem('wishlist', JSON.stringify(this.items))
      }
    },

    // Load from localStorage
    loadFromLocalStorage() {
      if (process.client) {
        const savedWishlist = localStorage.getItem('wishlist')
        if (savedWishlist) {
          try {
            this.items = JSON.parse(savedWishlist)
          } catch (error) {
            console.error('Error loading wishlist:', error)
            this.items = []
          }
        }
      }
    }
  }
})
