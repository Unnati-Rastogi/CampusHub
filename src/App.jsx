import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ClubsPage from './pages/ClubsPage';
import ClubDetailPage from './pages/ClubDetailPage';
import EventsPage from './pages/EventsPage';
import HallBookingPage from './pages/HallBookingPage';

function ScrollToTop() {
  const { pathname } = window.location;
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/clubs" element={<ClubsPage />} />
              <Route path="/clubs/:slug" element={<ClubDetailPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/halls" element={<HallBookingPage />} />
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center bg-sand-50 dark:bg-charcoal-950 pt-16">
                    <div className="text-center">
                      <p className="text-6xl font-display font-700 text-gray-200 dark:text-gray-800 mb-4">404</p>
                      <h2 className="font-display font-700 text-2xl text-gray-900 dark:text-gray-50 mb-3">Page not found</h2>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">This page doesn't exist yet.</p>
                      <a href="/" className="btn-primary">Go Home</a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
