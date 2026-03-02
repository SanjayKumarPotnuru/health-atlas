import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import { useThemeStore } from './store/themeStore'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PatientDashboard from './pages/PatientDashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import AnatomyViewer from './pages/AnatomyViewer'
import Profile from './pages/Profile'
import PrivateRoute from './components/PrivateRoute'
import ChatBot from './components/ChatBot'
import ThemeToggle from './components/ThemeToggle'

function App() {
  const initTheme = useThemeStore((s) => s.initTheme)

  useEffect(() => {
    initTheme()
  }, [initTheme])

  return (
    <Router>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/patient" element={
          <PrivateRoute role="PATIENT">
            <PatientDashboard />
          </PrivateRoute>
        } />
        
        <Route path="/doctor" element={
          <PrivateRoute role="DOCTOR">
            <DoctorDashboard />
          </PrivateRoute>
        } />
        
        <Route path="/admin" element={
          <PrivateRoute role="ADMIN">
            <AdminDashboard />
          </PrivateRoute>
        } />
        
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        
        <Route path="/anatomy/:patientId" element={
          <PrivateRoute>
            <AnatomyViewer />
          </PrivateRoute>
        } />
      </Routes>
      
      {/* AI Chatbot - appears as floating button on all pages */}
      <ChatBot />
    </Router>
  )
}

export default App
