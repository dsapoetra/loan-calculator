import { Suspense } from 'react'
import MortgageCalculator from '@/components/calculators/MortgageCalculator'
import { CalculatorStructuredData } from '@/components/StructuredData'

export const metadata = {
  title: 'Free Mortgage Calculator - Calculate Monthly Payments & Amortization Schedule',
  description: 'Calculate mortgage payments instantly with our free mortgage calculator. View detailed amortization schedules, payment breakdowns, loan-to-value ratios, and total interest costs. Perfect for home buyers and refinancing.',
  keywords: 'mortgage calculator, home loan calculator, mortgage payment calculator, amortization schedule, mortgage rates, home loan payments, refinance calculator, loan to value ratio',
  openGraph: {
    title: 'Free Mortgage Calculator - Calculate Monthly Payments & Amortization',
    description: 'Calculate mortgage payments instantly with detailed amortization schedules and payment breakdowns.',
    type: 'website',
    url: 'https://your-domain.com/mortgage',
    images: [
      {
        url: 'https://your-domain.com/og-mortgage.jpg',
        width: 1200,
        height: 630,
        alt: 'Mortgage Calculator - Home Loan Payment Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Mortgage Calculator - Calculate Monthly Payments',
    description: 'Calculate mortgage payments instantly with detailed amortization schedules.',
    images: ['https://your-domain.com/og-mortgage.jpg'],
  },
  alternates: {
    canonical: 'https://your-domain.com/mortgage',
  },
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
    <>
      <CalculatorStructuredData
        name="Mortgage Calculator"
        url="https://your-domain.com/mortgage"
        description="Calculate mortgage payments instantly with our free mortgage calculator. View detailed amortization schedules, payment breakdowns, and loan-to-value ratios."
        features={[
          'Monthly Payment Calculation',
          'Amortization Schedule',
          'Payment Breakdown',
          'Loan-to-Value Ratio',
          'Total Interest Calculation',
          'PDF Report Generation'
        ]}
      />
      <Suspense fallback={<MortgageCalculatorFallback />}>
        <MortgageCalculator />
      </Suspense>
    </>
  )
}