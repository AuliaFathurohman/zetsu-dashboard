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
import { formatDistanceToNow } from 'date-fns'
import { RefreshCw, Chrome, Edit, X } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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

interface Page {
  id: string
  url: string
  browserId: string
  status: string
  tag: string | null
  lastRunning: string | null
  attempts: number
}

export default function BrowsersPage() {
  const [browsers, setBrowsers] = useState<Browser[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  
  // Selection state for pages
  const [selectedPageIds, setSelectedPageIds] = useState<Set<string>>(new Set())
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Update form state
  const [updateData, setUpdateData] = useState({
    url: '',
    browserId: '',
    status: '',
    tag: '',
    attempts: ''
  })
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

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

  // Get all pages from all browsers
  const allPages = browsers.flatMap(browser => 
    browser.pages.map(page => ({
      ...page,
      browserId: browser.id,
      browserPort: browser.port,
      nodeName: browser.node.name
    }))
  )

  // Pagination logic
  const totalPages = Math.ceil(allPages.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPages = allPages.slice(startIndex, endIndex)

  // Selection handlers for pages
  const handleSelectAllPages = (checked: boolean) => {
    if (checked) {
      setSelectedPageIds(new Set(allPages.map(p => p.id)))
    } else {
      setSelectedPageIds(new Set())
    }
  }

  const handleSelectPage = (pageId: string, checked: boolean) => {
    const newSelection = new Set(selectedPageIds)
    if (checked) {
      newSelection.add(pageId)
    } else {
      newSelection.delete(pageId)
    }
    setSelectedPageIds(newSelection)
  }

  // Bulk update handler for pages
  const handleBulkUpdatePages = async () => {
    if (selectedPageIds.size === 0) {
      alert('⚠️ Please select at least one page!')
      return
    }

    // Build update payload with only non-empty fields
    const payload: any = {}
    if (updateData.url) payload.url = updateData.url
    if (updateData.browserId) payload.browserId = updateData.browserId
    if (updateData.status) payload.status = updateData.status
    if (updateData.tag) payload.tag = updateData.tag
    if (updateData.attempts) payload.attempts = parseInt(updateData.attempts)

    if (Object.keys(payload).length === 0) {
      alert('⚠️ Please fill at least one field to update!')
      return
    }

    setIsUpdating(true)

    try {
      const updatePromises = Array.from(selectedPageIds).map(pageId =>
        fetch(`http://localhost:3001/pages/${pageId}`, {
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
        alert(`✅ ${successCount} page(s) updated successfully!${failCount > 0 ? ` (${failCount} failed)` : ''}`)
        
        // Reset selection and form
        setSelectedPageIds(new Set())
        setUpdateData({ url: '', browserId: '', status: '', tag: '', attempts: '' })
        
        // Refresh browsers
        fetchBrowsers()
      } else {
        alert('❌ Failed to update pages')
      }
    } catch (error) {
      console.error('Error updating pages:', error)
      alert('❌ Failed to update pages')
    } finally {
      setIsUpdating(false)
    }
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
        <Card className="border-white dark:border-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white dark:text-white">
              Total Browsers
            </CardTitle>
            <Chrome className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{total}</div>
          </CardContent>
        </Card>
        <Card className="border-white dark:border-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white dark:text-white">
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
        <Card className="border-white dark:border-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white dark:text-white">
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

      <Card className="border-white dark:border-white">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">All Browsers</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
          ) : browsers.length === 0 ? (
            <div className="text-center py-10 text-white dark:text-white">
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

      {/* Bulk Update Panel for Pages */}
      {selectedPageIds.size > 0 && (
        <Card className="border-2 border-white dark:border-white bg-blue-50 dark:bg-blue-900/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white dark:text-white flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Bulk Update Pages ({selectedPageIds.size} selected)
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedPageIds(new Set())}
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
                    <SelectValue placeholder="No change" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-900 border-white dark:border-white">
                    <SelectItem value="IDLE" className="text-white dark:text-white hover:bg-blue-600">IDLE</SelectItem>
                    <SelectItem value="RUNNING" className="text-white dark:text-white hover:bg-blue-600">RUNNING</SelectItem>
                    <SelectItem value="ERROR" className="text-white dark:text-white hover:bg-blue-600">ERROR</SelectItem>
                    <SelectItem value="PAUSE" className="text-white dark:text-white hover:bg-blue-600">PAUSE</SelectItem>
                    <SelectItem value="CAPTCHA" className="text-white dark:text-white hover:bg-blue-600">CAPTCHA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* URL Update */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white dark:text-white">
                  URL
                </label>
                <Input
                  placeholder="No change"
                  value={updateData.url}
                  onChange={(e) => setUpdateData({...updateData, url: e.target.value})}
                  className="border-white dark:border-white text-white dark:text-white"
                />
              </div>

              {/* Tag Update */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white dark:text-white">
                  Tag
                </label>
                <Input
                  placeholder="No change"
                  value={updateData.tag}
                  onChange={(e) => setUpdateData({...updateData, tag: e.target.value})}
                  className="border-white dark:border-white text-white dark:text-white"
                />
              </div>

              {/* Browser ID Update */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white dark:text-white">
                  Browser ID
                </label>
                <Input
                  placeholder="No change"
                  value={updateData.browserId}
                  onChange={(e) => setUpdateData({...updateData, browserId: e.target.value})}
                  className="border-white dark:border-white text-white dark:text-white"
                />
              </div>

              {/* Attempts Update */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white dark:text-white">
                  Attempts
                </label>
                <Input
                  type="number"
                  placeholder="No change"
                  value={updateData.attempts}
                  onChange={(e) => setUpdateData({...updateData, attempts: e.target.value})}
                  className="border-white dark:border-white text-white dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedPageIds(new Set())
                  setUpdateData({ url: '', browserId: '', status: '', tag: '', attempts: '' })
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBulkUpdatePages}
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
                    Update {selectedPageIds.size} Page(s)
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pages Table */}
      <Card className="border-white dark:border-white">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">All Pages</CardTitle>
          <CardDescription className="text-white dark:text-white">
            Showing {startIndex + 1}-{Math.min(endIndex, allPages.length)} of {allPages.length} pages across {browsers.length} browsers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
          ) : allPages.length === 0 ? (
            <div className="text-center py-10 text-white dark:text-white">
              <p>No pages available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px] text-white dark:text-white">
                      <Checkbox
                        checked={selectedPageIds.size === allPages.length && allPages.length > 0}
                        onCheckedChange={handleSelectAllPages}
                      />
                    </TableHead>
                    <TableHead className="text-white dark:text-white">ID</TableHead>
                    <TableHead className="text-white dark:text-white">URL</TableHead>
                    <TableHead className="text-white dark:text-white">Browser</TableHead>
                    <TableHead className="text-white dark:text-white">Node</TableHead>
                    <TableHead className="text-white dark:text-white">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPages.map((page: any) => (
                    <TableRow key={page.id}>
                      <TableCell className="text-white dark:text-white">
                        <Checkbox
                          checked={selectedPageIds.has(page.id)}
                          onCheckedChange={(checked) => handleSelectPage(page.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs text-gray-900 dark:text-white">
                        {page.id.substring(0, 8)}
                      </TableCell>
                      <TableCell className="text-xs text-gray-900 dark:text-white max-w-xs truncate">
                        {page.url}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-gray-900 dark:text-white">
                        Port {page.browserPort}
                      </TableCell>
                      <TableCell className="text-xs text-gray-900 dark:text-white">
                        {page.nodeName}
                      </TableCell>
                      <TableCell>{getStatusBadge(page.status)}</TableCell>
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

