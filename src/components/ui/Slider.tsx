import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  formatValue?: (value: number) => string
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, error, formatValue, value, ...props }, ref) => {
    const displayValue = formatValue && value ? formatValue(Number(value)) : value

    return (
      <div className="space-y-2">
        {label && (
          <div className="flex justify-between">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <span className="text-sm text-gray-600">{displayValue}</span>
          </div>
        )}
        <input
          type="range"
          className={cn(
            'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider',
            error && 'bg-red-200',
            className
          )}
          ref={ref}
          value={value}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
        `}</style>
      </div>
    )
  }
)

Slider.displayName = 'Slider'

export { Slider }