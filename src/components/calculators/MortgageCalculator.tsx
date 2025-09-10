'use client'

import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { NumberInput } from '@/components/ui/NumberInput'
import { Slider } from '@/components/ui/Slider'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import AmortizationChart from '@/components/charts/AmortizationChart'
import PaymentBreakdownChart from '@/components/charts/PaymentBreakdownChart'
import BalanceChart from '@/components/charts/BalanceChart'
import ComplianceAlert, { BIRateInfo } from '@/components/ui/ComplianceAlert'
import { mortgageSchema, type MortgageFormData, creditScorePresets } from '@/lib/schemas'
import { calculateMortgage, formatCurrency, getBIRateBasedInterestRate, getIndonesianBankingInfo } from '@/lib/calculations'
import { PDFReportGenerator, downloadPDF } from '@/lib/pdf-generator'
import { FileDown, Share } from 'lucide-react'
import { trackCalculatorUsage, trackPDFExport, trackFormInteraction } from '@/lib/analytics'

export default function MortgageCalculator() {
  const searchParams = useSearchParams()

  const defaultValues = useMemo(() => ({
    loanAmount: 1000000000,
    interestRate: getBIRateBasedInterestRate('mortgage'), // Use BI rate-based default
    loanTermYears: 15,
    downPayment: 200000000, // 20% down payment
    propertyTax: 10000000,
    homeInsurance: 3000000,
    pmiRate: 0.5,
    hoaFees: 500000,
  }), [])
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<MortgageFormData>({
    resolver: zodResolver(mortgageSchema),
    defaultValues,
    mode: 'onChange'
  })

  const watchedValues = watch()

  // Load shared data from URL on component mount
  useEffect(() => {
    if (searchParams.toString()) {
      const sharedData = {
        loanAmount: Number(searchParams.get('loanAmount')) || defaultValues.loanAmount,
        interestRate: Number(searchParams.get('interestRate')) || defaultValues.interestRate,
        loanTermYears: Number(searchParams.get('loanTermYears')) || defaultValues.loanTermYears,
        downPayment: Number(searchParams.get('downPayment')) || defaultValues.downPayment,
        propertyTax: Number(searchParams.get('propertyTax')) || defaultValues.propertyTax,
        homeInsurance: Number(searchParams.get('homeInsurance')) || defaultValues.homeInsurance,
        pmiRate: Number(searchParams.get('pmiRate')) || defaultValues.pmiRate,
        hoaFees: Number(searchParams.get('hoaFees')) || defaultValues.hoaFees,
      }
      reset(sharedData)
    }
  }, [searchParams, reset, defaultValues])

  // Auto-calculate when form values change
  // Note: We intentionally don't include 'watchedValues' in dependencies to avoid infinite loops
  // since watchedValues is a new object reference on every render
  const results = useMemo(() => {
    try {
      const calculation = calculateMortgage(watchedValues)

      // Track calculation event when we have valid results
      if (calculation && watchedValues.loanAmount > 0) {
        trackCalculatorUsage(
          'mortgage',
          'calculate',
          watchedValues.loanAmount,
          watchedValues.interestRate,
          watchedValues.loanTermYears
        )
      }

      return calculation
    } catch (error) {
      console.error('Calculation error:', error)
      return null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues.loanAmount, watchedValues.interestRate, watchedValues.loanTermYears, watchedValues.downPayment, watchedValues.propertyTax, watchedValues.homeInsurance, watchedValues.pmiRate, watchedValues.hoaFees])

  const onSubmit = (data: MortgageFormData) => {
    // Form submission is handled automatically by the useMemo calculation
    // This function can be used for additional actions if needed
    trackFormInteraction('mortgage', 'complete')
    console.log('Form submitted with data:', data)
  }

  const handleCreditPreset = (creditTier: string) => {
    if (creditTier in creditScorePresets) {
      setValue('interestRate', creditScorePresets[creditTier as keyof typeof creditScorePresets].mortgageRate)
    }
  }

  const handleBIRatePreset = () => {
    setValue('interestRate', getBIRateBasedInterestRate('mortgage'))
  }

  const bankingInfo = getIndonesianBankingInfo()

  const handleDownloadPDF = () => {
    if (!results) return

    // Track PDF export
    trackPDFExport('mortgage', 'summary')

    const generator = new PDFReportGenerator()
    const pdfData = generator.generateMortgageReport(watchedValues, results)
    downloadPDF(pdfData, 'mortgage-report.pdf')
  }

  const handleShareResults = async () => {
    if (!results) return
    
    // Create URL with calculation parameters
    const params = new URLSearchParams({
      loanAmount: watchedValues.loanAmount.toString(),
      interestRate: watchedValues.interestRate.toString(),
      loanTermYears: watchedValues.loanTermYears.toString(),
      downPayment: watchedValues.downPayment.toString(),
      propertyTax: watchedValues.propertyTax.toString(),
      homeInsurance: watchedValues.homeInsurance.toString(),
      pmiRate: watchedValues.pmiRate.toString(),
      hoaFees: watchedValues.hoaFees.toString()
    })
    
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`
    
    const shareText = `Mortgage Calculator Results:
Monthly Payment: ${formatCurrency(results.monthlyPayment)}
Total Interest: ${formatCurrency(results.totalInterest)}
Total Cost: ${formatCurrency(results.totalCost)}
Home Price: ${formatCurrency(watchedValues.loanAmount)}
Down Payment: ${formatCurrency(watchedValues.downPayment)}

View calculation: ${shareUrl}`

    const shareData = {
      title: 'Mortgage Calculator Results',
      text: shareText,
      url: shareUrl
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Error sharing:', err)
        // Fallback to copy to clipboard
        navigator.clipboard.writeText(shareText)
        alert('Link copied to clipboard!')
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(shareText)
      alert('Link copied to clipboard!')
    }
  }

  const loanToValueRatio = watchedValues.loanAmount > 0 && watchedValues.downPayment > 0
    ? ((watchedValues.loanAmount - watchedValues.downPayment) / watchedValues.loanAmount) * 100
    : 0

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mortgage Calculator</h1>
        <p className="text-gray-600 mt-2">Calculate your monthly mortgage payment and view detailed amortization</p>
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
            <CardTitle>Loan Details</CardTitle>
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
                    Use BI Rate + Spread: {bankingInfo.suggestedRates.mortgage}%
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
                      {key.charAt(0).toUpperCase() + key.slice(1)}: {preset.mortgageRate}%
                    </Button>
                  ))}
                </div>
              </div>

              {/* Loan Amount with Slider */}
              <div className="space-y-2">
                <NumberInput
                  label="Home Price (Rupiah)"
                  value={watchedValues.loanAmount}
                  onChange={(value) => setValue('loanAmount', value)}
                  error={errors.loanAmount?.message}
                />
                <Slider
                  value={watchedValues.loanAmount}
                  onChange={(e) => setValue('loanAmount', Number(e.target.value))}
                  min={500000000}
                  max={5000000000}
                  step={50000000}
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
                  helperText={`${((watchedValues.downPayment / watchedValues.loanAmount) * 100 || 0).toFixed(1)}% of home price`}
                />
                <Slider
                  value={watchedValues.downPayment}
                  onChange={(e) => setValue('downPayment', Number(e.target.value))}
                  min={0}
                  max={watchedValues.loanAmount * 0.5}
                  step={25000000}
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
                  max="18"
                  placeholder={`Enter interest rate (e.g., ${bankingInfo.suggestedRates.mortgage})`}
                  error={errors.interestRate?.message}
                  helperText={`Current BI Rate: ${bankingInfo.biRate}% | Max allowed: ${bankingInfo.complianceRules.maxMortgageRate}%`}
                />
              </div>

              <Select
                {...register('loanTermYears', { valueAsNumber: true })}
                label="Loan Term"
                error={errors.loanTermYears?.message}
                helperText={`Maximum allowed: ${bankingInfo.complianceRules.maxLoanTermMortgage} years (Indonesian banking regulation)`}
                options={[
                  { value: 10, label: '10 years' },
                  { value: 15, label: '15 years' },
                  { value: 20, label: '20 years' },
                  { value: 25, label: '25 years (Maximum)' },
                ]}
              />

              {/* Additional Costs */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Additional Monthly Costs</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <NumberInput
                    label="Property Tax (Annual)"
                    value={watchedValues.propertyTax}
                    onChange={(value) => setValue('propertyTax', value)}
                    error={errors.propertyTax?.message}
                  />
                  
                  <NumberInput
                    label="Home Insurance (Annual)"
                    value={watchedValues.homeInsurance}
                    onChange={(value) => setValue('homeInsurance', value)}
                    error={errors.homeInsurance?.message}
                  />
                  
                  <Input
                    {...register('pmiRate', { valueAsNumber: true })}
                    label="PMI Rate (% annually)"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="0.5"
                    error={errors.pmiRate?.message}
                    helperText={loanToValueRatio > 80 ? `PMI required (LTV > 80% | Max LTV: ${bankingInfo.complianceRules.maxLoanToValueMortgage}%)` : 'PMI not required (LTV ≤ 80%)'}
                  />
                  
                  <NumberInput
                    label="HOA Fees (Monthly)"
                    value={watchedValues.hoaFees}
                    onChange={(value) => setValue('hoaFees', value)}
                    error={errors.hoaFees?.message}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Calculate Mortgage
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FileDown className="h-4 w-4" />
                Download PDF
              </Button>
              <Button
                onClick={handleShareResults}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Share className="h-4 w-4" />
                Share
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Payment Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">
                      {formatCurrency(results.monthlyPayment)}
                    </div>
                    <div className="text-sm text-blue-600">Total Monthly Payment</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-semibold">{formatCurrency(results.principalAndInterest || 0)}</div>
                      <div className="text-sm text-gray-600">Principal & Interest</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-semibold">{formatCurrency(results.monthlyTaxes || 0)}</div>
                      <div className="text-sm text-gray-600">Property Tax</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-semibold">{formatCurrency(results.monthlyInsurance || 0)}</div>
                      <div className="text-sm text-gray-600">Home Insurance</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-semibold">{formatCurrency((results.monthlyPMI || 0) + (results.monthlyHOA || 0))}</div>
                      <div className="text-sm text-gray-600">PMI + HOA</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loan Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-lg font-semibold">{formatCurrency(results.totalInterest)}</div>
                    <div className="text-sm text-gray-600">Total Interest</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{formatCurrency(results.totalCost)}</div>
                    <div className="text-sm text-gray-600">Total Cost</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{results.loanToValue?.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Loan-to-Value</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{results.amortization.length}</div>
                    <div className="text-sm text-gray-600">Total Payments</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Breakdown Chart */}
            <Card>
              <CardContent className="pt-6">
                <PaymentBreakdownChart
                  data={[
                    { name: 'Principal & Interest', value: results.principalAndInterest || 0, color: '#3b82f6' },
                    { name: 'Property Tax', value: results.monthlyTaxes || 0, color: '#10b981' },
                    { name: 'Home Insurance', value: results.monthlyInsurance || 0, color: '#f59e0b' },
                    { name: 'PMI', value: results.monthlyPMI || 0, color: '#ef4444' },
                    { name: 'HOA Fees', value: results.monthlyHOA || 0, color: '#8b5cf6' },
                  ].filter(item => item.value > 0)}
                  title="Monthly Payment Breakdown"
                />
              </CardContent>
            </Card>

            {/* Amortization Chart */}
            <Card>
              <CardContent className="pt-6">
                <AmortizationChart 
                  data={results.amortization}
                  title="Principal vs Interest Over Time"
                />
              </CardContent>
            </Card>

            {/* Balance Chart */}
            <Card>
              <CardContent className="pt-6">
                <BalanceChart 
                  data={results.amortization}
                  title="Remaining Balance Over Time"
                />
              </CardContent>
            </Card>

            {/* Amortization Table Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Amortization Schedule (First 12 months)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Month</th>
                        <th className="text-left py-2">Payment</th>
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