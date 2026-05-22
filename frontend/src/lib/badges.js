export function classificationVariant(label) {
  if (!label) return 'default'
  const upper = label.toUpperCase()
  if (upper.includes('HIGH')) return 'high'
  if (upper.includes('MEDIUM')) return 'medium'
  if (upper.includes('LOW')) return 'low'
  return 'default'
}

export function stockVariant(stock, threshold) {
  if (stock === 0) return 'danger'
  if (stock < threshold) return 'warning'
  return 'success'
}

export function alertVariant(alert) {
  if (alert?.includes('OUT OF STOCK')) return 'danger'
  if (alert?.includes('CRITICAL')) return 'danger'
  return 'warning'
}

export function trendVariant(trend) {
  if (!trend) return 'default'
  if (trend.includes('RISING')) return 'success'
  if (trend.includes('DECLINING')) return 'danger'
  return 'info'
}
