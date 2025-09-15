import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "@/components/Navigation";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'
import PageTracker from '@/components/PageTracker'


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://your-domain.com'), // Replace with your actual domain
  title: {
    default: "Loan Calculator - Mortgage, Auto, Personal & Investment Calculators",
    template: "%s | Loan Calculator"
  },
  description: "Free comprehensive loan calculators for mortgages, auto loans, personal loans, and investment planning. Calculate payments, view amortization schedules, and generate PDF reports instantly.",
  keywords: "loan calculator, mortgage calculator, auto loan calculator, personal loan calculator, investment calculator, amortization schedule, financial planning, loan payment calculator",
  authors: [{ name: "Loan Calculator Team" }],
  creator: "Loan Calculator",
  publisher: "Loan Calculator",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    siteName: 'Loan Calculator',
    title: 'Free Loan Calculator - Mortgage, Auto, Personal & Investment Calculators',
    description: 'Calculate loan payments instantly with our free comprehensive calculators. Get detailed amortization schedules, interactive charts, and PDF reports.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Loan Calculator - Financial Planning Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Loan Calculator - Financial Planning Tools',
    description: 'Calculate loan payments instantly with our free comprehensive calculators.',
    images: ['/og-image.jpg'],
    creator: '@loancalculator', // Replace with your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://your-domain.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Loan Calculator" />
        <meta name="application-name" content="Loan Calculator" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 dark:bg-slate-950 transition-colors`}
      >
        <ThemeProvider>
          <PageTracker />
          <header>
            <Navigation />
          </header>
          <main className="min-h-screen" role="main">
            {children}
          </main>
          <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 py-8 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  © 2024 Loan Calculator. Free financial planning tools for informed decisions.
                </p>
                <p className="text-slate-500 dark:text-slate-500 text-xs mt-2">
                  Calculate loan payments, view amortization schedules, and generate reports.
                </p>
              </div>
            </div>
          </footer>
          {gaId && <GoogleAnalytics gaId={gaId} />}
        </ThemeProvider>
      </body>
    </html>
  );
}
