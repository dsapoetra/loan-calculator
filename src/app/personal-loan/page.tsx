import PersonalLoanCalculator from '@/components/calculators/PersonalLoanCalculator'
import { CalculatorStructuredData } from '@/components/StructuredData'

export const metadata = {
  title: 'Free Personal Loan Calculator - Calculate Monthly Payments & Debt-to-Income',
  description: 'Calculate personal loan payments instantly with our free calculator. Include origination fees, debt-to-income analysis, and detailed payment schedules. Compare loan options and rates.',
  keywords: 'personal loan calculator, unsecured loan calculator, personal loan rates, debt consolidation calculator, loan payment calculator, debt to income ratio',
  openGraph: {
    title: 'Free Personal Loan Calculator - Calculate Monthly Payments & Debt-to-Income',
    description: 'Calculate personal loan payments instantly with origination fees and debt-to-income analysis.',
    type: 'website',
    url: 'https://your-domain.com/personal-loan',
    images: [
      {
        url: 'https://your-domain.com/og-personal-loan.jpg',
        width: 1200,
        height: 630,
        alt: 'Personal Loan Calculator - Unsecured Loan Payment Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Personal Loan Calculator - Calculate Monthly Payments',
    description: 'Calculate personal loan payments instantly with origination fees included.',
    images: ['https://your-domain.com/og-personal-loan.jpg'],
  },
  alternates: {
    canonical: 'https://your-domain.com/personal-loan',
  },
}

export default function PersonalLoanPage() {
  return (
    <>
      <CalculatorStructuredData
        name="Personal Loan Calculator"
        url="https://your-domain.com/personal-loan"
        description="Calculate personal loan payments instantly with our free calculator. Include origination fees, debt-to-income analysis, and detailed payment schedules."
        features={[
          'Monthly Payment Calculation',
          'Origination Fee Integration',
          'Debt-to-Income Analysis',
          'Payment Schedule',
          'Total Interest Calculation',
          'Loan Comparison Tools'
        ]}
      />
      <PersonalLoanCalculator />
    </>
  )
}