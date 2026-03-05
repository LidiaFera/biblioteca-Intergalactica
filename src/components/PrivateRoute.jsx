import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Carregando...</div>
  }

  return user ? children : <Navigate to="/login" replace />
}