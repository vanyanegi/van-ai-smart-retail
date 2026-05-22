export function Card({ title, children, action, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-border bg-panel/90 p-5 shadow-xl shadow-black/25 backdrop-blur-sm ${className}`}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && (
            <h3 className="text-sm font-medium tracking-wide text-slate-400">
              {title}
            </h3>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  )
}
