import InvestmentCalculator from '@/components/calculators/InvestmentCalculator'

export const metadata = {
  title: 'Investment Calculator - Calculate Future Value & Compound Growth',
  description: 'Calculate investment growth with our comprehensive investment calculator. Project future value, compound interest, and inflation-adjusted returns.'
}

export default function InvestmentPage() {
  return <InvestmentCalculator />
}