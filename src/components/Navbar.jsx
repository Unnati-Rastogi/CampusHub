import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, GraduationCap, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Clubs', to: '/clubs' },
  { label: 'Events', to: '/events' },
  { label: 'Hall Booking', to: '/halls' },
];

export default function Navbar() {
  const { isDark, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => { setMenuOpen(false); }, [location]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/70 dark:bg-grape-900/80 backdrop-blur-xl shadow-petal border-b border-petal-100/60 dark:border-grape-700/40'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-br from-petal-400 to-bloom-500 flex items-center justify-center shadow-petal group-hover:shadow-petal-lg transition-all duration-300 group-hover:scale-105">
              <GraduationCap className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-mint-400 border-2 border-white dark:border-grape-900" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-gray-900 dark:text-gray-50">
              Campus<span className="text-gradient">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2.5 rounded-2xl text-gray-500 dark:text-gray-400
                hover:bg-petal-100 dark:hover:bg-grape-800
                hover:text-petal-700 dark:hover:text-petal-300
                transition-all duration-200"
              aria-label="Toggle theme"
            >
              {isDark
                ? <Sun className="w-4 h-4" />
                : <Moon className="w-4 h-4" />
              }
            </button>

            <Link
              to="/login"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl
                bg-petal-600 text-white text-xs font-bold
                hover:bg-petal-700 shadow-petal hover:shadow-petal-lg
                transition-all duration-200 hover:-translate-y-0.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Sign In
            </Link>

            <button
              onClick={() => setMenuOpen(v => !v)}
              className="md:hidden p-2.5 rounded-2xl text-gray-500 dark:text-gray-400
                hover:bg-petal-100 dark:hover:bg-grape-800 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="glass border-t border-petal-100/50 dark:border-grape-700/40 px-5 py-4 space-y-1 mx-0">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-petal-100/80 dark:bg-grape-700/60 text-petal-700 dark:text-petal-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-petal-50 dark:hover:bg-grape-800'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="pt-2">
            <Link to="/login" className="btn-primary w-full justify-center text-sm">
              <Sparkles className="w-4 h-4" /> Sign In
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
