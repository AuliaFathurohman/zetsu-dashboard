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
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDistanceToNow } from 'date-fns'
import { RefreshCw } from 'lucide-react'

interface Task {
  id: number
  user_id: string | null
  action: string | null
  status: string | null
  created_at: string | null
  updated_at: string | null
  retry_count: number | null
  scrape_time: number | null
  domain: string | null
  browser_type: string | null
  device_os: string | null
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [total, setTotal] = useState(0)

  const fetchTasks = async () => {
    setLoading(true)
    try {
      // COMMENTED: API call to backend
      // const url =
      //   statusFilter === 'all'
      //     ? '/api/tasks?limit=100'
      //     : `/api/tasks?limit=100&status=${statusFilter}`
      // const response = await fetch(url)
      // const data = await response.json()
      // setTasks(data.tasks)
      // setTotal(data.total)
      
      // TODO: Uncomment when backend is ready
      console.log('Tasks API call commented - waiting for backend setup')
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
    // Auto-refresh commented for now
    // const interval = setInterval(fetchTasks, 10000)
    // return () => clearInterval(interval)
  }, [statusFilter])

  const getStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="outline">Unknown</Badge>

    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-500 hover:bg-yellow-600',
      PROCESSING: 'bg-blue-500 hover:bg-blue-600',
      COMPLETED: 'bg-green-500 hover:bg-green-600',
      FAILED: 'bg-red-500 hover:bg-red-600',
    }

    return (
      <Badge className={colors[status] || 'bg-gray-500'}>
        {status}
      </Badge>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Tasks Management</h2>
        <div className="flex items-center space-x-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchTasks} size="icon" variant="outline">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            All Tasks ({total.toLocaleString()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
          ) : tasks.length === 0 ? (
            <div className="text-center py-10 text-gray-600 dark:text-gray-400">
              <p>No tasks available</p>
              <p className="text-sm mt-2">Backend connection pending...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Browser</TableHead>
                    <TableHead>OS</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Retry</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-mono text-xs">
                        {task.id}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {task.user_id ? task.user_id.substring(0, 8) : 'N/A'}
                      </TableCell>
                      <TableCell>{task.action || 'N/A'}</TableCell>
                      <TableCell className="text-xs">
                        {task.domain || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {task.browser_type || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {task.device_os || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {task.retry_count !== null ? task.retry_count : 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        {task.scrape_time
                          ? `${task.scrape_time.toFixed(2)}s`
                          : 'N/A'}
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

