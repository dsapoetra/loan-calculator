import AutoLoanCalculator from '@/components/calculators/AutoLoanCalculator'
import { CalculatorStructuredData } from '@/components/StructuredData'

export const metadata = {
  title: 'Free Auto Loan Calculator - Calculate Car Payments with Taxes & Fees',
  description: 'Calculate auto loan payments instantly with our free car loan calculator. Include trade-in values, taxes, fees, and down payments. View detailed payment schedules and total loan costs.',
  keywords: 'auto loan calculator, car loan calculator, vehicle loan calculator, car payment calculator, auto financing calculator, car loan rates, vehicle financing',
  openGraph: {
    title: 'Free Auto Loan Calculator - Calculate Car Payments with Taxes & Fees',
    description: 'Calculate auto loan payments instantly with trade-ins, taxes, and fees included.',
    type: 'website',
    url: 'https://your-domain.com/auto-loan',
    images: [
      {
        url: 'https://your-domain.com/og-auto-loan.jpg',
        width: 1200,
        height: 630,
        alt: 'Auto Loan Calculator - Car Payment Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Auto Loan Calculator - Calculate Car Payments',
    description: 'Calculate auto loan payments instantly with trade-ins, taxes, and fees.',
    images: ['https://your-domain.com/og-auto-loan.jpg'],
  },
  alternates: {
    canonical: 'https://your-domain.com/auto-loan',
  },
}

export default function AutoLoanPage() {
  return (
    <>
      <CalculatorStructuredData
        name="Auto Loan Calculator"
        url="https://your-domain.com/auto-loan"
        description="Calculate auto loan payments instantly with our free car loan calculator. Include trade-in values, taxes, fees, and down payments."
        features={[
          'Monthly Payment Calculation',
          'Trade-in Value Integration',
          'Tax and Fee Calculation',
          'Down Payment Analysis',
          'Payment Schedule',
          'Total Cost Analysis'
        ]}
      />
      <AutoLoanCalculator />
    </>
  )
}