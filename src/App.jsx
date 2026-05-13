import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public pages
import HomePage        from './pages/HomePage';
import ClubsPage       from './pages/ClubsPage';
import ClubDetailPage  from './pages/ClubDetailPage';
import EventsPage      from './pages/EventsPage';
import HallBookingPage from './pages/HallBookingPage';

// Auth pages
import LoginPage       from './pages/LoginPage';
import SignupPage      from './pages/SignupPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Dashboard pages (lazy not needed for MVP)
import RepDashboardPage       from './pages/dashboard/RepDashboardPage';
import AuthorityDashboardPage from './pages/dashboard/AuthorityDashboardPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* ── Public ── */}
          <Route path="/"            element={<HomePage />} />
          <Route path="/clubs"       element={<ClubsPage />} />
          <Route path="/clubs/:slug" element={<ClubDetailPage />} />
          <Route path="/events"      element={<EventsPage />} />

          {/* ── Auth ── */}
          <Route path="/login"        element={<LoginPage />} />
          <Route path="/signup"       element={<SignupPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* ── Hall Booking (club rep only) ── */}
          <Route path="/halls" element={
            <ProtectedRoute allowedRoles={['club_rep']}>
              <HallBookingPage />
            </ProtectedRoute>
          } />

          {/* ── Dashboards ── */}
          <Route path="/dashboard/rep" element={
            <ProtectedRoute allowedRoles={['club_rep']}>
              <RepDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/authority" element={
            <ProtectedRoute allowedRoles={['authority']}>
              <AuthorityDashboardPage />
            </ProtectedRoute>
          } />

          {/* ── 404 ── */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center pt-16 px-5">
              <div className="text-center">
                <p className="text-8xl font-display font-bold text-petal-100 dark:text-grape-800 mb-2 select-none">404</p>
                <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-gray-50 mb-3">Page not found</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">This page doesn't exist.</p>
                <a href="/" className="btn-primary">Go Home</a>
              </div>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <AppRoutes />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
