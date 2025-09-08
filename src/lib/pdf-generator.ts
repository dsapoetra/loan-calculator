import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { formatCurrency, formatPercent } from './calculations'
import type {
  AmortizationEntry,
  MortgageInputs,
  AutoLoanInputs,
  PersonalLoanInputs,
  InvestmentInputs,
  LoanResult,
  InvestmentResult,
  ComplianceWarning
} from './calculations'

// Union types for inputs and results based on report type
type PDFInputs = MortgageInputs | AutoLoanInputs | PersonalLoanInputs | InvestmentInputs
type PDFResults = (LoanResult & { amortization?: AmortizationEntry[]; complianceWarnings?: ComplianceWarning[] }) |
                  (InvestmentResult & { projections?: Array<{year: number, value: number, contributions: number, interest: number}> })

export interface PDFReportData {
  type: 'mortgage' | 'auto' | 'personal' | 'investment'
  title: string
  inputs: PDFInputs
  results: PDFResults
  amortization?: AmortizationEntry[]
}

export class PDFReportGenerator {
  private doc: jsPDF

  constructor() {
    this.doc = new jsPDF()
  }

  private addHeader(title: string) {
    this.doc.setFontSize(20)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(title, 20, 30)
    
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 40)
    
    this.doc.line(20, 45, 190, 45)
  }

  private addSection(title: string, y: number): number {
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(title, 20, y)
    return y + 10
  }

  private addKeyValue(key: string, value: string, y: number): number {
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(`${key}:`, 20, y)
    this.doc.text(value, 100, y)
    return y + 8
  }

  private checkPageBreak(currentY: number, requiredSpace: number = 20): number {
    if (currentY + requiredSpace > 280) {
      this.doc.addPage()
      return 30
    }
    return currentY
  }

  private addLoanSummary(totalPrincipal: number, totalInterest: number, finalPayment: number, startY: number) {
    // Title
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Loan Summary', 20, startY)

    // Add a line separator
    this.doc.line(20, startY + 3, 190, startY + 3)

    // Summary content
    this.doc.setFontSize(9)
    this.doc.setFont('helvetica', 'normal')

    // Left column - labels and values
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Total Principal:', 20, startY + 15)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(formatCurrency(totalPrincipal), 20, startY + 23)

    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Total Payments:', 20, startY + 35)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(formatCurrency(totalPrincipal + totalInterest), 20, startY + 43)

    // Right column - labels and values
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Total Interest:', 110, startY + 15)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(formatCurrency(totalInterest), 110, startY + 23)

    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Final Payment:', 110, startY + 35)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(formatCurrency(finalPayment), 110, startY + 43)
  }

  generateMortgageReport(data: MortgageInputs, results: LoanResult & { amortization?: AmortizationEntry[]; complianceWarnings?: ComplianceWarning[] }): Uint8Array {
    this.addHeader('Mortgage Loan Report')
    
    let currentY = 55
    
    // Loan Details
    currentY = this.addSection('Loan Details', currentY)
    currentY = this.addKeyValue('Home Price', formatCurrency(data.loanAmount), currentY)
    currentY = this.addKeyValue('Down Payment', formatCurrency(data.downPayment), currentY)
    currentY = this.addKeyValue('Loan Amount', formatCurrency(data.loanAmount - data.downPayment), currentY)
    currentY = this.addKeyValue('Interest Rate', formatPercent(data.interestRate), currentY)
    currentY = this.addKeyValue('Loan Term', `${data.loanTermYears} years`, currentY)
    currentY += 10
    
    // Monthly Costs
    currentY = this.checkPageBreak(currentY)
    currentY = this.addSection('Monthly Costs', currentY)
    currentY = this.addKeyValue('Property Tax (Annual)', formatCurrency(data.propertyTax), currentY)
    currentY = this.addKeyValue('Home Insurance (Annual)', formatCurrency(data.homeInsurance), currentY)
    currentY = this.addKeyValue('PMI Rate', `${data.pmiRate}% annually`, currentY)
    currentY = this.addKeyValue('HOA Fees (Monthly)', formatCurrency(data.hoaFees), currentY)
    currentY += 10
    
    // Payment Summary
    currentY = this.checkPageBreak(currentY)
    currentY = this.addSection('Payment Summary', currentY)
    currentY = this.addKeyValue('Monthly Payment', formatCurrency(results.monthlyPayment), currentY)
    currentY = this.addKeyValue('Principal & Interest', formatCurrency(results.principalAndInterest ?? 0), currentY)
    currentY = this.addKeyValue('Monthly Property Tax', formatCurrency(results.monthlyTaxes ?? 0), currentY)
    currentY = this.addKeyValue('Monthly Insurance', formatCurrency(results.monthlyInsurance ?? 0), currentY)
    currentY = this.addKeyValue('Monthly PMI', formatCurrency(results.monthlyPMI ?? 0), currentY)
    currentY = this.addKeyValue('Monthly HOA', formatCurrency(results.monthlyHOA ?? 0), currentY)
    currentY += 10
    
    // Loan Summary
    currentY = this.checkPageBreak(currentY)
    currentY = this.addSection('Loan Summary', currentY)
    currentY = this.addKeyValue('Total Interest', formatCurrency(results.totalInterest), currentY)
    currentY = this.addKeyValue('Total Cost', formatCurrency(results.totalCost), currentY)
    this.addKeyValue('Loan-to-Value Ratio', `${results.loanToValue?.toFixed(1)}%`, currentY)
    
    // Add complete amortization table
    if (results.amortization && results.amortization.length > 0) {
      this.doc.addPage()
      this.addAmortizationTable(results.amortization)
    }
    
    return new Uint8Array(this.doc.output('arraybuffer') as ArrayBuffer)
  }

  generateAutoLoanReport(data: AutoLoanInputs, results: LoanResult & { amortization?: AmortizationEntry[]; complianceWarnings?: ComplianceWarning[] }): Uint8Array {
    this.addHeader('Auto Loan Report')
    
    let currentY = 55
    
    // Vehicle Details
    currentY = this.addSection('Vehicle Details', currentY)
    currentY = this.addKeyValue('Vehicle Price', formatCurrency(data.vehiclePrice), currentY)
    currentY = this.addKeyValue('Down Payment', formatCurrency(data.downPayment), currentY)
    currentY = this.addKeyValue('Trade-in Value', formatCurrency(data.tradeInValue), currentY)
    currentY = this.addKeyValue('Sales Tax Rate', `${data.salesTaxRate}%`, currentY)
    currentY = this.addKeyValue('Additional Fees', formatCurrency(data.additionalFees), currentY)
    currentY += 10
    
    // Loan Terms
    currentY = this.checkPageBreak(currentY)
    currentY = this.addSection('Loan Terms', currentY)
    currentY = this.addKeyValue('Interest Rate', formatPercent(data.interestRate), currentY)
    currentY = this.addKeyValue('Loan Term', `${data.loanTermYears} years`, currentY)
    currentY += 10
    
    // Payment Summary
    currentY = this.checkPageBreak(currentY)
    currentY = this.addSection('Payment Summary', currentY)
    currentY = this.addKeyValue('Monthly Payment', formatCurrency(results.monthlyPayment), currentY)
    currentY = this.addKeyValue('Total Interest', formatCurrency(results.totalInterest), currentY)
    currentY = this.addKeyValue('Total of Payments', formatCurrency(results.totalCost), currentY)
    this.addKeyValue('Loan-to-Value Ratio', `${results.loanToValue?.toFixed(1)}%`, currentY)

    // Add complete amortization table
    if (results.amortization && results.amortization.length > 0) {
      this.doc.addPage()
      this.addAmortizationTable(results.amortization)
    }

    return new Uint8Array(this.doc.output('arraybuffer') as ArrayBuffer)
  }

  generatePersonalLoanReport(data: PersonalLoanInputs, results: LoanResult & { amortization?: AmortizationEntry[]; complianceWarnings?: ComplianceWarning[] }): Uint8Array {
    this.addHeader('Personal Loan Report')
    
    let currentY = 55
    
    // Loan Details
    currentY = this.addSection('Loan Details', currentY)
    currentY = this.addKeyValue('Loan Amount', formatCurrency(data.loanAmount), currentY)
    currentY = this.addKeyValue('Interest Rate', formatPercent(data.interestRate), currentY)
    currentY = this.addKeyValue('Loan Term', `${data.loanTermMonths} months`, currentY)
    currentY = this.addKeyValue('Origination Fee Rate', `${data.originationFeeRate}%`, currentY)
    if (data.monthlyIncome) {
      currentY = this.addKeyValue('Monthly Income', formatCurrency(data.monthlyIncome), currentY)
    }
    currentY += 10
    
    // Payment Summary
    currentY = this.checkPageBreak(currentY)
    currentY = this.addSection('Payment Summary', currentY)
    currentY = this.addKeyValue('Monthly Payment', formatCurrency(results.monthlyPayment), currentY)
    currentY = this.addKeyValue('Total Interest', formatCurrency(results.totalInterest), currentY)
    currentY = this.addKeyValue('Total Cost', formatCurrency(results.totalCost), currentY)

    if (results.debtToIncome) {
      this.addKeyValue('Debt-to-Income Ratio', `${results.debtToIncome.toFixed(1)}%`, currentY)
    }

    // Add complete amortization table
    if (results.amortization && results.amortization.length > 0) {
      this.doc.addPage()
      this.addAmortizationTable(results.amortization)
    }

    return new Uint8Array(this.doc.output('arraybuffer') as ArrayBuffer)
  }

  generateInvestmentReport(data: InvestmentInputs, results: InvestmentResult & { projections?: Array<{year: number, value: number, contributions: number, interest: number}> }): Uint8Array {
    this.addHeader('Investment Growth Report')
    
    let currentY = 55
    
    // Investment Details
    currentY = this.addSection('Investment Details', currentY)
    currentY = this.addKeyValue('Initial Investment', formatCurrency(data.initialInvestment), currentY)
    currentY = this.addKeyValue('Monthly Contribution', formatCurrency(data.monthlyContribution), currentY)
    currentY = this.addKeyValue('Interest Rate', formatPercent(data.interestRate), currentY)
    currentY = this.addKeyValue('Investment Duration', `${data.investmentDurationYears} years`, currentY)
    currentY = this.addKeyValue('Compounding Frequency', this.getCompoundingText(data.compoundingFrequency), currentY)
    currentY = this.addKeyValue('Inflation Rate', formatPercent(data.inflationRate), currentY)
    currentY += 10
    
    // Investment Summary
    currentY = this.checkPageBreak(currentY)
    currentY = this.addSection('Investment Summary', currentY)
    currentY = this.addKeyValue('Future Value', formatCurrency(results.futureValue), currentY)
    currentY = this.addKeyValue('Total Contributions', formatCurrency(results.totalContributions), currentY)
    currentY = this.addKeyValue('Interest Earned', formatCurrency(results.interestEarned), currentY)
    this.addKeyValue('Real Value (Inflation-Adjusted)', formatCurrency(results.realValue), currentY)
    
    // Growth projections table
    if (results.projections && results.projections.length > 0) {
      this.doc.addPage()
      this.addInvestmentProjectionsTable(results.projections)
    }
    
    return new Uint8Array(this.doc.output('arraybuffer') as ArrayBuffer)
  }

  private getCompoundingText(frequency: number): string {
    switch (frequency) {
      case 1: return 'Annually'
      case 4: return 'Quarterly'
      case 12: return 'Monthly'
      case 365: return 'Daily'
      default: return `${frequency} times per year`
    }
  }

  private addAmortizationTable(amortization: AmortizationEntry[]) {
    const rowHeight = 6
    const colWidths = [20, 35, 35, 35, 35, 30]
    const headers = ['Payment', 'Payment Amt', 'Principal', 'Interest', 'Balance', 'Cum. Interest']
    const maxRowsPerPage = 35 // Fit about 35 rows per page
    const headerHeight = 45
    const pageBottomMargin = 270

    let currentPage = 1
    let currentRowIndex = 0

    while (currentRowIndex < amortization.length) {
      // Add page header for each page
      if (currentPage === 1) {
        this.addSection('Complete Amortization Schedule', 30)
      } else {
        this.addSection(`Amortization Schedule (Page ${currentPage})`, 30)
      }

      // Add table header
      this.doc.setFontSize(8)
      this.doc.setFont('helvetica', 'bold')

      let currentX = 20
      headers.forEach((header, index) => {
        this.doc.text(header, currentX, headerHeight)
        currentX += colWidths[index]
      })

      this.doc.line(20, headerHeight + 2, 190, headerHeight + 2)

      // Add table rows for current page
      this.doc.setFont('helvetica', 'normal')
      let rowsOnCurrentPage = 0

      while (currentRowIndex < amortization.length && rowsOnCurrentPage < maxRowsPerPage) {
        const entry = amortization[currentRowIndex]
        const y = headerHeight + 5 + (rowsOnCurrentPage * rowHeight)

        // Check if we have space for this row
        if (y > pageBottomMargin) break

        currentX = 20
        const values = [
          entry.month.toString(),
          formatCurrency(entry.payment),
          formatCurrency(entry.principal),
          formatCurrency(entry.interest),
          formatCurrency(entry.balance),
          formatCurrency(entry.cumulativeInterest)
        ]

        values.forEach((value, index) => {
          this.doc.text(value, currentX, y)
          currentX += colWidths[index]
        })

        currentRowIndex++
        rowsOnCurrentPage++
      }

      // Add page footer with summary info for current page
      if (currentRowIndex < amortization.length) {
        this.doc.setFontSize(7)
        this.doc.setFont('helvetica', 'italic')
        this.doc.text(`Page ${currentPage} of ${Math.ceil(amortization.length / maxRowsPerPage)} - Showing payments ${currentRowIndex - rowsOnCurrentPage + 1} to ${currentRowIndex}`, 20, 280)

        // Add new page if there are more rows
        this.doc.addPage()
        currentPage++
      } else {
        // Final page footer with summary
        const lastEntry = amortization[amortization.length - 1]
        const totalPrincipal = amortization.reduce((sum, entry) => sum + entry.principal, 0)
        const totalInterest = amortization.reduce((sum, entry) => sum + entry.interest, 0)

        // Calculate where the summary should start (below the last table row)
        const tableEndY = headerHeight + 5 + (rowsOnCurrentPage * rowHeight)
        const summaryStartY = tableEndY + 20

        // Check if we need a new page for the summary (need at least 60 points of space)
        if (summaryStartY + 60 > 290) {
          this.doc.addPage()
          currentPage++
          this.addSection(`Loan Summary (Page ${currentPage})`, 30)
          const newSummaryStartY = 45
          this.addLoanSummary(totalPrincipal, totalInterest, lastEntry.payment, newSummaryStartY)

          // Page footer
          this.doc.setFontSize(7)
          this.doc.setFont('helvetica', 'italic')
          this.doc.text(`Page ${currentPage} of ${Math.ceil(amortization.length / maxRowsPerPage) + 1} - Complete Schedule (${amortization.length} total payments)`, 20, 280)
        } else {
          // Add summary on current page
          this.addLoanSummary(totalPrincipal, totalInterest, lastEntry.payment, summaryStartY)

          // Page footer
          this.doc.setFontSize(7)
          this.doc.setFont('helvetica', 'italic')
          this.doc.text(`Page ${currentPage} of ${Math.ceil(amortization.length / maxRowsPerPage)} - Complete Schedule (${amortization.length} total payments)`, 20, summaryStartY + 50)
        }
      }
    }
  }

  private addInvestmentProjectionsTable(projections: Array<{year: number, value: number, contributions: number, interest: number}>) {
    this.addSection('Growth Projections', 30)
    
    // Table header
    const startY = 45
    const rowHeight = 8
    const colWidths = [30, 50, 50, 50]
    const headers = ['Year', 'Total Value', 'Contributions', 'Interest Earned']
    
    this.doc.setFontSize(8)
    this.doc.setFont('helvetica', 'bold')
    
    let currentX = 20
    headers.forEach((header, index) => {
      this.doc.text(header, currentX, startY)
      currentX += colWidths[index]
    })
    
    this.doc.line(20, startY + 2, 180, startY + 2)
    
    // Table rows
    this.doc.setFont('helvetica', 'normal')
    const maxRows = Math.min(projections.length, 25)
    
    for (let i = 0; i < maxRows; i++) {
      const projection = projections[i]
      const y = startY + 5 + (i * rowHeight)
      
      if (y > 270) break
      
      currentX = 20
      const values = [
        projection.year.toString(),
        formatCurrency(projection.value),
        formatCurrency(projection.contributions),
        formatCurrency(projection.interest)
      ]
      
      values.forEach((value, index) => {
        this.doc.text(value, currentX, y)
        currentX += colWidths[index]
      })
    }
  }
}

export async function generatePDFFromElement(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error(`Element with id ${elementId} not found`)
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF()
  const imgProps = pdf.getImageProperties(imgData)
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
  pdf.save(filename)
}

export function downloadPDF(arrayBuffer: Uint8Array, filename: string): void {
  const buffer = arrayBuffer.buffer.slice(arrayBuffer.byteOffset, arrayBuffer.byteOffset + arrayBuffer.byteLength) as ArrayBuffer
  const blob = new Blob([buffer], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}