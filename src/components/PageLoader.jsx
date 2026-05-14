import { GraduationCap } from 'lucide-react';

/**
 * Full-screen branded loading state.
 * Used as Suspense fallback during route-based lazy loading.
 */
export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#f5eeff] via-[#fdf4ff] to-[#fff0f8] dark:from-[#0c0a15] dark:via-[#140f22] dark:to-[#1a0e2a]">
      {/* Animated blobs */}
      <div className="absolute w-96 h-96 -top-20 -right-20 rounded-full bg-petal-200/50 dark:bg-petal-900/20 blur-3xl animate-pulse" />
      <div className="absolute w-64 h-64 -bottom-10 -left-10 rounded-full bg-bloom-100/50 dark:bg-bloom-900/15 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />

      <div className="relative z-10 flex flex-col items-center gap-5">
        {/* Logo */}
        <div className="relative">
          <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-petal-400 to-bloom-500 flex items-center justify-center shadow-[0_8px_40px_-8px_rgba(180,130,240,0.6)] animate-bounce">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-br from-petal-400 to-bloom-500 blur-xl opacity-40 animate-pulse" />
        </div>

        {/* Brand name */}
        <div className="text-center">
          <p className="font-display font-bold text-xl text-gray-900 dark:text-gray-50">
            Campus<span className="bg-gradient-to-r from-petal-600 to-bloom-500 bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">Hub</span>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 animate-pulse">Loading…</p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-petal-400/60 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
