'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Chrome, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

// Sample nodes data (nanti akan fetch dari backend)
const SAMPLE_NODES = [
  { id: '1', name: 'mac1', host: '192.168.1.101', status: 'UP' },
  { id: '2', name: 'mac2', host: '192.168.1.102', status: 'UP' },
  { id: '3', name: 'mac3', host: '192.168.1.103', status: 'UP' },
  { id: '4', name: 'mac4', host: '192.168.1.104', status: 'DOWN' },
  { id: '5', name: 'mac5', host: '192.168.1.105', status: 'UP' },
]

export default function HomePage() {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([])
  const [isStartingWorker, setIsStartingWorker] = useState(false)
  const [isStartingBrowser, setIsStartingBrowser] = useState(false)

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
    const allDownNodeIds = SAMPLE_NODES
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
      const selectedNodeNames = SAMPLE_NODES
        .filter(n => selectedNodes.includes(n.id))
        .map(n => `• ${n.name} (${n.host})`)
        .join('\n')
      
      alert(`✅ Starting workers on ${selectedNodes.length} node(s):\n\n${selectedNodeNames}`)
      setIsStartingWorker(false)
    }, 1000)
  }

  const handleStartBrowser = () => {
    setIsStartingBrowser(true)
    console.log('Start Browser clicked')
    
    // TODO: Implement start browser logic
    setTimeout(() => {
      alert('🚀 Start Browser - Coming soon!')
      setIsStartingBrowser(false)
    }, 1000)
  }

  const getSelectedNodesText = () => {
    if (selectedNodes.length === 0) return 'Select Nodes'
    const downNodes = SAMPLE_NODES.filter(n => n.status === 'DOWN').length
    if (selectedNodes.length === downNodes && downNodes > 0) return 'All Available Nodes'
    return `${selectedNodes.length} Node${selectedNodes.length > 1 ? 's' : ''} Selected`
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Zetsu Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Control center for worker and browser management
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
        {/* Start Worker Card */}
        <Card className="hover:shadow-xl transition-all duration-200 border-2 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Play className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900 dark:text-white">Start Worker</CardTitle>
                <CardDescription className="text-sm mt-1 text-gray-600 dark:text-gray-400">
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
                    {SAMPLE_NODES.map((node) => (
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
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Selected Nodes Preview */}
            {selectedNodes.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Selected:</label>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                  {SAMPLE_NODES
                    .filter(node => selectedNodes.includes(node.id))
                    .map(node => (
                      <div
                        key={node.id}
                        className="group cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-400 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-md transition-all font-medium flex items-center gap-2 shadow-sm"
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

        {/* Start Browser Card */}
        <Card className="hover:shadow-xl transition-all duration-200 border-2 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Chrome className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900 dark:text-white">Start Browser</CardTitle>
                <CardDescription className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                  Launch browser instances
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              size="lg" 
              className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-semibold"
              onClick={handleStartBrowser}
              disabled={isStartingBrowser}
            >
              {isStartingBrowser ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Starting Browser...
                </>
              ) : (
                <>
                  <Chrome className="mr-2 h-5 w-5" />
                  Start Browser
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <div className="max-w-5xl mx-auto">
        <Card className="border-2 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Available Nodes</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Current status of all worker nodes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {SAMPLE_NODES.map(node => (
                <div 
                  key={node.id} 
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-card hover:shadow-md transition-shadow"
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
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Total Nodes:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{SAMPLE_NODES.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600 dark:text-gray-400">Active:</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {SAMPLE_NODES.filter(n => n.status === 'UP').length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600 dark:text-gray-400">Down:</span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  {SAMPLE_NODES.filter(n => n.status === 'DOWN').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
