import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function PrivateRoute({ children, role }) {
  const { isAuthenticated, user } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  if (role && user?.role !== role) {
    const redirectPath = user?.role === 'PATIENT' ? '/patient' : user?.role === 'ADMIN' ? '/admin' : '/doctor'
    return <Navigate to={redirectPath} />
  }
  
  return children
}
