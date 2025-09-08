'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/calculations'
import type { AmortizationEntry } from '@/lib/calculations'

interface AmortizationChartProps {
  data: AmortizationEntry[]
  title?: string
}

export default function AmortizationChart({ data, title = 'Principal vs Interest Over Time' }: AmortizationChartProps) {
  // Sample data every 12 months for better visualization
  const chartData = data.filter((_, index) => index % 12 === 0 || index === data.length - 1).map(entry => ({
    month: entry.month,
    year: Math.ceil(entry.month / 12),
    principal: entry.principal,
    interest: entry.interest,
    balance: entry.balance,
    cumulativeInterest: entry.cumulativeInterest,
  }))

  interface TooltipPayload {
    color: string
    name: string
    value: number
  }

  interface CustomTooltipProps {
    active?: boolean
    payload?: TooltipPayload[]
    label?: string | number
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow">
          <p className="font-medium">{`Month ${label} (Year ${Math.ceil(Number(label) / 12)})`}</p>
          {payload.map((entry, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tickFormatter={(value) => `Month ${value}`}
            tick={{ fontSize: 10 }}
          />
          <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{ fontSize: 10 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="principal" 
            stroke="#3b82f6" 
            name="Principal"
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="interest" 
            stroke="#ef4444" 
            name="Interest"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}