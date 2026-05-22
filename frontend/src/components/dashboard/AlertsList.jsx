import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { alertVariant } from '../../lib/badges'
import { EmptyState } from '../ui/EmptyState'

export function AlertsList({ alerts }) {
  return (
    <Card title="Low Stock Alerts">
      {!alerts?.length ? (
        <EmptyState
          icon={AlertTriangle}
          title="No active alerts"
          description="All inventory levels are above threshold."
        />
      ) : (
        <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
          {alerts.map((item, i) => (
            <motion.li
              key={item.inventory_id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-panel-hover/50 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-200">
                  {item.product}
                </p>
                <p className="text-xs text-slate-500">{item.warehouse}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <Badge variant={alertVariant(item.alert)}>{item.alert}</Badge>
                <span className="text-xs text-slate-500">
                  {item.stock} / {item.threshold}
                </span>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </Card>
  )
}
