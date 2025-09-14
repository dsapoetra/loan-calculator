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
  title: "Loan Calculator - Mortgage, Auto, Personal & Investment Calculators",
  description: "Comprehensive loan calculators for mortgages, auto loans, personal loans, and investment planning with detailed amortization schedules and interactive charts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 dark:bg-slate-950 transition-colors`}
      >
        <ThemeProvider>
          <PageTracker />
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          {gaId && <GoogleAnalytics gaId={gaId} />}
        </ThemeProvider>
      </body>
    </html>
  );
}
