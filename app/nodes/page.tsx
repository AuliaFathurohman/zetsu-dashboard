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
import { RefreshCw, Server } from 'lucide-react'

interface Node {
  id: string
  host: string
  name: string
  status: string
  createdAt: string
  updatedAt: string
  _count: {
    browsers: number
  }
}

export default function NodesPage() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNodes = async () => {
    setLoading(true)
    try {
      // COMMENTED: API call to backend
      // const response = await fetch('/api/nodes')
      // const data = await response.json()
      // setNodes(data.nodes)
      
      // TODO: Uncomment when backend is ready
      console.log('Nodes API call commented - waiting for backend setup')
    } catch (error) {
      console.error('Error fetching nodes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNodes()
    // Auto-refresh commented for now
    // const interval = setInterval(fetchNodes, 15000)
    // return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status: string) => {
    return (
      <Badge
        className={status === 'UP' ? 'bg-green-500' : 'bg-red-500'}
      >
        {status}
      </Badge>
    )
  }

  const upNodes = nodes.filter((n) => n.status === 'UP').length
  const downNodes = nodes.filter((n) => n.status === 'DOWN').length
  const totalBrowsers = nodes.reduce((acc, n) => acc + n._count.browsers, 0)

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Node Management</h2>
        <Button onClick={fetchNodes} size="icon" variant="outline">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Nodes</CardTitle>
            <Server className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{nodes.length}</div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Nodes Up</CardTitle>
            <Server className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{upNodes}</div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Nodes Down</CardTitle>
            <Server className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{downNodes}</div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Browsers</CardTitle>
            <Server className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalBrowsers}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">All Nodes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
          ) : nodes.length === 0 ? (
            <div className="text-center py-10 text-gray-600 dark:text-gray-400">
              <p>No nodes available</p>
              <p className="text-sm mt-2">Backend connection pending...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Host</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Browsers</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nodes.map((node) => (
                    <TableRow key={node.id}>
                      <TableCell className="font-mono text-xs">
                        {node.id.substring(0, 8)}
                      </TableCell>
                      <TableCell className="font-medium">{node.name}</TableCell>
                      <TableCell className="font-mono">{node.host}</TableCell>
                      <TableCell>{getStatusBadge(node.status)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {node._count.browsers}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(node.createdAt), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(node.updatedAt), {
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

