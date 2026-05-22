import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceDot,
} from 'recharts'
import { Card } from '../ui/Card'

const tooltipStyle = {
  backgroundColor: '#12151c',
  border: '1px solid #252b38',
  borderRadius: '8px',
  fontSize: '12px',
}

export function ForecastChart({ historical = [], predicted }) {
  const data = historical.map((qty, i) => ({
    day: `Day ${i + 1}`,
    sales: qty,
    type: 'historical',
  }))

  if (predicted != null && historical.length > 0) {
    data.push({
      day: 'Forecast',
      sales: predicted,
      type: 'forecast',
    })
  }

  const forecastIndex = data.length - 1

  return (
    <Card title="Sales & Demand Forecast">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#252b38" />
            <XAxis
              dataKey="day"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={{ stroke: '#252b38' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={{ color: '#94a3b8' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#818cf8"
              strokeWidth={2}
              fill="url(#salesGradient)"
            />
            {predicted != null && historical.length > 0 && (
              <ReferenceDot
                x={data[forecastIndex]?.day}
                y={predicted}
                r={6}
                fill="#f59e0b"
                stroke="#fff"
                strokeWidth={2}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
