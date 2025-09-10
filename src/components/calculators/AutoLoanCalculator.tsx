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
import { autoLoanSchema, type AutoLoanFormData, creditScorePresets } from '@/lib/schemas'
import { calculateAutoLoan, formatCurrency, formatPercent, getBIRateBasedInterestRate, getIndonesianBankingInfo } from '@/lib/calculations'
import ComplianceAlert, { BIRateInfo } from '@/components/ui/ComplianceAlert'
import { trackCalculatorUsage, trackFormInteraction } from '@/lib/analytics'

export default function AutoLoanCalculator() {
  const [results, setResults] = useState<ReturnType<typeof calculateAutoLoan> | null>(null)
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<AutoLoanFormData>({
    resolver: zodResolver(autoLoanSchema),
    defaultValues: {
      vehiclePrice: 300000000,
      downPayment: 50000000,
      tradeInValue: 0,
      interestRate: getBIRateBasedInterestRate('auto'), // Use BI rate-based default
      loanTermYears: 5,
      salesTaxRate: 10,
      additionalFees: 5000000,
    },
    mode: 'onChange'
  })

  const watchedValues = watch()

  // Auto-calculate when form values change
  useEffect(() => {
    try {
      const calculation = calculateAutoLoan(watchedValues)
      setResults(calculation)

      // Track calculation event
      if (calculation && watchedValues.vehiclePrice > 0) {
        const loanAmount = watchedValues.vehiclePrice - watchedValues.downPayment - watchedValues.tradeInValue
        trackCalculatorUsage(
          'auto-loan',
          'calculate',
          loanAmount,
          watchedValues.interestRate,
          watchedValues.loanTermYears
        )
      }
    } catch (error) {
      // Only set results to null if there's an error, don't log every validation error
      console.error('Calculation error:', error)
      setResults(null)
    }
  }, [watchedValues.vehiclePrice, watchedValues.downPayment, watchedValues.tradeInValue, watchedValues.interestRate, watchedValues.loanTermYears, watchedValues.salesTaxRate, watchedValues.additionalFees, watchedValues])

  const onSubmit = (data: AutoLoanFormData) => {
    try {
      const calculation = calculateAutoLoan(data)
      setResults(calculation)
      trackFormInteraction('auto-loan', 'complete')
    } catch (error) {
      console.error('Calculation error:', error)
    }
  }

  const handleCreditPreset = (creditTier: string) => {
    if (creditTier in creditScorePresets) {
      setValue('interestRate', creditScorePresets[creditTier as keyof typeof creditScorePresets].autoRate)
    }
  }

  const handleBIRatePreset = () => {
    setValue('interestRate', getBIRateBasedInterestRate('auto'))
  }

  const bankingInfo = getIndonesianBankingInfo()

  const totalCostBeforeTaxes = watchedValues.vehiclePrice + watchedValues.additionalFees
  const taxAmount = totalCostBeforeTaxes * (watchedValues.salesTaxRate / 100)
  const totalCost = totalCostBeforeTaxes + taxAmount
  const netLoanAmount = totalCost - watchedValues.downPayment - watchedValues.tradeInValue
  const downPaymentPercentage = watchedValues.vehiclePrice > 0 
    ? ((watchedValues.downPayment / watchedValues.vehiclePrice) * 100)
    : 0

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Auto Loan Calculator</h1>
        <p className="text-gray-600 mt-2">Calculate your car payment with taxes, fees, trade-ins, and financing options</p>
        <p className="text-sm text-gray-500 mt-1">Compliant with Indonesian Banking Regulations (OJK)</p>
      </div>

      {/* BI Rate Information */}
      <BIRateInfo className="mb-6" />

      {/* Compliance Alerts */}
      {results && (
        <ComplianceAlert warnings={results.complianceWarnings} className="mb-6" />
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle & Loan Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* BI Rate Preset */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Indonesian Banking Rates</label>
                <div className="grid grid-cols-1 gap-2 mb-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleBIRatePreset}
                    className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                  >
                    Use BI Rate + Spread: {bankingInfo.suggestedRates.autoLoan}%
                  </Button>
                </div>
              </div>

              {/* Credit Score Presets */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Quick Interest Rate (by Credit Score)</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(creditScorePresets).map(([key, preset]) => (
                    <Button
                      key={key}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCreditPreset(key)}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}: {preset.autoRate}%
                    </Button>
                  ))}
                </div>
              </div>

              {/* Vehicle Price with Slider */}
              <div className="space-y-2">
                <NumberInput
                  label="Vehicle Price (Rupiah)"
                  value={watchedValues.vehiclePrice}
                  onChange={(value) => setValue('vehiclePrice', value)}
                  error={errors.vehiclePrice?.message}
                />
                <Slider
                  value={watchedValues.vehiclePrice}
                  onChange={(e) => setValue('vehiclePrice', Number(e.target.value))}
                  min={100000000}
                  max={1000000000}
                  step={10000000}
                  formatValue={(val) => formatCurrency(val)}
                />
              </div>

              {/* Down Payment with Slider */}
              <div className="space-y-2">
                <NumberInput
                  label="Down Payment (Rupiah)"
                  value={watchedValues.downPayment}
                  onChange={(value) => setValue('downPayment', value)}
                  error={errors.downPayment?.message}
                  helperText={`${downPaymentPercentage.toFixed(1)}% of vehicle price`}
                />
                <Slider
                  value={watchedValues.downPayment}
                  onChange={(e) => setValue('downPayment', Number(e.target.value))}
                  min={0}
                  max={watchedValues.vehiclePrice * 0.5}
                  step={5000000}
                  formatValue={(val) => formatCurrency(val)}
                />
              </div>

              {/* Trade-in Value */}
              <div className="space-y-2">
                <NumberInput
                  label="Trade-in Value (Rupiah)"
                  value={watchedValues.tradeInValue}
                  onChange={(value) => setValue('tradeInValue', value)}
                  error={errors.tradeInValue?.message}
                  helperText="Current value of your trade-in vehicle"
                />
                <Slider
                  value={watchedValues.tradeInValue}
                  onChange={(e) => setValue('tradeInValue', Number(e.target.value))}
                  min={0}
                  max={watchedValues.vehiclePrice * 0.8}
                  step={5000000}
                  formatValue={(val) => formatCurrency(val)}
                />
              </div>

              {/* Interest Rate */}
              <div className="space-y-2">
                <Input
                  {...register('interestRate', { valueAsNumber: true })}
                  label="Interest Rate (%)"
                  type="number"
                  step="0.01"
                  min="0"
                  max="20"
                  placeholder={`Enter interest rate (e.g., ${bankingInfo.suggestedRates.autoLoan})`}
                  error={errors.interestRate?.message}
                  helperText={`Current BI Rate: ${bankingInfo.biRate}% | Max allowed: ${bankingInfo.complianceRules.maxAutoLoanRate}%`}
                />
              </div>

              <Select
                {...register('loanTermYears', { valueAsNumber: true })}
                label="Loan Term"
                error={errors.loanTermYears?.message}
                helperText={`Maximum allowed: ${bankingInfo.complianceRules.maxLoanTermAutoLoan} years (Indonesian banking regulation)`}
                options={[
                  { value: 3, label: '3 years (36 months)' },
                  { value: 4, label: '4 years (48 months)' },
                  { value: 5, label: '5 years (60 months)' },
                  { value: 6, label: '6 years (72 months)' },
                  { value: 7, label: '7 years (84 months) - Maximum' },
                ]}
              />

              {/* Taxes and Fees */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Taxes & Fees</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Input
                      {...register('salesTaxRate', { valueAsNumber: true })}
                      label="Sales Tax Rate (%)"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="10.0"
                      error={errors.salesTaxRate?.message}
                      helperText={`Tax: ${formatCurrency(taxAmount)}`}
                    />
                  </div>
                  
                  <NumberInput
                    label="Additional Fees (Rupiah)"
                    value={watchedValues.additionalFees}
                    onChange={(value) => setValue('additionalFees', value)}
                    error={errors.additionalFees?.message}
                    helperText="Doc fees, registration, etc."
                  />
                </div>
              </div>

              {/* Loan Summary */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h3 className="font-medium">Loan Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Vehicle + Fees: {formatCurrency(totalCostBeforeTaxes)}</div>
                  <div>Sales Tax: {formatCurrency(taxAmount)}</div>
                  <div>Total Cost: {formatCurrency(totalCost)}</div>
                  <div>Net Loan: {formatCurrency(netLoanAmount)}</div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Calculate Auto Loan
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-green-700">
                      {formatCurrency(results.monthlyPayment)}
                    </div>
                    <div className="text-sm text-green-600">Monthly Payment</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-semibold">{formatCurrency(results.totalInterest)}</div>
                      <div className="text-sm text-gray-600">Total Interest</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-semibold">{formatCurrency(results.totalCost)}</div>
                      <div className="text-sm text-gray-600">Total of Payments</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loan Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-lg font-semibold">{formatCurrency(netLoanAmount)}</div>
                    <div className="text-sm text-gray-600">Amount Financed</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{results.loanToValue?.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Loan-to-Value Ratio</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{watchedValues.loanTermYears * 12}</div>
                    <div className="text-sm text-gray-600">Total Payments</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{formatPercent(watchedValues.interestRate)}</div>
                    <div className="text-sm text-gray-600">Interest Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Vehicle Price:</span>
                    <span>{formatCurrency(watchedValues.vehiclePrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Additional Fees:</span>
                    <span>{formatCurrency(watchedValues.additionalFees)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sales Tax ({watchedValues.salesTaxRate}%):</span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Total Cost:</span>
                    <span>{formatCurrency(totalCost)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Down Payment:</span>
                    <span>-{formatCurrency(watchedValues.downPayment)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Trade-in Value:</span>
                    <span>-{formatCurrency(watchedValues.tradeInValue)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold text-lg">
                    <span>Amount Financed:</span>
                    <span>{formatCurrency(netLoanAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amortization Table Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Schedule (First 12 months)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Payment</th>
                        <th className="text-left py-2">Amount</th>
                        <th className="text-left py-2">Principal</th>
                        <th className="text-left py-2">Interest</th>
                        <th className="text-left py-2">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.amortization.slice(0, 12).map((entry) => (
                        <tr key={entry.month} className="border-b">
                          <td className="py-2">{entry.month}</td>
                          <td className="py-2">{formatCurrency(entry.payment)}</td>
                          <td className="py-2">{formatCurrency(entry.principal)}</td>
                          <td className="py-2">{formatCurrency(entry.interest)}</td>
                          <td className="py-2">{formatCurrency(entry.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}