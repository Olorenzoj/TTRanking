export async function safeFetch(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, options)
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`)
    }
    
    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      throw new Error('Invalid response format')
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Fetch to ${url} failed:`, error)
    throw error
  }
}