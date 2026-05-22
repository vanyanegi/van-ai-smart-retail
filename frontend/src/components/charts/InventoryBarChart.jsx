import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '../ui/Card'

const tooltipStyle = {
  backgroundColor: '#12151c',
  border: '1px solid #252b38',
  borderRadius: '8px',
  fontSize: '12px',
}

export function InventoryBarChart({ data, title = 'Stock by Product' }) {
  if (!data?.length) return null

  return (
    <Card title={title}>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#252b38" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={{ stroke: '#252b38' }}
              tickLine={false}
              interval={0}
              angle={-25}
              textAnchor="end"
              height={56}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
            />
            <Bar dataKey="stock" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
