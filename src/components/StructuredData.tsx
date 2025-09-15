import Script from 'next/script'

interface OrganizationSchema {
  '@context': string
  '@type': string
  name: string
  url: string
  logo: string
  description: string
  sameAs: string[]
  contactPoint: {
    '@type': string
    contactType: string
    url: string
  }
}

interface WebApplicationSchema {
  '@context': string
  '@type': string
  name: string
  url: string
  description: string
  applicationCategory: string
  operatingSystem: string
  offers: {
    '@type': string
    price: string
    priceCurrency: string
  }
  featureList: string[]
}

interface FAQPageSchema {
  '@context': string
  '@type': string
  mainEntity: Array<{
    '@type': string
    name: string
    acceptedAnswer: {
      '@type': string
      text: string
    }
  }>
}

export function OrganizationStructuredData() {
  const organizationSchema: OrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Loan Calculator',
    url: 'https://your-domain.com',
    logo: 'https://your-domain.com/logo.png',
    description: 'Free comprehensive loan calculators for mortgages, auto loans, personal loans, and investment planning.',
    sameAs: [
      // Add your social media URLs here
      // 'https://twitter.com/loancalculator',
      // 'https://facebook.com/loancalculator'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: 'https://your-domain.com'
    }
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationSchema)
      }}
    />
  )
}

export function WebApplicationStructuredData() {
  const webAppSchema: WebApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Loan Calculator - Financial Planning Tools',
    url: 'https://your-domain.com',
    description: 'Free comprehensive loan calculators for mortgages, auto loans, personal loans, and investment planning with detailed amortization schedules.',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    featureList: [
      'Mortgage Calculator',
      'Auto Loan Calculator', 
      'Personal Loan Calculator',
      'Investment Calculator',
      'Amortization Schedules',
      'PDF Reports',
      'Interactive Charts'
    ]
  }

  return (
    <Script
      id="webapp-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(webAppSchema)
      }}
    />
  )
}

export function FAQStructuredData() {
  const faqSchema: FAQPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Are these loan calculators free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all our loan calculators are completely free to use. No registration, no hidden fees, no limits on usage.'
        }
      },
      {
        '@type': 'Question',
        name: 'How accurate are the calculations?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our calculators use standard financial formulas and are highly accurate. However, actual loan terms may vary based on lender policies and your creditworthiness.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I save or print my calculations?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, you can generate PDF reports of your calculations and save them for your records or share with financial advisors.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do you store my financial information?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No, all calculations are performed in your browser. We don\'t store or transmit any of your financial information.'
        }
      }
    ]
  }

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema)
      }}
    />
  )
}

interface CalculatorPageSchema {
  '@context': string
  '@type': string
  name: string
  url: string
  description: string
  applicationCategory: string
  featureList: string[]
  isPartOf: {
    '@type': string
    name: string
    url: string
  }
}

interface CalculatorPageProps {
  name: string
  url: string
  description: string
  features: string[]
}

export function CalculatorStructuredData({ name, url, description, features }: CalculatorPageProps) {
  const calculatorSchema: CalculatorPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    url,
    description,
    applicationCategory: 'FinanceApplication',
    featureList: features,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Loan Calculator',
      url: 'https://your-domain.com'
    }
  }

  return (
    <Script
      id="calculator-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(calculatorSchema)
      }}
    />
  )
}
