import { useEffect, useState } from 'react'
import { getInventory } from '../lib/api'
import { InventoryTable } from '../components/tables/InventoryTable'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

export default function Products() {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await getInventory()
        if (!cancelled) setInventory(res.data)
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.detail ||
              'Failed to load inventory.',
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

  if (loading) return <LoadingSpinner label="Loading inventory..." />

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-sm text-red-300">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        {inventory.length} inventory records across warehouses
      </p>
      <InventoryTable rows={inventory} />
    </div>
  )
}
