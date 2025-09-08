import { InputHTMLAttributes, forwardRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { formatNumber, parseFormattedNumber } from '@/lib/calculations'

export interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string
  error?: string
  helperText?: string
  value?: number
  onChange?: (value: number) => void
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, label, error, helperText, value = 0, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState('')

    // Update display value when value prop changes
    useEffect(() => {
      if (value !== undefined) {
        setDisplayValue(value === 0 ? '' : formatNumber(value))
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      
      // Allow empty string
      if (inputValue === '') {
        setDisplayValue('')
        onChange?.(0)
        return
      }

      // Parse the number and update
      const numericValue = parseFormattedNumber(inputValue)
      setDisplayValue(formatNumber(numericValue))
      onChange?.(numericValue)
    }

    const handleBlur = () => {
      // Reformat on blur to ensure consistent formatting
      if (value !== undefined && value !== 0) {
        setDisplayValue(formatNumber(value))
      }
    }

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          type="text"
          inputMode="numeric"
          className={cn(
            'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          ref={ref}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

NumberInput.displayName = 'NumberInput'

export { NumberInput }