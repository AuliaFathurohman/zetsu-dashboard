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
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDistanceToNow } from 'date-fns'
import { RefreshCw, Users, Upload, FileText, Edit, X } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

interface Account {
  id: string
  username: string
  password: string
  host: string
  status: string
  proxyId: string | null
  attempts: number
  country: string | null
  createdAt: string
  updatedAt: string
  blockedAt: string | null
  pausedAt: string | null
  cookiesCount: number
  hasCookies: boolean
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [countryFilter, setCountryFilter] = useState<string>('all')
  const [cookiesFilter, setCookiesFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Bulk form state
  const [bulkAccounts, setBulkAccounts] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [host, setHost] = useState('shopee.co.id')
  const [country, setCountry] = useState('id')
  
  // Selection state
  const [selectedAccountIds, setSelectedAccountIds] = useState<Set<string>>(new Set())
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Update form state
  const [updateData, setUpdateData] = useState({
    status: '',
    host: '',
    proxyId: '',
    attempts: ''
  })

  const fetchAccounts = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/accounts')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setAccounts(data.accounts || data)
    } catch (error) {
      console.error('Error fetching accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      IDLE: 'bg-gray-500 text-white',
      RUNNING: 'bg-green-500 text-white',
      BLOCKED: 'bg-red-500 text-white',
      PAUSE: 'bg-yellow-500 text-white',
    }

    return (
      <Badge className={colors[status] || 'bg-gray-500 text-white'}>
        {status}
      </Badge>
    )
  }

  // Apply filters
  const filteredAccounts = accounts.filter((account) => {
    // Status filter
    if (statusFilter !== 'all' && account.status !== statusFilter) {
      return false
    }
    
    // Country filter
    if (countryFilter !== 'all' && account.country !== countryFilter) {
      return false
    }
    
    // Cookies filter
    if (cookiesFilter !== 'all') {
      if (cookiesFilter === 'has-cookies' && !account.hasCookies) {
        return false
      }
      if (cookiesFilter === 'no-cookies' && account.hasCookies) {
        return false
      }
    }
    
    // Search filter (username or host)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchUsername = account.username.toLowerCase().includes(query)
      const matchHost = account.host.toLowerCase().includes(query)
      if (!matchUsername && !matchHost) {
        return false
      }
    }
    
    return true
  })

  const idleAccounts = accounts.filter((a) => a.status === 'IDLE').length
  const activeAccounts = accounts.filter((a) => a.status === 'RUNNING').length
  const blockedAccounts = accounts.filter((a) => a.status === 'BLOCKED').length
  const pausedAccounts = accounts.filter((a) => a.status === 'PAUSE').length

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'text/plain') {
      setSelectedFile(file)
      // Read file and populate textarea
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        setBulkAccounts(text)
      }
      reader.readAsText(file)
    } else {
      alert('Please select a .txt file')
    }
  }

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!bulkAccounts.trim() && !selectedFile) {
      alert('⚠️ Please provide accounts data or select a file!')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const formData = new FormData()
      
      if (selectedFile) {
        formData.append('file', selectedFile)
      } else {
        // Create a file from textarea content
        const blob = new Blob([bulkAccounts], { type: 'text/plain' })
        const file = new File([blob], 'accounts.txt', { type: 'text/plain' })
        formData.append('file', file)
      }
      
      formData.append('host', host)
      formData.append('country', country)
      
      const accountLines = bulkAccounts.trim().split('\n').filter(l => l.trim())
      
      const response = await fetch('http://localhost:3001/shopee/account/insert/bulk', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 943|Jj68208fsTFYZn1Y3A0xUOoPfyCUI6cE0I74z9Cjd079ed01'
        },
        body: formData
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('Bulk submit result:', result)
      
      alert(`✅ ${accountLines.length} account(s) submitted successfully!`)
      
      // Reset form
      setBulkAccounts('')
      setSelectedFile(null)
      
      // Refresh accounts list
      fetchAccounts()
    } catch (error) {
      console.error('Error submitting accounts:', error)
      alert('❌ Failed to submit accounts')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAccountIds(new Set(filteredAccounts.map(a => a.id)))
    } else {
      setSelectedAccountIds(new Set())
    }
  }

  const handleSelectAccount = (accountId: string, checked: boolean) => {
    const newSelection = new Set(selectedAccountIds)
    if (checked) {
      newSelection.add(accountId)
    } else {
      newSelection.delete(accountId)
    }
    setSelectedAccountIds(newSelection)
  }

  // Bulk update handler
  const handleBulkUpdate = async () => {
    if (selectedAccountIds.size === 0) {
      alert('⚠️ Please select at least one account!')
      return
    }

    // Build update payload with only non-empty fields
    const payload: any = {}
    if (updateData.status) payload.status = updateData.status
    if (updateData.host) payload.host = updateData.host
    if (updateData.proxyId) payload.proxyId = updateData.proxyId
    if (updateData.attempts) payload.attempts = parseInt(updateData.attempts)

    if (Object.keys(payload).length === 0) {
      alert('⚠️ Please fill at least one field to update!')
      return
    }

    setIsUpdating(true)

    try {
      const updatePromises = Array.from(selectedAccountIds).map(accountId =>
        fetch(`http://localhost:3001/accounts/${accountId}`, {
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
        alert(`✅ ${successCount} account(s) updated successfully!${failCount > 0 ? ` (${failCount} failed)` : ''}`)
        
        // Reset selection and form
        setSelectedAccountIds(new Set())
        setUpdateData({ status: '', host: '', proxyId: '', attempts: '' })
        
        // Refresh accounts
        fetchAccounts()
      } else {
        alert('❌ Failed to update accounts')
      }
    } catch (error) {
      console.error('Error updating accounts:', error)
      alert('❌ Failed to update accounts')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Account Management</h2>
        <Button onClick={fetchAccounts} size="icon" variant="outline">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-5">
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Accounts</CardTitle>
            <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{accounts.length}</div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Idle</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-400">{idleAccounts}</div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-500">{activeAccounts}</div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Blocked</CardTitle>
            <Users className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900 dark:text-red-500">{blockedAccounts}</div>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Paused</CardTitle>
            <Users className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-500">{pausedAccounts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Import Accounts */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Import Accounts
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Upload a .txt file or paste accounts directly. Format: email|password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBulkSubmit} className="space-y-4">
            {/* Config Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                <label htmlFor="host" className="text-sm font-medium text-gray-900 dark:text-white">
                  Host <span className="text-red-500">*</span>
                </label>
                <Select value={host} onValueChange={setHost}>
                  <SelectTrigger className="border-gray-300 dark:border-gray-600 text-white dark:text-white bg-white dark:bg-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                      <SelectItem value="shopee.co.id" className="text-white dark:text-white hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white">shopee.co.id</SelectItem>
                      <SelectItem value="shopee.co.th" className="text-white dark:text-white hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white">shopee.co.th</SelectItem>
                      <SelectItem value="shopee.sg" className="text-white dark:text-white hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white">shopee.sg</SelectItem>
                      <SelectItem value="shopee.com.my" className="text-white dark:text-white hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white">shopee.com.my</SelectItem>
                      <SelectItem value="shopee.vn" className="text-white dark:text-white hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white">shopee.vn</SelectItem>
                      <SelectItem value="shopee.ph" className="text-white dark:text-white hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white">shopee.ph</SelectItem>
                      <SelectItem value="shopee.tw" className="text-white dark:text-white hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white">shopee.tw</SelectItem>
                    </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="country" className="text-sm font-medium text-gray-900 dark:text-white">
                  Country <span className="text-red-500">*</span>
                </label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="border-gray-300 dark:border-gray-600 text-white dark:text-white bg-white dark:bg-gray-900">
                    <SelectValue />
                  </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                      <SelectItem value="id" className="text-white dark:text-white hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white">Indonesia (ID)</SelectItem>
                      <SelectItem value="th" className="text-white dark:text-white hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white">Thailand (TH)</SelectItem>
                      <SelectItem value="sg" className="text-white dark:text-white hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white">Singapore (SG)</SelectItem>
                      <SelectItem value="my" className="text-white dark:text-white hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white">Malaysia (MY)</SelectItem>
                      <SelectItem value="vn" className="text-white dark:text-white hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white">Vietnam (VN)</SelectItem>
                      <SelectItem value="ph" className="text-white dark:text-white hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white">Philippines (PH)</SelectItem>
                      <SelectItem value="tw" className="text-white dark:text-white hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white">Taiwan (TW)</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label htmlFor="file" className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Upload .txt File (Optional)
              </label>
              <Input
                id="file"
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
              {selectedFile && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  ✓ File loaded: {selectedFile.name}
                </p>
              )}
            </div>

            {/* Direct Input */}
            <div className="space-y-2">
              <label htmlFor="bulkAccounts" className="text-sm font-medium text-gray-900 dark:text-white">
                Or Paste Accounts Here
              </label>
              <Textarea
                id="bulkAccounts"
                placeholder={`Example:
Sionaga82@gmail.com|Ikeh12345
deviniggi@gmail.com|Ikeh12345
gggaming6668@gmail.com|Ikeh12345`}
                value={bulkAccounts}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBulkAccounts(e.target.value)}
                rows={8}
                className="border-gray-300 dark:border-gray-600 font-mono text-sm bg-background text-white dark:text-white placeholder:text-[rgba(249,250,251,0.24)]"
              />
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold mb-2">
                  📝 Format: email|password
                </p>
                <code className="text-xs text-blue-600 dark:text-blue-400 block space-y-1">
                  Sionaga82@gmail.com|Ikeh12345<br/>
                  deviniggi@gmail.com|Ikeh12345<br/>
                  gggaming6668@gmail.com|Ikeh12345
                </code>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between items-center pt-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {bulkAccounts.trim().split('\n').filter(l => l.trim()).length} account(s) ready
              </p>
              <Button
                type="submit"
                disabled={isSubmitting || (!bulkAccounts.trim() && !selectedFile)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Accounts
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Bulk Update Panel */}
      {selectedAccountIds.size > 0 && (
        <Card className="border-2 border-white dark:border-white bg-blue-50 dark:bg-blue-900/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white dark:text-white flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Bulk Update ({selectedAccountIds.size} selected)
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedAccountIds(new Set())}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Status Update */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Status
                </label>
                <Select 
                  value={updateData.status} 
                  onValueChange={(value) => setUpdateData({...updateData, status: value})}
                >
                  <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-white dark:text-white">
                    <SelectValue placeholder="No change" className="text-white dark:text-white" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-900 text-white dark:text-white border-gray-200 dark:border-gray-700">
                    <SelectItem value="IDLE" className="text-white dark:text-white hover:bg-blue-600">IDLE</SelectItem>
                    <SelectItem value="RUNNING" className="text-white dark:text-white hover:bg-blue-600">RUNNING</SelectItem>
                    <SelectItem value="BLOCKED" className="text-white dark:text-white hover:bg-blue-600">BLOCKED</SelectItem>
                    <SelectItem value="PAUSE" className="text-white dark:text-white hover:bg-blue-600">PAUSE</SelectItem>
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
                  <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-white dark:text-white">
                    <SelectValue placeholder="No change" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
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

              {/* Proxy ID Update */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white dark:text-white">
                  Proxy ID
                </label>
                <Input
                  placeholder="No change"
                  value={updateData.proxyId}
                  onChange={(e) => setUpdateData({...updateData, proxyId: e.target.value})}
                  className="border-gray-300 dark:border-gray-600 text-white dark:text-white"
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
                  className="border-gray-300 dark:border-gray-600 text-white dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedAccountIds(new Set())
                  setUpdateData({ status: '', host: '', proxyId: '', attempts: '' })
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
                    Update {selectedAccountIds.size} Account(s)
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">All Accounts</CardTitle>
            <div className="flex items-center gap-2">
              {/* Search */}
              <Input
                placeholder="Search username or host..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="w-[250px] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
              
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                  <SelectItem value="all" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">All Status</SelectItem>
                  <SelectItem value="IDLE" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">Idle</SelectItem>
                  <SelectItem value="RUNNING" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">Running</SelectItem>
                  <SelectItem value="BLOCKED" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">Blocked</SelectItem>
                  <SelectItem value="PAUSE" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">Paused</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Country Filter */}
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-[150px] border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                  <SelectItem value="all" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">All Countries</SelectItem>
                  <SelectItem value="id" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">Indonesia</SelectItem>
                  <SelectItem value="th" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">Thailand</SelectItem>
                  <SelectItem value="sg" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">Singapore</SelectItem>
                  <SelectItem value="my" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">Malaysia</SelectItem>
                  <SelectItem value="vn" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">Vietnam</SelectItem>
                  <SelectItem value="ph" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">Philippines</SelectItem>
                  <SelectItem value="tw" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">Taiwan</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Cookies Filter */}
              <Select value={cookiesFilter} onValueChange={setCookiesFilter}>
                <SelectTrigger className="w-[150px] border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                  <SelectValue placeholder="Cookies" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                  <SelectItem value="all" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">All Cookies</SelectItem>
                  <SelectItem value="has-cookies" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">🍪 Has Cookies</SelectItem>
                  <SelectItem value="no-cookies" className="text-white dark:text-white hover:bg-blue-600 hover:text-white">No Cookies</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Showing {filteredAccounts.length} of {accounts.length} accounts
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
          ) : accounts.length === 0 ? (
            <div className="text-center py-10 text-gray-600 dark:text-gray-400">
              <p>No accounts available</p>
              <p className="text-sm mt-2">Backend connection pending...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px] text-gray-700 dark:text-gray-300">
                      <Checkbox
                        checked={selectedAccountIds.size === filteredAccounts.length && filteredAccounts.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">ID</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Username</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Host</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Country</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Proxy ID</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Attempts</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Cookies</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="text-white dark:text-white">
                        <Checkbox
                          checked={selectedAccountIds.has(account.id)}
                          onCheckedChange={(checked) => handleSelectAccount(account.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs text-gray-900 dark:text-white">
                        {account.id}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900 dark:text-white">
                        {account.username}
                      </TableCell>
                      <TableCell className="text-xs text-gray-900 dark:text-white">{account.host}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-gray-900 dark:text-white">
                          {account.country?.toUpperCase() || 'ALL'}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(account.status)}</TableCell>
                      <TableCell className="font-mono text-xs text-gray-900 dark:text-white">
                        {account.proxyId || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-gray-900 dark:text-white">{account.attempts}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {account.hasCookies ? (
                            <Badge className="bg-green-500 text-white">
                              🍪 {account.cookiesCount}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-500">
                              No cookies
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-gray-600 dark:text-gray-400">
                        {formatDistanceToNow(new Date(account.updatedAt), {
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

