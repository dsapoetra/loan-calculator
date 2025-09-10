'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '@/lib/analytics'

export function usePageTracking() {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view when pathname changes
    trackPageView(pathname)
  }, [pathname])
}
