'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Calculator, Home, Car, User, TrendingUp } from 'lucide-react'
import { trackNavigation } from '@/lib/analytics'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Mortgage', href: '/mortgage', icon: Home },
  { name: 'Auto Loan', href: '/auto-loan', icon: Car },
  { name: 'Personal Loan', href: '/personal-loan', icon: User },
  { name: 'Investment', href: '/investment', icon: TrendingUp },
]

export default function Navigation() {
  const pathname = usePathname()

  const handleNavClick = (destination: string) => {
    const currentPage = pathname === '/' ? 'home' : pathname.slice(1)
    trackNavigation(destination, currentPage)
  }

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-lg border-b border-slate-200 dark:border-slate-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Calculator className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="ml-2 text-xl font-bold text-slate-900 dark:text-slate-100">Loan Calculator</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => handleNavClick(item.href === '/' ? 'home' : item.href.slice(1))}
                    className={cn(
                      'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'border-blue-500 dark:border-blue-400 text-slate-900 dark:text-slate-100'
                        : 'border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200'
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="sm:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => handleNavClick(item.href === '/' ? 'home' : item.href.slice(1))}
                className={cn(
                  'flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors',
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700'
                )}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
          <div className="px-3 py-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}