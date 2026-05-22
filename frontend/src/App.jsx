import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Forecasting from './pages/Forecasting'
import DemandClassification from './pages/DemandClassification'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="forecasting" element={<Forecasting />} />
          <Route path="classification" element={<DemandClassification />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
