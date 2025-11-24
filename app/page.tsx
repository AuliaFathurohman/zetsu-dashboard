'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Chrome, ChevronDown, RefreshCw, Users, StopCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

interface Node {
  id: string
  name: string
  host: string
  status: string
}

interface Browser {
  id: string
  nodeId: string
  country: string
  port: number
  status: string
  createdAt: string
  [key: string]: any
}

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

export default function HomePage() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [browsers, setBrowsers] = useState<Browser[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingBrowsers, setLoadingBrowsers] = useState(true)
  const [loadingAccounts, setLoadingAccounts] = useState(true)
  const [selectedNodes, setSelectedNodes] = useState<string[]>([])
  const [isStartingWorker, setIsStartingWorker] = useState(false)
  const [isStoppingWorker, setIsStoppingWorker] = useState(false)
  const [isStartingBrowser, setIsStartingBrowser] = useState(false)
  
  // Stop worker states
  const [selectedStopNodes, setSelectedStopNodes] = useState<string[]>([])
  
  // Browser states
  const [selectedBrowserNodes, setSelectedBrowserNodes] = useState<string[]>([])
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['id'])
  const [browserMode, setBrowserMode] = useState<'single' | 'multiple'>('single')
  const [port, setPort] = useState('2018')
  const [amountBrowser, setAmountBrowser] = useState('6')

  const fetchNodes = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/nodes')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setNodes(data.nodes || data)
    } catch (error) {
      console.error('Error fetching nodes:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBrowsers = async () => {
    setLoadingBrowsers(true)
    try {
      const response = await fetch('http://localhost:3001/Browsers')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setBrowsers(data.browsers || data)
    } catch (error) {
      console.error('Error fetching browsers:', error)
    } finally {
      setLoadingBrowsers(false)
    }
  }

  const fetchAccounts = async () => {
    setLoadingAccounts(true)
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
      setLoadingAccounts(false)
    }
  }

  useEffect(() => {
    fetchNodes()
    fetchBrowsers()
    fetchAccounts()
  }, [])

  // Toggle node selection
  const toggleNode = (nodeId: string) => {
    setSelectedNodes(prev => 
      prev.includes(nodeId) 
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    )
  }

  // Select all nodes that are DOWN (dapat di-start)
  const selectAllNodes = () => {
    const allDownNodeIds = nodes
      .filter(node => node.status === 'DOWN')
      .map(node => node.id)
    setSelectedNodes(allDownNodeIds)
  }

  // Clear all selections
  const clearAllNodes = () => {
    setSelectedNodes([])
  }

  const handleStartWorker = async () => {
    if (selectedNodes.length === 0) {
      alert('⚠️ Please select at least one node!')
      return
    }

    setIsStartingWorker(true)
    console.log('Starting worker on nodes:', selectedNodes)
    
    // TODO: Implement API call to backend
    // const selectedNodeData = SAMPLE_NODES.filter(node => selectedNodes.includes(node.id))
    // const response = await fetch('/api/start-worker', {
    //   method: 'POST',
    //   body: JSON.stringify({ nodes: selectedNodeData })
    // })
    
    setTimeout(() => {
      const selectedNodeNames = nodes
        .filter(n => selectedNodes.includes(n.id))
        .map(n => `• ${n.name} (${n.host})`)
        .join('\n')
      
      alert(`✅ Starting workers on ${selectedNodes.length} node(s):\n\n${selectedNodeNames}`)
      setIsStartingWorker(false)
    }, 1000)
  }

  const handleStopWorker = async () => {
    if (selectedStopNodes.length === 0) {
      alert('⚠️ Please select at least one node!')
      return
    }

    setIsStoppingWorker(true)
    console.log('Stopping worker on nodes:', selectedStopNodes)
    
    // TODO: Implement API call to backend
    // const response = await fetch('/api/stop-worker', {
    //   method: 'POST',
    //   body: JSON.stringify({ nodes: selectedStopNodes })
    // })
    
    setTimeout(() => {
      const selectedNodeNames = nodes
        .filter(n => selectedStopNodes.includes(n.id))
        .map(n => `• ${n.name} (${n.host})`)
        .join('\n')
      
      alert(`⏹️ Stopping workers on ${selectedStopNodes.length} node(s):\n\n${selectedNodeNames}`)
      setIsStoppingWorker(false)
    }, 1000)
  }

  // Stop worker node selection handlers
  const toggleStopNode = (nodeId: string) => {
    setSelectedStopNodes(prev => 
      prev.includes(nodeId) 
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    )
  }

  const selectAllStopNodes = () => {
    const upNodes = nodes.filter(n => n.status === 'UP')
    const allSelected = upNodes.every(node => selectedStopNodes.includes(node.id))
    if (allSelected) {
      setSelectedStopNodes([])
    } else {
      setSelectedStopNodes(upNodes.map(n => n.id))
    }
  }

  // Browser node selection handlers
  const toggleBrowserNode = (nodeId: string) => {
    setSelectedBrowserNodes(prev => 
      prev.includes(nodeId) 
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    )
  }

  const selectAllBrowserNodes = () => {
    const allUpNodeIds = nodes
      .filter(node => node.status === 'UP')
      .map(node => node.id)
    setSelectedBrowserNodes(allUpNodeIds)
  }

  const clearAllBrowserNodes = () => {
    setSelectedBrowserNodes([])
  }

  const getSelectedBrowserNodesText = () => {
    if (selectedBrowserNodes.length === 0) return 'Select Nodes'
    const upNodes = nodes.filter(n => n.status === 'UP').length
    if (selectedBrowserNodes.length === upNodes && upNodes > 0) return 'All UP Nodes'
    return `${selectedBrowserNodes.length} Node${selectedBrowserNodes.length > 1 ? 's' : ''} Selected`
  }

  // Country selection handlers
  const countries = [
    { code: 'id', name: 'Indonesia' },
    { code: 'th', name: 'Thailand' },
    { code: 'sg', name: 'Singapore' },
    { code: 'my', name: 'Malaysia' },
    { code: 'vn', name: 'Vietnam' },
    { code: 'ph', name: 'Philippines' },
    { code: 'tw', name: 'Taiwan' },
  ]

  const toggleCountry = (countryCode: string) => {
    setSelectedCountries(prev => 
      prev.includes(countryCode) 
        ? prev.filter(code => code !== countryCode)
        : [...prev, countryCode]
    )
  }

  const selectAllCountries = () => {
    setSelectedCountries(countries.map(c => c.code))
  }

  const clearAllCountries = () => {
    setSelectedCountries([])
  }

  const getSelectedCountriesText = () => {
    if (selectedCountries.length === 0) return 'Select Countries'
    if (selectedCountries.length === countries.length) return 'All Countries'
    return `${selectedCountries.length} Countr${selectedCountries.length > 1 ? 'ies' : 'y'} Selected`
  }

  const handleStartBrowser = async () => {
    if (selectedBrowserNodes.length === 0) {
      alert('⚠️ Please select at least one node!')
      return
    }

    if (selectedCountries.length === 0) {
      alert('⚠️ Please select at least one country!')
      return
    }

    if (!port || parseInt(port) <= 0) {
      alert('⚠️ Please enter a valid port number!')
      return
    }

    if (browserMode === 'multiple' && (!amountBrowser || parseInt(amountBrowser) <= 0)) {
      alert('⚠️ Please enter a valid amount of browsers!')
      return
    }

    setIsStartingBrowser(true)

    try {
      const endpoint = browserMode === 'single' 
        ? 'http://localhost:3001/init/browser/shopee'
        : 'http://localhost:3001/init/browser/shopeeAll'

      const requests = []

      // Loop through each node and country combination
      for (const nodeId of selectedBrowserNodes) {
        for (const country of selectedCountries) {
          const payload: any = {
            nodeId,
            port: parseInt(port),
            country
          }

          if (browserMode === 'multiple') {
            payload.amount_browser = parseInt(amountBrowser)
          }

          requests.push(
            fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload)
            })
          )
        }
      }

      const results = await Promise.all(requests)
      const successCount = results.filter(r => r.ok).length
      const failCount = results.length - successCount

      if (successCount > 0) {
        const selectedNodeNames = nodes
          .filter(n => selectedBrowserNodes.includes(n.id))
          .map(n => n.name)
          .join(', ')
        
        const countriesText = selectedCountries.map(c => c.toUpperCase()).join(', ')
        
        alert(`✅ ${successCount} browser(s) started successfully!${failCount > 0 ? ` (${failCount} failed)` : ''}\n\nNodes: ${selectedNodeNames}\nCountries: ${countriesText}\nMode: ${browserMode === 'single' ? 'Single Browser' : `${amountBrowser} Browsers per node`}`)
        
        // Refresh browsers list
        fetchBrowsers()
      } else {
        alert('❌ Failed to start browsers')
      }
    } catch (error) {
      console.error('Error starting browsers:', error)
      alert('❌ Failed to start browsers')
    } finally {
      setIsStartingBrowser(false)
    }
  }

  const getSelectedNodesText = () => {
    if (selectedNodes.length === 0) return 'Select Nodes'
    const downNodes = nodes.filter(n => n.status === 'DOWN').length
    if (selectedNodes.length === downNodes && downNodes > 0) return 'All Available Nodes'
    return `${selectedNodes.length} Node${selectedNodes.length > 1 ? 's' : ''} Selected`
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Zetsu Dashboard</h2>
          <p className="text-white dark:text-white mt-1">
            Control center for worker and browser management
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
        {/* Start Worker Card */}
        <Card className="hover:shadow-xl transition-all duration-200 border-2 border-white dark:border-white">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Play className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900 dark:text-white">Start Worker</CardTitle>
                <CardDescription className="text-sm mt-1 text-white dark:text-white">
                  Initialize worker processes
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Node Selection Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Select Nodes:</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between h-11 border-2 hover:border-blue-400 text-gray-900 dark:text-white"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">{getSelectedNodesText()}</span>
                    <div className="flex items-center gap-2">
                      {selectedNodes.length > 0 && (
                        <Badge className="bg-blue-500 text-white hover:bg-blue-600">{selectedNodes.length}</Badge>
                      )}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[400px] p-2">
                  <DropdownMenuLabel className="flex items-center justify-between px-2">
                    <span className="text-base">Select Nodes</span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          selectAllNodes()
                        }}
                        className="h-7 text-xs px-2"
                      >
                        All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          clearAllNodes()
                        }}
                        className="h-7 text-xs px-2"
                      >
                        Clear
                      </Button>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[300px] overflow-y-auto">
                    {loading ? (
                      <div className="py-8 text-center text-gray-500">Loading nodes...</div>
                    ) : nodes.length === 0 ? (
                      <div className="py-8 text-center text-gray-500">No nodes available</div>
                    ) : (
                      nodes.map((node) => (
                      <DropdownMenuCheckboxItem
                        key={node.id}
                        checked={selectedNodes.includes(node.id)}
                        onCheckedChange={() => toggleNode(node.id)}
                        disabled={node.status === 'UP'}
                        className="py-3"
                      >
                        <div className="flex items-center justify-between w-full pr-2">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-base">{node.name}</span>
                              {node.status === 'UP' && (
                                <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                                  Running
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground font-mono">
                              {node.host}
                            </span>
                          </div>
                          <Badge 
                            variant={node.status === 'UP' ? 'default' : 'secondary'}
                            className={`ml-2 ${node.status === 'UP' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                          >
                            {node.status}
                          </Badge>
                        </div>
                      </DropdownMenuCheckboxItem>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Selected Nodes Preview */}
            {selectedNodes.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Selected:</label>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-white dark:border-white">
                  {nodes
                    .filter(node => selectedNodes.includes(node.id))
                    .map(node => (
                      <div
                        key={node.id}
                        className="group cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-400 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border-2 border-white dark:border-white rounded-md transition-all font-medium flex items-center gap-2 shadow-sm"
                        onClick={() => toggleNode(node.id)}
                      >
                        <span className="text-gray-900 dark:text-gray-100 group-hover:text-red-700 dark:group-hover:text-red-400">{node.name}</span>
                        <span className="text-gray-400 dark:text-gray-500 group-hover:text-red-600 dark:group-hover:text-red-400 text-lg font-bold">×</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}

            {/* Start Button */}
            <Button 
              size="lg" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold"
              onClick={handleStartWorker}
              disabled={isStartingWorker || selectedNodes.length === 0}
            >
              {isStartingWorker ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Starting Workers...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Start Worker {selectedNodes.length > 0 && `(${selectedNodes.length})`}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Stop Worker Card */}
        <Card className="hover:shadow-xl transition-all duration-200 border-2 border-white dark:border-white">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <StopCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900 dark:text-white">Stop Worker</CardTitle>
                <CardDescription className="text-sm mt-1 text-white dark:text-white">
                  Stop running worker processes
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Node Selection Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Select Nodes:</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between h-11 border-2 hover:border-red-400 text-gray-900 dark:text-white"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedStopNodes.length === 0 
                        ? 'Choose nodes to stop...' 
                        : `${selectedStopNodes.length} node${selectedStopNodes.length > 1 ? 's' : ''} selected`}
                    </span>
                    <div className="flex items-center gap-2">
                      {selectedStopNodes.length > 0 && (
                        <Badge className="bg-red-500 text-white hover:bg-red-600">{selectedStopNodes.length}</Badge>
                      )}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[400px] p-2">
                  <DropdownMenuLabel className="flex items-center justify-between px-2">
                    <span className="text-base">Select Nodes</span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          selectAllStopNodes()
                        }}
                        className="h-7 text-xs px-2"
                      >
                        All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          setSelectedStopNodes([])
                        }}
                        className="h-7 text-xs px-2"
                      >
                        Clear
                      </Button>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[300px] overflow-y-auto">
                    {loading ? (
                      <div className="py-8 text-center text-gray-500">Loading nodes...</div>
                    ) : nodes.filter(n => n.status === 'UP').length === 0 ? (
                      <div className="py-8 text-center text-gray-500">No running nodes available</div>
                    ) : (
                      nodes
                        .filter(n => n.status === 'UP')
                        .map((node) => (
                        <DropdownMenuCheckboxItem
                          key={node.id}
                          checked={selectedStopNodes.includes(node.id)}
                          onCheckedChange={() => toggleStopNode(node.id)}
                          className="py-3"
                        >
                          <div className="flex items-center justify-between w-full pr-2">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-base">{node.name}</span>
                                <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                                  Running
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground font-mono">
                                {node.host}
                              </span>
                            </div>
                            <Badge 
                              variant="default"
                              className="ml-2 bg-green-500 hover:bg-green-600"
                            >
                              {node.status}
                            </Badge>
                          </div>
                        </DropdownMenuCheckboxItem>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Selected Nodes Preview */}
            {selectedStopNodes.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Selected:</label>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-white dark:border-white">
                  {nodes
                    .filter(node => selectedStopNodes.includes(node.id))
                    .map(node => (
                      <div
                        key={node.id}
                        className="group cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-400 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border-2 border-white dark:border-white rounded-md transition-all font-medium flex items-center gap-2 shadow-sm"
                        onClick={() => toggleStopNode(node.id)}
                      >
                        <span className="text-gray-900 dark:text-gray-100 group-hover:text-red-700 dark:group-hover:text-red-400">{node.name}</span>
                        <span className="text-gray-400 dark:text-gray-500 group-hover:text-red-600 dark:group-hover:text-red-400 text-lg font-bold">×</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}

            {/* Stop Button */}
            <Button 
              size="lg" 
              className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-base font-semibold"
              onClick={handleStopWorker}
              disabled={isStoppingWorker || selectedStopNodes.length === 0}
            >
              {isStoppingWorker ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Stopping Workers...
                </>
              ) : (
                <>
                  <StopCircle className="mr-2 h-5 w-5" />
                  Stop Worker {selectedStopNodes.length > 0 && `(${selectedStopNodes.length})`}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Start Browser Card */}
        <Card className="md:col-span-2 hover:shadow-xl transition-all duration-200 border-2 border-white dark:border-white">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Chrome className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900 dark:text-white">Start Browser</CardTitle>
                <CardDescription className="text-sm mt-1 text-white dark:text-white">
                  Launch browser instances
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Node Selection Dropdown */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Select Nodes (UP only):</label>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between h-11 border-2 border-white dark:border-white hover:border-green-400 text-gray-900 dark:text-white"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">{getSelectedBrowserNodesText()}</span>
                    <div className="flex items-center gap-2">
                      {selectedBrowserNodes.length > 0 && (
                        <Badge className="bg-green-500 text-white hover:bg-green-600">{selectedBrowserNodes.length}</Badge>
                      )}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[400px] p-2">
                  <DropdownMenuLabel className="flex items-center justify-between px-2">
                    <span className="text-base">Select Nodes (UP only)</span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          selectAllBrowserNodes()
                        }}
                        className="h-7 text-xs px-2"
                      >
                        All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          clearAllBrowserNodes()
                        }}
                        className="h-7 text-xs px-2"
                      >
                        Clear
                      </Button>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[300px] overflow-y-auto">
                    {loading ? (
                      <div className="py-8 text-center text-gray-500">Loading nodes...</div>
                    ) : nodes.filter(n => n.status === 'UP').length === 0 ? (
                      <div className="py-8 text-center text-gray-500">No UP nodes available</div>
                    ) : (
                      nodes.filter(node => node.status === 'UP').map((node) => (
                        <DropdownMenuCheckboxItem
                          key={node.id}
                          checked={selectedBrowserNodes.includes(node.id)}
                          onCheckedChange={() => toggleBrowserNode(node.id)}
                          className="py-3"
                        >
                          <div className="flex items-center justify-between w-full pr-2">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-base">{node.name}</span>
                                <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-medium">
                                  Running
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground font-mono">
                                {node.host}
                              </span>
                            </div>
                            <Badge 
                              variant="default"
                              className="ml-2 bg-green-500 hover:bg-green-600"
                            >
                              {node.status}
                            </Badge>
                          </div>
                        </DropdownMenuCheckboxItem>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              </div>

              {/* Browser Mode Selection */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Browser Mode:</label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={browserMode === 'single' ? 'default' : 'outline'}
                    className={`flex-1 text-white ${browserMode === 'single' ? 'bg-green-600 hover:bg-green-700 ' : 'bg-white dark:bg-gray-900 text-white dark:text-white hover:bg-green-600 hover:text-white dark:hover:bg-green-600 dark:hover:text-white'}`}
                    onClick={() => setBrowserMode('single')}
                  >
                    Single Browser
                  </Button>
                  <Button
                    type="button"
                    variant={browserMode === 'multiple' ? 'default' : 'outline'}
                    className={`flex-1 text-white ${browserMode === 'multiple' ? 'bg-green-600 hover:bg-green-700' : 'bg-white dark:bg-gray-900 text-white dark:text-white hover:bg-green-600 hover:text-white dark:hover:bg-green-600 dark:hover:text-white'}`}
                    onClick={() => setBrowserMode('multiple')}
                  >
                    Multiple Browsers
                  </Button>
                </div>
              </div>

              {/* Port Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Port:</label>
                <input
                  type="number"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  placeholder="e.g., 2018"
                  className="w-full h-11 px-3 border-2 border-white dark:border-white rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-green-400 focus:outline-none"
                />
              </div>

              {/* Amount Browser (only for multiple mode) */}
              {browserMode === 'multiple' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Amount of Browsers:</label>
                  <input
                    type="number"
                    value={amountBrowser}
                    onChange={(e) => setAmountBrowser(e.target.value)}
                    placeholder="e.g., 6"
                    className="w-full h-11 px-3 border-2 border-white dark:border-white rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-green-400 focus:outline-none"
                  />
                </div>
              )}

              {/* Country Selection */}
              <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-900 dark:text-white">Countries:</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between h-11 border-2 border-white dark:border-white hover:border-green-400 text-gray-900 dark:text-white"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">{getSelectedCountriesText()}</span>
                    <div className="flex items-center gap-2">
                      {selectedCountries.length > 0 && (
                        <Badge className="bg-green-500 text-white hover:bg-green-600">{selectedCountries.length}</Badge>
                      )}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[400px] p-2">
                  <DropdownMenuLabel className="flex items-center justify-between px-2">
                    <span className="text-base">Select Countries</span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          selectAllCountries()
                        }}
                        className="h-7 text-xs px-2"
                      >
                        All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          clearAllCountries()
                        }}
                        className="h-7 text-xs px-2"
                      >
                        Clear
                      </Button>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[300px] overflow-y-auto">
                    {countries.map((country) => (
                      <DropdownMenuCheckboxItem
                        key={country.code}
                        checked={selectedCountries.includes(country.code)}
                        onCheckedChange={() => toggleCountry(country.code)}
                        className="py-3"
                      >
                        <div className="flex items-center justify-between w-full pr-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-base">{country.name}</span>
                            <span className="text-xs text-muted-foreground font-mono">
                              ({country.code.toUpperCase()})
                            </span>
                          </div>
                        </div>
                      </DropdownMenuCheckboxItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              </div>

              {/* Selected Nodes Preview */}
              {selectedBrowserNodes.length > 0 && (
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Selected Nodes:</label>
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-white dark:border-white">
                    {nodes
                      .filter(node => selectedBrowserNodes.includes(node.id))
                      .map(node => (
                        <div
                          key={node.id}
                          className="group cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-400 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border-2 border-white dark:border-white rounded-md transition-all font-medium flex items-center gap-2 shadow-sm"
                          onClick={() => toggleBrowserNode(node.id)}
                        >
                          <span className="text-gray-900 dark:text-gray-100 group-hover:text-red-700 dark:group-hover:text-red-400">{node.name}</span>
                          <span className="text-gray-400 dark:text-gray-500 group-hover:text-red-600 dark:group-hover:text-red-400 text-lg font-bold">×</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}

              {/* Selected Countries Preview */}
              {selectedCountries.length > 0 && (
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-white">Selected Countries:</label>
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-white dark:border-white">
                    {countries
                      .filter(country => selectedCountries.includes(country.code))
                      .map(country => (
                        <div
                          key={country.code}
                          className="group cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-400 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border-2 border-white dark:border-white rounded-md transition-all font-medium flex items-center gap-2 shadow-sm"
                          onClick={() => toggleCountry(country.code)}
                        >
                          <span className="text-gray-900 dark:text-gray-100 group-hover:text-red-700 dark:group-hover:text-red-400">{country.code.toUpperCase()}</span>
                          <span className="text-gray-400 dark:text-gray-500 group-hover:text-red-600 dark:group-hover:text-red-400 text-lg font-bold">×</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}

              {/* Start Button */}
              <Button
              size="lg" 
              className="md:col-span-2 w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-semibold"
              onClick={handleStartBrowser}
              disabled={
                isStartingBrowser || 
                selectedBrowserNodes.length === 0 || 
                selectedCountries.length === 0 ||
                !port ||
                (browserMode === 'multiple' && !amountBrowser)
              }
            >
              {isStartingBrowser ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Starting Browser...
                </>
              ) : (
                <>
                  <Chrome className="mr-2 h-5 w-5" />
                  Start Browser {selectedBrowserNodes.length > 0 && selectedCountries.length > 0 && (() => {
                    const baseCount = selectedBrowserNodes.length * selectedCountries.length
                    const totalBrowsers = browserMode === 'single' 
                      ? baseCount 
                      : baseCount * (parseInt(amountBrowser) || 0)
                    return `(${totalBrowsers})`
                  })()}
                </>
              )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Accounts Overview */}
        <Card className="border-2 border-white dark:border-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 dark:text-white">Accounts Overview</CardTitle>
                <CardDescription className="text-white dark:text-white">
                  Summary of all accounts by status
                </CardDescription>
              </div>
              <Button onClick={fetchAccounts} size="icon" variant="outline">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingAccounts ? (
              <div className="h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
                  <p className="mt-2 text-sm text-white dark:text-white">Loading accounts...</p>
                </div>
              </div>
            ) : accounts.length === 0 ? (
              <div className="text-center py-10 text-white dark:text-white">
                <p>No accounts available</p>
                <p className="text-sm mt-2">Add accounts from the Accounts page</p>
              </div>
            ) : (
              <>
                {/* Status Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="p-4 rounded-lg border-2 border-white dark:border-white bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-xs font-medium text-white dark:text-white">Total</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {accounts.length}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border-2 border-white dark:border-white bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                      <span className="text-xs font-medium text-white dark:text-white">Idle</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-400">
                      {accounts.filter(a => a.status === 'IDLE').length}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border-2 border-white dark:border-white bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-xs font-medium text-green-700 dark:text-green-400">Running</span>
                    </div>
                    <div className="text-2xl font-bold text-green-900 dark:text-green-400">
                      {accounts.filter(a => a.status === 'RUNNING').length}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border-2 border-white dark:border-white bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-xs font-medium text-red-700 dark:text-red-400">Blocked</span>
                    </div>
                    <div className="text-2xl font-bold text-red-900 dark:text-red-400">
                      {accounts.filter(a => a.status === 'BLOCKED').length}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border-2 border-white dark:border-white bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">Paused</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-400">
                      {accounts.filter(a => a.status === 'PAUSE').length}
                    </div>
                  </div>
                </div>

                {/* Country Breakdown (IDLE only) */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Idle Accounts by Country</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Array.from(new Set(accounts.filter(a => a.status === 'IDLE').map(a => a.country).filter(Boolean))).map(country => (
                      <div key={country} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-white dark:border-white">
                        <span className="text-sm font-medium text-white dark:text-white">{country?.toUpperCase()}</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {accounts.filter(a => a.country === country && a.status === 'IDLE').length}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cookies Stats (IDLE only) */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-white dark:border-white">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Idle Accounts with Cookies</span>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Ready for automation</p>
                    </div>
                    <div className="text-3xl font-bold text-blue-900 dark:text-blue-300">
                      {accounts.filter(a => a.hasCookies && a.status === 'IDLE').length}
                    </div>
                  </div>
                  <div className="h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 dark:bg-blue-400 transition-all duration-500"
                      style={{ width: `${accounts.filter(a => a.status === 'IDLE').length > 0 ? (accounts.filter(a => a.hasCookies && a.status === 'IDLE').length / accounts.filter(a => a.status === 'IDLE').length * 100) : 0}%` }}
                    />
                  </div>
                  
                  {/* Breakdown by Country */}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Array.from(new Set(accounts.filter(a => a.status === 'IDLE' && a.hasCookies).map(a => a.country).filter(Boolean))).map(country => (
                      <div key={country} className="flex items-center justify-between p-2 bg-white dark:bg-blue-800/30 rounded border border-white dark:border-white">
                        <span className="text-xs font-medium text-blue-700 dark:text-blue-300">{country?.toUpperCase()}</span>
                        <span className="text-xs font-bold text-blue-900 dark:text-blue-200">
                          {accounts.filter(a => a.country === country && a.status === 'IDLE' && a.hasCookies).length}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 border-white dark:border-white">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Available Nodes</CardTitle>
            <CardDescription className="text-white dark:text-white">
              Current status of all worker nodes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
                  <p className="mt-2 text-sm text-white dark:text-white">Loading nodes...</p>
                </div>
              </div>
            ) : nodes.length === 0 ? (
              <div className="text-center py-10 text-white dark:text-white">
                <p>No nodes available</p>
                <p className="text-sm mt-2">Backend connection pending...</p>
              </div>
            ) : (
              <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {nodes.map(node => (
                <div 
                  key={node.id} 
                  className="flex items-center justify-between p-3 rounded-lg border border-white dark:border-white bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${node.status === 'UP' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                    <div>
                      <div className="font-semibold text-sm text-gray-900 dark:text-white">{node.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">{node.host}</div>
                    </div>
                  </div>
                  <Badge 
                    variant={node.status === 'UP' ? 'default' : 'secondary'}
                    className={node.status === 'UP' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}
                  >
                    {node.status}
                  </Badge>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-white dark:border-white">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white dark:text-white">Total Nodes:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{nodes.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-white dark:text-white">Active:</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                      {nodes.filter(n => n.status === 'UP').length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-white dark:text-white">Down:</span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                      {nodes.filter(n => n.status === 'DOWN').length}
                </span>
              </div>
            </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Active Browsers */}
        <Card className="border-2 border-white dark:border-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 dark:text-white">Active Browsers</CardTitle>
                <CardDescription className="text-white dark:text-white">
                  Currently running browser instances
                </CardDescription>
              </div>
              <Button onClick={fetchBrowsers} size="icon" variant="outline">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingBrowsers ? (
              <div className="h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
                  <p className="mt-2 text-sm text-white dark:text-white">Loading browsers...</p>
                </div>
              </div>
            ) : browsers.length === 0 ? (
              <div className="text-center py-10 text-white dark:text-white">
                <p>No active browsers</p>
                <p className="text-sm mt-2">Start browsers from the control panel above</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {browsers.map(browser => (
                    <div 
                      key={browser.id} 
                      className="flex flex-col p-3 rounded-lg border border-white dark:border-white bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Chrome className="h-4 w-4 text-blue-500" />
                          <span className="font-semibold text-sm text-gray-900 dark:text-white">
                            {nodes.find(n => n.id === browser.nodeId)?.name || 'Unknown Node'}
                          </span>
                        </div>
                        <Badge className="bg-blue-500 text-white text-xs">
                          {browser.status || 'RUNNING'}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Country:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{browser.country.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Port:</span>
                          <span className="font-mono text-gray-900 dark:text-white">{browser.port}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-white dark:border-white">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white dark:text-white">Total Browsers:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{browsers.length}</span>
                  </div>
                  {selectedCountries.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                      {Array.from(new Set(browsers.map(b => b.country))).map(country => (
                        <div key={country} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <span className="text-xs text-white dark:text-white">{country.toUpperCase()}:</span>
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">
                            {browsers.filter(b => b.country === country).length}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
