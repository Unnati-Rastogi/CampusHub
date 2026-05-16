import { useState } from 'react';
import { Mail, Lock, User, CheckCircle2, AlertCircle, X, Loader2, KeyRound } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile, 
  sendEmailVerification 
} from 'firebase/auth';
import { ensureUserProfile } from '../../services/userService';
import Modal from '../Modal';
import { isValidEmail } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function StudentAuthModal({ isOpen, onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', usn: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user, syncProfileWithRole } = useAuth();
  const toast = useToast();

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        // Login
        const { user: firebaseUser } = await signInWithEmailAndPassword(auth, form.email, form.password);
        
        // Optionally fetch profile and sync
        await ensureUserProfile(firebaseUser); // ensures it exists
        if (syncProfileWithRole) {
          await syncProfileWithRole('student', firebaseUser);
        }
        
        toast.success('Welcome back', 'Successfully signed in.');
        if (onSuccess) onSuccess(firebaseUser);
        onClose();
      } else {
        // Signup
        if (!form.usn.trim()) {
          setError('USN is required to post reviews.');
          setLoading(false);
          return;
        }
        if (form.password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }

        const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, form.email, form.password);
        
        // Update auth profile
        await updateProfile(firebaseUser, { displayName: form.name });
        
        // Save to users collection with student role and USN
        await ensureUserProfile(firebaseUser, {
          role: 'student',
          usn: form.usn.toUpperCase().trim()
        });

        if (syncProfileWithRole) {
          await syncProfileWithRole('student', firebaseUser);
        }

        // Send Verification Email
        await sendEmailVerification(firebaseUser);
        
        toast.success('Account Created', 'Please check your email to verify your account.');
        if (onSuccess) onSuccess(firebaseUser);
        onClose();
      }
    } catch (err) {
      console.error(err);
      const msgs = {
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
      };
      setError(msgs[err.code] || err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isLogin ? 'Student Login' : 'Student Signup'} size="md">
      <div className="p-2">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          {isLogin 
            ? 'Sign in to leave reviews and rate events.' 
            : 'Create a quick student account to leave reviews. We need your USN to verify you are a student.'}
        </p>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-bloom-50 dark:bg-bloom-900/20 border border-bloom-200 dark:border-bloom-800 mb-4">
            <AlertCircle className="w-4 h-4 text-bloom-600 flex-shrink-0" />
            <p className="text-xs text-bloom-700 dark:text-bloom-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                  placeholder="Your name" 
                  className="input-base pl-10" 
                />
              </div>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">USN</label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  name="usn" 
                  value={form.usn} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. 4NI..." 
                  className="input-base pl-10 uppercase" 
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handleChange} 
                required 
                placeholder="you@nie.ac.in" 
                className="input-base pl-10" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                name="password" 
                type="password" 
                value={form.password} 
                onChange={handleChange} 
                required 
                placeholder={isLogin ? 'Your password' : 'Min. 6 characters'} 
                className="input-base pl-10" 
              />
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
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-petal-100/40 dark:border-grape-700/40 text-center">
          <button 
            type="button" 
            onClick={toggleMode} 
            className="text-xs font-bold text-petal-600 dark:text-petal-400 hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
