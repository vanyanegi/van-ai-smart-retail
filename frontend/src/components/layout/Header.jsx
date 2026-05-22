import { Menu, Bell } from 'lucide-react'

export function Header({ title, subtitle, onMenuClick, alertCount = 0 }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-400 hover:bg-panel-hover hover:text-white lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-white md:text-xl">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 md:text-sm">{subtitle}</p>
          )}
        </div>
      </div>

      {alertCount > 0 && (
        <div className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-400">
          <Bell className="h-4 w-4" />
          <span>{alertCount} alerts</span>
        </div>
      )}
    </header>
  )
}
