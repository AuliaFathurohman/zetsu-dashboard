'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'

interface Task {
  id: number
  action: string | null
  status: string | null
  created_at: string | null
  updated_at: string | null
  retry_count: number | null
  scrape_time: number | null
}

export function RecentTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // COMMENTED: API call to backend
        // const response = await fetch('/api/tasks?limit=10')
        // const data = await response.json()
        // setTasks(data.tasks)
        
        // TODO: Uncomment when backend is ready
        console.log('Tasks API call commented - waiting for backend setup')
      } catch (error) {
        console.error('Error fetching tasks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
    // Refresh every 5 seconds (commented for now)
    // const interval = setInterval(fetchTasks, 5000)
    // return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>

    const variants: Record<string, any> = {
      PENDING: 'secondary',
      PROCESSING: 'default',
      COMPLETED: 'default',
      FAILED: 'destructive',
    }

    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-500',
      PROCESSING: 'bg-blue-500',
      COMPLETED: 'bg-green-500',
      FAILED: 'bg-red-500',
    }

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-muted-foreground">
            <p>No tasks available</p>
            <p className="text-sm mt-2">Backend connection pending...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Retry</TableHead>
              <TableHead>Scrape Time</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-mono text-xs">
                  {task.id}
                </TableCell>
                <TableCell>{task.action || 'N/A'}</TableCell>
                <TableCell>{getStatusBadge(task.status)}</TableCell>
                <TableCell>
                  {task.retry_count !== null ? task.retry_count : 0}
                </TableCell>
                <TableCell>
                  {task.scrape_time ? `${task.scrape_time.toFixed(2)}s` : 'N/A'}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {task.created_at
                    ? formatDistanceToNow(new Date(task.created_at), {
                        addSuffix: true,
                      })
                    : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
