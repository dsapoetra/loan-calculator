import InvestmentCalculator from '@/components/calculators/InvestmentCalculator'
import { CalculatorStructuredData } from '@/components/StructuredData'

export const metadata = {
  title: 'Free Investment Calculator - Calculate Future Value & Compound Growth',
  description: 'Calculate investment growth instantly with our free investment calculator. Project future value, compound interest, and inflation-adjusted returns. Plan your financial future with detailed projections.',
  keywords: 'investment calculator, compound interest calculator, future value calculator, retirement calculator, investment growth calculator, compound growth, financial planning',
  openGraph: {
    title: 'Free Investment Calculator - Calculate Future Value & Compound Growth',
    description: 'Calculate investment growth instantly with compound interest and inflation adjustments.',
    type: 'website',
    url: 'https://your-domain.com/investment',
    images: [
      {
        url: 'https://your-domain.com/og-investment.jpg',
        width: 1200,
        height: 630,
        alt: 'Investment Calculator - Compound Interest Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Investment Calculator - Calculate Future Value',
    description: 'Calculate investment growth instantly with compound interest calculations.',
    images: ['https://your-domain.com/og-investment.jpg'],
  },
  alternates: {
    canonical: 'https://your-domain.com/investment',
  },
}

export default function InvestmentPage() {
  return (
    <>
      <CalculatorStructuredData
        name="Investment Calculator"
        url="https://your-domain.com/investment"
        description="Calculate investment growth instantly with our free investment calculator. Project future value, compound interest, and inflation-adjusted returns."
        features={[
          'Future Value Calculation',
          'Compound Interest Analysis',
          'Inflation Adjustment',
          'Investment Growth Projection',
          'Return on Investment',
          'Financial Planning Tools'
        ]}
      />
      <InvestmentCalculator />
    </>
  )
}