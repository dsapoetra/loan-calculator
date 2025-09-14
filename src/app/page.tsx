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
          <Calculator className="h-16 w-16 text-blue-600 mr-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Comprehensive Loan Calculators
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Make informed financial decisions with our suite of professional loan calculators. 
          Calculate payments, view amortization schedules, and compare scenarios with interactive charts and reports.
        </p>
      </div>

      {/* Calculator Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
          <CardHeader className="flex-grow">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <Home className="h-6 w-6 text-blue-600" />
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

        <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
          <CardHeader className="flex-grow">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <Car className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-lg">Auto Loan Calculator</CardTitle>
            <CardDescription className="flex-grow">
              Determine car payments with trade-in values, taxes, and additional fees included
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 mt-auto">
            <Link href="/auto-loan">
              <Button className="w-full bg-green-600 hover:bg-green-700">Calculate Auto Loan</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
          <CardHeader className="flex-grow">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Personal Loan Calculator</CardTitle>
            <CardDescription className="flex-grow">
              Calculate personal loan payments with origination fees and debt-to-income ratios
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 mt-auto">
            <Link href="/personal-loan">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Calculate Personal Loan</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
          <CardHeader className="flex-grow">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-lg">Investment Calculator</CardTitle>
            <CardDescription className="flex-grow">
              Project investment growth with compound interest and inflation adjustments
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 mt-auto">
            <Link href="/investment">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">Calculate Investment</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Powerful Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center flex flex-col items-center">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Interactive Charts</h3>
            <p className="text-gray-600 leading-relaxed">
              Visualize payment breakdowns, amortization schedules, and loan comparisons with dynamic charts
            </p>
          </div>

          <div className="text-center flex flex-col items-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg mb-4">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">PDF Reports</h3>
            <p className="text-gray-600 leading-relaxed">
              Generate professional loan reports with payment schedules and analysis for your records
            </p>
          </div>

          <div className="text-center flex flex-col items-center">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-lg mb-4">
              <Share className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Save & Share</h3>
            <p className="text-gray-600 leading-relaxed">
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
            <div className="text-center p-4 bg-green-50 rounded-lg flex flex-col h-full">
              <div className="font-bold text-green-700 text-lg mb-1">Excellent</div>
              <div className="text-sm text-gray-600 mb-3 font-medium">800-850</div>
              <div className="space-y-1 text-sm flex-grow">
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

            <div className="text-center p-4 bg-blue-50 rounded-lg flex flex-col h-full">
              <div className="font-bold text-blue-700 text-lg mb-1">Very Good</div>
              <div className="text-sm text-gray-600 mb-3 font-medium">740-799</div>
              <div className="space-y-1 text-sm flex-grow">
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

            <div className="text-center p-4 bg-yellow-50 rounded-lg flex flex-col h-full">
              <div className="font-bold text-yellow-700 text-lg mb-1">Good</div>
              <div className="text-sm text-gray-600 mb-3 font-medium">670-739</div>
              <div className="space-y-1 text-sm flex-grow">
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

            <div className="text-center p-4 bg-orange-50 rounded-lg flex flex-col h-full">
              <div className="font-bold text-orange-700 text-lg mb-1">Fair</div>
              <div className="text-sm text-gray-600 mb-3 font-medium">580-669</div>
              <div className="space-y-1 text-sm flex-grow">
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

            <div className="text-center p-4 bg-red-50 rounded-lg flex flex-col h-full">
              <div className="font-bold text-red-700 text-lg mb-1">Poor</div>
              <div className="text-sm text-gray-600 mb-3 font-medium">300-579</div>
              <div className="space-y-1 text-sm flex-grow">
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
          <p className="text-sm text-gray-500 mt-4">
            * Rates are approximate and vary by lender, loan amount, and other factors. Use as a general guide only.
          </p>
        </CardContent>
      </Card>

      {/* Get Started CTA */}
      <div className="text-center bg-blue-600 text-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Ready to Calculate Your Loan?</h2>
        <p className="mb-6 text-blue-100">
          Choose from our comprehensive calculators to make informed financial decisions
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/mortgage">
            <Button variant="outline" className="bg-white text-blue-600 border-white hover:bg-blue-50">
              Start with Mortgage
            </Button>
          </Link>
          <Link href="/auto-loan">
            <Button variant="outline" className="bg-white text-blue-600 border-white hover:bg-blue-50">
              Calculate Auto Loan
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
