import PersonalLoanCalculator from '@/components/calculators/PersonalLoanCalculator'

export const metadata = {
  title: 'Personal Loan Calculator - Calculate Monthly Payments & Debt-to-Income',
  description: 'Calculate personal loan payments with our comprehensive calculator. Include origination fees, debt-to-income analysis, and payment schedules.'
}

export default function PersonalLoanPage() {
  return <PersonalLoanCalculator />
}