import { AlertTriangle, X } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', destructive = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="text-center p-2">
        <div className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center ${destructive ? 'bg-red-100 dark:bg-red-900/30' : 'bg-petal-100 dark:bg-grape-800'}`}>
          <AlertTriangle className={`w-7 h-7 ${destructive ? 'text-red-600 dark:text-red-400' : 'text-petal-600 dark:text-petal-400'}`} />
        </div>
        <h3 className="font-display font-bold text-lg text-gray-900 dark:text-gray-50 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          {message}
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-secondary py-2.5 justify-center">
            Cancel
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }} 
            className={`flex-1 py-2.5 px-4 rounded-2xl font-bold text-sm text-white shadow-lg transition-all hover:-translate-y-0.5
              ${destructive 
                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' 
                : 'bg-petal-600 hover:bg-petal-700 shadow-petal'
              }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
