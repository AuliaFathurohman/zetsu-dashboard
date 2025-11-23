'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TaskTrend } from '@/lib/types'

export function TaskTrendsChart() {
  const [trends, setTrends] = useState<TaskTrend[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        // COMMENTED: API call to backend
        // const response = await fetch('/api/tasks/trends?days=7')
        // const data = await response.json()
        // setTrends(data)
        
        // TODO: Uncomment when backend is ready
        console.log('Trends API call commented - waiting for backend setup')
      } catch (error) {
        console.error('Error fetching trends:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrends()
    // Refresh every 30 seconds (commented for now)
    // const interval = setInterval(fetchTrends, 30000)
    // return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Trends (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Trends (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#22c55e"
              strokeWidth={2}
              name="Completed"
            />
            <Line
              type="monotone"
              dataKey="failed"
              stroke="#ef4444"
              strokeWidth={2}
              name="Failed"
            />
            <Line
              type="monotone"
              dataKey="pending"
              stroke="#eab308"
              strokeWidth={2}
              name="Pending"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
