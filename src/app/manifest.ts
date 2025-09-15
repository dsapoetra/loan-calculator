import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Loan Calculator - Financial Planning Tools',
    short_name: 'Loan Calculator',
    description: 'Comprehensive loan calculators for mortgages, auto loans, personal loans, and investment planning with detailed amortization schedules.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['finance', 'productivity', 'utilities'],
    lang: 'en',
    orientation: 'portrait-primary',
  }
}
