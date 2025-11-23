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
import { formatDistanceToNow } from 'date-fns'
import { RefreshCw, Chrome } from 'lucide-react'

interface Browser {
  id: string
  port: number
  active: boolean
  nodeId: string
  accountId: string | null
  country: string | null
  status: string
  lastRunning: string | null
  attempts: number
  createdAt: string
  updatedAt: string
  node: {
    name: string
    host: string
    status: string
  }
  proxy: {
    host: string
    port: number
    status: string
  } | null
  account: {
    username: string
    status: string
  } | null
  pages: Array<{
    id: string
    url: string
    status: string
  }>
}

export default function BrowsersPage() {
  const [browsers, setBrowsers] = useState<Browser[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const fetchBrowsers = async () => {
    setLoading(true)
    try {
      // COMMENTED: API call to backend
      // const response = await fetch('/api/browsers?limit=100')
      // const data = await response.json()
      // setBrowsers(data.browsers)
      // setTotal(data.total)
      
      // TODO: Uncomment when backend is ready
      console.log('Browsers API call commented - waiting for backend setup')
    } catch (error) {
      console.error('Error fetching browsers:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBrowsers()
    // Auto-refresh commented for now
    // const interval = setInterval(fetchBrowsers, 10000)
    // return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      IDLE: 'bg-gray-500',
      RUNNING: 'bg-green-500',
      ERROR: 'bg-red-500',
      PAUSE: 'bg-yellow-500',
      CAPTCHA: 'bg-orange-500',
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
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Browser Management
        </h2>
        <Button onClick={fetchBrowsers} size="icon" variant="outline">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Browsers
            </CardTitle>
            <Chrome className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{total}</div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Active Browsers
            </CardTitle>
            <Chrome className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {browsers.filter((b) => b.active).length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Running Browsers
            </CardTitle>
            <Chrome className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {browsers.filter((b) => b.status === 'RUNNING').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">All Browsers</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
          ) : browsers.length === 0 ? (
            <div className="text-center py-10 text-gray-600 dark:text-gray-400">
              <p>No browsers available</p>
              <p className="text-sm mt-2">Backend connection pending...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Port</TableHead>
                    <TableHead>Node</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Proxy</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Pages</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead>Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {browsers.map((browser) => (
                    <TableRow key={browser.id}>
                      <TableCell className="font-mono text-xs">
                        {browser.id.substring(0, 8)}
                      </TableCell>
                      <TableCell className="font-mono">{browser.port}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium">
                            {browser.node.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {browser.node.host}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {browser.country?.toUpperCase() || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={browser.active ? 'default' : 'secondary'}
                          className={
                            browser.active ? 'bg-green-500' : 'bg-gray-500'
                          }
                        >
                          {browser.active ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(browser.status)}</TableCell>
                      <TableCell>
                        {browser.proxy ? (
                          <div className="flex flex-col">
                            <span className="text-xs font-mono">
                              {browser.proxy.host}:{browser.proxy.port}
                            </span>
                            <Badge
                              variant="outline"
                              className="w-fit text-xs mt-1"
                            >
                              {browser.proxy.status}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No proxy
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {browser.account ? (
                          <div className="flex flex-col">
                            <span className="text-xs">
                              {browser.account.username}
                            </span>
                            <Badge
                              variant="outline"
                              className="w-fit text-xs mt-1"
                            >
                              {browser.account.status}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No account
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{browser.pages.length}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{browser.attempts}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {browser.lastRunning
                          ? formatDistanceToNow(new Date(browser.lastRunning), {
                              addSuffix: true,
                            })
                          : 'Never'}
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

