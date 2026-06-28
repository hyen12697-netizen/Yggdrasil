import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, XCircle, HelpCircle, X } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const GlobalNotificationModal = () => {
  const { modalState, hideNotification } = useNotification();

  if (!modalState.isOpen) return null;

  const { type, title, message, onConfirm } = modalState;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={48} className="text-green-500 mb-4" />;
      case 'error':
        return <XCircle size={48} className="text-red-500 mb-4" />;
      case 'warning':
        return <AlertCircle size={48} className="text-yellow-500 mb-4" />;
      case 'confirm':
        return <HelpCircle size={48} className="text-blue-500 mb-4" />;
      default:
        return <AlertCircle size={48} className="text-gray-500 mb-4" />;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'success': return 'Thành công';
      case 'error': return 'Lỗi';
      case 'warning': return 'Cảnh báo';
      case 'confirm': return 'Xác nhận';
      default: return 'Thông báo';
    }
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    hideNotification();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => type !== 'confirm' && hideNotification()}
      />
      <AnimatePresence>
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 dark:border-gray-750 z-10 flex flex-col items-center text-center"
        >
          {type !== 'confirm' && (
            <button 
              onClick={hideNotification}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
          )}

          {getIcon()}
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {title || getDefaultTitle()}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 w-full">
            {message}
          </p>

          <div className="flex gap-3 w-full">
            {type === 'confirm' ? (
              <>
                <button
                  onClick={hideNotification}
                  className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-2.5 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors"
                >
                  Đồng ý
                </button>
              </>
            ) : (
              <button
                onClick={hideNotification}
                className={`flex-1 py-2.5 px-4 text-white rounded-xl font-medium transition-colors ${
                  type === 'success' ? 'bg-green-500 hover:bg-green-600' :
                  type === 'error' ? 'bg-red-500 hover:bg-red-600' :
                  type === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600' :
                  'bg-primary hover:bg-primary-dark'
                }`}
              >
                Đóng
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default GlobalNotificationModal;
