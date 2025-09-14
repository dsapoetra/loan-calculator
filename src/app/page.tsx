import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Calculator, Home, Car, User, TrendingUp, BarChart3, Share, FileText } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Hero Section */}
      <div className="text-center py-12 mb-12">
        <div className="flex justify-center items-center mb-6">
          <Calculator className="h-16 w-16 text-blue-600 dark:text-blue-400 mr-4" />
          <h1 className="text-4xl md:text-5xl font-bold">
            Comprehensive Loan Calculators
          </h1>
        </div>
        <p className="text-xl max-w-3xl mx-auto">
          Make informed financial decisions with our suite of professional loan calculators.
          Calculate payments, view amortization schedules, and compare scenarios with interactive charts and reports.
        </p>
      </div>

      {/* Calculator Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 flex flex-col h-full border-slate-200 dark:border-slate-700">
          <CardHeader className="flex-grow">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-50 dark:bg-blue-950/50 rounded-lg mb-4 border border-blue-100 dark:border-blue-900/50">
              <Home className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-lg">Mortgage Calculator</CardTitle>
            <CardDescription className="flex-grow">
              Calculate monthly payments, view amortization schedules, and analyze loan-to-value ratios
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 mt-auto">
            <Link href="/mortgage">
              <Button className="w-full">Calculate Mortgage</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 flex flex-col h-full border-slate-200 dark:border-slate-700">
          <CardHeader className="flex-grow">
            <div className="flex items-center justify-center w-12 h-12 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg mb-4 border border-emerald-100 dark:border-emerald-900/50">
              <Car className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <CardTitle className="text-lg">Auto Loan Calculator</CardTitle>
            <CardDescription className="flex-grow">
              Determine car payments with trade-in values, taxes, and additional fees included
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 mt-auto">
            <Link href="/auto-loan">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700">Calculate Auto Loan</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 flex flex-col h-full border-slate-200 dark:border-slate-700">
          <CardHeader className="flex-grow">
            <div className="flex items-center justify-center w-12 h-12 bg-violet-50 dark:bg-violet-950/50 rounded-lg mb-4 border border-violet-100 dark:border-violet-900/50">
              <User className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <CardTitle className="text-lg">Personal Loan Calculator</CardTitle>
            <CardDescription className="flex-grow">
              Calculate personal loan payments with origination fees and debt-to-income ratios
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 mt-auto">
            <Link href="/personal-loan">
              <Button className="w-full bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-700">Calculate Personal Loan</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg dark:hover:shadow-xl transition-all duration-200 flex flex-col h-full border-slate-200 dark:border-slate-700">
          <CardHeader className="flex-grow">
            <div className="flex items-center justify-center w-12 h-12 bg-amber-50 dark:bg-amber-950/50 rounded-lg mb-4 border border-amber-100 dark:border-amber-900/50">
              <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <CardTitle className="text-lg">Investment Calculator</CardTitle>
            <CardDescription className="flex-grow">
              Project investment growth with compound interest and inflation adjustments
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 mt-auto">
            <Link href="/investment">
              <Button className="w-full bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700">Calculate Investment</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8 mb-12 transition-colors">
        <h2 className="text-3xl font-bold text-center mb-8 text-slate-900 dark:text-slate-100">Powerful Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center flex flex-col items-center">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-50 dark:bg-blue-950/50 rounded-lg mb-4 border border-blue-100 dark:border-blue-900/50">
              <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">Interactive Charts</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Visualize payment breakdowns, amortization schedules, and loan comparisons with dynamic charts
            </p>
          </div>

          <div className="text-center flex flex-col items-center">
            <div className="flex items-center justify-center w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg mb-4 border border-emerald-100 dark:border-emerald-900/50">
              <FileText className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">PDF Reports</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Generate professional loan reports with payment schedules and analysis for your records
            </p>
          </div>

          <div className="text-center flex flex-col items-center">
            <div className="flex items-center justify-center w-16 h-16 bg-violet-50 dark:bg-violet-950/50 rounded-lg mb-4 border border-violet-100 dark:border-violet-900/50">
              <Share className="h-8 w-8 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">Save & Share</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Save calculations and share scenarios with colleagues, family, or financial advisors
            </p>
          </div>
        </div>
      </div>

      {/* Credit Score Guide */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Interest Rate Guide by Credit Score</CardTitle>
          <CardDescription>
            Typical interest rates you might qualify for based on your credit score range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg flex flex-col h-full border border-emerald-100 dark:border-emerald-900/30">
              <div className="font-bold text-emerald-700 dark:text-emerald-400 text-lg mb-1">Excellent</div>
              <div className="text-sm text-slate-600 dark:text-slate-100 mb-3 font-medium">800-850</div>
              <div className="space-y-1 text-sm flex-grow text-slate-700 dark:text-slate-100">
                <div className="flex justify-between">
                  <span>Mortgage:</span>
                  <span className="font-medium">~6.5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Auto:</span>
                  <span className="font-medium">~4.5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Personal:</span>
                  <span className="font-medium">~6.0%</span>
                </div>
              </div>
            </div>

            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg flex flex-col h-full border border-blue-100 dark:border-blue-900/30">
              <div className="font-bold text-blue-700 dark:text-blue-400 text-lg mb-1">Very Good</div>
              <div className="text-sm text-slate-600 dark:text-slate-100 mb-3 font-medium">740-799</div>
              <div className="space-y-1 text-sm flex-grow text-slate-700 dark:text-slate-100">
                <div className="flex justify-between">
                  <span>Mortgage:</span>
                  <span className="font-medium">~6.8%</span>
                </div>
                <div className="flex justify-between">
                  <span>Auto:</span>
                  <span className="font-medium">~5.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>Personal:</span>
                  <span className="font-medium">~8.5%</span>
                </div>
              </div>
            </div>

            <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg flex flex-col h-full border border-amber-100 dark:border-amber-900/30">
              <div className="font-bold text-amber-700 dark:text-amber-400 text-lg mb-1">Good</div>
              <div className="text-sm text-slate-600 dark:text-slate-100 mb-3 font-medium">670-739</div>
              <div className="space-y-1 text-sm flex-grow text-slate-700 dark:text-slate-100">
                <div className="flex justify-between">
                  <span>Mortgage:</span>
                  <span className="font-medium">~7.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>Auto:</span>
                  <span className="font-medium">~6.8%</span>
                </div>
                <div className="flex justify-between">
                  <span>Personal:</span>
                  <span className="font-medium">~12.5%</span>
                </div>
              </div>
            </div>

            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg flex flex-col h-full border border-orange-100 dark:border-orange-900/30">
              <div className="font-bold text-orange-700 dark:text-orange-400 text-lg mb-1">Fair</div>
              <div className="text-sm text-slate-600 dark:text-slate-100 mb-3 font-medium">580-669</div>
              <div className="space-y-1 text-sm flex-grow text-slate-700 dark:text-slate-100">
                <div className="flex justify-between">
                  <span>Mortgage:</span>
                  <span className="font-medium">~8.1%</span>
                </div>
                <div className="flex justify-between">
                  <span>Auto:</span>
                  <span className="font-medium">~9.5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Personal:</span>
                  <span className="font-medium">~18.0%</span>
                </div>
              </div>
            </div>

            <div className="text-center p-4 bg-red-50 dark:bg-red-950/30 rounded-lg flex flex-col h-full border border-red-100 dark:border-red-900/30">
              <div className="font-bold text-red-700 dark:text-red-400 text-lg mb-1">Poor</div>
              <div className="text-sm text-slate-600 dark:text-slate-100 mb-3 font-medium">300-579</div>
              <div className="space-y-1 text-sm flex-grow text-slate-700 dark:text-slate-100">
                <div className="flex justify-between">
                  <span>Mortgage:</span>
                  <span className="font-medium">~9.5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Auto:</span>
                  <span className="font-medium">~14.0%</span>
                </div>
                <div className="flex justify-between">
                  <span>Personal:</span>
                  <span className="font-medium">~25.0%</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-100 mt-4">
            * Rates are approximate and vary by lender, loan amount, and other factors. Use as a general guide only.
          </p>
        </CardContent>
      </Card>

      {/* Get Started CTA */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-blue-700 dark:from-slate-700 dark:to-slate-800 text-white rounded-lg p-8 transition-all duration-200 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Ready to Calculate Your Loan?</h2>
        <p className="mb-6 text-white/90 dark:text-white/90">
          Choose from our comprehensive calculators to make informed financial decisions
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/mortgage">
            <Button variant="outline" className="bg-white/90 !text-blue-700 border-white/90 hover:bg-white hover:shadow-md dark:bg-slate-100 dark:!text-blue-700 dark:border-slate-100 dark:hover:bg-white transition-all duration-200">
              Start with Mortgage
            </Button>
          </Link>
          <Link href="/auto-loan">
            <Button variant="outline" className="bg-white/90 !text-blue-700 border-white/90 hover:bg-white hover:shadow-md dark:bg-slate-100 dark:!text-blue-700 dark:border-slate-100 dark:hover:bg-white transition-all duration-200">
              Calculate Auto Loan
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
