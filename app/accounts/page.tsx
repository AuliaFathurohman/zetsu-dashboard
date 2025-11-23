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
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDistanceToNow } from 'date-fns'
import { RefreshCw, Users, Upload, FileText } from 'lucide-react'

interface Account {
  id: string
  username: string
  host: string
  status: string
  country: string | null
  attempts: number
  createdAt: string
  updatedAt: string
  blockedAt: string | null
  pausedAt: string | null
  proxy: {
    host: string
    port: number
    status: string
  } | null
  browser: {
    id: string
    port: number
    status: string
  } | null
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Bulk form state
  const [bulkAccounts, setBulkAccounts] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [host, setHost] = useState('shopee.co.id')
  const [country, setCountry] = useState('id')

  const fetchAccounts = async () => {
    setLoading(true)
    try {
      // COMMENTED: API call to backend
      // const response = await fetch('/api/accounts')
      // const data = await response.json()
      // setAccounts(data.accounts)
      
      // TODO: Uncomment when backend is ready
      console.log('Accounts API call commented - waiting for backend setup')
    } catch (error) {
      console.error('Error fetching accounts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccounts()
    // Auto-refresh commented for now
    // const interval = setInterval(fetchAccounts, 15000)
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
                <Label htmlFor="host" className="text-gray-900 dark:text-white">
                  Host <span className="text-red-500">*</span>
                </Label>
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
                <Label htmlFor="country" className="text-gray-900 dark:text-white">
                  Country <span className="text-red-500">*</span>
                </Label>
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
              <Label htmlFor="file" className="text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Upload .txt File (Optional)
              </Label>
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
              <Label htmlFor="bulkAccounts" className="text-gray-900 dark:text-white">
                Or Paste Accounts Here
              </Label>
              <Textarea
                id="bulkAccounts"
                placeholder={`Example:
Sionaga82@gmail.com|Ikeh12345
deviniggi@gmail.com|Ikeh12345
gggaming6668@gmail.com|Ikeh12345`}
                value={bulkAccounts}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBulkAccounts(e.target.value)}
                rows={8}
                className="border-gray-300 dark:border-gray-600 font-mono text-sm bg-background"
                style={{ color: 'rgba(249, 250, 251, 0.24)' }}
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

      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">All Accounts</CardTitle>
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
                    <TableHead>ID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Host</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Proxy</TableHead>
                    <TableHead>Browser</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-mono text-xs">
                        {account.id.substring(0, 8)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {account.username}
                      </TableCell>
                      <TableCell className="text-xs">{account.host}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {account.country?.toUpperCase() || 'ALL'}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(account.status)}</TableCell>
                      <TableCell>
                        {account.proxy ? (
                          <div className="flex flex-col">
                            <span className="text-xs font-mono">
                              {account.proxy.host}:{account.proxy.port}
                            </span>
                            <Badge
                              variant="outline"
                              className="w-fit text-xs mt-1"
                            >
                              {account.proxy.status}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No proxy
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {account.browser ? (
                          <div className="flex flex-col">
                            <span className="text-xs font-mono">
                              Port {account.browser.port}
                            </span>
                            <Badge
                              variant="outline"
                              className="w-fit text-xs mt-1"
                            >
                              {account.browser.status}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No browser
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{account.attempts}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
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

