'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/calculations'
import type { AmortizationEntry } from '@/lib/calculations'

interface BalanceChartProps {
  data: AmortizationEntry[]
  title?: string
}

export default function BalanceChart({ data, title = 'Remaining Balance Over Time' }: BalanceChartProps) {
  // Sample data every 12 months for better visualization
  const chartData = data.filter((_, index) => index % 12 === 0 || index === data.length - 1).map(entry => ({
    month: entry.month,
    year: Math.ceil(entry.month / 12),
    balance: entry.balance,
    totalPaid: data[0].balance + data[0].cumulativeInterest - entry.balance - (entry.cumulativeInterest || 0),
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
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tickFormatter={(value) => `Month ${value}`}
            tick={{ fontSize: 10 }}
          />
          <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{ fontSize: 10 }} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.6}
            name="Remaining Balance"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}