export function ProductSelect({ value, onChange, label = 'Product' }) {
  const ids = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-lg border border-border bg-panel-hover px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
      >
        {ids.map((id) => (
          <option key={id} value={id}>
            Product #{id}
          </option>
        ))}
      </select>
    </label>
  )
}
