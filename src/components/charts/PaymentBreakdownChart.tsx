'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '@/lib/calculations'

interface PaymentBreakdownChartProps {
  data: Array<{
    name: string
    value: number
    color: string
  }>
  title?: string
}

interface TooltipPayload {
    payload: {
      name: string
      value: number
      color: string
      total: number
    }
  }

  interface CustomTooltipProps {
    active?: boolean
    payload?: TooltipPayload[]
  }

export default function PaymentBreakdownChart({ data, title = 'Payment Breakdown' }: PaymentBreakdownChartProps) {
  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow">
          <p className="font-medium">{data.name}</p>
          <p style={{ color: data.color }}>
            {formatCurrency(data.value)}
          </p>
          <p className="text-sm text-gray-600">
            {((data.value / data.total) * 100).toFixed(1)}% of total
          </p>
        </div>
      )
    }
    return null
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)
  const dataWithTotal = data.map(item => ({ ...item, total }))

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={dataWithTotal}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(1) : '0.0'}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {dataWithTotal.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-4 h-4 rounded mr-2" 
              style={{ backgroundColor: item.color }}
            ></div>
            <div className="flex-1">
              <div className="text-sm font-medium">{item.name}</div>
              <div className="text-sm text-gray-600">{formatCurrency(item.value)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}