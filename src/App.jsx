import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageLoader from './components/PageLoader';

// ── Lazy-loaded public pages ───────────────────────────────────
const HomePage        = lazy(() => import('./pages/HomePage'));
const ClubsPage       = lazy(() => import('./pages/ClubsPage'));
const ClubDetailPage  = lazy(() => import('./pages/ClubDetailPage'));
const EventsPage      = lazy(() => import('./pages/EventsPage'));
const HallBookingPage = lazy(() => import('./pages/HallBookingPage'));

// ── Lazy-loaded auth pages ─────────────────────────────────────
const LoginPage        = lazy(() => import('./pages/LoginPage'));
const SignupPage       = lazy(() => import('./pages/SignupPage'));
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'));

// ── Lazy-loaded dashboard pages ────────────────────────────────
const RepDashboardPage       = lazy(() => import('./pages/dashboard/RepDashboardPage'));
const AuthorityDashboardPage = lazy(() => import('./pages/dashboard/AuthorityDashboardPage'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-5">
      <div className="text-center">
        <p className="text-[8rem] font-display font-bold leading-none text-petal-100 dark:text-grape-800 mb-2 select-none">
          404
        </p>
        <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-gray-50 mb-3">
          Page not found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Looks like this page wandered off campus.
        </p>
        <a href="/" className="btn-primary">Go Home</a>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ── Public (Guest Only) ── */}
            <Route path="/" element={
              <GuestRoute>
                <HomePage />
              </GuestRoute>
            } />
            <Route path="/clubs" element={
              <GuestRoute>
                <ClubsPage />
              </GuestRoute>
            } />
            <Route path="/clubs/:slug" element={
              <GuestRoute>
                <ClubDetailPage />
              </GuestRoute>
            } />
            <Route path="/events" element={
              <GuestRoute>
                <EventsPage />
              </GuestRoute>
            } />

            {/* ── Auth (Guest Only) ── */}
            <Route path="/login" element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            } />
            <Route path="/signup" element={
              <GuestRoute>
                <SignupPage />
              </GuestRoute>
            } />
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
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
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
