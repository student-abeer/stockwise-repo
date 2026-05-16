import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import ManageItem from './pages/ManageItem'
import Login from './pages/Login'
import Layout from './components/Layout'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import HelpSupport from './pages/HelpSupport'
import Activity from './pages/Activity'
import Reports from './pages/Reports'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/inventory/manage" element={<ManageItem />} />
        <Route path="/inventory/manage/:id" element={<ManageItem />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<HelpSupport />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
