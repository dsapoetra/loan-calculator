import { z } from 'zod'

// Indonesian Banking Compliance Limits
const INDONESIAN_MAX_MORTGAGE_RATE = 18.0
const INDONESIAN_MAX_AUTO_LOAN_RATE = 20.0
const INDONESIAN_MAX_PERSONAL_LOAN_RATE = 24.0
const INDONESIAN_MAX_MORTGAGE_TERM = 25
const INDONESIAN_MAX_AUTO_LOAN_TERM = 7
const INDONESIAN_MAX_PERSONAL_LOAN_TERM = 60

export const mortgageSchema = z.object({
  loanAmount: z.number().min(100000000, 'Loan amount must be at least Rp 100.000.000').max(10000000000, 'Loan amount cannot exceed Rp 10.000.000.000'),
  interestRate: z.number().min(0.01, 'Interest rate must be at least 0.01%').max(INDONESIAN_MAX_MORTGAGE_RATE, `Interest rate cannot exceed ${INDONESIAN_MAX_MORTGAGE_RATE}% (Indonesian banking regulation limit)`),
  loanTermYears: z.number().min(1, 'Loan term must be at least 1 year').max(INDONESIAN_MAX_MORTGAGE_TERM, `Loan term cannot exceed ${INDONESIAN_MAX_MORTGAGE_TERM} years (Indonesian banking regulation limit)`),
  downPayment: z.number().min(0, 'Down payment cannot be negative'),
  propertyTax: z.number().min(0, 'Property tax cannot be negative'),
  homeInsurance: z.number().min(0, 'Home insurance cannot be negative'),
  pmiRate: z.number().min(0, 'PMI rate cannot be negative').max(5, 'PMI rate cannot exceed 5%'),
  hoaFees: z.number().min(0, 'HOA fees cannot be negative'),
}).refine((data) => {
  // Validate minimum down payment (10% of loan amount)
  const minDownPayment = data.loanAmount * 0.10
  return data.downPayment >= minDownPayment
}, {
  message: 'Down payment must be at least 10% of loan amount (Indonesian banking regulation)',
  path: ['downPayment']
}).refine((data) => {
  // Validate maximum loan-to-value ratio (90%)
  const loanToValue = ((data.loanAmount - data.downPayment) / data.loanAmount) * 100
  return loanToValue <= 90
}, {
  message: 'Loan-to-value ratio cannot exceed 90% (Indonesian banking regulation)',
  path: ['downPayment']
})

export const autoLoanSchema = z.object({
  vehiclePrice: z.number().min(50000000, 'Vehicle price must be at least Rp 50.000.000').max(2000000000, 'Vehicle price cannot exceed Rp 2.000.000.000'),
  downPayment: z.number().min(0, 'Down payment cannot be negative'),
  tradeInValue: z.number().min(0, 'Trade-in value cannot be negative'),
  interestRate: z.number().min(0.01, 'Interest rate must be at least 0.01%').max(INDONESIAN_MAX_AUTO_LOAN_RATE, `Interest rate cannot exceed ${INDONESIAN_MAX_AUTO_LOAN_RATE}% (Indonesian banking regulation limit)`),
  loanTermYears: z.number().min(1, 'Loan term must be at least 1 year').max(INDONESIAN_MAX_AUTO_LOAN_TERM, `Loan term cannot exceed ${INDONESIAN_MAX_AUTO_LOAN_TERM} years (Indonesian banking regulation limit)`),
  salesTaxRate: z.number().min(0, 'Sales tax rate cannot be negative').max(15, 'Sales tax rate cannot exceed 15%'),
  additionalFees: z.number().min(0, 'Additional fees cannot be negative'),
})

export const personalLoanSchema = z.object({
  loanAmount: z.number().min(5000000, 'Loan amount must be at least Rp 5.000.000').max(500000000, 'Loan amount cannot exceed Rp 500.000.000'),
  interestRate: z.number().min(0.01, 'Interest rate must be at least 0.01%').max(INDONESIAN_MAX_PERSONAL_LOAN_RATE, `Interest rate cannot exceed ${INDONESIAN_MAX_PERSONAL_LOAN_RATE}% (Indonesian banking regulation limit)`),
  loanTermMonths: z.number().min(6, 'Loan term must be at least 6 months').max(INDONESIAN_MAX_PERSONAL_LOAN_TERM, `Loan term cannot exceed ${INDONESIAN_MAX_PERSONAL_LOAN_TERM} months (Indonesian banking regulation limit)`),
  originationFeeRate: z.number().min(0, 'Origination fee cannot be negative').max(10, 'Origination fee cannot exceed 10%'),
  monthlyIncome: z.number().min(0, 'Monthly income cannot be negative').optional(),
}).refine((data) => {
  // Validate debt-to-income ratio if monthly income is provided
  if (!data.monthlyIncome || data.monthlyIncome <= 0) return true

  const monthlyRate = data.interestRate / 100 / 12
  const monthlyPayment = data.loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, data.loanTermMonths)) /
    (Math.pow(1 + monthlyRate, data.loanTermMonths) - 1)
  const debtToIncomeRatio = (monthlyPayment / data.monthlyIncome) * 100

  return debtToIncomeRatio <= 40 // Maximum 40% DTI ratio
}, {
  message: 'Debt-to-income ratio cannot exceed 40% (Indonesian banking regulation)',
  path: ['monthlyIncome']
})

export const investmentSchema = z.object({
  initialInvestment: z.number().min(0, 'Initial investment cannot be negative'),
  monthlyContribution: z.number().min(0, 'Monthly contribution cannot be negative'),
  interestRate: z.number().min(0.01, 'Interest rate must be at least 0.01%').max(100, 'Interest rate cannot exceed 100%'),
  investmentDurationYears: z.number().min(1, 'Investment duration must be at least 1 year').max(50, 'Investment duration cannot exceed 50 years'),
  compoundingFrequency: z.number().int().min(1).max(365), // 1=annual, 4=quarterly, 12=monthly, 365=daily
  inflationRate: z.number().min(0, 'Inflation rate cannot be negative').max(20, 'Inflation rate cannot exceed 20%'),
})

export type MortgageFormData = z.infer<typeof mortgageSchema>
export type AutoLoanFormData = z.infer<typeof autoLoanSchema>
export type PersonalLoanFormData = z.infer<typeof personalLoanSchema>
export type InvestmentFormData = z.infer<typeof investmentSchema>

// Indonesian Credit Score Presets (based on BI Rate + spreads)
// Current BI Rate: 5.00% (as of August 2025)
export const creditScorePresets = {
  excellent: { min: 800, max: 850, mortgageRate: 8.5, autoRate: 9.0, personalRate: 15.0 },
  veryGood: { min: 740, max: 799, mortgageRate: 9.5, autoRate: 10.0, personalRate: 16.5 },
  good: { min: 670, max: 739, mortgageRate: 10.5, autoRate: 11.0, personalRate: 18.0 },
  fair: { min: 580, max: 669, mortgageRate: 12.0, autoRate: 13.0, personalRate: 20.0 },
  poor: { min: 300, max: 579, mortgageRate: 14.0, autoRate: 15.0, personalRate: 22.0 },
}

export function getPresetRatesByCredit(creditTier: keyof typeof creditScorePresets) {
  return creditScorePresets[creditTier]
}