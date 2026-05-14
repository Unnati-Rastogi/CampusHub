import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * GuestRoute — ensures ONLY unauthenticated users can access the route.
 * If a user is logged in, they are redirected to their appropriate dashboard.
 */
export default function GuestRoute({ children }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-4 border-petal-300 border-t-petal-600 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (user) {
    // Redirect to dashboard based on role
    const dashboard = role === 'authority' ? '/dashboard/authority' : '/dashboard/rep';
    return <Navigate to={dashboard} replace />;
  }

  return children;
}
