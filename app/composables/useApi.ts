export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  const apiFetch = async (url: string, options: any = {}) => {
    const fullUrl = `${baseURL}${url}`

    // Dev-only: these calls now also run during server-side rendering, where
    // logging every response would dump the whole catalogue into the server log
    // on each page view.
    if (import.meta.dev) {
      console.log('🌐 [API] Calling:', fullUrl)
    }

    try {
      return await $fetch(fullUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })
    } catch (error: any) {
      console.error('❌ [API] Error:', fullUrl, error.statusCode, error.message)
      throw error
    }
  }

  return {
    apiFetch,
    baseURL
  }
}
