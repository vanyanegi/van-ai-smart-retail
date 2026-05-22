import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, BarChart3 } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getClassification, PRODUCT_IDS } from '../lib/api'
import { ProductSelect } from '../components/ui/ProductSelect'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { classificationVariant } from '../lib/badges'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

const tooltipStyle = {
  backgroundColor: '#12151c',
  border: '1px solid #252b38',
  borderRadius: '8px',
  fontSize: '12px',
}

export default function DemandClassification() {
  const [productId, setProductId] = useState(1)
  const [result, setResult] = useState(null)
  const [comparison, setComparison] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await getClassification(productId)
        if (!cancelled) setResult(res.data)
      } catch (err) {
        if (!cancelled) {
          setResult(null)
          setError(
            err.response?.data?.detail || 'Failed to classify demand.',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [productId])

  useEffect(() => {
    let cancelled = false
    async function loadAll() {
      const results = await Promise.allSettled(
        PRODUCT_IDS.map((id) => getClassification(id)),
      )
      if (cancelled) return
      const rows = results
        .filter((r) => r.status === 'fulfilled')
        .map((r) => ({
          name: r.value.data.product,
          avg: r.value.data.average_sales,
          tier: r.value.data.demand_classification,
        }))
      setComparison(rows)
    }
    loadAll()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <ProductSelect value={productId} onChange={setProductId} />
      </Card>

      {loading && <LoadingSpinner label="Running AI classification..." />}

      {error && !loading && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-sm text-red-300">
          {error}
        </div>
      )}

      {result && !loading && !error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-panel to-panel p-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20">
            <Brain className="h-7 w-7 text-indigo-400" />
          </div>
          <p className="text-sm text-slate-400">AI demand classification</p>
          <h2 className="mt-2 text-2xl font-bold text-white">{result.product}</h2>
          <div className="mt-4 flex justify-center">
            <Badge
              variant={classificationVariant(result.demand_classification)}
              className="px-4 py-1.5 text-sm"
            >
              {result.demand_classification}
            </Badge>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Average sales:{' '}
            <span className="font-semibold text-slate-300">
              {result.average_sales}
            </span>
          </p>
        </motion.div>
      )}

      {comparison.length > 0 && (
        <Card
          title="All products — average sales"
          action={
            <BarChart3 className="h-4 w-4 text-slate-500" />
          }
        >
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparison} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252b38" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  axisLine={{ stroke: '#252b38' }}
                  tickLine={false}
                  angle={-30}
                  textAnchor="end"
                  height={64}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="avg" fill="#818cf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  )
}
