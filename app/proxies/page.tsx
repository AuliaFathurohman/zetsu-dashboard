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
import { RefreshCw, Shield } from 'lucide-react'

interface Proxy {
  id: string
  host: string
  port: number
  username: string
  password: string
  status: string
  createdAt: string
  updatedAt: string
  _count: {
    browser: number
    account: number
  }
}

export default function ProxiesPage() {
  const [proxies, setProxies] = useState<Proxy[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProxies = async () => {
    setLoading(true)
    try {
      // COMMENTED: API call to backend
      // const response = await fetch('/api/proxies')
      // const data = await response.json()
      // setProxies(data.proxies)
      
      // TODO: Uncomment when backend is ready
      console.log('Proxies API call commented - waiting for backend setup')
    } catch (error) {
      console.error('Error fetching proxies:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProxies()
    // Auto-refresh commented for now
    // const interval = setInterval(fetchProxies, 15000)
    // return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      IDLE: 'bg-gray-500',
      RUNNING: 'bg-green-500',
      BLOCKED: 'bg-red-500',
      PAUSE: 'bg-yellow-500',
    }

    return (
      <Badge className={colors[status] || 'bg-gray-500'}>
        {status}
      </Badge>
    )
  }

  const activeProxies = proxies.filter((p) => p.status === 'RUNNING').length
  const blockedProxies = proxies.filter((p) => p.status === 'BLOCKED').length

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Proxy Management</h2>
        <Button onClick={fetchProxies} size="icon" variant="outline">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Proxies</CardTitle>
            <Shield className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{proxies.length}</div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{activeProxies}</div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Blocked</CardTitle>
            <Shield className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{blockedProxies}</div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Idle</CardTitle>
            <Shield className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {proxies.length - activeProxies - blockedProxies}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">All Proxies</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
          ) : proxies.length === 0 ? (
            <div className="text-center py-10 text-gray-600 dark:text-gray-400">
              <p>No proxies available</p>
              <p className="text-sm mt-2">Backend connection pending...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Host</TableHead>
                    <TableHead>Port</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Browsers</TableHead>
                    <TableHead>Accounts</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proxies.map((proxy) => (
                    <TableRow key={proxy.id}>
                      <TableCell className="font-mono text-xs">
                        {proxy.id.substring(0, 8)}
                      </TableCell>
                      <TableCell className="font-mono">{proxy.host}</TableCell>
                      <TableCell className="font-mono">{proxy.port}</TableCell>
                      <TableCell>{proxy.username}</TableCell>
                      <TableCell>{getStatusBadge(proxy.status)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {proxy._count.browser}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {proxy._count.account}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(proxy.updatedAt), {
                          addSuffix: true,
                        })}
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

