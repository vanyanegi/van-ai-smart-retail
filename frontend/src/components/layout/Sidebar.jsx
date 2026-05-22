import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  Brain,
  Sparkles,
  X,
} from 'lucide-react'
const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/forecasting', label: 'Forecasting', icon: TrendingUp },
  { to: '/classification', label: 'Demand Classification', icon: Brain },
]

export function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-panel transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20">
              <Sparkles className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">SmartRetail</p>
              <p className="text-[10px] text-slate-500">AI Analytics</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-panel-hover hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-300'
                    : 'text-slate-400 hover:bg-panel-hover hover:text-slate-200'
                }`
              }
            >
              <>
                <Icon className="h-5 w-5 shrink-0" />
                {label}
              </>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <p className="text-xs text-slate-500">Retail Intelligence API</p>
          <p className="mt-0.5 text-[10px] text-slate-600">127.0.0.1:8000</p>
        </div>
      </aside>
    </>
  )
}
