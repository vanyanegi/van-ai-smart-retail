import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

export const getSummary = () => api.get('/analytics/summary')
export const getInventory = () => api.get('/inventory')
export const getAlerts = () => api.get('/alerts')
export const getForecast = (productId) => api.get(`/forecast/${productId}`)
export const getClassification = (productId) =>
  api.get(`/demand-classification/${productId}`)
export const getTrend = (productId) => api.get(`/trends/${productId}`)
export const getAnomaly = (productId) => api.get(`/anomalies/${productId}`)

export function getUniqueProducts(inventory) {
  const seen = new Map()
  for (const row of inventory) {
    if (!seen.has(row.product)) {
      seen.set(row.product, { name: row.product })
    }
  }
  return Array.from(seen.values())
}

export const PRODUCT_IDS = Array.from({ length: 10 }, (_, i) => i + 1)
