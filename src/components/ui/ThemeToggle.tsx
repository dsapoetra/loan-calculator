'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { Button } from './Button'
import { Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      case 'system':
        return <Monitor className="h-4 w-4" />
      default:
        return <Sun className="h-4 w-4" />
    }
  }

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light mode'
      case 'dark':
        return 'Dark mode'
      case 'system':
        return 'System theme'
      default:
        return 'Light mode'
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        'relative h-9 w-9 rounded-md transition-colors',
        'text-slate-700 dark:text-slate-300',
        'hover:bg-slate-100 dark:hover:bg-slate-800',
        'hover:text-slate-900 dark:hover:text-slate-100',
        'focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400'
      )}
      title={getLabel()}
      aria-label={getLabel()}
    >
      {getIcon()}
    </Button>
  )
}

export function ThemeToggleDropdown() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'relative h-9 w-9 rounded-md transition-colors',
          'text-slate-700 dark:text-slate-300',
          'hover:bg-slate-100 dark:hover:bg-slate-800',
          'hover:text-slate-900 dark:hover:text-slate-100',
          'focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400'
        )}
        title="Toggle theme"
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
      
      <div className="absolute right-0 top-full mt-2 w-48 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-1">
          <button
            onClick={() => setTheme('light')}
            className={cn(
              'flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors',
              'hover:bg-slate-100 dark:hover:bg-slate-700',
              theme === 'light' && 'bg-slate-100 dark:bg-slate-700'
            )}
          >
            <Sun className="h-4 w-4" />
            Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={cn(
              'flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors',
              'hover:bg-slate-100 dark:hover:bg-slate-700',
              theme === 'dark' && 'bg-slate-100 dark:bg-slate-700'
            )}
          >
            <Moon className="h-4 w-4" />
            Dark
          </button>
          <button
            onClick={() => setTheme('system')}
            className={cn(
              'flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors',
              'hover:bg-slate-100 dark:hover:bg-slate-700',
              theme === 'system' && 'bg-slate-100 dark:bg-slate-700'
            )}
          >
            <Monitor className="h-4 w-4" />
            System
          </button>
        </div>
      </div>
    </div>
  )
}
