import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, Eye, EyeOff, AlertCircle, Shield } from 'lucide-react';

const ROLES = [
  { id: 'club_rep', label: 'Club / Society', icon: GraduationCap, desc: 'Manage events & hall bookings' },
  { id: 'authority', label: 'Head / Authority', icon: Shield, desc: 'Approve bookings & manage halls' },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState('club_rep');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const { role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || null;

  const getRedirect = (userRole) => {
    if (from) return from;
    return userRole === 'authority' ? '/dashboard/authority' : '/dashboard/rep';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // AuthContext will fetch profile, role will be set automatically
      // Navigate based on stored role after a brief wait
      setTimeout(() => {
        navigate(getRedirect(role || selectedRole), { replace: true });
      }, 800);
    } catch (err) {
      const msgs = {
        'auth/user-not-found':  'No account found with this email.',
        'auth/wrong-password':  'Incorrect password.',
        'auth/invalid-email':   'Please enter a valid email address.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/invalid-credential': 'Invalid email or password.',
      };
      setError(msgs[err.code] || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 pt-16 pb-10">
      {/* Background blobs */}
      <div className="blob w-96 h-96 -top-20 -right-20 bg-petal-200 dark:bg-petal-900/30 opacity-50 fixed" />
      <div className="blob w-72 h-72 bottom-0 -left-20 bg-bloom-100 dark:bg-bloom-900/20 opacity-40 fixed" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-petal-400 to-bloom-500 flex items-center justify-center shadow-petal">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900 dark:text-gray-50">
              Campus<span className="text-gradient">Hub</span>
            </span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-gray-50 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to your CampusHub account</p>
        </div>

        <div className="glass-card p-6 sm:p-8">
          {/* Role selector */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">Sign in as</p>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map(r => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRole(r.id)}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 ${
                      selectedRole === r.id
                        ? 'border-petal-400 bg-petal-50 dark:bg-petal-900/20 shadow-petal'
                        : 'border-gray-200 dark:border-grape-700 hover:border-petal-300'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1.5 ${selectedRole === r.id ? 'text-petal-600 dark:text-petal-400' : 'text-gray-400'}`} />
                    <p className={`text-xs font-bold leading-tight ${selectedRole === r.id ? 'text-petal-700 dark:text-petal-300' : 'text-gray-600 dark:text-gray-400'}`}>{r.label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{r.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-bloom-50 dark:bg-bloom-900/20 border border-bloom-200 dark:border-bloom-800 mb-4">
              <AlertCircle className="w-4 h-4 text-bloom-600 dark:text-bloom-400 flex-shrink-0" />
              <p className="text-xs text-bloom-700 dark:text-bloom-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@campushub.edu"
                  className="input-base pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="input-base pl-10 pr-10"
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-petal-500 to-bloom-500 text-white font-bold text-sm
                hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 shadow-petal
                disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-petal-100/40 dark:border-grape-700/40 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Club Rep without an account?{' '}
              <Link to="/signup" className="font-bold text-petal-600 dark:text-petal-400 hover:underline">Sign up</Link>
            </p>
          </div>

          {!user && (
            <div className="mt-3 text-center">
              <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                ← Browse as Student
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
