export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  const apiFetch = async (url: string, options: any = {}) => {
    const fullUrl = `${baseURL}${url}`
    console.log('🌐 [API] Calling:', fullUrl)
    console.log('📤 [API] Options:', options)
    try {
      const response = await $fetch(fullUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })
      console.log('✅ [API] Response received:', response)
      return response
    } catch (error: any) {
      console.error('❌ [API] Error:', error)
      console.error('❌ [API] URL:', fullUrl)
      console.error('❌ [API] Error details:', error.message, error.statusCode)
      throw error
    }
  }

  return {
    apiFetch,
    baseURL
  }
}
