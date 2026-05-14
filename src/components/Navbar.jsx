import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X, Sun, Moon, LogOut, LayoutDashboard, LogIn } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/',       label: 'Home',         exact: true },
  { to: '/clubs',  label: 'Clubs'  },
  { to: '/events', label: 'Events' },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggle }         = useTheme();
  const { user, profile, role, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileOpen(false);
  };

  const dashPath = role === 'authority' ? '/dashboard/authority' : '/dashboard/rep';
  const initials = profile?.displayName
    ? profile.displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled
        ? 'bg-white/80 dark:bg-grape-900/80 backdrop-blur-xl shadow-sm border-b border-white/60 dark:border-grape-700/40'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-petal-400 to-bloom-500 flex items-center justify-center shadow-petal group-hover:scale-105 transition-transform duration-300">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-gray-900 dark:text-gray-50">
              Campus<span className="text-gradient">Hub</span>
            </span>
          </Link>

          {/* Desktop nav */}
          {!user && (
            <div className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.exact}
                  className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          )}

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-petal-50 dark:hover:bg-grape-800 transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                {/* Dashboard link */}
                <Link
                  to={dashPath}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-petal-700 dark:text-petal-300 hover:bg-petal-50 dark:hover:bg-grape-800 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                {/* Avatar + logout */}
                <div className="flex items-center gap-1.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-petal-400 to-bloom-500 flex items-center justify-center text-white text-xs font-bold shadow-petal">
                    {initials}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-bloom-600 hover:bg-bloom-50 dark:hover:bg-bloom-900/20 transition-all"
                    title="Sign out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-primary py-2 text-sm">
                <LogIn className="w-4 h-4" /> Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-1">
            <button onClick={toggle} className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => setMobileOpen(v => !v)} className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-petal-50 dark:hover:bg-grape-800 transition-all">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/90 dark:bg-grape-900/95 backdrop-blur-xl border-b border-petal-100/40 dark:border-grape-700/40 px-5 py-4 space-y-1">
          {!user && NAV_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-petal-50 dark:bg-petal-900/30 text-petal-700 dark:text-petal-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-petal-50/50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-petal-100/40 dark:border-grape-700/40">
            {user ? (
              <div className="space-y-1">
                <Link to={dashPath} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold text-petal-700 dark:text-petal-300 hover:bg-petal-50/50"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <button onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2.5 rounded-2xl text-sm font-semibold text-bloom-600 dark:text-bloom-400 hover:bg-bloom-50/50"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold text-petal-700 dark:text-petal-300"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
