import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: { Icon: CheckCircle2, color: 'text-mint-500',  bg: 'bg-mint-50  dark:bg-mint-900/30',  border: 'border-mint-200  dark:border-mint-800/50' },
  error:   { Icon: XCircle,      color: 'text-bloom-500', bg: 'bg-bloom-50 dark:bg-bloom-900/30', border: 'border-bloom-200 dark:border-bloom-800/50' },
  warning: { Icon: AlertTriangle,color: 'text-sand-500',  bg: 'bg-sand-50  dark:bg-sand-900/30',  border: 'border-sand-200  dark:border-sand-800/50' },
  info:    { Icon: Info,         color: 'text-sky-500',   bg: 'bg-sky-50   dark:bg-sky-900/30',   border: 'border-sky-200   dark:border-sky-800/50' },
};

function Toast({ id, type = 'info', title, message, onDismiss }) {
  const { Icon, color, bg, border } = ICONS[type] || ICONS.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`flex items-start gap-3 w-80 max-w-[calc(100vw-2rem)] p-4 rounded-2xl border shadow-lg backdrop-blur-md ${bg} ${border}`}
      role="alert"
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${color}`} />
      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-sm font-bold text-gray-900 dark:text-gray-50 leading-tight">{title}</p>
        )}
        {message && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">{message}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = ++counterRef.current;
    setToasts(prev => [...prev.slice(-4), { id, type, title, message }]);

    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }

    return id;
  }, [dismiss]);

  const toast = {
    success: (title, message, opts) => addToast({ type: 'success', title, message, ...opts }),
    error:   (title, message, opts) => addToast({ type: 'error',   title, message, ...opts }),
    warning: (title, message, opts) => addToast({ type: 'warning', title, message, ...opts }),
    info:    (title, message, opts) => addToast({ type: 'info',    title, message, ...opts }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container — fixed bottom-right */}
      <div
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none"
        aria-live="polite"
        aria-atomic="false"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <div key={t.id} className="pointer-events-auto">
              <Toast {...t} onDismiss={dismiss} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
