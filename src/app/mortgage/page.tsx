import MortgageCalculator from '@/components/calculators/MortgageCalculator'

export const metadata = {
  title: 'Mortgage Calculator - Calculate Monthly Payments & Amortization',
  description: 'Calculate mortgage payments with our comprehensive mortgage calculator. View amortization schedules, payment breakdowns, and loan-to-value ratios.'
}

export default function MortgagePage() {
  return <MortgageCalculator />
}