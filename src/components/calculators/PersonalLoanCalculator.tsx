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
import { personalLoanSchema, type PersonalLoanFormData, creditScorePresets } from '@/lib/schemas'
import { calculatePersonalLoan, formatCurrency, formatPercent, getBIRateBasedInterestRate, getIndonesianBankingInfo } from '@/lib/calculations'
import ComplianceAlert, { BIRateInfo } from '@/components/ui/ComplianceAlert'
import { trackCalculatorUsage, trackFormInteraction } from '@/lib/analytics'

export default function PersonalLoanCalculator() {
  const [results, setResults] = useState<ReturnType<typeof calculatePersonalLoan> | null>(null)
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<PersonalLoanFormData>({
    resolver: zodResolver(personalLoanSchema),
    defaultValues: {
      loanAmount: 50000000,
      interestRate: getBIRateBasedInterestRate('personal'), // Use BI rate-based default
      loanTermMonths: 36,
      originationFeeRate: 3.0,
      monthlyIncome: 4200000,
    },
    mode: 'onChange'
  })

  const watchedValues = watch()

  // Auto-calculate when form values change
  useEffect(() => {
    try {
      const calculation = calculatePersonalLoan(watchedValues)
      setResults(calculation)

      // Track calculation event
      if (calculation && watchedValues.loanAmount > 0) {
        trackCalculatorUsage(
          'personal-loan',
          'calculate',
          watchedValues.loanAmount,
          watchedValues.interestRate,
          watchedValues.loanTermMonths / 12 // convert months to years
        )
      }
    } catch (error) {
      console.error('Calculation error:', error)
      setResults(null)
    }
  }, [watchedValues.loanAmount, watchedValues.interestRate, watchedValues.loanTermMonths, watchedValues.originationFeeRate, watchedValues.monthlyIncome])

  const onSubmit = (data: PersonalLoanFormData) => {
    try {
      const calculation = calculatePersonalLoan(data)
      setResults(calculation)
      trackFormInteraction('personal-loan', 'complete')
    } catch (error) {
      console.error('Calculation error:', error)
    }
  }

  const handleCreditPreset = (creditTier: string) => {
    if (creditTier in creditScorePresets) {
      setValue('interestRate', creditScorePresets[creditTier as keyof typeof creditScorePresets].personalRate)
    }
  }

  const handleBIRatePreset = () => {
    setValue('interestRate', getBIRateBasedInterestRate('personal'))
  }

  const bankingInfo = getIndonesianBankingInfo()

  const originationFee = watchedValues.loanAmount * (watchedValues.originationFeeRate / 100)
  const totalCost = watchedValues.loanAmount + originationFee

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Personal Loan Calculator</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Calculate personal loan payments with origination fees and debt-to-income analysis</p>
        <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">Compliant with Indonesian Banking Regulations (OJK)</p>
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
            <CardTitle>Loan Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* BI Rate Preset */}
              <div>
                <label className="text-sm font-medium mb-2 block text-slate-700 dark:text-slate-300">Indonesian Banking Rates</label>
                <div className="grid grid-cols-1 gap-2 mb-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleBIRatePreset}
                    className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                  >
                    Use BI Rate + Spread: {bankingInfo.suggestedRates.personalLoan}%
                  </Button>
                </div>
              </div>

              {/* Credit Score Presets */}
              <div>
                <label className="text-sm font-medium mb-2 block">Quick Interest Rate (by Credit Score)</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(creditScorePresets).map(([key, preset]) => (
                    <Button
                      key={key}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCreditPreset(key)}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}: {preset.personalRate}%
                    </Button>
                  ))}
                </div>
              </div>

              {/* Loan Amount with Slider */}
              <div className="space-y-2">
                <NumberInput
                  label="Loan Amount (Rupiah)"
                  value={watchedValues.loanAmount}
                  onChange={(value) => setValue('loanAmount', value)}
                  error={errors.loanAmount?.message}
                />
                <Slider
                  value={watchedValues.loanAmount}
                  onChange={(e) => setValue('loanAmount', Number(e.target.value))}
                  min={10000000}
                  max={200000000}
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
                  max="24"
                  placeholder={`Enter interest rate (e.g., ${bankingInfo.suggestedRates.personalLoan})`}
                  error={errors.interestRate?.message}
                  helperText={`Current BI Rate: ${bankingInfo.biRate}% | Max allowed: ${bankingInfo.complianceRules.maxPersonalLoanRate}%`}
                />
              </div>

              {/* Loan Term */}
              <Select
                {...register('loanTermMonths', { valueAsNumber: true })}
                label="Loan Term"
                error={errors.loanTermMonths?.message}
                helperText={`Maximum allowed: ${bankingInfo.complianceRules.maxLoanTermPersonalLoan} months (Indonesian banking regulation)`}
                options={[
                  { value: 12, label: '1 year (12 months)' },
                  { value: 24, label: '2 years (24 months)' },
                  { value: 36, label: '3 years (36 months)' },
                  { value: 48, label: '4 years (48 months)' },
                  { value: 60, label: '5 years (60 months) - Maximum' },
                ]}
              />

              {/* Origination Fee */}
              <div className="space-y-2">
                <Input
                  {...register('originationFeeRate', { valueAsNumber: true })}
                  label="Origination Fee (%)"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="3.0"
                  error={errors.originationFeeRate?.message}
                  helperText={`Fee: ${formatCurrency(originationFee)}`}
                />
              </div>

              {/* Monthly Income (Optional) */}
              <NumberInput
                label="Monthly Income (Optional)"
                value={watchedValues.monthlyIncome || 0}
                onChange={(value) => setValue('monthlyIncome', value || undefined)}
                error={errors.monthlyIncome?.message}
                helperText={`Used to calculate debt-to-income ratio (Max DTI: ${bankingInfo.complianceRules.maxDebtToIncomeRatio}%)`}
                placeholder="Enter your monthly income"
              />

              {/* Loan Summary */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h3 className="font-medium">Loan Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Loan Amount: {formatCurrency(watchedValues.loanAmount)}</div>
                  <div>Origination Fee: {formatCurrency(originationFee)}</div>
                  <div>Total Cost: {formatCurrency(totalCost)}</div>
                  <div>Term: {watchedValues.loanTermMonths} months</div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 !text-white">
                Calculate Personal Loan
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
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-purple-700">
                      {formatCurrency(results.monthlyPayment)}
                    </div>
                    <div className="text-sm text-purple-600">Monthly Payment</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-semibold">{formatCurrency(results.totalInterest)}</div>
                      <div className="text-sm text-gray-600">Total Interest</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-semibold">{formatCurrency(results.totalCost)}</div>
                      <div className="text-sm text-gray-600">Total Cost</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loan Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-lg font-semibold">{formatCurrency(watchedValues.loanAmount)}</div>
                    <div className="text-sm text-gray-600">Principal Amount</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{formatCurrency(originationFee)}</div>
                    <div className="text-sm text-gray-600">Origination Fee</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{watchedValues.loanTermMonths}</div>
                    <div className="text-sm text-gray-600">Total Payments</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{formatPercent(watchedValues.interestRate)}</div>
                    <div className="text-sm text-gray-600">Interest Rate</div>
                  </div>
                </div>

                {results.debtToIncome && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Debt-to-Income Ratio:</span>
                      <span className={`font-bold ${
                        results.debtToIncome <= 20 ? 'text-green-600' :
                        results.debtToIncome <= 36 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {results.debtToIncome.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {results.debtToIncome <= 20 && 'Excellent - Well within recommended limits'}
                      {results.debtToIncome > 20 && results.debtToIncome <= 36 && 'Good - Within acceptable range'}
                      {results.debtToIncome > 36 && 'Caution - Above recommended 36% limit'}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Principal Amount:</span>
                    <span>{formatCurrency(watchedValues.loanAmount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Origination Fee ({watchedValues.originationFeeRate}%):</span>
                    <span>{formatCurrency(originationFee)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Total Interest:</span>
                    <span>{formatCurrency(results.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold text-lg text-slate-900 dark:text-slate-100">
                    <span>Total Cost:</span>
                    <span>{formatCurrency(results.totalCost)}</span>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    You&apos;ll pay {formatCurrency(results.totalInterest + originationFee)} in interest and fees
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

            {/* Tips Section */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Loan Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 rounded">
                  <strong>Good Debt-to-Income:</strong> Keep total monthly debt payments under 36% of income
                </div>
                <div className="p-3 bg-green-50 rounded">
                  <strong>Shop Around:</strong> Interest rates can vary significantly between lenders
                </div>
                <div className="p-3 bg-yellow-50 rounded">
                  <strong>Watch for Fees:</strong> Some lenders charge origination, prepayment, or late fees
                </div>
                <div className="p-3 bg-purple-50 rounded">
                  <strong>Consider Alternatives:</strong> Credit cards or home equity loans might offer better rates
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}