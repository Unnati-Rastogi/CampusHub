import { Link } from 'react-router-dom';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UnauthorizedPage() {
  const { role } = useAuth();
  const dashLink = role === 'authority' ? '/dashboard/authority' : role === 'club_rep' ? '/dashboard/rep' : '/';

  return (
    <div className="min-h-screen flex items-center justify-center px-5 pt-16">
      <div className="blob w-80 h-80 top-20 right-0 bg-bloom-100 dark:bg-bloom-900/20 opacity-50" />
      <div className="text-center relative z-10">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-bloom-400 to-sand-400 flex items-center justify-center mx-auto mb-6 shadow-bloom">
          <ShieldX className="w-10 h-10 text-white" />
        </div>
        <h1 className="font-display font-bold text-3xl text-gray-900 dark:text-gray-50 mb-3">Access Denied</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-2 max-w-sm mx-auto leading-relaxed">
          You don't have permission to view this page.
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
          Current role: <span className="font-semibold text-petal-600 dark:text-petal-400">{role || 'None'}</span>
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to={dashLink} className="btn-primary">
            <ArrowLeft className="w-4 h-4" /> Go to Dashboard
          </Link>
          <Link to="/" className="btn-secondary">
            <Home className="w-4 h-4" /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}
