'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Activity } from 'lucide-react'

export function MainNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: '/',
      label: 'Dashboard',
      active: pathname === '/',
    },
    {
      href: '/tasks',
      label: 'Tasks',
      active: pathname === '/tasks',
    },
    {
      href: '/browsers',
      label: 'Browsers',
      active: pathname === '/browsers',
    },
    {
      href: '/proxies',
      label: 'Proxies',
      active: pathname === '/proxies',
    },
    {
      href: '/accounts',
      label: 'Accounts',
      active: pathname === '/accounts',
    },
    {
      href: '/nodes',
      label: 'Nodes',
      active: pathname === '/nodes',
    },
  ]

  return (
    <div className="flex items-center space-x-6">
      <Link href="/" className="flex items-center space-x-2 group">
        <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
        <span className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">Zetsu</span>
      </Link>
      <nav className="flex items-center space-x-1 lg:space-x-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'text-sm font-semibold transition-all px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800',
              route.active
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

