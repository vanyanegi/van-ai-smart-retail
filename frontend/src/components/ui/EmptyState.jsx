export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      {Icon && <Icon className="h-10 w-10 text-slate-600" />}
      <p className="text-sm font-medium text-slate-300">{title}</p>
      {description && (
        <p className="max-w-sm text-xs text-slate-500">{description}</p>
      )}
    </div>
  )
}
