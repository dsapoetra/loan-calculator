'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/calculations'

interface InvestmentGrowthChartProps {
  data: Array<{
    year: number
    value: number
    contributions: number
    interest: number
  }>
  title?: string
}

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

export default function InvestmentGrowthChart({ data, title = 'Investment Growth Over Time' }: InvestmentGrowthChartProps) {
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow">
          <p className="font-medium">{`Year ${label}`}</p>
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
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" tick={{ fontSize: 10 }} />
          <YAxis tickFormatter={(value) => formatCurrency(value)} tick={{ fontSize: 10 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="contributions"
            stackId="1"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
            name="Contributions"
          />
          <Area
            type="monotone"
            dataKey="interest"
            stackId="1"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.6}
            name="Interest Earned"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}