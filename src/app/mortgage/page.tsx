import { Suspense } from 'react'
import MortgageCalculator from '@/components/calculators/MortgageCalculator'

export const metadata = {
  title: 'Mortgage Calculator - Calculate Monthly Payments & Amortization',
  description: 'Calculate mortgage payments with our comprehensive mortgage calculator. View amortization schedules, payment breakdowns, and loan-to-value ratios.'
}

function MortgageCalculatorFallback() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-slate-200 dark:bg-slate-700 rounded-lg h-96"></div>
          <div className="bg-slate-200 dark:bg-slate-700 rounded-lg h-96"></div>
        </div>
      </div>
    </div>
  )
}

export default function MortgagePage() {
  return (
    <Suspense fallback={<MortgageCalculatorFallback />}>
      <MortgageCalculator />
    </Suspense>
  )
}