import { useEffect, useState, useMemo } from 'react'
import { TrendingUp } from 'lucide-react'
import { getSummary, getAlerts, getTrend, getForecast } from '../lib/api'
import { KpiGrid } from '../components/dashboard/KpiGrid'
import { AlertsList } from '../components/dashboard/AlertsList'
import { ForecastChart } from '../components/charts/ForecastChart'
import { InventoryBarChart } from '../components/charts/InventoryBarChart'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { trendVariant } from '../lib/badges'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { ProductSelect } from '../components/ui/ProductSelect'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [trend, setTrend] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [productId, setProductId] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [summaryRes, alertsRes] = await Promise.all([
          getSummary(),
          getAlerts(),
        ])
        if (!cancelled) {
          setSummary(summaryRes.data)
          setAlerts(alertsRes.data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.detail ||
              'Failed to load dashboard. Is the API running on port 8000?',
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
  }, [])

  useEffect(() => {
    let cancelled = false
    async function loadProduct() {
      try {
        const [trendRes, forecastRes] = await Promise.all([
          getTrend(productId),
          getForecast(productId),
        ])
        if (!cancelled) {
          setTrend(trendRes.data)
          setForecast(forecastRes.data)
        }
      } catch {
        if (!cancelled) {
          setTrend(null)
          setForecast(null)
        }
      }
    }
    loadProduct()
    return () => {
      cancelled = true
    }
  }, [productId])

  const barData = useMemo(() => {
    const byProduct = {}
    for (const a of alerts) {
      if (!byProduct[a.product]) {
        byProduct[a.product] = { name: a.product, stock: 0 }
      }
      byProduct[a.product].stock += a.stock
    }
    return Object.values(byProduct).slice(0, 8)
  }, [alerts])

  if (loading) return <LoadingSpinner label="Loading dashboard..." />

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-sm text-red-300">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <KpiGrid summary={summary} />

      <div className="grid gap-6 lg:grid-cols-2">
        <AlertsList alerts={alerts} />

        <Card title="Sales Trend Analysis">
          <div className="mb-4">
            <ProductSelect value={productId} onChange={setProductId} />
          </div>
          {trend ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15">
                  <TrendingUp className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{trend.product}</p>
                  <Badge variant={trendVariant(trend.trend)}>{trend.trend}</Badge>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-panel-hover/80 p-3">
                  <dt className="text-xs text-slate-500">Growth rate</dt>
                  <dd className="mt-1 font-semibold text-white">
                    {trend.growth_rate}%
                  </dd>
                </div>
                <div className="rounded-lg bg-panel-hover/80 p-3">
                  <dt className="text-xs text-slate-500">Recent avg sales</dt>
                  <dd className="mt-1 font-semibold text-white">
                    {trend.recent_average_sales}
                  </dd>
                </div>
                <div className="rounded-lg bg-panel-hover/80 p-3">
                  <dt className="text-xs text-slate-500">Older avg sales</dt>
                  <dd className="mt-1 font-semibold text-slate-300">
                    {trend.older_average_sales}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Trend data unavailable.</p>
          )}
        </Card>
      </div>

      {forecast?.historical_sales && (
        <ForecastChart
          historical={forecast.historical_sales}
          predicted={forecast.predicted_next_day_demand}
        />
      )}

      {barData.length > 0 && (
        <InventoryBarChart
          data={barData}
          title="Alert inventory levels by product"
        />
      )}
    </div>
  )
}
