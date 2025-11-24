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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDistanceToNow } from 'date-fns'
import { RefreshCw, Server, Edit, X } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

interface Proxy {
  id: string
  host: string
  port: number
  username: string
  password: string
  status: string
  createdAt: string
  updatedAt: string
}

export default function ProxiesPage() {
  const [proxies, setProxies] = useState<Proxy[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [hostFilter, setHostFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
  
  // Selection state
  const [selectedProxyIds, setSelectedProxyIds] = useState<Set<string>>(new Set())
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Update form state
  const [updateData, setUpdateData] = useState({
    status: '',
    host: '',
    port: '',
    username: '',
    password: ''
  })

  const fetchProxies = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/proxies')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setProxies(data.proxies || data)
    } catch (error) {
      console.error('Error fetching proxies:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProxies()
  }, [])

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      IDLE: 'bg-gray-500 text-white',
      ACTIVE: 'bg-green-500 text-white',
      BLOCKED: 'bg-red-500 text-white',
      ERROR: 'bg-red-500 text-white',
    }

    return (
      <Badge className={colors[status] || 'bg-gray-500 text-white'}>
        {status}
      </Badge>
    )
  }

  // Apply filters
  const filteredProxies = proxies.filter((proxy) => {
    // Status filter
    if (statusFilter !== 'all' && proxy.status !== statusFilter) {
      return false
    }
    
    // Host filter
    if (hostFilter !== 'all' && proxy.host !== hostFilter) {
      return false
    }
    
    // Search filter (username, host, or id)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchUsername = proxy.username.toLowerCase().includes(query)
      const matchHost = proxy.host.toLowerCase().includes(query)
      const matchId = proxy.id.toLowerCase().includes(query)
      if (!matchUsername && !matchHost && !matchId) {
        return false
      }
    }
    
    return true
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredProxies.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProxies = filteredProxies.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter, hostFilter, searchQuery])

  const idleProxies = proxies.filter((p) => p.status === 'IDLE').length
  const activeProxies = proxies.filter((p) => p.status === 'ACTIVE').length
  const blockedProxies = proxies.filter((p) => p.status === 'BLOCKED' || p.status === 'ERROR').length

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProxyIds(new Set(filteredProxies.map(p => p.id)))
    } else {
      setSelectedProxyIds(new Set())
    }
  }

  const handleSelectProxy = (proxyId: string, checked: boolean) => {
    const newSelection = new Set(selectedProxyIds)
    if (checked) {
      newSelection.add(proxyId)
    } else {
      newSelection.delete(proxyId)
    }
    setSelectedProxyIds(newSelection)
  }

  // Bulk update handler
  const handleBulkUpdate = async () => {
    if (selectedProxyIds.size === 0) {
      alert('⚠️ Please select at least one proxy!')
      return
    }

    // Build update payload with only non-empty fields
    const payload: any = {}
    if (updateData.status) payload.status = updateData.status
    if (updateData.host) payload.host = updateData.host
    if (updateData.port) payload.port = parseInt(updateData.port)
    if (updateData.username) payload.username = updateData.username
    if (updateData.password) payload.password = updateData.password

    if (Object.keys(payload).length === 0) {
      alert('⚠️ Please fill at least one field to update!')
      return
    }

    setIsUpdating(true)

    try {
      const updatePromises = Array.from(selectedProxyIds).map(proxyId =>
        fetch(`http://localhost:3001/proxies/${proxyId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        })
      )

      const results = await Promise.all(updatePromises)
      
      const successCount = results.filter(r => r.ok).length
      const failCount = results.length - successCount

      if (successCount > 0) {
        alert(`✅ ${successCount} proxy(ies) updated successfully!${failCount > 0 ? ` (${failCount} failed)` : ''}`)
        
        // Reset selection and form
        setSelectedProxyIds(new Set())
        setUpdateData({ status: '', host: '', port: '', username: '', password: '' })
        
        // Refresh proxies
        fetchProxies()
      } else {
        alert('❌ Failed to update proxies')
      }
    } catch (error) {
      console.error('Error updating proxies:', error)
      alert('❌ Failed to update proxies')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Proxy Management</h2>
        <Button onClick={fetchProxies} size="icon" variant="outline">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <Card className="border-white dark:border-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white dark:text-white">Total Proxies</CardTitle>
            <Server className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{proxies.length}</div>
          </CardContent>
        </Card>
        <Card className="border-white dark:border-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white dark:text-white">Idle</CardTitle>
            <Server className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-400">{idleProxies}</div>
          </CardContent>
        </Card>
        <Card className="border-white dark:border-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white dark:text-white">Active</CardTitle>
            <Server className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-500">{activeProxies}</div>
          </CardContent>
        </Card>
        <Card className="border-white dark:border-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white dark:text-white">Blocked</CardTitle>
            <Server className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-500">{blockedProxies}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Update Panel */}
      {selectedProxyIds.size > 0 && (
        <Card className="border-2 border-white dark:border-white bg-blue-50 dark:bg-blue-900/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white dark:text-white flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Bulk Update ({selectedProxyIds.size} selected)
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedProxyIds(new Set())}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Status Update */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white dark:text-white">
                  Status
                </label>
                <Select 
                  value={updateData.status} 
                  onValueChange={(value) => setUpdateData({...updateData, status: value})}
                >
                  <SelectTrigger className="border-white dark:border-white bg-white dark:bg-gray-900 text-white dark:text-white">
                    <SelectValue placeholder="No change" className="text-white dark:text-white" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-900 text-white dark:text-white border-white dark:border-white">
                    <SelectItem value="IDLE" className="text-white dark:text-white hover:bg-blue-600">IDLE</SelectItem>
                    <SelectItem value="ACTIVE" className="text-white dark:text-white hover:bg-blue-600">ACTIVE</SelectItem>
                    <SelectItem value="BLOCKED" className="text-white dark:text-white hover:bg-blue-600">BLOCKED</SelectItem>
                    <SelectItem value="ERROR" className="text-white dark:text-white hover:bg-blue-600">ERROR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Host Update */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white dark:text-white">
                  Host
                </label>
                <Select 
                  value={updateData.host} 
                  onValueChange={(value) => setUpdateData({...updateData, host: value})}
                >
                  <SelectTrigger className="border-white dark:border-white bg-white dark:bg-gray-900 text-white dark:text-white">
                    <SelectValue placeholder="No change" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-900 border-white dark:border-white">
                    <SelectItem value="shopee.co.id" className="text-white dark:text-white hover:bg-blue-600">shopee.co.id</SelectItem>
                    <SelectItem value="shopee.co.th" className="text-white dark:text-white hover:bg-blue-600">shopee.co.th</SelectItem>
                    <SelectItem value="shopee.sg" className="text-white dark:text-white hover:bg-blue-600">shopee.sg</SelectItem>
                    <SelectItem value="shopee.com.my" className="text-white dark:text-white hover:bg-blue-600">shopee.com.my</SelectItem>
                    <SelectItem value="shopee.vn" className="text-white dark:text-white hover:bg-blue-600">shopee.vn</SelectItem>
                    <SelectItem value="shopee.ph" className="text-white dark:text-white hover:bg-blue-600">shopee.ph</SelectItem>
                    <SelectItem value="shopee.tw" className="text-white dark:text-white hover:bg-blue-600">shopee.tw</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Port Update */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white dark:text-white">
                  Port
                </label>
                <Input
                  type="number"
                  placeholder="No change"
                  value={updateData.port}
                  onChange={(e) => setUpdateData({...updateData, port: e.target.value})}
                  className="border-white dark:border-white text-white dark:text-white"
                />
              </div>

              {/* Username Update */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white dark:text-white">
                  Username
                </label>
                <Input
                  placeholder="No change"
                  value={updateData.username}
                  onChange={(e) => setUpdateData({...updateData, username: e.target.value})}
                  className="border-white dark:border-white text-white dark:text-white"
                />
              </div>

              {/* Password Update */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white dark:text-white">
                  Password
                </label>
                <Input
                  placeholder="No change"
                  value={updateData.password}
                  onChange={(e) => setUpdateData({...updateData, password: e.target.value})}
                  className="border-white dark:border-white text-white dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                className="bg-white dark:bg-gray-900 text-white dark:text-white"
                variant="outline"
                onClick={() => {
                  setSelectedProxyIds(new Set())
                  setUpdateData({ status: '', host: '', port: '', username: '', password: '' })
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBulkUpdate}
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isUpdating ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Update {selectedProxyIds.size} Proxy(ies)
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-white dark:border-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">All Proxies</CardTitle>
            <div className="flex items-center gap-2">
              {/* Search */}
              <Input
                placeholder="Search username, host, or ID..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="w-[250px] border-white dark:border-white text-gray-900 dark:text-white"
              />
              
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] border-white dark:border-white bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border-white dark:border-white">
                  <SelectItem value="all" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">All Status</SelectItem>
                  <SelectItem value="IDLE" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">Idle</SelectItem>
                  <SelectItem value="ACTIVE" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">Active</SelectItem>
                  <SelectItem value="BLOCKED" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">Blocked</SelectItem>
                  <SelectItem value="ERROR" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">Error</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Host Filter */}
              <Select value={hostFilter} onValueChange={setHostFilter}>
                <SelectTrigger className="w-[150px] border-white dark:border-white bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Host" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border-white dark:border-white">
                  <SelectItem value="all" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">All Hosts</SelectItem>
                  <SelectItem value="shopee.co.id" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">shopee.co.id</SelectItem>
                  <SelectItem value="shopee.co.th" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">shopee.co.th</SelectItem>
                  <SelectItem value="shopee.sg" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">shopee.sg</SelectItem>
                  <SelectItem value="shopee.com.my" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">shopee.com.my</SelectItem>
                  <SelectItem value="shopee.vn" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">shopee.vn</SelectItem>
                  <SelectItem value="shopee.ph" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">shopee.ph</SelectItem>
                  <SelectItem value="shopee.tw" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">shopee.tw</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-sm text-white dark:text-white mt-2">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredProxies.length)} of {filteredProxies.length} proxies (Total: {proxies.length})
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
          ) : proxies.length === 0 ? (
            <div className="text-center py-10 text-white dark:text-white">
              <p>No proxies available</p>
              <p className="text-sm mt-2">Backend connection pending...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px] text-white dark:text-white">
                      <Checkbox
                        checked={selectedProxyIds.size === filteredProxies.length && filteredProxies.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="text-white dark:text-white">ID</TableHead>
                    <TableHead className="text-white dark:text-white">Host</TableHead>
                    <TableHead className="text-white dark:text-white">Port</TableHead>
                    <TableHead className="text-white dark:text-white">Username</TableHead>
                    <TableHead className="text-white dark:text-white">Password</TableHead>
                    <TableHead className="text-white dark:text-white">Status</TableHead>
                    <TableHead className="text-white dark:text-white">Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProxies.map((proxy) => (
                    <TableRow key={proxy.id}>
                      <TableCell className="text-white dark:text-white">
                        <Checkbox
                          checked={selectedProxyIds.has(proxy.id)}
                          onCheckedChange={(checked) => handleSelectProxy(proxy.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs text-gray-900 dark:text-white">
                        {proxy.id}
                      </TableCell>
                      <TableCell className="text-xs text-gray-900 dark:text-white">{proxy.host}</TableCell>
                      <TableCell className="font-mono text-xs text-gray-900 dark:text-white">
                        {proxy.port}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900 dark:text-white">
                        {proxy.username}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-gray-900 dark:text-white">
                        {proxy.password}
                      </TableCell>
                      <TableCell>{getStatusBadge(proxy.status)}</TableCell>
                      <TableCell className="text-xs text-white dark:text-white">
                        {formatDistanceToNow(new Date(proxy.updatedAt), {
                          addSuffix: true,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-white dark:text-white">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={currentPage === pageNum ? "bg-blue-600 text-white" : ""}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
