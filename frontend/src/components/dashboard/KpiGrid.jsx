import { motion } from 'framer-motion'
import {
  Package,
  Warehouse,
  Boxes,
  AlertTriangle,
  XCircle,
} from 'lucide-react'

const kpis = [
  { key: 'total_products', label: 'Total Products', icon: Package, color: 'indigo' },
  { key: 'total_warehouses', label: 'Warehouses', icon: Warehouse, color: 'violet' },
  {
    key: 'total_inventory_units',
    label: 'Inventory Units',
    icon: Boxes,
    color: 'sky',
  },
  {
    key: 'low_stock_items',
    label: 'Low Stock',
    icon: AlertTriangle,
    color: 'amber',
  },
  {
    key: 'out_of_stock_items',
    label: 'Out of Stock',
    icon: XCircle,
    color: 'red',
  },
]

const iconColors = {
  indigo: 'bg-indigo-500/15 text-indigo-400',
  violet: 'bg-violet-500/15 text-violet-400',
  sky: 'bg-sky-500/15 text-sky-400',
  amber: 'bg-amber-500/15 text-amber-400',
  red: 'bg-red-500/15 text-red-400',
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
}

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
}

export function KpiGrid({ summary }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
    >
      {kpis.map(({ key, label, icon: Icon, color }) => (
        <motion.div
          key={key}
          variants={item}
          whileHover={{ scale: 1.02 }}
          className="rounded-2xl border border-border bg-panel/90 p-5 shadow-lg shadow-black/20"
        >
          <div className="flex items-start justify-between">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconColors[color]}`}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-2xl font-bold tracking-tight text-white">
            {summary?.[key] ?? '—'}
          </p>
          <p className="mt-1 text-xs text-slate-500">{label}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
