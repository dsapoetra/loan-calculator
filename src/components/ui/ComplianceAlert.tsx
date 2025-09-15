'use client'

import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'
import { ComplianceWarning } from '@/lib/calculations'

interface ComplianceAlertProps {
  warnings: ComplianceWarning[]
  className?: string
}

export default function ComplianceAlert({ warnings, className = '' }: ComplianceAlertProps) {
  if (!warnings || warnings.length === 0) {
    return (
      <div className={`flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg ${className}`}>
        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-white-100">
            Compliant with Indonesian Banking Regulations
          </p>
          <p className="text-xs text-green-600">
            All loan parameters meet OJK (Otoritas Jasa Keuangan) requirements
          </p>
        </div>
      </div>
    )
  }

  const errors = warnings.filter(w => w.type === 'error')
  const warningMessages = warnings.filter(w => w.type === 'warning')

  return (
    <div className={`space-y-2 ${className}`}>
      {errors.length > 0 && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800 mb-1">
              Non-Compliant with Indonesian Banking Regulations
            </p>
            <ul className="text-xs text-red-700 space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-red-500">•</span>
                  <span>{error.message}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {warningMessages.length > 0 && (
        <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800 mb-1">
              Banking Regulation Warnings
            </p>
            <ul className="text-xs text-yellow-700 space-y-1">
              {warningMessages.map((warning, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-yellow-500">•</span>
                  <span>{warning.message}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

interface BIRateInfoProps {
  className?: string
}

export function BIRateInfo({ className = '' }: BIRateInfoProps) {
  return (
    <div className={`flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg ${className}`}>
      <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium text-blue-800">
          Current BI Rate: 5.00% | Suku Bunga Acuan Bank Indonesia
        </p>
        <p className="text-xs text-blue-600">
          Bank Indonesia reference rate as of August 20, 2025. Loan rates are calculated as BI Rate + spread according to OJK regulations.
        </p>
      </div>
    </div>
  )
}
