import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { isValidEmail } from '../lib/utils';

import { useClubs } from '../hooks/useClubs';
import { ensureUserProfile } from '../services/userService';

export default function SignupPage() {
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '', clubId: '' });
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const { user, syncProfileWithRole } = useAuth();
  const navigate = useNavigate();
  const { clubs } = useClubs();

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isValidEmail(form.email)) { setError('Please enter a valid email address.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (!form.clubId) { setError('Please select a club to represent.'); return; }

    setLoading(true);
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(firebaseUser, { displayName: form.name });

      // Ensure profile is created with club_rep role and the selected clubId
      await ensureUserProfile(firebaseUser, { role: 'club_rep', clubId: form.clubId });
      
      // Update local state before navigating
      if (syncProfileWithRole) {
        await syncProfileWithRole('club_rep', firebaseUser);
      }

      // Navigate to rep dashboard
      setTimeout(() => {
        navigate('/dashboard/rep', { replace: true });
      }, 300);
    } catch (err) {
      const msgs = {
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/invalid-email':        'Please enter a valid email address.',
        'auth/weak-password':        'Password must be at least 6 characters.',
      };
      setError(msgs[err.code] || err.message);
    } finally {
      setLoading(false);
    }
  };

  const requirements = [
    { label: 'At least 6 characters', met: form.password.length >= 6 },
    { label: 'Passwords match', met: form.password && form.password === form.confirm },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-5 pt-16 pb-10">
      <div className="blob w-96 h-96 -top-20 -right-20 bg-petal-200 dark:bg-petal-900/30 opacity-50 fixed" />
      <div className="blob w-72 h-72 bottom-0 -left-20 bg-mint-100 dark:bg-mint-900/20 opacity-40 fixed" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-petal-400 to-bloom-500 flex items-center justify-center shadow-petal">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900 dark:text-gray-50">
              Campus<span className="text-gradient">Hub</span>
            </span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-gray-50 mb-1">Create account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Sign up as a Club Representative</p>
        </div>

        <div className="glass-card p-6 sm:p-8">
          {/* Info banner */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-petal-50/80 dark:bg-petal-900/20 border border-petal-200/50 dark:border-petal-800/30 mb-5">
            <CheckCircle2 className="w-4 h-4 text-petal-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-petal-700 dark:text-petal-300 leading-relaxed">
              Select your club during signup to instantly gain access to the Rep Dashboard, where you can manage events and book halls.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-bloom-50 dark:bg-bloom-900/20 border border-bloom-200 dark:border-bloom-800 mb-4">
              <AlertCircle className="w-4 h-4 text-bloom-600 flex-shrink-0" />
              <p className="text-xs text-bloom-700 dark:text-bloom-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Club to Represent</label>
              <div className="relative">
                <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select 
                  name="clubId" 
                  value={form.clubId} 
                  onChange={handleChange} 
                  required 
                  className="input-base pl-10 appearance-none bg-white/70 dark:bg-grape-900/40"
                >
                  <option value="" disabled>Select a club...</option>
                  {clubs.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Your full name" className="input-base pl-10" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@nie.ac.in" className="input-base pl-10" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handleChange} required placeholder="Min. 6 characters" className="input-base pl-10 pr-10" />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input name="confirm" type="password" value={form.confirm} onChange={handleChange} required placeholder="Repeat password" className="input-base pl-10" />
              </div>
            </div>

            {/* Password requirements */}
            {form.password && (
              <div className="space-y-1">
                {requirements.map(r => (
                  <div key={r.label} className={`flex items-center gap-2 text-xs ${r.met ? 'text-mint-600 dark:text-mint-400' : 'text-gray-400'}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${r.met ? 'text-mint-500' : 'text-gray-300 dark:text-gray-600'}`} />
                    {r.label}
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-petal-500 to-bloom-500 text-white font-bold text-sm
                hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 shadow-petal
                disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating account...</>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-petal-100/40 dark:border-grape-700/40 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-petal-600 dark:text-petal-400 hover:underline">Sign in</Link>
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
