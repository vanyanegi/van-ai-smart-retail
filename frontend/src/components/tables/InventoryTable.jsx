import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { stockVariant } from '../../lib/badges'

function stockLabel(stock, threshold) {
  if (stock === 0) return 'Out of stock'
  if (stock < threshold) return 'Low stock'
  return 'Healthy'
}

export function InventoryTable({ rows = [] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      (r) =>
        r.product?.toLowerCase().includes(q) ||
        r.warehouse?.toLowerCase().includes(q),
    )
  }, [rows, query])

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-panel/90">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-medium text-slate-400">Inventory</h3>
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            placeholder="Search product or warehouse..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-panel-hover py-2 pl-9 pr-3 text-sm text-slate-200 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Warehouse</th>
              <th className="px-4 py-3 font-medium text-right">Stock</th>
              <th className="px-4 py-3 font-medium text-right">Threshold</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <motion.tr
                key={row.inventory_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: Math.min(i * 0.02, 0.4) }}
                className="border-b border-border/60 transition hover:bg-panel-hover/60"
              >
                <td className="px-4 py-3 font-medium text-slate-200">
                  {row.product}
                </td>
                <td className="px-4 py-3 text-slate-400">{row.warehouse}</td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-300">
                  {row.stock}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-500">
                  {row.threshold}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={stockVariant(row.stock, row.threshold)}>
                    {stockLabel(row.stock, row.threshold)}
                  </Badge>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && (
          <p className="py-12 text-center text-sm text-slate-500">
            No inventory rows match your search.
          </p>
        )}
      </div>
    </div>
  )
}
