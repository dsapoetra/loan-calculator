import AutoLoanCalculator from '@/components/calculators/AutoLoanCalculator'

export const metadata = {
  title: 'Auto Loan Calculator - Calculate Car Payments with Taxes & Fees',
  description: 'Calculate auto loan payments with our comprehensive car loan calculator. Include trade-ins, taxes, fees, and view detailed payment schedules.'
}

export default function AutoLoanPage() {
  return <AutoLoanCalculator />
}