// API Client untuk hit backend zetsu-debug
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

export async function fetchFromBackend<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BACKEND_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error)
    throw error
  }
}

export const apiClient = {
  // Nodes
  getNodes: () => fetchFromBackend<{ nodes: any[] }>('/nodes'),
  
  // Workers  
  getWorkers: () => fetchFromBackend<any>('/workers'),

  // Browsers - we'll need to query database through a custom endpoint
  getBrowsers: () => fetchFromBackend<{ browsers: any[] }>('/api/browsers'),
  
  // Proxies
  getProxies: () => fetchFromBackend<{ proxies: any[] }>('/api/proxies'),
  
  // Accounts
  getAccounts: () => fetchFromBackend<{ accounts: any[] }>('/api/accounts'),
  
  // Tasks
  getTasks: (params?: { limit?: number; offset?: number; status?: string }) => {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    if (params?.status) queryParams.append('status', params.status)
    
    const endpoint = `/api/tasks${queryParams.toString() ? `?${queryParams}` : ''}`
    return fetchFromBackend<{ tasks: any[]; total: number }>(endpoint)
  },
  
  // Stats
  getStats: () => fetchFromBackend<any>('/api/stats'),
  
  // Trends
  getTrends: (days: number = 7) => 
    fetchFromBackend<any[]>(`/api/tasks/trends?days=${days}`),
}

