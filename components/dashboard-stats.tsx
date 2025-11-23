'use client'

import { useEffect, useState } from 'react'
import { StatCard } from './stat-card'
import {
  Activity,
  CheckCircle2,
  Clock,
  XCircle,
  Chrome,
  Server,
  Shield,
  Users,
} from 'lucide-react'
import type { DashboardStats } from '@/lib/types'

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // COMMENTED: API call to backend
        // const response = await fetch('/api/stats')
        // const data = await response.json()
        // setStats(data)
        
        // TODO: Uncomment when backend is ready
        console.log('Stats API call commented - waiting for backend setup')
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    // Refresh every 10 seconds (commented for now)
    // const interval = setInterval(fetchStats, 10000)
    // return () => clearInterval(interval)
  }, [])

  if (loading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"
          />
        ))}
      </div>
    )
  }

  const completionRate = stats.totalTasks
    ? ((stats.completedTasks / stats.totalTasks) * 100).toFixed(1)
    : '0'

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Tasks"
        value={stats.totalTasks.toLocaleString()}
        description={`${completionRate}% completion rate`}
        icon={Activity}
        iconColor="text-blue-500"
      />
      <StatCard
        title="Completed Tasks"
        value={stats.completedTasks.toLocaleString()}
        description={`${stats.processingTasks} processing`}
        icon={CheckCircle2}
        iconColor="text-green-500"
      />
      <StatCard
        title="Failed Tasks"
        value={stats.failedTasks.toLocaleString()}
        description={`${stats.pendingTasks} pending`}
        icon={XCircle}
        iconColor="text-red-500"
      />
      <StatCard
        title="Pending Tasks"
        value={stats.pendingTasks.toLocaleString()}
        description="Waiting in queue"
        icon={Clock}
        iconColor="text-yellow-500"
      />
      <StatCard
        title="Active Browsers"
        value={`${stats.activeBrowsers}/${stats.totalBrowsers}`}
        description="Browser instances"
        icon={Chrome}
        iconColor="text-purple-500"
      />
      <StatCard
        title="Active Proxies"
        value={`${stats.activeProxies}/${stats.totalProxies}`}
        description="Proxy connections"
        icon={Shield}
        iconColor="text-cyan-500"
      />
      <StatCard
        title="Active Accounts"
        value={`${stats.activeAccounts}/${stats.totalAccounts}`}
        description={`${stats.blockedAccounts} blocked`}
        icon={Users}
        iconColor="text-orange-500"
      />
      <StatCard
        title="Active Nodes"
        value={`${stats.upNodes}/${stats.totalNodes}`}
        description={`${stats.downNodes} down`}
        icon={Server}
        iconColor="text-pink-500"
      />
    </div>
  )
}
