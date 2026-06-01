import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

export default function Notification({ message, type, isVisible, onClose }: NotificationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="custom-notification"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl border border-zinc-200 shadow-xl shadow-zinc-100 max-w-sm"
        >
          {type === 'success' ? (
            <CheckCircle id="success-icon" className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle id="error-icon" className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <p id="notification-message" className="text-sm font-medium text-zinc-850">
            {message}
          </p>
          <button
            id="notification-close"
            onClick={onClose}
            className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-600 transition-colors ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
