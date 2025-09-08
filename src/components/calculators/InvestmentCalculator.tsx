'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { NumberInput } from '@/components/ui/NumberInput'
import { Slider } from '@/components/ui/Slider'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import InvestmentGrowthChart from '@/components/charts/InvestmentGrowthChart'
import { investmentSchema, type InvestmentFormData } from '@/lib/schemas'
import { calculateInvestment, formatCurrency } from '@/lib/calculations'

export default function InvestmentCalculator() {
  const [results, setResults] = useState<ReturnType<typeof calculateInvestment> | null>(null)
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      initialInvestment: 25000000,
      monthlyContribution: 2000000,
      interestRate: 12.0,
      investmentDurationYears: 10,
      compoundingFrequency: 12,
      inflationRate: 3.5,
    },
    mode: 'onChange'
  })

  const watchedValues = watch()

  // Auto-calculate when form values change
  useEffect(() => {
    try {
      const calculation = calculateInvestment(watchedValues)
      setResults(calculation)
    } catch (error) {
      console.error('Calculation error:', error)
      setResults(null)
    }
  }, [watchedValues.initialInvestment, watchedValues.monthlyContribution, watchedValues.interestRate, watchedValues.investmentDurationYears, watchedValues.compoundingFrequency, watchedValues.inflationRate, watchedValues])

  const onSubmit = (data: InvestmentFormData) => {
    try {
      const calculation = calculateInvestment(data)
      setResults(calculation)
    } catch (error) {
      console.error('Calculation error:', error)
    }
  }

  const totalContributions = watchedValues.initialInvestment + 
    (watchedValues.monthlyContribution * 12 * watchedValues.investmentDurationYears)

  const compoundingOptions = [
    { value: 1, label: 'Annually' },
    { value: 4, label: 'Quarterly' },
    { value: 12, label: 'Monthly' },
    { value: 365, label: 'Daily' },
  ]

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Investment Calculator</h1>
        <p className="text-gray-600 mt-2">Project your investment growth with compound interest and inflation adjustments</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Initial Investment with Slider */}
              <div className="space-y-2">
                <NumberInput
                  label="Initial Investment (Rupiah)"
                  value={watchedValues.initialInvestment}
                  onChange={(value) => setValue('initialInvestment', value)}
                  error={errors.initialInvestment?.message}
                />
                <Slider
                  value={watchedValues.initialInvestment}
                  onChange={(e) => setValue('initialInvestment', Number(e.target.value))}
                  min={0}
                  max={200000000}
                  step={5000000}
                  formatValue={(val) => formatCurrency(val)}
                />
              </div>

              {/* Monthly Contribution with Slider */}
              <div className="space-y-2">
                <NumberInput
                  label="Monthly Contribution (Rupiah)"
                  value={watchedValues.monthlyContribution}
                  onChange={(value) => setValue('monthlyContribution', value)}
                  error={errors.monthlyContribution?.message}
                />
                <Slider
                  value={watchedValues.monthlyContribution}
                  onChange={(e) => setValue('monthlyContribution', Number(e.target.value))}
                  min={0}
                  max={10000000}
                  step={200000}
                  formatValue={(val) => formatCurrency(val)}
                />
              </div>

              {/* Interest Rate */}
              <div className="space-y-2">
                <Input
                  {...register('interestRate', { valueAsNumber: true })}
                  label="Annual Interest Rate (%)"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Enter interest rate (e.g., 12.0)"
                  error={errors.interestRate?.message}
                  helperText="Enter your expected annual return rate as a percentage"
                />
              </div>

              {/* Investment Duration with Slider */}
              <div className="space-y-2">
                <Input
                  {...register('investmentDurationYears', { valueAsNumber: true })}
                  label="Investment Duration (Years)"
                  type="number"
                  error={errors.investmentDurationYears?.message}
                />
                <Slider
                  value={watchedValues.investmentDurationYears}
                  onChange={(e) => setValue('investmentDurationYears', Number(e.target.value))}
                  min={1}
                  max={50}
                  step={1}
                  formatValue={(val) => `${val} years`}
                />
              </div>

              {/* Compounding Frequency */}
              <Select
                {...register('compoundingFrequency', { valueAsNumber: true })}
                label="Compounding Frequency"
                error={errors.compoundingFrequency?.message}
                options={compoundingOptions}
              />

              {/* Inflation Rate */}
              <div className="space-y-2">
                <Input
                  {...register('inflationRate', { valueAsNumber: true })}
                  label="Expected Inflation Rate (%)"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="3.5"
                  error={errors.inflationRate?.message}
                  helperText="Used to calculate inflation-adjusted returns"
                />
              </div>

              {/* Investment Summary */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h3 className="font-medium">Investment Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Initial: {formatCurrency(watchedValues.initialInvestment)}</div>
                  <div>Monthly: {formatCurrency(watchedValues.monthlyContribution)}</div>
                  <div>Duration: {watchedValues.investmentDurationYears} years</div>
                  <div>Total Contributions: {formatCurrency(totalContributions)}</div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                Calculate Investment Growth
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Investment Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-orange-700">
                      {formatCurrency(results.futureValue)}
                    </div>
                    <div className="text-sm text-orange-600">Future Value</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-semibold">{formatCurrency(results.totalContributions)}</div>
                      <div className="text-sm text-gray-600">Total Contributions</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-semibold">{formatCurrency(results.interestEarned)}</div>
                      <div className="text-sm text-gray-600">Interest Earned</div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Inflation-Adjusted Value:</span>
                      <span className="font-bold text-blue-700">{formatCurrency(results.realValue)}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Purchasing power in today&apos;s dollars
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-lg font-semibold">
                      {((results.interestEarned / results.totalContributions) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Total Return</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      {(((results.futureValue / results.totalContributions) ** (1 / watchedValues.investmentDurationYears) - 1) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Annual Growth Rate</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      {formatCurrency(results.futureValue / (watchedValues.investmentDurationYears * 12))}
                    </div>
                    <div className="text-sm text-gray-600">Average Monthly Growth</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      {(results.interestEarned / results.totalContributions * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600">Earnings vs Contributions</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Investment Growth Chart */}
            <Card>
              <CardContent className="pt-6">
                <InvestmentGrowthChart
                  data={results.projections}
                  title="Investment Growth Over Time"
                />
              </CardContent>
            </Card>

            {/* Year-by-Year Growth */}
            <Card>
              <CardHeader>
                <CardTitle>Growth Projections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-2 text-sm font-medium text-gray-600 border-b pb-2">
                    <div>Year</div>
                    <div>Total Value</div>
                    <div>Contributions</div>
                    <div>Interest</div>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {results.projections.map((projection) => (
                      <div key={projection.year} className="grid grid-cols-4 gap-2 text-sm">
                        <div className="font-medium">{projection.year}</div>
                        <div>{formatCurrency(projection.value)}</div>
                        <div className="text-gray-600">{formatCurrency(projection.contributions)}</div>
                        <div className="text-green-600">{formatCurrency(projection.interest)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Milestones */}
            <Card>
              <CardHeader>
                <CardTitle>Investment Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.projections.filter((_, index) => 
                    index === 4 || index === 9 || index === 14 || index === results.projections.length - 1
                  ).map((milestone) => (
                    <div key={milestone.year} className="p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">Year {milestone.year}</div>
                          <div className="text-sm text-gray-600">
                            {formatCurrency(milestone.contributions)} contributed
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{formatCurrency(milestone.value)}</div>
                          <div className="text-sm text-green-600">
                            +{formatCurrency(milestone.interest)} interest
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Investment Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Investment Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="p-3 bg-green-50 rounded">
                  <strong>Start Early:</strong> Time is your greatest asset in compound investing
                </div>
                <div className="p-3 bg-blue-50 rounded">
                  <strong>Consistent Contributions:</strong> Regular investing helps smooth out market volatility
                </div>
                <div className="p-3 bg-yellow-50 rounded">
                  <strong>Diversification:</strong> Don&apos;t put all your eggs in one basket
                </div>
                <div className="p-3 bg-purple-50 rounded">
                  <strong>Tax-Advantaged Accounts:</strong> Consider 401(k)s and IRAs for better returns
                </div>
                <div className="p-3 bg-orange-50 rounded">
                  <strong>Review Regularly:</strong> Adjust your strategy as your goals and circumstances change
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}