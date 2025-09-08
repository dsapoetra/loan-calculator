// Indonesian Banking Regulations
export interface IndonesianBankingRates {
  biRate: number // Bank Indonesia reference rate
  lastUpdated: Date
  mortgageBaseRate: number // BI Rate + spread
  autoLoanBaseRate: number
  personalLoanBaseRate: number
}

export interface IndonesianComplianceRules {
  maxMortgageRate: number
  maxAutoLoanRate: number
  maxPersonalLoanRate: number
  maxLoanToValueMortgage: number // Maximum LTV for mortgages (typically 80-90%)
  maxDebtToIncomeRatio: number // Maximum DTI ratio (typically 30-40%)
  minDownPaymentMortgage: number // Minimum down payment percentage
  maxLoanTermMortgage: number // Maximum loan term in years
  maxLoanTermAutoLoan: number
  maxLoanTermPersonalLoan: number // in months
}

export const INDONESIAN_BANKING_COMPLIANCE: IndonesianComplianceRules = {
  maxMortgageRate: 18.0, // Maximum mortgage interest rate
  maxAutoLoanRate: 20.0, // Maximum auto loan interest rate
  maxPersonalLoanRate: 24.0, // Maximum personal loan interest rate
  maxLoanToValueMortgage: 90.0, // Maximum 90% LTV for mortgages
  maxDebtToIncomeRatio: 40.0, // Maximum 40% debt-to-income ratio
  minDownPaymentMortgage: 10.0, // Minimum 10% down payment
  maxLoanTermMortgage: 25, // Maximum 25 years for mortgages
  maxLoanTermAutoLoan: 7, // Maximum 7 years for auto loans
  maxLoanTermPersonalLoan: 60, // Maximum 60 months for personal loans
}

// Current BI Rate (should be updated from API in production)
export const CURRENT_BI_RATES: IndonesianBankingRates = {
  biRate: 5.00, // Current BI Rate as of August 2025
  lastUpdated: new Date('2025-08-20'),
  mortgageBaseRate: 8.5, // BI Rate + 3.5% spread
  autoLoanBaseRate: 9.0, // BI Rate + 4.0% spread
  personalLoanBaseRate: 15.0, // BI Rate + 10.0% spread
}

export interface MortgageInputs {
  loanAmount: number
  interestRate: number
  loanTermYears: number
  downPayment: number
  propertyTax: number
  homeInsurance: number
  pmiRate: number
  hoaFees: number
}

export interface AutoLoanInputs {
  vehiclePrice: number
  downPayment: number
  tradeInValue: number
  interestRate: number
  loanTermYears: number
  salesTaxRate: number
  additionalFees: number
}

export interface PersonalLoanInputs {
  loanAmount: number
  interestRate: number
  loanTermMonths: number
  originationFeeRate: number
  monthlyIncome?: number
}

export interface InvestmentInputs {
  initialInvestment: number
  monthlyContribution: number
  interestRate: number
  investmentDurationYears: number
  compoundingFrequency: number
  inflationRate: number
}

export interface LoanResult {
  monthlyPayment: number
  totalInterest: number
  totalCost: number
  principalAndInterest?: number
  monthlyTaxes?: number
  monthlyInsurance?: number
  monthlyPMI?: number
  monthlyHOA?: number
  loanToValue?: number
  debtToIncome?: number
}

export interface InvestmentResult {
  futureValue: number
  totalContributions: number
  interestEarned: number
  realValue: number
}

export interface AmortizationEntry {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
  cumulativeInterest: number
}

export interface ComplianceWarning {
  type: 'warning' | 'error'
  message: string
  field: string
}

// Indonesian Banking Compliance Validation Functions
export function validateIndonesianMortgageCompliance(inputs: MortgageInputs): ComplianceWarning[] {
  const warnings: ComplianceWarning[] = []
  const { loanAmount, interestRate, loanTermYears, downPayment } = inputs

  // Check interest rate compliance
  if (interestRate > INDONESIAN_BANKING_COMPLIANCE.maxMortgageRate) {
    warnings.push({
      type: 'error',
      message: `Interest rate exceeds maximum allowed rate of ${INDONESIAN_BANKING_COMPLIANCE.maxMortgageRate}% for mortgages in Indonesia`,
      field: 'interestRate'
    })
  }

  // Check loan term compliance
  if (loanTermYears > INDONESIAN_BANKING_COMPLIANCE.maxLoanTermMortgage) {
    warnings.push({
      type: 'error',
      message: `Loan term exceeds maximum allowed term of ${INDONESIAN_BANKING_COMPLIANCE.maxLoanTermMortgage} years for mortgages in Indonesia`,
      field: 'loanTermYears'
    })
  }

  // Check loan-to-value ratio
  const loanToValue = ((loanAmount - downPayment) / loanAmount) * 100
  if (loanToValue > INDONESIAN_BANKING_COMPLIANCE.maxLoanToValueMortgage) {
    warnings.push({
      type: 'error',
      message: `Loan-to-value ratio of ${loanToValue.toFixed(1)}% exceeds maximum allowed LTV of ${INDONESIAN_BANKING_COMPLIANCE.maxLoanToValueMortgage}%`,
      field: 'downPayment'
    })
  }

  // Check minimum down payment
  const downPaymentPercentage = (downPayment / loanAmount) * 100
  if (downPaymentPercentage < INDONESIAN_BANKING_COMPLIANCE.minDownPaymentMortgage) {
    warnings.push({
      type: 'error',
      message: `Down payment of ${downPaymentPercentage.toFixed(1)}% is below minimum required ${INDONESIAN_BANKING_COMPLIANCE.minDownPaymentMortgage}%`,
      field: 'downPayment'
    })
  }

  // Warning if rate is significantly above BI base rate
  if (interestRate > CURRENT_BI_RATES.mortgageBaseRate + 3) {
    warnings.push({
      type: 'warning',
      message: `Interest rate is significantly higher than current market rate (BI Rate + spread: ${CURRENT_BI_RATES.mortgageBaseRate}%)`,
      field: 'interestRate'
    })
  }

  return warnings
}

export function validateIndonesianAutoLoanCompliance(inputs: AutoLoanInputs): ComplianceWarning[] {
  const warnings: ComplianceWarning[] = []
  const { interestRate, loanTermYears } = inputs

  // Check interest rate compliance
  if (interestRate > INDONESIAN_BANKING_COMPLIANCE.maxAutoLoanRate) {
    warnings.push({
      type: 'error',
      message: `Interest rate exceeds maximum allowed rate of ${INDONESIAN_BANKING_COMPLIANCE.maxAutoLoanRate}% for auto loans in Indonesia`,
      field: 'interestRate'
    })
  }

  // Check loan term compliance
  if (loanTermYears > INDONESIAN_BANKING_COMPLIANCE.maxLoanTermAutoLoan) {
    warnings.push({
      type: 'error',
      message: `Loan term exceeds maximum allowed term of ${INDONESIAN_BANKING_COMPLIANCE.maxLoanTermAutoLoan} years for auto loans in Indonesia`,
      field: 'loanTermYears'
    })
  }

  // Warning if rate is significantly above BI base rate
  if (interestRate > CURRENT_BI_RATES.autoLoanBaseRate + 3) {
    warnings.push({
      type: 'warning',
      message: `Interest rate is significantly higher than current market rate (BI Rate + spread: ${CURRENT_BI_RATES.autoLoanBaseRate}%)`,
      field: 'interestRate'
    })
  }

  return warnings
}

export function validateIndonesianPersonalLoanCompliance(inputs: PersonalLoanInputs): ComplianceWarning[] {
  const warnings: ComplianceWarning[] = []
  const { interestRate, loanTermMonths, loanAmount, monthlyIncome } = inputs

  // Check interest rate compliance
  if (interestRate > INDONESIAN_BANKING_COMPLIANCE.maxPersonalLoanRate) {
    warnings.push({
      type: 'error',
      message: `Interest rate exceeds maximum allowed rate of ${INDONESIAN_BANKING_COMPLIANCE.maxPersonalLoanRate}% for personal loans in Indonesia`,
      field: 'interestRate'
    })
  }

  // Check loan term compliance
  if (loanTermMonths > INDONESIAN_BANKING_COMPLIANCE.maxLoanTermPersonalLoan) {
    warnings.push({
      type: 'error',
      message: `Loan term exceeds maximum allowed term of ${INDONESIAN_BANKING_COMPLIANCE.maxLoanTermPersonalLoan} months for personal loans in Indonesia`,
      field: 'loanTermMonths'
    })
  }

  // Check debt-to-income ratio if monthly income is provided
  if (monthlyIncome && monthlyIncome > 0) {
    const monthlyRate = interestRate / 100 / 12
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) /
      (Math.pow(1 + monthlyRate, loanTermMonths) - 1)
    const debtToIncomeRatio = (monthlyPayment / monthlyIncome) * 100

    if (debtToIncomeRatio > INDONESIAN_BANKING_COMPLIANCE.maxDebtToIncomeRatio) {
      warnings.push({
        type: 'error',
        message: `Debt-to-income ratio of ${debtToIncomeRatio.toFixed(1)}% exceeds maximum allowed DTI of ${INDONESIAN_BANKING_COMPLIANCE.maxDebtToIncomeRatio}%`,
        field: 'monthlyIncome'
      })
    }
  }

  // Warning if rate is significantly above BI base rate
  if (interestRate > CURRENT_BI_RATES.personalLoanBaseRate + 5) {
    warnings.push({
      type: 'warning',
      message: `Interest rate is significantly higher than current market rate (BI Rate + spread: ${CURRENT_BI_RATES.personalLoanBaseRate}%)`,
      field: 'interestRate'
    })
  }

  return warnings
}

export function calculateMortgage(inputs: MortgageInputs): LoanResult & { amortization: AmortizationEntry[]; complianceWarnings: ComplianceWarning[] } {
  const {
    loanAmount,
    interestRate,
    loanTermYears,
    downPayment,
    propertyTax,
    homeInsurance,
    pmiRate,
    hoaFees
  } = inputs

  const principal = loanAmount - downPayment
  const monthlyRate = interestRate / 100 / 12
  const totalMonths = loanTermYears * 12

  // Monthly principal and interest
  const monthlyPI = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
    (Math.pow(1 + monthlyRate, totalMonths) - 1)

  // Monthly taxes, insurance, PMI, HOA
  const monthlyTaxes = propertyTax / 12
  const monthlyInsurance = homeInsurance / 12
  const monthlyPMI = principal * (pmiRate / 100) / 12
  const monthlyHOA = hoaFees

  const monthlyPayment = monthlyPI + monthlyTaxes + monthlyInsurance + monthlyPMI + monthlyHOA

  // Calculate amortization schedule
  const amortization: AmortizationEntry[] = []
  let remainingBalance = principal
  let cumulativeInterest = 0

  for (let month = 1; month <= totalMonths; month++) {
    const interestPayment = remainingBalance * monthlyRate
    const principalPayment = monthlyPI - interestPayment
    remainingBalance -= principalPayment
    cumulativeInterest += interestPayment

    amortization.push({
      month,
      payment: monthlyPI,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, remainingBalance),
      cumulativeInterest
    })
  }

  const totalInterest = amortization.reduce((sum, entry) => sum + entry.interest, 0)
  const totalCost = principal + totalInterest + (monthlyTaxes + monthlyInsurance + monthlyHOA) * totalMonths

  const loanToValue = (principal / loanAmount) * 100

  // Validate Indonesian banking compliance
  const complianceWarnings = validateIndonesianMortgageCompliance(inputs)

  return {
    monthlyPayment,
    totalInterest,
    totalCost,
    principalAndInterest: monthlyPI,
    monthlyTaxes,
    monthlyInsurance,
    monthlyPMI,
    monthlyHOA,
    loanToValue,
    amortization,
    complianceWarnings
  }
}

export function calculateAutoLoan(inputs: AutoLoanInputs): LoanResult & { amortization: AmortizationEntry[]; complianceWarnings: ComplianceWarning[] } {
  const {
    vehiclePrice,
    downPayment,
    tradeInValue,
    interestRate,
    loanTermYears,
    salesTaxRate,
    additionalFees
  } = inputs

  const taxAmount = vehiclePrice * (salesTaxRate / 100)
  const totalCost = vehiclePrice + taxAmount + additionalFees
  const principal = totalCost - downPayment - tradeInValue

  const monthlyRate = interestRate / 100 / 12
  const totalMonths = loanTermYears * 12

  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
    (Math.pow(1 + monthlyRate, totalMonths) - 1)

  // Calculate amortization schedule
  const amortization: AmortizationEntry[] = []
  let remainingBalance = principal
  let cumulativeInterest = 0

  for (let month = 1; month <= totalMonths; month++) {
    const interestPayment = remainingBalance * monthlyRate
    const principalPayment = monthlyPayment - interestPayment
    remainingBalance -= principalPayment
    cumulativeInterest += interestPayment

    amortization.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, remainingBalance),
      cumulativeInterest
    })
  }

  const totalInterest = amortization.reduce((sum, entry) => sum + entry.interest, 0)
  const loanToValue = (principal / vehiclePrice) * 100

  // Validate Indonesian banking compliance
  const complianceWarnings = validateIndonesianAutoLoanCompliance(inputs)

  return {
    monthlyPayment,
    totalInterest,
    totalCost: principal + totalInterest,
    loanToValue,
    amortization,
    complianceWarnings
  }
}

export function calculatePersonalLoan(inputs: PersonalLoanInputs): LoanResult & { amortization: AmortizationEntry[]; complianceWarnings: ComplianceWarning[] } {
  const {
    loanAmount,
    interestRate,
    loanTermMonths,
    originationFeeRate,
    monthlyIncome
  } = inputs

  const originationFee = loanAmount * (originationFeeRate / 100)
  const principal = loanAmount
  const monthlyRate = interestRate / 100 / 12

  const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) / 
    (Math.pow(1 + monthlyRate, loanTermMonths) - 1)

  // Calculate amortization schedule
  const amortization: AmortizationEntry[] = []
  let remainingBalance = principal
  let cumulativeInterest = 0

  for (let month = 1; month <= loanTermMonths; month++) {
    const interestPayment = remainingBalance * monthlyRate
    const principalPayment = monthlyPayment - interestPayment
    remainingBalance -= principalPayment
    cumulativeInterest += interestPayment

    amortization.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, remainingBalance),
      cumulativeInterest
    })
  }

  const totalInterest = amortization.reduce((sum, entry) => sum + entry.interest, 0)
  const totalCost = principal + totalInterest + originationFee

  const debtToIncome = monthlyIncome ? (monthlyPayment / monthlyIncome) * 100 : undefined

  // Validate Indonesian banking compliance
  const complianceWarnings = validateIndonesianPersonalLoanCompliance(inputs)

  return {
    monthlyPayment,
    totalInterest,
    totalCost,
    debtToIncome,
    amortization,
    complianceWarnings
  }
}

export function calculateInvestment(inputs: InvestmentInputs): InvestmentResult & { projections: Array<{ year: number; value: number; contributions: number; interest: number }> } {
  const {
    initialInvestment,
    monthlyContribution,
    interestRate,
    investmentDurationYears,
    compoundingFrequency,
    inflationRate
  } = inputs

  const annualRate = interestRate / 100
  const periodsPerYear = compoundingFrequency
  const totalPeriods = investmentDurationYears * periodsPerYear
  const ratePerPeriod = annualRate / periodsPerYear
  const contributionPerPeriod = monthlyContribution * (12 / periodsPerYear)

  // Future value of initial investment
  const futureValueInitial = initialInvestment * Math.pow(1 + ratePerPeriod, totalPeriods)

  // Future value of monthly contributions (annuity)
  const futureValueContributions = contributionPerPeriod * 
    ((Math.pow(1 + ratePerPeriod, totalPeriods) - 1) / ratePerPeriod)

  const futureValue = futureValueInitial + futureValueContributions
  const totalContributions = initialInvestment + (monthlyContribution * 12 * investmentDurationYears)
  const interestEarned = futureValue - totalContributions

  // Real value (inflation-adjusted)
  const realValue = futureValue / Math.pow(1 + inflationRate / 100, investmentDurationYears)

  // Year-by-year projections
  const projections = []
  for (let year = 1; year <= investmentDurationYears; year++) {
    const periods = year * periodsPerYear
    const yearlyInitialValue = initialInvestment * Math.pow(1 + ratePerPeriod, periods)
    const yearlyContributionValue = contributionPerPeriod * 
      ((Math.pow(1 + ratePerPeriod, periods) - 1) / ratePerPeriod)
    const totalValue = yearlyInitialValue + yearlyContributionValue
    const totalContributed = initialInvestment + (monthlyContribution * 12 * year)
    const interestEarnedToDate = totalValue - totalContributed

    projections.push({
      year,
      value: totalValue,
      contributions: totalContributed,
      interest: interestEarnedToDate
    })
  }

  return {
    futureValue,
    totalContributions,
    interestEarned,
    realValue,
    projections
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatPercent(rate: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(rate / 100)
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function parseFormattedNumber(value: string): number {
  // Remove all non-digit characters except minus sign
  const cleaned = value.replace(/[^\d-]/g, '')
  return parseInt(cleaned) || 0
}

// Indonesian Banking Utility Functions
export function getBIRateBasedInterestRate(loanType: 'mortgage' | 'auto' | 'personal'): number {
  switch (loanType) {
    case 'mortgage':
      return CURRENT_BI_RATES.mortgageBaseRate
    case 'auto':
      return CURRENT_BI_RATES.autoLoanBaseRate
    case 'personal':
      return CURRENT_BI_RATES.personalLoanBaseRate
    default:
      return CURRENT_BI_RATES.biRate
  }
}

export function getIndonesianBankingInfo() {
  return {
    biRate: CURRENT_BI_RATES.biRate,
    lastUpdated: CURRENT_BI_RATES.lastUpdated,
    complianceRules: INDONESIAN_BANKING_COMPLIANCE,
    suggestedRates: {
      mortgage: CURRENT_BI_RATES.mortgageBaseRate,
      autoLoan: CURRENT_BI_RATES.autoLoanBaseRate,
      personalLoan: CURRENT_BI_RATES.personalLoanBaseRate,
    }
  }
}

export function isComplianceError(warnings: ComplianceWarning[]): boolean {
  return warnings.some(warning => warning.type === 'error')
}

export function getComplianceErrorsOnly(warnings: ComplianceWarning[]): ComplianceWarning[] {
  return warnings.filter(warning => warning.type === 'error')
}

export function getComplianceWarningsOnly(warnings: ComplianceWarning[]): ComplianceWarning[] {
  return warnings.filter(warning => warning.type === 'warning')
}