import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from '../components/layout/Sidebar'
import { Header } from '../components/layout/Header'

const pageMeta = {
  '/': {
    title: 'Dashboard',
    subtitle: 'Overview of retail performance and alerts',
  },
  '/products': {
    title: 'Products',
    subtitle: 'Inventory across warehouses',
  },
  '/forecasting': {
    title: 'Demand Forecasting',
    subtitle: 'ML-powered next-day demand predictions',
  },
  '/classification': {
    title: 'Demand Classification',
    subtitle: 'AI demand tier classification',
  },
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const meta = pageMeta[location.pathname] ?? pageMeta['/']

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="flex-1 overflow-auto p-4 md:p-6 lg:p-8"
          >
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  )
}
