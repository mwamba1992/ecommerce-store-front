import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    customer: null,
    token: null,
    isAuthenticated: false
  }),

  getters: {
    getCustomer: (state) => state.customer,
    getToken: (state) => state.token,
    isLoggedIn: (state) => state.isAuthenticated
  },

  actions: {
    // Initialize auth from localStorage
    initAuth() {
      if (process.client) {
        const token = localStorage.getItem('customerToken')
        const customer = localStorage.getItem('customer')

        if (token && customer) {
          this.token = token
          this.customer = JSON.parse(customer)
          this.isAuthenticated = true
        }
      }
    },

    // Register new customer
    async register(formData) {
      try {
        const response = await $fetch('https://business.mwendavano.com/api/customer-auth/register', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'application/json'
          }
        })

        // Save token and customer data
        this.token = response.access_token
        this.customer = response.customer
        this.isAuthenticated = true

        // Save to localStorage
        if (process.client) {
          localStorage.setItem('customerToken', response.access_token)
          localStorage.setItem('customer', JSON.stringify(response.customer))
        }

        return response
      } catch (error) {
        console.error('Registration error:', error)
        throw error
      }
    },

    // Login customer
    async login(phone, password) {
      try {
        const response = await $fetch('https://business.mwendavano.com/api/customer-auth/login', {
          method: 'POST',
          body: { phone, password },
          headers: {
            'Content-Type': 'application/json'
          }
        })

        // Save token and customer data
        this.token = response.access_token
        this.customer = response.customer
        this.isAuthenticated = true

        // Save to localStorage
        if (process.client) {
          localStorage.setItem('customerToken', response.access_token)
          localStorage.setItem('customer', JSON.stringify(response.customer))
        }

        return response
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },

    // Set password for existing customer (from checkout)
    async setPassword(phone, password) {
      try {
        const response = await $fetch('https://business.mwendavano.com/api/customer-auth/set-password', {
          method: 'POST',
          body: { phone, password },
          headers: {
            'Content-Type': 'application/json'
          }
        })

        return response
      } catch (error) {
        console.error('Set password error:', error)
        throw error
      }
    },

    // Get customer profile
    async getProfile() {
      try {
        const response = await $fetch('https://business.mwendavano.com/api/customer-auth/me', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })

        this.customer = response.customer

        // Update localStorage
        if (process.client) {
          localStorage.setItem('customer', JSON.stringify(response.customer))
        }

        return response
      } catch (error) {
        console.error('Get profile error:', error)
        // If unauthorized, logout
        if (error.response?.status === 401) {
          this.logout()
        }
        throw error
      }
    },

    // Update customer profile
    async updateProfile(data) {
      try {
        const response = await $fetch('https://business.mwendavano.com/api/customer-auth/profile', {
          method: 'PUT',
          body: data,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        })

        this.customer = response.customer

        // Update localStorage
        if (process.client) {
          localStorage.setItem('customer', JSON.stringify(response.customer))
        }

        return response
      } catch (error) {
        console.error('Update profile error:', error)
        throw error
      }
    },

    // Change password
    async changePassword(currentPassword, newPassword) {
      try {
        const response = await $fetch('https://business.mwendavano.com/api/customer-auth/change-password', {
          method: 'POST',
          body: { currentPassword, newPassword },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        })

        return response
      } catch (error) {
        console.error('Change password error:', error)
        throw error
      }
    },

    // Get customer orders
    async getOrders() {
      try {
        const response = await $fetch('https://business.mwendavano.com/api/customer-auth/orders', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })

        return response
      } catch (error) {
        console.error('Get orders error:', error)
        throw error
      }
    },

    // Get order statistics
    async getOrderStats() {
      try {
        const response = await $fetch('https://business.mwendavano.com/api/customer-auth/orders/stats', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })

        return response
      } catch (error) {
        console.error('Get order stats error:', error)
        throw error
      }
    },

    // Logout
    logout() {
      this.customer = null
      this.token = null
      this.isAuthenticated = false

      // Clear localStorage
      if (process.client) {
        localStorage.removeItem('customerToken')
        localStorage.removeItem('customer')
      }
    }
  }
})
