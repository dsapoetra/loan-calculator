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
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Home className="h-8 w-8 text-blue-600 mb-2" />
            <CardTitle>Mortgage Calculator</CardTitle>
            <CardDescription>
              Calculate monthly payments, view amortization schedules, and analyze loan-to-value ratios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/mortgage">
              <Button className="w-full">Calculate Mortgage</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Car className="h-8 w-8 text-green-600 mb-2" />
            <CardTitle>Auto Loan Calculator</CardTitle>
            <CardDescription>
              Determine car payments with trade-in values, taxes, and additional fees included
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/auto-loan">
              <Button className="w-full bg-green-600 hover:bg-green-700">Calculate Auto Loan</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <User className="h-8 w-8 text-purple-600 mb-2" />
            <CardTitle>Personal Loan Calculator</CardTitle>
            <CardDescription>
              Calculate personal loan payments with origination fees and debt-to-income ratios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/personal-loan">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Calculate Personal Loan</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <TrendingUp className="h-8 w-8 text-orange-600 mb-2" />
            <CardTitle>Investment Calculator</CardTitle>
            <CardDescription>
              Project investment growth with compound interest and inflation adjustments
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Interactive Charts</h3>
            <p className="text-gray-600">
              Visualize payment breakdowns, amortization schedules, and loan comparisons with dynamic charts
            </p>
          </div>
          
          <div className="text-center">
            <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">PDF Reports</h3>
            <p className="text-gray-600">
              Generate professional loan reports with payment schedules and analysis for your records
            </p>
          </div>
          
          <div className="text-center">
            <Share className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Save & Share</h3>
            <p className="text-gray-600">
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
          <div className="grid md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="font-bold text-green-700">Excellent</div>
              <div className="text-sm text-gray-600 mb-2">800-850</div>
              <div className="space-y-1 text-sm">
                <div>Mortgage: ~6.5%</div>
                <div>Auto: ~4.5%</div>
                <div>Personal: ~6.0%</div>
              </div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="font-bold text-blue-700">Very Good</div>
              <div className="text-sm text-gray-600 mb-2">740-799</div>
              <div className="space-y-1 text-sm">
                <div>Mortgage: ~6.8%</div>
                <div>Auto: ~5.2%</div>
                <div>Personal: ~8.5%</div>
              </div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="font-bold text-yellow-700">Good</div>
              <div className="text-sm text-gray-600 mb-2">670-739</div>
              <div className="space-y-1 text-sm">
                <div>Mortgage: ~7.2%</div>
                <div>Auto: ~6.8%</div>
                <div>Personal: ~12.5%</div>
              </div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="font-bold text-orange-700">Fair</div>
              <div className="text-sm text-gray-600 mb-2">580-669</div>
              <div className="space-y-1 text-sm">
                <div>Mortgage: ~8.1%</div>
                <div>Auto: ~9.5%</div>
                <div>Personal: ~18.0%</div>
              </div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="font-bold text-red-700">Poor</div>
              <div className="text-sm text-gray-600 mb-2">300-579</div>
              <div className="space-y-1 text-sm">
                <div>Mortgage: ~9.5%</div>
                <div>Auto: ~14.0%</div>
                <div>Personal: ~25.0%</div>
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
