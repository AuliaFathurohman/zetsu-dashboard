export interface DashboardStats {
  totalTasks: number
  pendingTasks: number
  processingTasks: number
  completedTasks: number
  failedTasks: number
  totalBrowsers: number
  activeBrowsers: number
  totalProxies: number
  activeProxies: number
  totalAccounts: number
  activeAccounts: number
  blockedAccounts: number
  totalNodes: number
  upNodes: number
  downNodes: number
}

export interface TaskTrend {
  date: string
  completed: number
  failed: number
  pending: number
}

export interface CountryStats {
  country: string
  total: number
  completed: number
  failed: number
  pending: number
}

export interface RecentTask {
  id: number
  action: string | null
  status: string | null
  created_at: Date | null
  updated_at: Date | null
  retry_count: number | null
  scrape_time: number | null
}

