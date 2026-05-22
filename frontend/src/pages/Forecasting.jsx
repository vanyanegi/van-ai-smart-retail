import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Calendar } from 'lucide-react'
import { getForecast } from '../lib/api'
import { ForecastChart } from '../components/charts/ForecastChart'
import { ProductSelect } from '../components/ui/ProductSelect'
import { Card } from '../components/ui/Card'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

export default function Forecasting() {
  const [productId, setProductId] = useState(1)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await getForecast(productId)
        if (!cancelled) setData(res.data)
      } catch (err) {
        if (!cancelled) {
          setData(null)
          setError(
            err.response?.data?.error ||
              err.response?.data?.detail ||
              'Failed to load forecast.',
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

  const historical = data?.historical_sales ?? []
  const predicted = data?.predicted_next_day_demand
  const lastDay = historical[historical.length - 1]
  const delta =
    lastDay != null && predicted != null
      ? (((predicted - lastDay) / lastDay) * 100).toFixed(1)
      : null

  return (
    <div className="space-y-6">
      <Card>
        <ProductSelect value={productId} onChange={setProductId} />
      </Card>

      {loading && <LoadingSpinner label="Running demand forecast..." />}

      {error && !loading && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-sm text-red-300">
          {error}
        </div>
      )}

      {data && !loading && !error && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                label: 'Last day sales',
                value: lastDay,
                icon: Calendar,
                color: 'text-sky-400 bg-sky-500/15',
              },
              {
                label: 'Predicted demand',
                value: predicted,
                icon: TrendingUp,
                color: 'text-indigo-400 bg-indigo-500/15',
              },
              {
                label: 'Change vs last day',
                value: delta != null ? `${delta}%` : '—',
                icon: TrendingUp,
                color:
                  Number(delta) >= 0
                    ? 'text-emerald-400 bg-emerald-500/15'
                    : 'text-amber-400 bg-amber-500/15',
              },
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-panel/90 p-5"
              >
                <div
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${metric.color}`}
                >
                  <metric.icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <p className="mt-1 text-xs text-slate-500">{metric.label}</p>
              </motion.div>
            ))}
          </div>

          <ForecastChart historical={historical} predicted={predicted} />
        </>
      )}
    </div>
  )
}
