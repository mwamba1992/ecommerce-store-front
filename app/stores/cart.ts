import { defineStore } from 'pinia'

export interface CartItem {
  id: number
  name: string
  code?: string
  imageUrl?: string
  quantity: number
  price: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },

    totalPrice: (state) => {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },

    cartCount: (state) => state.items.length,
  },

  actions: {
    addToCart(product: any, quantity: number = 1) {
      const existingItem = this.items.find(item => item.id === product.id)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          code: product.code,
          imageUrl: product.imageUrl,
          quantity,
          price: product.sellingPrice || 0,
        })
      }

      this.saveToLocalStorage()
    },

    removeFromCart(productId: number) {
      this.items = this.items.filter(item => item.id !== productId)
      this.saveToLocalStorage()
    },

    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find(item => item.id === productId)
      if (item) {
        item.quantity = quantity
        if (item.quantity <= 0) {
          this.removeFromCart(productId)
        }
        this.saveToLocalStorage()
      }
    },

    clearCart() {
      this.items = []
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      if (process.client) {
        localStorage.setItem('cart', JSON.stringify(this.items))
      }
    },

    loadFromLocalStorage() {
      if (process.client) {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
          this.items = JSON.parse(savedCart)
        }
      }
    },
  },
})
